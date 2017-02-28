require('./config/config');
const _ = require('lodash');
const express = require("express");
const bodyParser = require('body-parser');
const moment = require('moment');

var {Day} = require('./models/day.js');

var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

var app = express();

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
// app.use(morgan('combined'));
if (process.env.NODE_ENV !== 'production') {
    var morgan = require('morgan');
    app.use(morgan('dev'));
}


// app.use((req, res, next)=> {
//     var now = new Date().toString();
//     var log = `${now}: ${req.method} ${req.url}`;
//     console.log(log);
//     next();
// })



app.post('/days', authenticate, (req,res) => {
    console.log('------------------------------------------');
    console.log('req.body.dateString in app.post /days', req.body.dateString);
    console.log('_creator is', req.user._id);
    console.log('------------------------------------------');
    Day
        .find({
            _creator: req.user._id,
            dateString: req.body.dateString
        })
        .then(
            (day) => {
                console.log('------------------------------------------');
                console.log('day in app.post/days',day);
                console.log('------------------------------------------');

                if (day.length > 0) {
                    console.log("updating existing entry - day._id", day[0]._id );
                    Day
                        .findByIdAndUpdate(
                            day[0]._id,
                            req.body,
                            {new:true}
                        )
                        .then(
                            (response) => { res.send(response); },
                            (err) => { res.send(err); }
                        )
                        .catch(
                            (err) => { console.log('error in update catch block', err);}
                        )

                } else {
                    console.log('did not find same date');
                    req.body._creator = req.user._id
                    var newDay = new Day(req.body);
         
                    newDay
                        .save()
                        .then(
                            (doc)=>{ res.send('new day added'); },
                            (err)=>{ res.status(400).send(err); }
                        )
                        .catch( (err) => { console.log('some error', err);} )
                }
            }
        )
});  

app.get('/days', authenticate, (req,res) => {
        Day
            .find( {_creator: req.user._id} )
            .select('date weight heartrate diastolic systolic saltTotal waterTotal -_id')
            .sort('date')
            .then(
                (data)=>{
                    let chartData = data.map( datum => {
                        return {
                            weight:datum.weight,
                            heartrate:datum.heartrate,
                            diastolic:datum.diastolic,
                            systolic:datum.systolic,
                            saltTotal:datum.saltTotal,
                            waterTotal:datum.waterTotal,
                            date: moment(datum.date).format('YYYY-MM-DD ddd')
                        };
                    })
                    res.send({chartData});
                },
                (err)=>{
                    res.status(400).send(err);
                }
            )
    })

app.get('/day/:dateString', authenticate, (req,res) => {
    Day
        .find({
            _creator: req.user._id,
            dateString: req.params.dateString
        })
        // .find({
        //     _creator: req.user._id,
        //     date: date
        // })
        .then((day)=>{
            day = day[0];
            if (!day) {
                console.log('------------------------------------------');
                console.log(' get /day/date - did not find day', req.params.dateString);
                console.log('------------------------------------------');
                return res.status(200).send({'day':false});
            }
            res.send({day})
        })
        .catch((err)=>{
            res.status(400).send(err);
        })
})

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user)
})

app.post('/users', (req,res) => {
    const email = req.body.email;

    User
        .findOne(
            {email:email},
            (err, existingUser) => {
                if (err) {return next(err);}
                if (existingUser) {
                    return res.status(422).send({error:'Email is in use'});
                }

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
            }
        )
})

app.post('/users/login', (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User
        .findByCredentials(body.email, body.password)
        .then((user) => {
            console.log('------------------------------------------');
            console.log('user after findByCredentials',user);
            console.log('------------------------------------------');
            return user
                .generateAuthToken()
                .then((token) => {
                    res
                        .header('x-auth', token)
                        .send(user);
                })
        })
        .catch((err) => {
            res.status(400).send(err);
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


