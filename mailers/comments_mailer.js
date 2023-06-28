const nodemailer = require('../configs/nodemailer')

exports.newComment = (comment)=>{
    let htmlString = nodemailer.renderTemplate({comment: comment},'/comments/new_comment.ejs')
    nodemailer.transporter.sendMail({
        from: 'mailercodial@gmail.com',
        to: comment.user.email,
        subject: 'New comment added',
        html: htmlString
       
    }, (error, info)=>{
        if(error){
            console.log('error in newComment' , error)
        }else{
            console.log('email sent')
        }
       
    })
}