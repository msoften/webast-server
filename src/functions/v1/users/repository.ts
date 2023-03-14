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

export const createUser = async (user: UserModel) => {
	// TODO: Capture dynamodb erros using try catch block.
	await docClient.put({
		TableName: process.env.TABLE_USERS,
		Item: user,
	}).promise();

	return user;
};
