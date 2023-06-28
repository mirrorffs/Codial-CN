const queue = require('../configs/kue')
const commentMailer = require('../mailers/comments_mailer')
const resetPasswordMailer=require('../mailers/reset_password_mailer')

queue.process('comment-email', function(job,done){
    console.log('comment-email job is being processed')
    commentMailer.newComment(job.data)
    done()
})
queue.process('reset-email', function(job,done){
    console.log('reset-email job is being processed')
    resetPasswordMailer.resetPassword(job.data)
    done()
})