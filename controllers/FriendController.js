const User = require('../models/user')
const Friendship = require('../models/friend')

module.exports.toggleFriend = async function(req,res){
    try{
    let toAddFriend = await User.findById(req.query.id).populate('friends')
    let user = await User.findById(req.user._id).populate('friends')
    if(toAddFriend){
        let friendOp1 = await Friendship.findOne({
            from_user: req.user._id,
            to_user: req.query.id
        })
        let friendOp2 = await Friendship.findOne({
            from_user: req.query.id,
            to_user: req.user._id
        })

        let friendStatus = false

        if(friendOp1){
            await toAddFriend.friends.pull(friendOp1._id)
            await toAddFriend.save()
            await user.friends.pull(friendOp1._id)
            await user.save()
            await Friendship.findByIdAndDelete(friendOp1._id)
        }
        else if(friendOp2){
            await toAddFriend.friends.pull(friendOp2._id)
            await toAddFriend.save()
            await user.friends.pull(friendOp2._id)
            await user.save()
            await Friendship.findByIdAndDelete(friendOp2._id)
        }
        else{
            let newFriend = await Friendship.create({
                from_user: req.user._id,
                to_user: req.query.id
            })
            toAddFriend.friends.push(newFriend._id)
            user.friends.push(newFriend._id)
            toAddFriend.save()
            user.save()
            friendStatus = true
        }
        return res.json(200,{
            data:{
                friendStatus: friendStatus
            },
            message: 'success'
        })
    }

}catch(error){
    console.log('error in toggle friend',error);
        return res.json(500, {
            message: 'Internal Server Error'
        });
}
}