const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect(
    'mongodb://dwilbank:1aberath@ds031601.mlab.com:31601/todo-app',
    (err, db)=>{
        if (err) { return console.log('Unable to connect'); }
        console.log('connected to MongoDB server');

        db.collection('Users')
            .findOneAndUpdate(
                { _id: ObjectId('58021ab7bf81b73beca0e21f') },
                { $set: {name:"Billy Q"}, $inc: {age:1} },          // 1
                { returnOriginal: false }                           // 2
            )
            .then( result =>{
                console.log(result);
            })

        // 1 - or $inc, $mul, $rename, $setOnInsert, $unset, $min, $max, $currentDate
        // 1 - see docs.mongodb.com/manual/reference/operator/update/
        // 2 - so that updated object is returned instead

        // db.close();
    }
)
