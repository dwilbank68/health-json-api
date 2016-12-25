const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect(
    'mongodb://dwilbank:1aberath@ds031601.mlab.com:31601/todo-app',
    (err, db)=>{
        if (err) { return console.log('Unable to connect'); }
        console.log('connected to MongoDB server');

        // db.collection('Todos')
        //     .find({
        //         _id: ObjectId('580218d919804b3bb170c400')
        //     })
        //     .toArray()
        //     .then(
        //         docs => {
        //             console.log('Todos');
        //             console.log(JSON.stringify(docs , null, 2));
        //         },
        //         err => {
        //             console.log('unable to fetch todos', err);
        //         }
        //     )

        db.collection('Todos')
            .deleteMany({text:'Eat a bug'})
            .then(
                (res)=>{ console.log(res);}
            )

        // db.close();
    }
)
