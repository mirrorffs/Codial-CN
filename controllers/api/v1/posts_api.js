const Post = require('../../../models/post')
const Comment = require('../../../models/comment')

module.exports.index = async function(req,res){
    
    let posts =await Post.find({}).sort('-createdAt').populate('user').populate({
        path: 'comments',
        populate:{
            path:'user'
        }
    }) 

    return res.json(200,{
        message: 'Post List',
        post: posts
    })
}


module.exports.deletePost = async function(req,res){
    try{
        let post = await Post.findById(req.params.id)
        if(post.user == req.user.id){
            await Post.findByIdAndDelete(post._id)
            await Comment.deleteMany({post: post._id})
            return res.json(200,{
                message:'Post deleted'
            })
        }else{
            return res.json(401,{
                message:'Not Authorized'
            })
        }
 
    }catch(error){
        console.log(error)
        return res.json(500,{
            message:'Internal server error'
        })
    }
}
