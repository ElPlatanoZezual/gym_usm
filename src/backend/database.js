const mongoose = require('mongoose');


function run() {

    const DB_USER = encodeURIComponent(process.env.DB_USER);
    const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);
    const DB_URI = encodeURIComponent(process.env.DB_URI);
    const DB_NAME = process.env.DB_NAME;

    const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URI}/${DB_NAME}?retryWrites=true&w=majority`;
    mongoose.set('strictQuery', false);
    
    return mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB Connected...')
    })
    .catch((err) => {
        throw new Error(err);
    });
}


module.exports = {
    run
};