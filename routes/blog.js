exports.lgin = function(req, res){
    res.render('lgin.jade', {
        //title: 'New Post'
    });
};

exports.new = function(req, res){
    res.render('blog_new.jade', {
        title: 'New Post',
        cookieTracker:cookieTracker
    });
};

exports.newSave = function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/');
    });
};

exports.getBlogPost = function(req, res){
    var pageRender;
    
        if(cookieTracker)
        {
            pageRender='blog_show_logged_in.jade';
        }
        else
        {
            pageRender='blog_show.jade';
        }
        console.log('login result'+cookieTracker);
    

    articleProvider.findById(req.params.id, function(error, article) {
         //GLOBAL.cookies = new Cookies( req, res );
         //cookies.set("articleID",req.params.id);
         //console.log('cookie is'+ cookies.get("remember"));
         //cookies.set("remember");
        //if (cookies.get("remember")) {
            res.render(pageRender, {
                title: article.title,
                //title: "test",
                article:article,
                cookieTracker:cookieTracker
            });
       /* }
        else
        {
            res.render(pageRender, {
                title: article.title,
                //title: "test",
                article:article
            });
        } */
        //console.log( article);
    });
};

exports.addComment = function(req, res){
    //console.log('adding commnet to '+ req.param('_id'));
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
    } , function( error, docs) {
        res.redirect('/blog/' + req.param('_id'))
    });
};

exports.deleteBlog = function(req, res){
    //console.log('adding commnet to '+ req.param('id'));
    articleProvider.deleteById(req.params.id, function( error, docs) {
        res.redirect('/');
    });
};

exports.loginForm = function(req, res){
    var pageRender;

    console.log('going to login');
    console.log(req.param('user'));
    //GLOBAL.cookies = new Cookies( req, res );
         //cookies.set("articleID",req.params.id);
    articleProvider.ManualLogin(req.param('user'),req.param('pass'),function(err,result){
        console.log('result is'+ result);
        if(result)
        {
            cookieTracker=1;
            //res.cookie('loggedIn', 1);   
            //cookies.set("loggedIn",1,{domain:"127.0.0.1",path:"/"});
            //res.addProperty(cookies);
            // pageRender='blog_show_logged_in.jade';
        }
        else
        {
            cookieTracker=0;
            //res.cookie('loggedIn', 0);   
            //cookies.set("loggedIn",0,{domain:"127.0.0.1",path:"/"});
            //res.addProperty(cookies);
            // pageRender='blog_show.jade';
        }
        console.log('login result'+result);
        //console.log("Logged in cookie is:"+ cookies.get("loggedIn"));
        console.log("Logged in cookie is:"+cookieTracker);
        
        res.redirect('/');
    });

    /*res.render(pageRender, {
                title: article.title,
                //title: "test",
                article:article
            }); */

    //var id=cookies.get("articleID");
    //console.log('id is '+ req.param('_id'));
    //res.redirect('/blog/deleteBlog/'+id);
    //res.redirect('/blog/' + req.param('_id'));
    //res.redirect('/blog/deleteBlog');
};

