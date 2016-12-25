const { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();

MongoClient.connect(
    'mongodb://dwilbank:1aberath@ds031601.mlab.com:31601/todo-app',
    (err, db)=>{
        if (err) { return console.log('Unable to connect'); }
        console.log('connected to MongoDB server');

        db.collection('Todos')
            .insertOne(
                {text:'Something to do', completed:false},
                (err, result)=>{
                    if (err) {
                        return console.log('unable to insert todo',err);
                    }
                    console.log(JSON.stringify( result.ops, null, 2));
                }
            )

        db.collection('Users')
            .insertOne(
                {name:'Billy', age:10, location:'Texas'},
                (err, result)=>{
                    if (err) {
                        return console.log('unable to insert todo',err);
                    }
                    console.log(JSON.stringify( result.ops, null, 2));
                }
            )

        db.close();
    }
)