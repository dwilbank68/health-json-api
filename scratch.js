{
    [
        {
            "ladder":"Accountant",
            "classes": [
                {"class":"Departmental Chief Accountant"},
                {"class":"Chief Auditor Controller (Water and Power)"},
                {"class":"Fiscal System Specialist"},
                {"class":"Financial Manager"},
                {"class":"Departmental Chief Accountant"},
                {"class":"Departmental Chief Accountant"},
            ]
        }


    ]
}

//////////////////// simplest server /////////////////////
                                                        //
// const express = require('express');
                                                        //
// const app = express();
                                                        //
// app.listen(3050, function() {
//     console.log('listening on port 3050');
// });
//////////////////////////////////////////////////////////

////////////////// using webpack to serve static site ////////////////
                                                                    //
const express = require('express');
const path = require('path');
const app = express();
                                                                    //
// server routes here - app.get, etc...                             //
                                                                    //
if (process.env.NODE_ENV !== 'production') {
    const webpackMiddleware = require('webpack-dev-middleware');
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config.js');
    app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
    app.use(express.static('dist'));                                // 1
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));      // 2
    })
}
                                                                    //
app.listen(process.env.PORT || 3050, function() {
    console.log('listening on port 3050');
});
                                                                    //
// 1 -  make all contents of dist folder available for requests     //
// 2 -  so that React Router's browserHistory works correctly       //
                                                                    //
//////////////////////////////////////////////////////////////////////

////// to set static folder of assets //////////////////////////
//app.use('/assets', express.static(__dirname + '/public'));  //
////////////////////////////////////////////////////////////////

////////////// to use swig //////////////////////
// var cons = require('consolidate');          //
// app.engine('html', cons.swig);              //
// app.set('view engine', 'html');             //
// app.set('views', __dirname + '/views');     // this is already default... skip it?
// // then use like                            //
// // res.render('hello', { 'name':'Swig' });  //
// //////////////////////////////////////////////


////////// to use mongo (node driver) //////////////////////////
// var MongoClient = require('mongodb').MongoClient;          //
// var Server = require('mongodb').Server;                    //
// var mongoclient = new MongoClient(new Server('localhost',  //
//     27017,                                                 //
//     { 'native_parser':true }                               //
// ));                                                        //
//                                                            //
// var db = mongoclient.db('course');                         //
//                                                            //
// mongoclient.open(function(err,mongoclient){                //
//     app.listen(8080);                                      //
//     console.log('express server started on port 8080');    //
// });                                                        //
////////////////////////////////////////////////////////////////

// app.get('/', function(req,res) {
//     res.send('Hello world');       // sends back text/html if contents are text/html
//     res.send('yourArrayOrObject'); // sends back JSON if contents is object or array
//     res.json(yourArrayOrObject)    // same as res.send and sends 200 status code
//     // or to use methods inherited from node,
//     res.write('Hello world');
//     res.end();
//
//     res.redirect('/wherever');      // sets 302 (temp relocate) and the location in the header
//     res.redirect(301, '/wherever'); // sets 301 (perm relocate) and the location in the header
// });

// or

// app.get('/', function(req,res){
//     db.collection('hello_mongo_express').findOne({}, function(err,doc){
//         res.render('hello', doc);
//     });
// });
//
// app.get('*', 'etc...') // any other route

// app.listen(3000);
// or

// or
// mongoclient.open(function(err,mongoclient){
//     if(err) throw err;
//     app.listen(8080);
//     console.log('express server started on port 8080');
// });


////////////////////////// To send/serve an HTML file /////////////////////////

// app.get('/', function(req,res) {
//     res.sendFile(__dirname + '/public/index.html');
// };

// or

// app.param('name', function(req,res,next) {
//     var name = req.params.name;
//     var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
//     req.blockName = block;
//     next();
// }

// which is the same as

//     .all(function(req,res,next) {
//         var name = req.params.name;
//         var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
//         req.blockName = block;
//         next();
//     }
//
// app.use(express.static('public')); // which defaults to index.html file



/////////////////////////// User Params and GET Variables ////////////////////////////////
//                                                                                      //
// if URL is something/name?getvar1=diddly												//
// and app.get('/:name', ...)															//
// var name = req.params.name															//
// var getvar1 = req.query.getvar1														//
//                                                                                      //
// '/blocks?limit=1'																	//
// can be accessed with																	//
//                                                                                      //
// if(req.query.limit >= 0)																//
//     response.json(blocks.slice(0, req.query.limit));									//
//                                                                                      //
// and if resource can't be found														//
//                                                                                      //
// res.status(404).json('No description found for ' + req.params.name);					//
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////

// want to alter params?

// Body Parser

// var parseUrlencoded = bodyParser.urlencoded({ extended: false });


// GET
// <form>
//     <input name="str"/>
{/*</form>*/}

// to get data from a form input, grab input's name - req.body.str

////////////////////////////////// POST ///////////////////////////////////////
//
// to access the req.body,


// app.post('/favorite_fruit', function(req,res,next){
//     var fav = req.body.fruit;
//     if(typeof fav =='undefined') {
//         next(Error('Please choose a fruit')); // looks for error handling middleware
//     } else {
//         res.send('You chose ' + fav);
//     }
// });
//
// function errorHandler(err,req,res,next){
//     console.error(err.message);
//     console.error(err.stack);
//     res.status(500);
//     res.render('error_template', { error:err });
// };
// app.use(errorHandler);
//
// app.post('/blocks', parseUrlencoded, function(req, res) {
//     var newBlock = request.body; // which is where form data comes in if you form.serialize() it
// });

//DELETE
//Client-side

// $('.block-list').on('click', 'a[data-block]', function(e) {
//     if (!confirm('Are you sure ?')) {
//         return false;
//     }
//
//     var target = $(e.currentTarget);
//
//     $ajax({
//         type: 'DELETE', url: '/blocks', target.data('block')
// }).done(function() {
//
//     });
//
// }

// Server-side

// app.delete('/blocks/:name', function(req,res){
//     delete blocks[req.blockName];
//     res.sendStatus(200); // res.status(200) would give empty body, which can cause probs
// });

// Refactoring

// var blocksRoute = app.route('/blocks');
// blocksRoute.get(...
//     blocksRoute.post(...
//
//         or chaining...
//
// app.route('/blocks')
//     .get(func...
// .post(parseUrlencoded, func...

// or create modules
//
// create new folder e.g. routes/blocks.js
//
// blocks.js
//
// var express = require('express');
// var router = express.Router();
// var bodyParser = require('body-parser');
// var parseUrlencoded = bodyParser.urlencoded({ extended: false });
// var blocks = { ... };
//
// router.route('/') // which means /blocks because of app.use('/blocks', ...);
//     .get(func...
//     .post(parseUrlencoded, func...
//
// module.exports = router; // exports router as a Node module

//then use it in app.js

// var blocks = require('./routes/blocks');
// app.use('/blocks', blocks);

/////////////////////////////////////////////////////////////////////////////////////////

// var express = require('express');
// var bodyParser = require('body-parser');
// var _ = require('underscore');
// var app = express();
// var PORT = process.env.PORT || 3000;
// var todos = [];
// var todoNextId = 1;
//
//
// app.use(bodyParser.json());
//
// app.get('/', function(req,res) {
//     res.send('Todo API Root');
// });
//
//
// app.get('/todos', function(req,res){
//     res.json(todos);
// });
//
// app.get('/todos/:id', function(req,res){
//     var id = parseInt(req.params.id,10);
//     var matched = _.findWhere(todos, {id:id});
//
//     matched ? res.json(matched) : res.status(404).send();
//
// });
//
// app.post('/todos', function(req,res){
//     var body = _.pick(req.body, 'description','completed');
//
//     if ( !_.isBoolean(body.completed)
//         || !_.isString(body.description)
//         || body.description.trim().length === 0) {
//         return res.status(400).send();
//     }
//     body.description = body.description.trim();
//
//     body.id = todoNextId++;
//     todos.push(body);
//     res.json(todos);
// });
//
//
//
//
//
//
//
// app.delete('/todos/:id', function(req,res) {
//     var todoId = parseInt(req.params.id, 10);
//     var matchedTodo = _.findWhere(todos, {id: todoId});
//
//     if (!matchedTodo){
//         res.status(400).json({"error": "no todo found with that id"});
//     } else {
//         todos = _without(todos, matchedTodo);
//         res.json(matchedTodo);
//     }
// });
//
// app.put('/todos/:id', function(req,res) {
//
//     var todoId = parseInt(req.params.id, 10);
//     var matchedTodo = _.findWhere(todos, {id: todoId});
//     var body = _.pick(req.body, 'description', 'completed');
//     var validAttributes = {};
//
//     if(!matchedTodo){
//         console.log('not matched Todo');
//         return res.status(404).send();
//     }
//
//     if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
//         console.log('yay completed');
//         validAttributes.completed = body.completed;
//     } else if (body.hasOwnProperty('completed')){
//         return res.status(400).send();
//     }
//
//     if(body.hasOwnProperty('description') && body.description.trim().length > 0){
//         console.log('yay desc');
//         validAttributes.description = body.description;
//         console.log('validAttr is ', validAttributes);
//     } else if (body.hasOwnProperty('description')){
//         return res.status(400).send();
//     }
//
//     _.extend(matchedTodo, validAttributes);
//     res.json(matchedTodo);
// });
//
// app.listen(PORT, function(){
//     console.log('Express listening on port ', PORT);
// });
