import Waterline from 'waterline';

const Profile = Waterline.Collection.extend({
	identity: 'profile',
	connection: 'default',
	schema: true,

	attributes: {

		emailAddress: {
			type: 'string',
			unique: true,
			index: true,
		},

		firstName: {
			type: 'string',
		},

		lastName: {
			type: 'string',
		},

		user: {
			model: 'user',
		},

		birthDate: {
			type: 'string',
		},

		civilStatus: {
			type: 'string',
		},

		mobileNumber: {
			type: 'string',
		},

		toJSON() {
			const obj = this.toObject();

			delete obj.user;

			return obj;
		},
	},

	afterValidate(values, cb) {
		if (values.mobileNumber && !Number(values.mobileNumber)) {
			return cb('Mobile number is not valid');
		}
		cb();
	},
});

export default Profile;
