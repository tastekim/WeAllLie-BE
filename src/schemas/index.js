const mongoose = require("mongoose");
require('dotenv').config();

const connect = () => {
    mongoose
        .connect(`${process.env.MONGO_URI}`)
        .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
    console.error("몽고디비 연결 에러", err);
});

module.exports = connect;

// module.exports = async () => {
//     try {
//         if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required!!');
//         if (!process.env.PORT) throw new Error('PORT is required!!');
//
//         await mongoose.connect(process.env.MONGO_URI);
//         mongoose.set('debug', true);
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.log(err);
//     }
// };