const express = require('express')
const router = express.Router()
const friendController=require('../controllers/FriendController')
const passport = require('passport');

router.get('/toggle',passport.checkAuthentication, friendController.toggleFriend)


module.exports = router