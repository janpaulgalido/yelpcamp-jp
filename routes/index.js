const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    Campground = require('../models/campground')

// LANDING PAGE ROUTE
router.get('/', (req, res) => res.render('landing'))

// ========================
// AUTH ROUTE
// ========================

// Sign Up Route
// showing sign up form
router.get('/register', (req, res) => {
    res.render('register')
})
// handling user sign up
router.post('/register', (req, res) => {
    const newUser = req.body.user
    if (req.body.adminCode == process.env.ADMIN_KEY) {
        newUser.isAdmin = true
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message + '!')
            res.redirect('/')
        } else {
            passport.authenticate('local')(req, res, function () {
                req.flash('success', 'Welcome to YelpCamp ' + user.username)
                res.redirect('/campgrounds')
            })
        }
    })
})

// Login Route
// showing login form
router.get('/login', (req, res) => {
    res.render('login')
})
// handling login logic
router.post(
    '/login',
    passport.authenticate('local', {
        // successRedirect: '/campgrounds',
        // successFlash: "Welcome ",
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res) => {
        if (req.user.isAdmin) {
            req.flash('success', ' Hello Admin!')
        } else {
            req.flash(
                'success',
                'Welcome ' +
                    req.user.username[0].toUpperCase() +
                    req.user.username.slice(1) +
                    '!'
            )
        }
        res.redirect('/campgrounds')
    }
)

// Logout Route
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'See you later!')
    res.redirect('/campgrounds')
})

// USER PROFILES
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err || !foundUser) {
            console.log(err)
            req.flas('error', "User didn't exists!")
            res.redirect('back')
        } else {
            Campground.find({})
                .where('author.id')
                .equals(foundUser._id)
                .exec(function (err, foundCamp) {
                    if (err || !foundCamp) {
                        console.log(err)
                        req.flas('error', "User didn't exists!")
                        res.redirect('back')
                    } else {
                        res.render('users/show', {
                            user: foundUser,
                            campground: foundCamp,
                        })
                    }
                })
        }
    })
})

module.exports = router
