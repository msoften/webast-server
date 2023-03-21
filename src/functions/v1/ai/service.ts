// TODO: Module docs
// Business Logic layer, contains auth related function.
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

import * as UsersRepository from '../users/repository';


// TODO: Add function docs.
// TODO: Add messages type.
export const getAIChatResponse = async (messages: any, email: string): Promise<any> => {
	try {
		// Update user tokens.
		const user = await UsersRepository.getUserByEmail(email);

		if (!user)
			throw new Error('User not found');

		if(user.aiTokens === 0) 
			throw new Error('You have no tokens');

		const completion = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: messages,
		});

		let newTokensAmount = user.aiTokens - completion.data.usage.total_tokens;
		if(newTokensAmount < 0)
			newTokensAmount = 0;

		user.aiTokens = newTokensAmount;

		UsersRepository.createUser(user);

		return completion.data.choices[0].message;
	} catch (error) {
		throw new Error(error.getmessage);
	}
};
