const nodemailer = require('../configs/nodemailer')

exports.resetPassword = (token)=>{
    let htmlString = nodemailer.renderTemplate({token: token},'/password-reset/reset_password_link.ejs')
    nodemailer.transporter.sendMail({
        from: 'mailercodial@gmail.com',
        to: token.user.email,
        subject: 'Reset Password Link',
        html: htmlString
    },(error,info)=>{
        if(error){
            console.log('error in newComment' , error)
        }else{
            console.log('email sent')
        }
    })
}
   