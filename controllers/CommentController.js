const Comment = require('../models/comment')
const Post = require('../models/post')
const Like = require('../models/like')
const commentMailer = require('../mailers/comments_mailer')
const emailWorker = require('../workers/email_worker')
const queue = require('../configs/kue')


module.exports.createComment=async function(req,res){
    // Post.findById(req.body.post).then(post=>{
    //     Comment.create({
    //         content: req.body.content,
    //         user: req.user._id,
    //         post: req.body.post
            
    //     }).then(comment=>{
    //         comment.populate('user')
    //         post.comments.push(comment)
    //         post.save()
    //         if(req.xhr){
    //             return res.status(200).json({
    //                 data:{
    //                     comment: comment
    //                 },
    //                 message: 'comment success'
    //             })
    //         }
    //         req.flash('success','commented successfully')
    //         return res.redirect('/')
    //     }).catch(error=>{
    //         console.log('error in creating Comment',error)
    //     })
    // }).catch(error=>{
    //     console.log('error in finding post for Comment',error)
    // })

    try{
        let post = await Post.findById(req.body.post)
        
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.user.post
            })
            post.comments.push(comment)
            post.save()
            comment = await comment.populate('user')

            // Working function to send email on every comment

            let job = queue.create('comment-email',comment).save(function(error){
                if(error){console.log('error in queue create', error)}
                else{console.log('job enqueued',job.id)}
                
            })
            commentMailer.newComment(comment)
            if(req.xhr){
                
                return res.status(200).json({
                    data:{
                        comment: comment
                    },
                    message: 'comment success'
                })
            }
            req.flash('success','Comment added')
            return res.redirect('back')
        }

    }catch(error){
        console.log('error in creating comment',error)
    }
    
}

module.exports.deleteComment = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id){
            let postId = comment.post;
            await Comment.findByIdAndDelete(comment._id)
            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        commentId: req.params.id
                    },
                    message: 'comment deleted'
                })
            }
            
            req.flash('success','comment deleted')
            return res.redirect('/')
        }
    }catch(error){
        console.log('error in deleting comment',error)
        return 
    }
}


