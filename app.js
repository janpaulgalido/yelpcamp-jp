require('dotenv').config()
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    seedDB = require('./seeds'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    cors = require('cors')

app.use(cors())

// Routers
const campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index')

// MONGOOSE CONNECT
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

connectDB()

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())

// seeding the DB
// seedDB();

// PASSPORT CONFIGURATION
app.use(
    require('express-session')({
        secret: 'Tellmesomethingaboutit',
        resave: false,
        saveUninitialized: false,
    })
)
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.message = {
        error: req.flash('error'),
        success: req.flash('success'),
    }
    next()
})

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

// bind and listen the connections on the specified host
const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} node on port ${PORT}`
    )
)
