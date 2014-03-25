var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var routes = require('./routes');
var blog = require('./routes/blog');
GLOBAL.Cookies = require( "cookies" );
GLOBAL.cookieTracker=null;

//GLOBAL.ArticleProvider = require('./articleprovider-memory').ArticleProvider; // MEMORY OPTION: enable for memory data holder
GLOBAL.ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

// all environments
app.use(express.static(__dirname + '/'));
app.set('port', process.env.PORT || 3005);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
//app.use(express.cookieParser());
//app.use(express.createServer( Cookies.express() ));

app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

if ('production' == app.get('env')) {
    app.use(express.errorHandler());
}

//GLOBAL.articleProvider = new ArticleProvider();  // MEMORY OPTION: enable for memory data holder
GLOBAL.articleProvider = new ArticleProvider('localhost', 27017);

app.get('/', routes.index);
//app.post('/', routes.index);

app.get('/blog/new', blog.new);
app.post('/blog/new', blog.newSave);
app.get('/blog/lgin', blog.lgin);
app.post('/blog/lgin', blog.lgin);

app.get('/blog/:id', blog.getBlogPost);
app.post('/blog/addComment', blog.addComment);
app.post('/blog/deleteBlog/:id', blog.deleteBlog);
app.post('/blog/loginForm', blog.loginForm);
app.get('/blog/deleteBlog/:id', blog.deleteBlog);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  });



