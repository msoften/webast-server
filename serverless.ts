import type {AWS} from '@serverless/typescript';

import hello from '@functions/hello';
import {authRegister, authLogin, auth, authTest} from '@functions/v1/auth';
import {aiChat} from '@functions/v1/ai';
import {subscriptions, createUserSubscription, getUserTokens} from '@functions/v1/subscriptions';

const serverlessConfiguration: AWS = {
	service: 'webast-server',
	frameworkVersion: '3',

	//* Plugins.
	plugins: [
		'serverless-esbuild',
		'serverless-iam-roles-per-function',
		'serverless-dotenv-plugin',
	],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},

		//* Environment variables.
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			TABLE_USERS: '${self:service}-users-${self:provider.stage}',
			TABLE_USERS_SUBSCRIPTIONS: '${self:service}-users-subscriptions-01-${self:provider.stage}',
		},
		profile: 'completecoding.io-serverless',
		stage: 'dev',
		region: 'us-east-1',
	},

	//* Functions
	// TODO: Auto import all exported functions
	// TODO: Fix authorization problem
	functions: {
		hello,
		authRegister, authLogin, auth, authTest,
		subscriptions, createUserSubscription, getUserTokens,
		aiChat
	},

	package: {individually: true},
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: {'require.resolve': undefined},
			platform: 'node',
			concurrency: 10,
		},
	},

	//* Resources
	resources: {
		Resources: {
			//* DynamoDB tables.
			// TODO: change all table names to reference from environment variable.
			UsersTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${self:provider.environment.TABLE_USERS}',
					AttributeDefinitions: [
						{
							AttributeName: 'email',
							AttributeType: 'S',
						}
					],
					KeySchema: [
						{
							AttributeName: 'email',
							KeyType: 'HASH',
						}
					],
					BillingMode: 'PAY_PER_REQUEST'
				},
			},
			UsersSubscriptionsTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${self:provider.environment.TABLE_USERS_SUBSCRIPTIONS}',
					AttributeDefinitions: [
						{
							AttributeName: 'paymentReference',
							AttributeType: 'S',
						},
					],
					KeySchema: [
						{
							AttributeName: 'paymentReference',
							KeyType: 'HASH',
						},
					],
					BillingMode: 'PAY_PER_REQUEST'
				},
			},
		}
	}
};

module.exports = serverlessConfiguration;
