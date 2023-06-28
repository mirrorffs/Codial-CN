
{
    // method to create and submit post using ajax
    let createPost = function () {
        let newPostForm = $('#new-post-form')
        
        newPostForm.submit(function(e){
            e.preventDefault()
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post)
                    $('#posts-list-container>ul').prepend(newPost)
                    deletePost($(' .delete-post-button', newPost))

                    new PostComments(data.data.post._id)
                    new ToggleLike($('.toggle-like-button',newPost))

                    new Noty({ 
                        type: 'success',
                        theme: 'nest',
                        text: 'Post uploaded',
                        layout: 'bottomRight',
                        timeout: 1000,
                        progressBar: true
                         }).show();
    
                },
                error: function(error){
                    console.log(error.responseText)
                }
            })
        })
    }

    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">   
                    <p>
                    <p>
                        <small>
                        <a class="delete-post-button" href="/posts/destroy/${post._id}">x</a>
                        </small>
                        ${ post.content }
                        <br>
                    <small>${ post.user.name }</small>
                    </p>
                    <small>
                       <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 Likes
                       </a>
                    </small>
                    </p>
                    <hr>
                    <div class="post-comments">
                            <form id="post-${post._id}" action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Type here to add comment.." required>
                                <input type="hidden" name="post" value="${post._id}" >
                                <input type="submit" value="Add Comment">
                            </form>                            
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">
                                </ul>
                            </div>
                    </div>
                    <hr>
                    <br>
                </li>`)
    }

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault()

            $.ajax({
                type: 'get',
                url:  $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.postId}`).remove()
                    
                    new Noty({ 
                        type: 'success',
                        theme: 'nest',
                        text: 'Post deleted',
                        layout: 'bottomRight',
                        timeout: 1000,
                        progressBar: true
                         }).show();
                },
                error: function(error){
                    console.log(error.responseText)
                }
            })
        })
    }

    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self)
            deletePost(deleteButton)
            
            let postId=self.prop('id').split('-')[1]
            new PostComments(postId)

        })
    }
    createPost()
    convertPostsToAjax()
}