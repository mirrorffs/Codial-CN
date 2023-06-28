const Post = require('../models/post')
const Comment = require('../models/comment')
const Like = require('../models/like')

module.exports.createPost =async function(req,res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        post = await post.populate('user');
        
        if (req.xhr){
            
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post created');
        return res.redirect('back');

    }catch(error){
        console.log(error);
    }   
       
}

module.exports.deletePost = async function(req,res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            await Post.findByIdAndDelete(post._id);
            await Comment.deleteMany({post: req.params.id});
            
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        postId: req.params.id
                    },
                    message: 'Post deleted'
                })
            }
            req.flash('success', 'Post deleted!');

            return res.redirect('back');
        }

    }catch(error){
        console.log('error in deleting post',error)
        return res.redirect('back');
    }

                    
 
}
