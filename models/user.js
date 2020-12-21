const mongoose				= require('mongoose'),
	  passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
	username: String,
	password: String,
	avatar: String,
	firstname: String,
	lastname: String,
	email: String,
	isAdmin: {
		type: Boolean, 
		default: false
	}
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);