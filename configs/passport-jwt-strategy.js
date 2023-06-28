const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')
const env = require('./environment')

let opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret
}

passport.use(new JwtStrategy(opts , async function(jwt_payload, done){
    
    try{
        let user = await User.findById(jwt_payload._id)

    if(user){
        return done(null, user)
    }else{
        return done(null, false)
    }
    }catch(error){
        console.log(error)
        return done(null, false)
    }

}))

module.exports = passport
