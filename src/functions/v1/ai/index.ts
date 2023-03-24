import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';


// TODO: Add openAPI docs.
export const aiChat = {
	handler: `${handlerPath(__dirname)}/handler.chat`,
	events: [
		{
			http: {
				method: 'post',
				path: 'v1/ai/chat',
				request: {
					schemas: {
						'application/json': schema,
					},
				},
				cors: true,
				authorizer: {
					name: 'MyCustomAuthorizer',
					arn: 'arn:aws:lambda:us-east-1:137627469964:function:webast-server-dev-auth',
				},
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
			// TODO: Convert table to programmatic import.
			Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-users-${self:provider.stage}',
		},
	],
};
