
require('dotenv').config()
const express = require('express')

const path = require('path')
const app = express()
const {logger}=require('./middleware/logger')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')
const corsOptions =require('./config/corsOption')
const port = process.env.PORT || 3500
const connectDb =require('./config/dbConn')
const cors=require('cors')
const moongose =require('mongoose')
const {logEvents}=require('./middleware/logger')
const { log } = require('console')
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
connectDb()
app.use(logger)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', require('./routers/root'))
app.use('/api/job', require('./routers/jobFilterRoute'))
app.use('/auth', require('./routers/authRouter'))
app.use('/user',require('./routers/userRoute'))
app.use('/send',require('./routers/contact'))
app.use('/jobs',require('./routers/jobsRoute'))
app.use('/applications',require('./routers/applicationRoute'))


// Static files
app.use('/', express.static(path.join(__dirname, 'public')))

// 404 handler
app.use((req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.accepts('json')) {
        res.json({ message: "The resource does not exist" })
    } else {
        res.type('txt').send("The resource does not exist")
    }
})



app.use(errorHandler)
// Server
moongose.connection.once('open',()=>{
    console,log("connected to mongoDb")
app.listen(port, () => console.log("The server is listening on " + port))


})
moongose.connection.on('error',err=>{
    console.log(err)
    logEvents(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.log')
})