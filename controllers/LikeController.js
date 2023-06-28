const Post = require('../models/post')
const Like = require('../models/like')
const Comment = require('../models/comment')

module.exports.toggleLike = async function(req,res){
    try{
        let likeable
        let deleted=false

        if(req.query.type == 'Post'){
            likeable= await Post.findById(req.query.id).populate('likes')
        }else{
            likeable= await Comment.findById(req.query.id).populate('likes')
        }
        //check like exists
        let existingLike =await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        if(existingLike){
            likeable.likes.pull(existingLike._id)
            likeable.save()
            await Like.findByIdAndDelete(existingLike._id)
            deleted=true
        }else{
            let newLike = await Like.create({
                likeable: req.query.id,
                onModel: req.query.type,
                user: req.user._id
            })
            likeable.likes.push(newLike._id)
            likeable.save()
            deleted=false
        }
        return res.json(200,{
            message:'Internal server error',
            data:{
                deleted: deleted
            }
        })


    }catch(error){
        console.log(error)
        return res.json(500,{
            message:'Internal server error in toggle like'
        })
    }
}