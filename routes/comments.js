const express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware')

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        if (err || !foundCamp) {
            req.flash('error', 'Sorry, that campground does not exist!')
            return res.redirect('/campgrounds')
        }
        res.render('comments/new', { campground: foundCamp })
    })
})

// POST ROUTE
router.post('/', middleware.isLoggedIn, (req, res) => {
    // lookup campground using campID
    Campground.findById(req.params.id, (err, foundCamp) => {
        if (err) {
            req.flash('error', 'Something went wrong')
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            // create new comments
            Comment.create(req.body.comment, (err, comment) => {
                if (err) return console.log(err)
                // add username and id to comment
                comment.author.id = req.user._id
                comment.author.username = req.user.username
                // save comment
                comment.save()
                // connect new comment to campground
                foundCamp.comments.push(comment)
                foundCamp.save()
                // redirect to campground show page
                req.flash('success', 'Successfully added comment')
                res.redirect('/campgrounds/' + foundCamp._id)
            })
        }
    })
})

// EDIT COMMENT ROUTE
router.get(
    '/:comment_id/edit',
    middleware.checkCommentOwnership,
    (req, res) => {
        Campground.findById(req.params.id, (err, foundCamp) => {
            if (err || !foundCamp) {
                req.flash('error', 'Sorry, that campground does not exist!')
                return res.redirect('/campgrounds/')
            }
            res.render('comments/edit', {
                campground_id: req.params.id,
                comment: req.comment,
            })
        })
        // res.render('comments/edit', {campground_id: req.params.id, comment: req.comment})
    }
)

// UPDATE COMMENT ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        (err, updatedComment) => {
            if (err) {
                req.flash(
                    'error',
                    "Something went wrong, didn't update the comment!"
                )
                res.redirect('/campgrounds/')
            } else {
                // redirect to show page
                req.flash('success', 'Successfully updated comment!')
                res.redirect('/campgrounds/' + req.params.id)
            }
        }
    )
})

// DESTROY COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
        if (err) {
            console.log(err.message)
            res.redirect('/campgrounds/' + req.params.id)
        } else {
            req.flash('success', 'Comment deleted')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

module.exports = router
