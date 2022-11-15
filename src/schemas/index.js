const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async () => {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required!!');
    if (!process.env.PORT) throw new Error('PORT is required!!');

    await mongoose.connect(process.env.MONGO_URI);
    mongoose.set('debug', true);
    console.log('MongoDB connected');
};
