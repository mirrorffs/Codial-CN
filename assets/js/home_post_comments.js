
class PostComments{
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this))
        })
    }

    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            console.log('in comment')
            e.preventDefault();
            let self = this;
            $.ajax({
                type:'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment)
                    $(`#post-comments-${postId}`).prepend(newComment)
                    pSelf.deleteComment($(' .delete-comment-button', newComment))

                    new ToggleLike($(' .toggle-like-button',newComment))
                    new Noty({ 
                        type: 'success',
                        theme: 'nest',
                        text: 'Comment added',
                        layout: 'bottomRight',
                        timeout: 1000,
                        progressBar: true
                         }).show();
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    newCommentDom(comment){
        return $(`<li id="comment-${ comment._id }">
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">x</a>
            </small>
            ${comment.content}
            <br>
            <small>
                ${comment.user.name}
            </small>
            
                <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                       0 Likes
                    </a>
                </small>
        </p>    
</li>
        `)
    }

    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault()

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success:function(data){
                    $(`#comment-${data.data.commentId}`).remove();
                    new Noty({ 
                        type: 'success',
                        theme: 'nest',
                        text: 'Comment deleted',
                        layout: 'bottomRight',
                        timeout: 1000,
                        progressBar: true
                         }).show()
                },
                error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

}
