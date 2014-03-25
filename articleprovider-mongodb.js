var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ArticleProvider = function(host, port) {
    this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){});
};


//addCommentToArticle

ArticleProvider.prototype.addCommentToArticle = function(articleId, comment, callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback( error );
        else {
            article_collection.update(
                {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
                {"$push": {comments: comment}},
                function(error, article){
                    if( error ) callback(error);
                    else callback(null, article)
                });
        }
    });
};

//getCollection

ArticleProvider.prototype.getCollection= function(callback) {
    this.db.collection('articles', function(error, article_collection) {
        if( error ) callback(error);
        else {
                //console.log('articles is:'+ toJSON(article_collection));
                callback(null, article_collection);
            };
    });
};

//findAll
ArticleProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback(error)
        else {
            article_collection.find().sort({'created_at': -1}).toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};

//findById

ArticleProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback(error)
        else {
            article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
};

//save
ArticleProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback(error)
        else {
            if( typeof(articles.length)=="undefined")
                articles = [articles];

            for( var i =0;i< articles.length;i++ ) {
                article = articles[i];
                article.created_at = new Date();
                if( article.comments === undefined ) article.comments = [];
                for(var j =0;j< article.comments.length; j++) {
                    article.comments[j].created_at = new Date();
                }
            }

            article_collection.insert(articles, function() {
                callback(null, articles);
            });
        }
    });
};


ArticleProvider.prototype.deleteById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
        if( error ) callback(error)
        else {
            article_collection.remove({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
};

ArticleProvider.prototype.ManualLogin = function(user, pass, callback)
{
    
    //var accounts = this.db.collection('accounts');
    this.getCollectionAccounts(function(error, accounts_collection) {
        /*accounts_collection.findOne({user:"user1"},function(err,items){
                    //items.each(function(err,acc){
                        //if(acc!=null){
                            console.log('user is:'+ JSON.stringify(items)+'pass is:'+ JSON.stringify(items));
                        //};
                   // });
                    
                }); */

        if( error ) callback(error)
        else {
            accounts_collection.findOne({user:"user1"},function(e, o) {
                if (o == null){
                    //console.log('o is null:'+o);
                    callback('user-not-found');
                }   
                else{
                    //console.log('password retrieved is:'+ o.pass +'password entered is'+ pass);
                    
                    validatePassword(pass, o.pass, function(err, res) {
                        if (res){
                            callback(null,res);
                            console.log('validate result is'+res);
                        }   else{
                            callback('invalid-password');
                        }
                    });
                }
            });
        }
    });
    //console.log('using username:'+user+'password'+pass);
    
}

ArticleProvider.prototype.getCollectionAccounts= function(callback) {
    this.db.collection('accounts', function(error, accounts_collection) {
        if( error ) callback(error);
        else {
                /*accounts_collection.find().toArray(function(err,items){
                    console.log('accounts_collection length is:'+ items.length);

                }); */

                //accounts_collection.findOne({user:"user1"},function(err,items){
                    //items.each(function(err,acc){
                        //if(acc!=null){
                           // console.log('user is:'+ JSON.stringify(items)+'pass is:'+ JSON.stringify(items));
                        //};
                   // });
                    
                //});
                callback(null, accounts_collection);
            }
    });
};

var validatePassword = function(plainPass, hashedPass, callback)
{
    var passwordMatch=0;

    if(hashedPass==plainPass){
        //console.log("passwors match");
        passwordMatch= 1;
        console.log('enterd'+plainPass+'recvd'+hashedPass);

    };
    console.log("passwordmatch"+passwordMatch+'entered'+plainPass+'recvd'+hashedPass);
    //console.log(hashedPass === plainPass);
    //var salt = hashedPass.substr(0, 10);
    //var validHash = salt + md5(plainPass + salt);
    //callback(null, hashedPass === plainPass);
    callback(null,passwordMatch);
}

exports.ArticleProvider = ArticleProvider;