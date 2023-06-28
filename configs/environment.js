const fs = require('fs')
const rfs = require('rotating-file-stream')
const path = require('path')

const logDirectory = path.join(__dirname,'../development_logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory) 
const accessLogStream = rfs.createStream('access.logs',{
    interval: '1d',
    path: logDirectory
})

const development = {
    name: 'development',
    session_cookie_key: 'xyz',
    db: 'mongodb+srv://mirrorffs:Avigupta121@cluster0.qffikxv.mongodb.net/',
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'mailercodial@gmail.com',
            pass: 'vlazyklwjygocwti'
        }
    },
    google_clientID: "424043313153-2pn49d0mksrfnkh32d9afplfj6kjhrtp.apps.googleusercontent.com",
    google_clientSecret: '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',
    google_callbackURL: 'http://localhost:8000/users/auth/google/callback',
    jwt_secret: 'codial',
    morgan: {
        mode: 'dev',
        options: {
            stream: accessLogStream
        }
    }
}
const production = {
    name: 'production'
}

module.exports = development