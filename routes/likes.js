const express = require('express')
const router = express.Router()
const likeController=require('../controllers/LikeController')

router.post('/toggle',likeController.toggleLike)


module.exports = router