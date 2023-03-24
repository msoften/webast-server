// TODO: Module docs
// Data layer for users.
import * as AWS from 'aws-sdk';
import UserModel from './model';

const docClient = new AWS.DynamoDB.DocumentClient();


// TODO: Add function docs
export const getUserByEmail = async (email: string): Promise<UserModel> => {
	// TODO: Capture dynamodb erros using try catch block.
	const result = await docClient.get({
		TableName: process.env.TABLE_USERS,
		Key: {
			email: email,
		},
	}).promise();

	return result.Item as UserModel;
};


// TODO: Add function docs.
// TODO: Check if token expired.
export const getUserByToken = async (token: string): Promise<UserModel> => {
	// TODO: Capture dynamodb erros using try catch block.
	const params = {
		TableName: process.env.TABLE_USERS,
		FilterExpression: '#token = :token',
		ExpressionAttributeNames: {'#token': 'token'},
		ExpressionAttributeValues: {
			':token': token,
		}
	};

	const results = await docClient.scan(params).promise();

	if (results.Items.length !== 0) {
		return results.Items[0] as UserModel;
	}

	throw new Error('Unauthorized');
};

// TODO: Add function docs
export const createUser = async (user: UserModel) => {
	// TODO: Capture dynamodb erros using try catch block.
	await docClient.put({
		TableName: process.env.TABLE_USERS,
		Item: user,
	}).promise();

	return user;
};
