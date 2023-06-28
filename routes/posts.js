const express = require('express')
const router = express.Router()
const passport = require('passport');
const postController=require('../controllers/PostController');


router.post('/create',passport.checkAuthentication,postController.createPost)
router.get('/destroy/:id',passport.checkAuthentication,postController.deletePost)





module.exports = router