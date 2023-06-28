const express = require('express')
const cookieParser = require('cookie-parser')
const app=express()
const env = require('./configs/environment')
const logger = require('morgan')
const expresslayouts = require('express-ejs-layouts')
const db = require('./configs/mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocal = require('./configs/passport_local_strategy')
const passportJwt = require('./configs/passport-jwt-strategy')
const passportGoogle = require('./configs/passport_google_oauth2_strategy')
const MongoStore = require('connect-mongo')
const saasMiddleware = require('node-sass-middleware')
const flash = require('connect-flash')
const customMiddleware = require('./configs/middleware')
//chat sockets
const socketServer = require('http').createServer(app);;
const chatSocket = require('./configs/chat_socket').chatSocket(socketServer)
const path = require('path')

socketServer.listen(3000, () => {
    console.log('Chat server running on 3000');
  });

const port=8000;
app.use(saasMiddleware({
    src: './assets/scss',
    dest: path.join('./assets/css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))

app.use(express.urlencoded())
app.use(cookieParser())
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)
app.use(express.static('./assets'))
app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(logger(env.morgan.mode, env.morgan.options))
app.use(expresslayouts)
app.set('view engine','ejs')
app.set('views','./views')
app.use(session({
    name: 'Codial',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://mirrorffs:Avigupta121@cluster0.qffikxv.mongodb.net/',
        autoRemove: 'disabled'
    },function(error){
        console.log(error)
    })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser)
app.use(flash())
app.use(customMiddleware.setFlash)


app.use('/',require('./routes'))

app.listen(port,function(error){
    if(error){
        console.log(error)
    }else{
        console.log(`Server is running on port ${port}`)
    }
})