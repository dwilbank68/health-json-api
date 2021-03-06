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
// app.options('*', cors());

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, x-auth, X-Auth');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth, X-Auth');
    next();
});

app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
    var morgan = require('morgan');
    // app.use(morgan('combined'));
    app.use(morgan('dev'));
}


// app.use((req, res, next)=> {
//     var now = new Date().toString();
//     var log = `${now}: ${req.method} ${req.url}`;
//     console.log(log);
//     next();
// })



app.post('/days', authenticate, (req,res) => {
    Day
        .find({
            _creator: req.user._id,
            dateString: req.body.dateString
        })
        .then(
            (day) => {
                if (day.length > 0) {
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
                return res.status(200).send({'day':false});
            }
            res.send({day})
        })
        .catch((err)=>{
            res.status(400).send(err);
        })
})

// app.options('/users/me', cors());
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

app.options('/users/login', cors());
app.post('/users/login', (req,res) => {
    console.log('------------------------------------------');
    console.log(' inside /users/login route handler');
    console.log('------------------------------------------');
    var body = _.pick(req.body, ['email', 'password']);
    User
        .findByCredentials(body.email, body.password)
        .then((user) => {
            return user
                .generateAuthToken()
                .then((token) => {
                    res.header('x-auth', token)
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


