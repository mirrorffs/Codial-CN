const Post = require('../models/post')
const User = require('../models/user')


module.exports.home=async function(req,res){
    try{
        let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
            path: 'comments',
            options: {
                sort: {
                    createdAt: -1
                }
            },
            populate:{
                path: 'user likes'
            }
            }).populate('likes')
    
        let users = await User.find({})
        let myUser
        if(req.user){
            myUser = await User.findById(req.user._id).populate({
                path: 'friends',
                options: {
                    sort: {createdAt:-1}
                },
                populate:{
                    path: 'from_user to_user'
                }
            }) 
        }
        
        return res.render('home',{
            title: 'Codial | Home',
            post_list: posts,
            user_list: users,
            myUser: myUser
        })

            
        }catch(error){
        console.log('error in finding posts',error)
    }
}