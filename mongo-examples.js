const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {

    if (err) throw err;

    const db = client.db("testdb");

    // list collections
    db.listCollections().toArray().then((docs) => {

        console.log('Available collections:');
        docs.forEach((doc, idx, array) => {
            console.log(doc.name)
        });
        console.log('----------------------------------------------');

    }).catch((err) => {
        console.log(err);
    }).finally(() => {
        client.close();
    });

    // show db stats
    db.stats((err, stats) => {

        if (err) throw err;

        console.log('Db Stats:');
        console.log(stats);
        console.log('----------------------------------------------');

        client.close();
    })

    // find all
    db.collection('cars').find({}).toArray().then((docs) => {

        console.log('Find all:');
        console.log(docs);
        console.log('----------------------------------------------');

    }).catch((err) => {
        console.log(err);
    }).finally(() => {
        client.close();
    });

    // count documents
    db.collection('cars').find({}).count().then((n) => {

        console.log("Count Documents:");
        console.log(`There are ${n} documents`);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // find one
    let collection = db.collection('cars');
    let query = {name: 'Volkswagen'}

    collection.findOne(query).then(doc => {

        console.log("Find One:");
        console.log(doc);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // find cars price greater than 30000
    let priceQuery = {price: {$gt: 30000}};

    db.collection('cars').find(priceQuery).toArray().then((docs) => {

        console.log("Cars which's price greater than 30000:");
        console.log(docs);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // find cars price between 20000 and 50000
    let priceBetweenQuery = {$and: [{price: {$gt: 20000}}, {price: {$lt: 50000}}]};

    db.collection('cars').find(priceBetweenQuery).toArray().then((docs) => {

        console.log("Cars which's price between 20000 and 50000:");
        console.log(docs);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // Projections determine which fields are passed from the database.
    db.collection('cars').find({}).project({_id: 0}).toArray().then((docs) => {

        console.log("Excludes _id field:");
        console.log(docs);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // Limit data output
    db.collection('cars').find({}).skip(2).limit(5).toArray().then((docs) => {

        console.log("Limit data output:");
        console.log(docs);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // aggregations
    let myagr = [{$group: {_id: 1, all: { $sum: "$price" } }}];

    db.collection('cars').aggregate(myagr).toArray().then((sum) => {

        console.log("Calculates the prices of all cars in the collection:");
        console.log(sum);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // specific aggregations
    let specificAgr = [
        { $match: { $or: [{ name: "Audi" }, { name: "Volvo" }] } },
        { $group: { _id: 1, sumAudiAndVolvo: { $sum: "$price" } } }
    ];

    db.collection('cars').aggregate(specificAgr).toArray().then((sum) => {

        console.log('Calculates the sum of prices of Audi and Volvo cars.:');
        console.log(sum);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // insert one
    let doc = {_id: new ObjectID(), name: "Toyota", price: 37600 };

    db.collection('cars').insertOne(doc).then((doc) => {

        console.log('Car inserted')
        console.log(doc);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // insert many
    let continentsCollection = db.collection('continents');

    let continents = [
        { _id: new ObjectID(), name: "Africa" }, { _id: new ObjectID(), name: "America" },
        { _id: new ObjectID(), name: "Europe" }, { _id: new ObjectID(), name: "Asia" },
        { _id: new ObjectID(), name: "Australia" }, { _id: new ObjectID(), name: "Antarctica" }
    ];

    continentsCollection.insertMany(continents).then(result => {

        console.log("documents inserted into the collection");
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // delete one
    let deleteQuery = { name: "Volkswagen" };

    db.collection('cars').deleteOne(deleteQuery).then((result) => {

        console.log('Car deleted');
        console.log(result);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });

    // update one
    let filQuery = { name: "Audi" };
    let updateQuery = { $set: { "price": 52000 }};

    db.collection('cars').updateOne(filQuery, updateQuery).then(result => {

        console.log('Car updated');
        console.log(result);
        console.log('----------------------------------------------');

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });
});