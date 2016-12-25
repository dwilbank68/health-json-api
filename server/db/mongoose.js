var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};