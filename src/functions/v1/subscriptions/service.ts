// TODO: Module docs
// Business Logic layer, contains auth related function.
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

// TODO: move to repository
const openai = new OpenAIApi(configuration);
// TODO: move to repository
import * as AWS from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();

import * as UsersRepository from '../users/repository';


// TODO: Add function docs.
// TODO: Add messages type.
export const getAIChatResponse = async (messages: any): Promise<any> => {
	try {
		const completion = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: messages,
		});

		return completion.data.choices[0].message;
	} catch (error) {
		throw new Error(error.getmessage);
	}
};


// TODO: Add function docs.
// TODO: Add messages type.
export const subscribe = async (email: any, targetSubscription: any, paymentReference: any): Promise<any> => {
	try {
		// Create subscription
		const subscription = {
			userId: email,
			paymentReference: paymentReference,
			subscriptionId: targetSubscription,
			createdAt: new Date().getTime()
		};

		await docClient.put({
			TableName: process.env.TABLE_USERS_SUBSCRIPTIONS,
			Item: subscription,
		}).promise();

		// Update user data.
		const user = await UsersRepository.getUserByEmail(email);

		if (!user)
			throw new Error('User not found');

		user.aiTokens = user.aiTokens + targetSubscription.tokens;

		UsersRepository.createUser(user);
	} catch (error) {
		throw new Error(error.message);
	}
};


export const getUserTokens = async (email: any): Promise<any> => {
	try {
		const user = await UsersRepository.getUserByEmail(email);

		if (!user)
			throw new Error('User not found');

		return user.aiTokens;
	} catch (error) {
		throw new Error(error.getmessage);
	}
};
