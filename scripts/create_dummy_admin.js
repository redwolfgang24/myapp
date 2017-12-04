//connect with welinktalent local database
var db = connect('127.0.0.1:27017/myapp');

//create the dummy admin collection with email: welinktalent@gmail.com and password: welinktalent
var dummyUser = db.user.findOneAndUpdate({
		"email": "dummyviseo2017@gmail.com"
	},
	{
		$set: {
			"email": "dummyviseo2017@gmail.com",
			"createdAt": new Date(),
			"updatedAt": new Date(),
			"role": "admin",
			"password": "$2a$10$JFNQw/e3y/ysrtfcMPr6k.ke8JE2CuZCi2CuPeUADxCbTb9lztTVe"
		}
	},
	{
		"upsert": true,
		"returnNewDocument": true
	}
);

print("**********User collection updated with dummy admin user**********");
print("**********Creating admin profile**********");

//create dummy admin profile and update user id into it
var dummyUserProfile = db.profile.findOneAndUpdate({
		"user": dummyUser._id
	},
	{
		$set: {
			"emailAddress": "dummyviseo2017@gmail.com",
			"firstName": "Dummy",
			"lastName": "Account",
			"user": dummyUser._id,
			"createdAt": new Date(),
			"updatedAt": new Date()
		}
	},
	{
		"upsert": true,
		"returnNewDocument": true
	}
);

print("**********Admin profile successfully created**********");

//update dummy admin user and add add profile id
db.user.update({
		"email": "dummyviseo2017@gmail.com"
	},
	{
		"$set": {"profile": dummyUserProfile._id}
	}
);

print("**********Admin successfully created**********");
