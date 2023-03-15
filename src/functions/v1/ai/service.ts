// TODO: Module docs
// Business Logic layer, contains auth related function.
import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


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
