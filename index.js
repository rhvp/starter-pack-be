require('dotenv').config();
const app = require('./app');
require('./config/mongoose');
// const upload = require('./config/script');

// upload.uploadState();


Error.stackTraceLimit = 1;
const port = process.env.PORT || 2200;

process.on('uncaughtException', err => {
    console.log('Uncaught Exception!! Shutting down process..', err.name, err.message, err.stack);
    process.exit(1);
});

app.listen(port,()=>{
    console.log('App running on Port:', port)
});

process.on('unhandledRejection', err=>{
    console.log('Unhandled Rejection!!',err.code, err.name, err.message, err.stack);
});