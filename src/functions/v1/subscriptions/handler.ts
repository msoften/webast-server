// TODO: Module docs
// Presentation layer as Lambda functions

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';

import * as subscriptionsService from './service';

import {subscriptions as subs} from '@libs/subscriptions';

import * as usersService from '../users/service';

// TODO: Add function docs
// TODO: Add try-block
const subscriptionsFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	return {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		body: JSON.stringify({
			message: 'Success',
			data: subs,
		})
	};
};

const subscriptions = middyfy(subscriptionsFun);


// TODO: Add function docs
const createUserSubscriptionFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	// TODO: Check if user exist
	// TODO: Use try-catch

	const email = event.body.email;
	const targetSubscription = event.body.targetSubscription;
	const paymentReference = event.body.paymentReference;

	try {
		await subscriptionsService.subscribe(
			email,
			targetSubscription,
			paymentReference,
		);

		return {
			statusCode: 201,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Subscription succesful',
				data: '',
			})
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: error.message,
				data: '',
			})
		};
	}
};

const createUserSubscription = middyfy(createUserSubscriptionFun);


// TODO: Add function docs
const getUserTokensFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	const email = event.queryStringParameters.email;

	try {
		const tokens = await subscriptionsService.getUserTokens(email);

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Subscription tokens',
				data: tokens,
			})
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: error.message,
				data: '',
			})
		};
	}
};

const getUserTokens = middyfy(getUserTokensFun);


// TODO: Add function docs
const checkoutPageFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

	const html = `
	<html lang="en">

	<head>
		<script
			src="https://www.paypal.com/sdk/js?client-id=Acf-UdRZIxSwidWwrbxc1ldk-6WV9oLCoW0qqR6W5IWcxstJdo6Ii47Y4bSiBiqcusz0-17fYtTB4853&currency=USD"></script>
	</head>
	
	<body>
		<div id="loginRegisterContainer" class="container">
			<div id="loginRegisterForm">
				<br />
				<h1>Checkout.</h1>
				<!--TODO: transaction details and when transaction is complete, retries on fail-->
	
			</div>
	
			<div id="paypal-button-container"></div>
		</div>
	
		<script defer>
			document.addEventListener('DOMContentLoaded', function () {
				const subscribe = async (email, subscription, paymentReference) => {
					const requestOptions = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							"email": email,
							"targetSubscription": subscription,
							"paymentReference": paymentReference
						  }),
						redirect: 'follow'
					};
	
					try {
						const response = await fetch('https://wiu2lwtia2.execute-api.us-east-1.amazonaws.com/dev/v1/subscriptions/user', requestOptions);
						const json = await response.json();
	
						if (!response.ok) {
							throw new Error(json.message);
						}

						if (json) {
							console.log(json);
						}
	
						setTimeout(()=>{
							window.close();
						}, 500);
					} catch (error) {
						console.log('error: ' + error.message);
					}
				};

				//* Get passed data.
				const params = new URLSearchParams(window.location.search);
				const encodedObj = params.get('data');
				const decodedObj = JSON.parse(decodeURIComponent(encodedObj));
				const passedData = decodedObj;
	
				/*
				* Paypal
				*/
				paypal.Buttons(
					{
						createOrder: function (data, actions) {
							// This function sets up the details of the transaction, including the amount and line item details.
							return actions.order.create({
								purchase_units: [{
									reference_id: passedData.email,
									description: passedData.subscription.description,
									amount: {
										value: passedData.subscription.price
									}
								}],
								application_context: {shipping_preference: 'NO_SHIPPING'}
							});
						},
						onApprove: function (data, actions) {
							// This function captures the funds from the transaction.
							return actions.order.capture().then(function (details) {
								//  This function shows a transaction success message to your buyer.
								//  alert('Transaction completed by ' + details.payer.name.given_name);
	
								console.log(details.purchase_units[0].payments.captures[0].id);
	
								subscribe(passedData.email, passedData.subscription, details.purchase_units[0].payments.captures[0].id);
							});
						}
					}
				).render('#paypal-button-container');
			});
		</script>
	</body>
	
	</html>
  `;

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/html',
		},
		body: html,
	};
};

const checkoutPage = middyfy(checkoutPageFun);

export {subscriptions, createUserSubscription, getUserTokens, checkoutPage};
