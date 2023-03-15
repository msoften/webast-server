// TODO: Module docs
// Presentation layer as Lambda functions

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse} from '@libs/api-gateway';

import {middyfy} from '@libs/lambda';
import cors from '@middy/http-cors';

import schema from './schema';
import UserModel from '../users/model';
import * as usersService from '../users/service';
import * as authService from './service';
import {randomString} from '../utils/common';


// TODO: Add function docs.
const registerFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	// Create user object.
	const date = new Date();

	const user: UserModel = {
		email: event.body.email,
		password: event.body.password, // TODO: Encrypt password.
		token: randomString(32),
		tokenExpiry: date.setDate(date.getDate() + 1), // Add a day from now, // TODO: Use environemnt variable for expiry duration.
		date: date.getTime()
	};

	try {
		// Save user to db.
		await usersService.createUser(user);

		return formatJSONResponse({
			statusCode: 201,
			message: 'Registered successfully.',
			data: user.token
		});
	} catch (error) {
		return formatJSONResponse({
			statusCode: 500,
			message: error.message,
			data: ''
		});
	}
};

const register = middyfy(registerFun)
	.use(cors());


// TODO: Add function docs.
export const loginFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	try {
		const token: string = await authService.getUserToken(event.body.email, event.body.password);

		return formatJSONResponse({
			statusCode: 201,
			message: 'Logged in successfully.',
			data: token
		});
	} catch (error) {
		return formatJSONResponse({
			statusCode: 500,
			message: error.message,
			data: ''
		});
	}
};

const login = middyfy(loginFun)
	.use(cors());

export {register, login};
