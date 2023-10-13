/****************************
 MONGOOSE SCHEMAS
 ****************************/
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoString = 'mongodb://127.0.0.1:27017/feeds';

module.exports = function () {
    console.log('inside mongoose func')
    var db = mongoose.connect(mongoString).then(
        (connect) => { console.log('MongoDB connected') },
        (err) => { console.log('MongoDB connection error', err) }
    );
    return db;
};
