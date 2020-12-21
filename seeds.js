const mongoose = require('mongoose'),
	  Campground = require('./models/campground'),
	  Comment = require('./models/comment');

const data = [
	{
		name: 'Clouds Rest',
		price: 10.0,
		image: 'https://images.unsplash.com/photo-1545572695-789c1407474c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mattis urna quam, vitae semper nulla dictum et. Donec ex lectus, volutpat eget interdum vel, consequat in justo. Maecenas ac elit ac justo commodo convallis et sed metus. Cras mollis erat orci, ut iaculis quam tincidunt pharetra. Curabitur molestie dolor sed quam sagittis pulvinar. Maecenas ut nisl eros. Pellentesque ante turpis, porttitor gravida suscipit quis, gravida eu urna. Morbi fringilla erat at nulla commodo ultrices. Duis et augue placerat, sollicitudin purus a, luctus est. Integer in eros egestas, vulputate nulla sed, dictum dui. Maecenas eget tincidunt neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus enim nulla, eu congue turpis condimentum ut'
	},
	{
		name: 'Southwoods\'s',
		price: 10.0,
		image: 'https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mattis urna quam, vitae semper nulla dictum et. Donec ex lectus, volutpat eget interdum vel, consequat in justo. Maecenas ac elit ac justo commodo convallis et sed metus. Cras mollis erat orci, ut iaculis quam tincidunt pharetra. Curabitur molestie dolor sed quam sagittis pulvinar. Maecenas ut nisl eros. Pellentesque ante turpis, porttitor gravida suscipit quis, gravida eu urna. Morbi fringilla erat at nulla commodo ultrices. Duis et augue placerat, sollicitudin purus a, luctus est. Integer in eros egestas, vulputate nulla sed, dictum dui. Maecenas eget tincidunt neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus enim nulla, eu congue turpis condimentum ut'
	},
	{
		name: 'Pleasant Valley Camp for Girls',
		price: 10.0,
		image: 'https://images.unsplash.com/photo-1563024767-5bd8ee292c3f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mattis urna quam, vitae semper nulla dictum et. Donec ex lectus, volutpat eget interdum vel, consequat in justo. Maecenas ac elit ac justo commodo convallis et sed metus. Cras mollis erat orci, ut iaculis quam tincidunt pharetra. Curabitur molestie dolor sed quam sagittis pulvinar. Maecenas ut nisl eros. Pellentesque ante turpis, porttitor gravida suscipit quis, gravida eu urna. Morbi fringilla erat at nulla commodo ultrices. Duis et augue placerat, sollicitudin purus a, luctus est. Integer in eros egestas, vulputate nulla sed, dictum dui. Maecenas eget tincidunt neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus enim nulla, eu congue turpis condimentum ut'
	}
];


function seedDB(){
// 	Remove all campgrounds
	Campground.deleteMany({}, (err) =>{
		if(err) return console.log(err);
		console.log('removed campgrounds!');
		// remove all comments
		Comment.deleteMany({}, (err) =>{
			if(err) return console.log(err);
			console.log('removed comments!');
				// Add a few campgrounds
			// data.forEach((seed) => {
			// 	Campground.create(seed, (err, campground) => {
			// 		if(err) return console.log(err);
			// 		console.log('added a campground!')
			// 		// 	Add a few comments
			// 		Comment.create(
			// 			{
			// 				text: 'This place is great but I wish there was a internet',
			// 				author: 'Bob'
			// 			}, (err, comment) => {
			// 				if(err) return console.log(err);
							// add username and id commenten
							// comment.author.id = req.user._id;
							// comment.author.username = req.user.username;
							// // save comment
							// comment.save();
			// 				campground.comments.push(comment);
			// 				campground.save();
			// 				console.log('created new comment')
			// 			}
			// 		)
			// 	})
			// });
		})
	});
}

module.exports = seedDB;
