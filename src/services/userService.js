module.exports = {
	getProfiles: async (app, searchCriteria, projectionObj) => new Promise((resolve, reject) => {
		app.models.profile.native((err, collection) => {
			if (err) {
				reject(err);
			} else {
				collection.find(
					searchCriteria,
					projectionObj,
				).toArray((error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				});
			}
		});
	}),
};
