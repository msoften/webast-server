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

export {subscriptions, createUserSubscription, getUserTokens};
