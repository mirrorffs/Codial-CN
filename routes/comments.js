const express = require('express')
const router = express.Router()
const passport = require('passport');
const commentController=require('../controllers/CommentController');

router.post('/create',passport.checkAuthentication,commentController.createComment)
router.get('/destroy/:id',passport.checkAuthentication,commentController.deleteComment)

module.exports = router