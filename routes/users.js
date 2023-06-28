const express = require('express')
const router = express.Router()
const userController=require('../controllers/UserController')

const passport = require('passport');
const session = require('express-session')

router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.post('/update/:id',passport.checkAuthentication,userController.update)
router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);
router.get('/sign-out',userController.destroySession)
router.post('/create',userController.create);
//using passport as middleware to authenticate
router.post('/create-session',passport.authenticate('local',{
    failureRedirect:'/users/sign-in'
}),userController.createSession)

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect: '/users/sign-in'}),userController.createSession)
router.get('/forgot-password',userController.forgotPassword)
router.post('/reset-password-link',userController.resetPasswordLink)
router.get('/create-new-password/',userController.createNewPassword)
router.post('/reset-password/:id',userController.resetPassword)

module.exports = router;