// TODO: Module docs
// Presentation layer as Lambda functions

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';
import * as aiService from './service';


// TODO: Add function docs.
const chatFun: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
	// TODO: Check if user is authorized.
	// TODO: Check if user has a subscription and has enough tokens.
	
	try {
		// TODO: Verify message has the correct format.
		const messages = JSON.parse(event.body.messages);
		const email = event.body.email;

		const response = await aiService.getAIChatResponse(messages, email);

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Success',
				data: response
			})
		};
	} catch (error) {
		return {
			statusCode: 403,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: error.messages,
				data: ''
			})
		};
	}
};

const chat = middyfy(chatFun);

export {chat};
