const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


const producRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/orders');
mongoose.connect('mongodb+srv://jaicky:test1234@cluster0-zetem.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology: true,useNewUrlParser: true })

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// handling cros

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','*');
        return res.status(200).json({});
    }
    next();
})


// routes which handle requests
app.use('/product',producRoutes);
app.use('/order',orderRoutes);

// error handaling

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
    
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports = app;