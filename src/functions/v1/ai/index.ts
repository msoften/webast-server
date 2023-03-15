import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

// TODO: Export as named modules.
// TODO: Create register endpoint.


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
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:GetItem',
			],
			Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-users-${self:provider.stage}',
		},
	],
};
