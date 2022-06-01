require('./models/user')
require('./models/Track')
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authroute')

const trackRoutes = require('./routes/trackRoutes');
const bodyParser = require('body-parser')
const app = express();

const authRoute = require('./middlewares/requireAuth')

app.get('/', authRoute, (req,res)=>{
    // console.log({req})
    res.send(`your email is ${req.user.email}`)
})
app.use(bodyParser.json())
app.use(authRoutes)
app.use(trackRoutes)
const mongoUri = process.env.CONNECTION_STRING

mongoose.connect(mongoUri, {
    useNewUrlParser:true,
    // useCreateIndex:true
})

mongoose.connection.on('connected', ()=>{
    console.log('Connected to mongo instance')
})
mongoose.connection.on('error',(err)=>{
    console.error('Error connecting to the mongo',err)
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000')
})