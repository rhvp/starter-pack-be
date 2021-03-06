const express = require('express');
const AppError = require('./config/appError');
const errorHandler = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const app = express();

app.use(cors());
app.options('*', cors());

app.use(morgan('short'));

app.use(helmet());

const limiter = rateLimit({
    max: 500,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use('/', limiter);
app.get('/', (req, res, next)=>{
    console.log('random request from ' + req.ip);
    res.send('Hello ' + req.ip);
})
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/location', locationRoutes);


app.use((req, res, next)=>{
    let err = new AppError(`${req.ip} tried to reach a resource at ${req.originalUrl} that is not on this server.`, 404);
    next(err);
});

app.use(errorHandler);

module.exports = app;