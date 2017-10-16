var express = require('express'),
    bodyParser = require('body-parser'),
    nunjucks = require('nunjucks'),
    MongoClient = require('mongodb').MongoClient,
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    assert = require('assert'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    flash = require('express-flash'),
    MongoStore = require('connect-mongo')(session),
    passport = require('passport');

var stripe = require('stripe')('sk_test_eBc69WlaOxykHBs34Rfqietx');


var secret = require('./config/secret');

// Set up express
app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/authentication/views');
app.use('/static', express.static(__dirname + '/static'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.dburl, autoReconnnect: true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// connect database
mongoose.connect(secret.dburl, function(err) {
    if (err) {
        console.log('err');
    } else {
        console.log('connect to database');
    }
});

// set up router
var indexRoute = require('./authentication/controller/index');
var userRoute = require('./authentication/controller/user');

app.use('/', userRoute);
app.use('/user', userRoute);

app.listen(secret.port, function() {
    console.log('server listen at port ', secret.port);
})

