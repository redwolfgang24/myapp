import Waterline from 'waterline';

const Token = Waterline.Collection.extend({
	identity: 'token',
	connection: 'default',
	schema: true,

	attributes: {
		emailAddress: {
			type: 'string',
			required: true,
		},

		token: {
			type: 'string',
			required: true,
		},

		expired: {
			type: 'boolean',
			defaultsTo: false,
		},

	},
});

export default Token;
