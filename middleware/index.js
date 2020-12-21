const Campground = require('../models/campground'),
	  Comment    = require('../models/comment');
// this goes all the middlewares
const middlewareObj = {};

// Campground middleware
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCamp) =>{
			if(err || !foundCamp){
				req.flash('error', 'Sorry, that campground does not exist!');
				res.redirect('/campgrounds');
				// does user own the campground?
			} else if(foundCamp.author.id.equals(req.user._id) || req.user.isAdmin) {
				req.campground = foundCamp;
				next();
			} else {
				req.flash('error', 'You don\'t have permission to do that!');
				res.redirect('/campgrounds/' + req.params.id);
			}
		})
	} else {
		req.flash('error', 'You need to be logged in!')
		res.redirect('back');
	}
}

// Comment middleware
middlewareObj.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) =>{
			if(err || !foundComment){
				req.flash('error', 'Sorry, that comment does not exist!');
				res.redirect('/campgrounds');
				// does user own the comment?
			} else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
				req.comment = foundComment;
				next();
			} else {
				req.flash('error', "You don't have permission to do that!");
				res.redirect('/campgrounds/' + req.params.id);
			}	
		})
	} else {
		req.flash('error', "You need to be logged in!");
		res.redirect('back');
	}
}

// Login Authentication middleware
middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You need to be logged in!');
	res.redirect('/login');
}

module.exports = middlewareObj;






