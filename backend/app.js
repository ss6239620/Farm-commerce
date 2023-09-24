const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport')
const path = require('path')

const users = require('./routes/users')
const crop = require('./routes/crop')
const order = require('./routes/order')
const category = require('./routes/category')
const review = require('./routes/review')
const contact = require('./routes/contact')
const cart = require('./routes/cart')
const merchant = require('./routes/merchant')




const app = express()

app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

app.use(bodyParser.json());

const dbURL = "mongodb://localhost:27017/anon";

// connect to mongoDB
mongoose.connect(
    process.env.MONGODB_URI || dbURL,
    { useUnifiedTopology: true, useNewUrlParser: true }
)
    .then(() => { console.log("MongoDB connected Succesfully.") })
    .catch(err => { console.log(err) })


// passport middileware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

//Routes
app.use('/api/users', users)
app.use('/api/crop', crop)
app.use('/api/order', order)
app.use('/api/category', category)
app.use('/api/review', review)
app.use('/api/contact', contact)
app.use('/api/cart', cart)
app.use('/api/merchant', merchant)







const port = 9000;

app.listen(port, () => { console.log(`Server up and running on port ${port}`) })


