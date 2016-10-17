
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , signin = require('./routes/signin')
  , profile = require('./routes/profile')
  , products = require('./routes/products')
  , order = require('./routes/order')
  , payment = require('./routes/payment')
  , records = require('./routes/records')
  , bidding = require('./routes/bidding')
  , path = require('path')
  , session = require('client-sessions');

var app = express();

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_lab1_nilam',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', signin.signInPage);
app.get('/users', user.list);
app.get('/signin', signin.signInPage);
app.get('/home', signin.redirectToHome);
app.get('/getProfile', profile.getProfile);
app.get('/getProducts', products.getProducts);
app.get('/getCart', order.getCart);
app.get('/getPurchases', records.getPurchases);
app.get('/getSales', records.getSales);
app.get('/signout', signin.signout);

app.post('/signin', signin.signIn);
app.post('/signup', signin.signUp);
app.post('/updateProfile', profile.updateProfile);
app.post('/createListing', products.createListing);
app.post('/createOrder', order.createOrder);
app.post('/removeCartItem', order.removeCartItem);
app.post('/makePayment', payment.validatePayment);
app.post('/updateCartItem', order.updateCartItem);
app.post('/placeOrder', order.placeOrder);
app.post('/placeBid', bidding.placeBid);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
