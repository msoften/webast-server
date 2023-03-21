import { handlerPath } from '@libs/handler-resolver';

// TODO: Change tables reference to be dynamic

// TODO: Add openAPI docs.
export const subscriptions = {
	handler: `${handlerPath(__dirname)}/handler.subscriptions`,
	events: [
		{
			http: {
				method: 'get',
				path: 'v1/subscriptions',
				cors: true,
			},
		},
	],
};


// TODO: Add openAPI docs.
export const createUserSubscription = {
	handler: `${handlerPath(__dirname)}/handler.createUserSubscription`,
	events: [
		{
			http: {
				method: 'post',
				path: 'v1/subscriptions/user',
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:GetItem',
				'dynamodb:PutItem',
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-users-${self:provider.stage}',
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_USERS_SUBSCRIPTIONS}'
			],
		},
	],
};


// TODO: Add openAPI docs.
export const getUserTokens = {
	handler: `${handlerPath(__dirname)}/handler.getUserTokens`,
	events: [
		{
			http: {
				method: 'get',
				path: 'v1/tokens/user',
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:GetItem',
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-users-${self:provider.stage}',
			],
		},
	],
};
