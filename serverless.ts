import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import {authRegister} from '@functions/v1/auth';

const serverlessConfiguration: AWS = {
  service: 'webast-server',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
	functions: { hello, authRegister },
	resources: {
		Resources: {
			//* DynamoDB tables.
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
		}
	}
};

module.exports = serverlessConfiguration;
