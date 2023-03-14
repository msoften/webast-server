// TODO: Module docs
// Presentation layer as Lambda functions

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';
import UserModel from '../users/model';
import {createUser} from '../users/service';
import {randomString} from '../utils/common';


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
		await createUser(user);

		return formatJSONResponse({
			statusCode: 201,
			message: 'User created',
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

const register = middyfy(registerFun);

export {register};
