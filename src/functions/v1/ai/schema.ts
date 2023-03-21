export default {
	type: 'object',
	properties: {
		messages: {type: 'string'},
		email: {type: 'string'},
	},
	required: ['messages', 'email']
} as const;
