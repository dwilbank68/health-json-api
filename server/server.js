require('./config/config');

const _ = require('lodash');
const express = require("express");
const bodyParser = require('body-parser');
var morgan = require('morgan');
const { ObjectID } = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Day} = require('./models/day.js');

var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

var app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));


// app.use((req, res, next)=> {
//     var now = new Date().toString();
//     var log = `${now}: ${req.method} ${req.url}`;
//     console.log(log);
//     next();
// })

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, x-auth');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth');
    next();
});

app.post('/days', authenticate, (req,res) => {

    Day.find({
            _creator: req.user._id,
            date: req.body.date
        })
        .then(
            (day) => {
                if (day.length) {
                    console.log("updating existing entry - day._id", day[0]._id );
                    console.log();

                    Day.findByIdAndUpdate(
                        day[0]._id,
                        req.body,
                        {new:true},
                        (err, updatedDay) => {
                            if (err) throw err;
                            console.log('updatedDay', updatedDay);
                        }
                    )
                    // .then(
                    //     (response) => {
                    //         res.send(response);
                    //         console.log('findByIdAndUpdate success');
                    //     },
                    //     (err) => {
                    //         console.log('findByIdAndUpdate failure');
                    //         res.send(err);
                    //     }
                    // )
                    // .catch(
                    //     (caughtError) => { console.log('error in update catch block', caughtError);}
                    // )

                } else {
                    console.log('did not find same date');
                    req.body._creator = req.user._id
                    var newDay = new Day(req.body);
         
                    newDay
                        .save()
                        .then(
                            (doc)=>{
                                res.send('new day added');
                            },
                            (err)=>{
                                res.status(400).send(err);
                            }
                        )
                        .catch(
                            (err) => { console.log('some error', err);}
                        )
                }
            }
        )
});  

// app.get('/todos', authenticate, (req,res) => {
//     Todo.find({_creator: req.user._id})
//         .then(
//             (todos)=>{
//                 res.send({todos})
//             },
//             (err)=>{
//                 res.status(400).send(err);
//             }
//         )
// })

app.get('/date/:date', authenticate, (req,res) => {
    let dateMilliseconds = parseInt(req.params.date);
    let date = new Date(dateMilliseconds);

//     if (!ObjectID.isValid(id)){
//         return res.status(404).send();
//     }

    Day.find({
        _creator: req.user._id,
        date: date
    })
    .then((day)=>{
        if (!day) {
            console.log('found no day');
            return res.status(404).send();
        }
        console.log('found day', day);
        res.send({day})
    })
    .catch((err)=>{
        res.status(400).send();
    })
})

// app.delete('/todos/:id', authenticate, (req,res) => {
//     var id = req.params.id

//     if (!ObjectID.isValid(id)){
//         return res.status(404).send();
//     }

//     Todo
//         .findOneAndRemove({
//             _id: id,
//             _creator: req.user._id
//         })
//         .then((todo)=>{
//             if (!todo) { return res.status(404).send(); }
//             res.send({todo})
//         })
//         .catch((err)=>{
//             res.status(400).send();
//         })
// })

// app
//     .patch('/todos/:id', authenticate, (req,res) => {
//         var id = req.params.id; 
//         var body = req.body;

//         if (!ObjectID.isValid(id)){
//             return res.status(404).send();
//         }

//         console.log('body', body);

        // if (_.isBoolean(body.completed) && body.completed){
        //     body.completedAt = new Date().getTime();
        // } else {
        //     body.completed = false;
        //     body.completedAt = null;
        // }

        // Todo
        //     .findOneAndUpdate(
        //         {_id:id, _creator: req.user._id},
        //         {$set: body},
        //         {new:true}
        //     )
        //     .then((todo)=>{
        //         if (!todo) { return res.status(404).send(); }
        //         res.send({todo})
        //     })
        //     .catch((err)=>{
        //         res.status(400).send();
        //     })
    // })




app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user)
})

app.post('/users', (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save()
        .then(()=>{
            return user.generateAuthToken();
        })
        .then((token)=>{
            res
                .header('x-auth', token)
                .send(user);
        })
        .catch((e)=>{
            res.status(400).send(e);
        })
})

app.post('/users/login', (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User
        .findByCredentials(body.email, body.password)
        .then((user) => {
            return user
                .generateAuthToken()
                .then((token) => {
                    res
                        .header('x-auth', token)
                        .send(user);
                })
        })
        .catch((err) => {
            res.status(400).send();
        })
})

app.delete('/users/me/token', authenticate, (req,res) => {
    req.user
        .removeToken(req.token)
        .then(
            () => { res.status(200).send(); },
            () => { res.status(400).send(); }
        )
})

app.listen(port, ()=>{
    console.log('running on port ' + port);
})

module.exports = {app};


