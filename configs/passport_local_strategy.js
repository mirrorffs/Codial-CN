const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },function(req,email,password,done){
        User.findOne({email: email}).then(foundUser=>{
            if(foundUser==null || foundUser.password != password){
                req.flash('error','Invalid username/password')
                return done(null,false)
            }else{
                return done(null,foundUser)
            }
        }).catch(error=>{
            console.log('error in finding user in passport',error)
            return done(error)
        })
    }
))

passport.serializeUser(function(user,done){
    console.log('error in finding user in passport',user)
    done(null, user.id)
})

passport.deserializeUser(function(id,done){
    User.findById(id).then(user=>{
        return done(null,user)
    }).catch(error=>{
        console.log('error in deserializeUser',error)
        return done(error)
    })
})

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/users/sign-in')
    }
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user
        
    }
    next()
}

module.exports = passport