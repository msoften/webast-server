// TODO: Module docs
// Presentation layer as Lambda functions

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from 'aws-lambda';

import {middyfy} from '@libs/lambda';

import schema from './schema';
import UserModel from '../users/model';
import * as usersService from '../users/service';
import * as authService from './service';
import {randomString} from '../utils/common';

import * as UsersRepository from '../users/repository';


// TODO: Add function docs.
const registerFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	// Create user object.
	const date = new Date();

	const user: UserModel = {
		email: event.body.email,
		password: event.body.password, // TODO: Encrypt password.
		token: randomString(32),
		tokenExpiry: date.setDate(date.getDate() + 1), // Add a day from now, // TODO: Use environemnt variable for expiry duration.
		aiTokens: 0,
		date: date.getTime()
	};

	try {
		// Save user to db.
		await usersService.createUser(user);

		return {
			statusCode: 201,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Registered successfully.',
				data: user.token
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
				data: ''
			})
		};
	}
};

const register = middyfy(registerFun);


// TODO: Add function docs.
export const loginFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	try {
		const token: string = await authService.getUserToken(event.body.email, event.body.password);

		return {
			statusCode: 201,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Logged in successfully.',
				data: token
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
				data: ''
			})
		};
	}
};

const login = middyfy(loginFun);


// TODO: Add function docs.
export const authFun = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
	// TODO: Implement custom authorizer logic here
	const token = event.authorizationToken;
	const methodArn = event.methodArn;


	// console.log(`token: ${token}`);
	// console.log(`methodArn: ${methodArn}`);
	console.log('auth: something');

	return {
		principalId: 'user',
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Allow',
					Resource: methodArn,
				},
			],
		},
	};

	// Get user with this token.
	// try {
	// 	const user = await UsersRepository.getUserByToken(token);

	// 	if (user) {
	// 		return {
	// 			principalId: 'user',
	// 			policyDocument: {
	// 				Version: '2012-10-17',
	// 				Statement: [
	// 					{
	// 						Action: 'execute-api:Invoke',
	// 						Effect: 'Allow',
	// 						Resource: methodArn,
	// 					},
	// 				],
	// 			},
	// 		};
	// 	}

	// 	throw new Error('Authorization failed');
	// } catch (error) {
	// 	return {
	// 		principalId: 'user',
	// 		policyDocument: {
	// 			Version: '2012-10-17',
	// 			Statement: [
	// 				{
	// 					Action: 'execute-api:Invoke',
	// 					Effect: 'Deny',
	// 					Resource: methodArn,
	// 				},
	// 			],
	// 		},
	// 	};
	// }
};


const auth = middyfy(authFun);

// TODO: Add function docs.
export const authTestFun = async (event: APIGatewayTokenAuthorizerEvent): Promise<any> => {
	// TODO: Implement custom authorizer logic here
	const token = event.authorizationToken;

	// return {
	// 	statusCode: 200,
	// 	headers: {
	// 		'Access-Control-Allow-Origin': '*',
	// 	},
	// 	body: JSON.stringify({
	// 		message: 'Success',
	// 		data: event
	// 	})
	// };

	try {
		const user = await UsersRepository.getUserByToken('Q7lbUZ4Yzck23iCIAMOvxo7Pm8wWu6EJ');

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Success',
				data: user
			})
		};
	} catch (error) {
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: error.message,
				data: ''
			})
		};
	}

};


const authTest = middyfy(authTestFun);

export {register, login, auth, authTest};
