const User = require('../models/user')
const fs = require('fs')
const path = require('path')
const ResetToken = require('../models/PassResetToken')
const crypto = require('crypto')
const resetPassowrdMailer = require('../mailers/reset_password_mailer')
const emailWorker = require('../workers/email_worker')
const queue = require('../configs/kue')

module.exports.profile = async function(req,res){
    // Manual Authentication 
    // let userId=req.cookies.user_id
    // if(userId){
    //     User.findById(userId).then(user=>{
    //         if(user==null){
    //             return res.redirect('/users/sign-in')
    //         }else{
    //             return res.render('user_profile',{
    //                 title: 'User Profile',
    //                 user: user
    //             })
    //         }
    //     }).catch(error=>{
    //         console.log('error in finding user profile'+error)
    //     })
    // }else{
    //     return res.redirect('/users/sign-in')
    // }

    try{
        let profileUser = await User.findById(req.params.id)
        let usersFriendships
        if(req.user){
             usersFriendships = await User.findById(req.user._id).populate({ 
               path : 'friends',
               options :  { sort: { createdAt: -1 } },
               populate : {
                   path: 'from_user to_user'
               }})
           }
        let isFriend = false;
        for(Friendships of usersFriendships.friends ){
            if(Friendships.from_user.id == profileUser.id || Friendships.to_user.id == profileUser.id ){
                isFriend = true ;
                break;
            }
        }
        return res.render('user_profile',{
                title: 'Profile',
                profile_user: profileUser,
                myUser: usersFriendships,
                isFriend: isFriend
            })
    }catch(error){
        console.log('error in getting user profile',error)
    }  
}
    


module.exports.update = function(req,res){
    if(req.user.id == req.params.id){
        User.findById(req.params.id).then(user=>{
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log('error in multer',err)}
                user.name = req.body.name
                user.email = req.body.email
                
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                    }

                    user.avatar = User.avatarPath+'/'+req.file.filename
                }
                user.save()
            })


            req.flash('success','Profile updated')
            return res.redirect('back')
        }).catch(error=>{
            console.log('error in updating user',error)
        })
    }else{
        return res.status(401).send('unauthorized')
    }
}




module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    res.render('user_signup',{
        title: 'SignUp'
    })
}

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    res.render('user_signin',{
        title: 'SignIn'
    })
}

module.exports.create=function(req,res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error','passwords do not match')
        return res.redirect('/users/sign-up')
    }else{
        User.findOne({ email: req.body.email}).then(user=>{
            if(user == null){
                User.create(req.body).then(newUser=>{
                    req.flash('success','Account created')
                    return res.redirect('/users/sign-in')
                }).catch(error=>{
                    console.log('error in creating user',error)
                })
            }else{
                req.flash('error','Email already exists')
                return res.redirect('/users/sign-in')
            }
        }).catch(error=>{
            console.log('error in finding user to sign up',error)
        })
    }

}

// Manual Auth Using Cookies

// module.exports.createSession=function(req,res){
//     User.findOne({email: req.body.email}).then(foundUser=>{
//         if(foundUser==null){
//             return res.redirect('back')
//         }else if(foundUser.password != req.body.password){
//                 res.redirect('back')
//         }else{
//             res.cookie('user_id ',foundUser.id)
//             return res.redirect('/users/profile')
//         }

//     }).catch(error=>{
//         console.log('error in finding user to sign in'+error)
//     })
// }

module.exports.forgotPassword = async function(req,res){
    
    try{
        res.render('forgot_password',{
            title: 'Forgot Password?'
        })
    }catch(error){
        console.log('error in rendering forgot pass page',error)
    }
}

module.exports.resetPasswordLink =  async function(req,res){

    try{
        let user = await User.findOne({email: req.body.email})
        console.log(user)
        if(user){
            let token = await ResetToken.create({
                user: user._id,
                accessToken: crypto.randomBytes(20).toString('hex'),
                isValid: true
            })
            console.log(token.accessToken)
            token = await token.populate('user')
            let job = queue.create('reset-email',token).save(function(error){
                if(error){console.log('error in queue create', error)}
                else{console.log('job enqueued',job.id)}   
            })
            req.flash('success','Reset link sent on your email')
            return res.redirect('/')
        }else{
            req.flash('error','User not found')
        }
    }catch(error){
        console.log('error in rendering forgot pass page',error)
    }
}
    
module.exports.createNewPassword = async function(req,res){
    try{
        let userToken = await ResetToken.findOne({accessToken:req.query.accessToken})
        if(userToken.isValid){
            res.render('reset_password',{
                title: 'Reset password',
                user_token: userToken
            })
        }else{
            req.flash('error','Reset link expired')
            return res.redirect('/')
        }
       
    }catch(error){
        console.log('error in rendering create new pass',error)
    }
}

module.exports.resetPassword = async function(req,res){
        if(req.body.password == req.body.confirm_password){
            console.log(req.body.password)
            let user = await User.findById(req.params.id) 
            console.log(user)
            await User.findByIdAndUpdate(user._id, {password:req.body.confirm_password})
            req.flash('success','Password updated successfully')
            return res.redirect('/')
        }else{
            req.flash('error','Passwords do not match! try again')
            return res.redirect('back')
        }
}

module.exports.createSession=function(req,res){
    req.flash('success','Logged in successfully')
    return res.redirect('/')
}

module.exports.destroySession=function(req,res){
    req.logout(function(error){
        if(error){
            console.log(error)
        }else{
            req.flash('success','Logged out successfully')
            return res.redirect('/')
        }
    })
    
}


