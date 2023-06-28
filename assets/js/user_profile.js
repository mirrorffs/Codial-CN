{   
    let successPopUp = function(message){
    new Noty({ 
        type: 'success',
        theme: 'nest',
        text: message,
        layout: 'bottomRight',
        timeout: 1000,
        progressBar: true
         }).show();
    }

    let errorPopUp = function(message){
        new Noty({ 
            type: 'error',
            theme: 'nest',
            text: '<%= flash.error %>',
            layout: 'bottomRight',
            timeout: 1000,
            progressBar: true
             }).show();
    }

    $('#friend-toggle').click(function(e){
        e.preventDefault()
        let self = this

        $.ajax({
            method: 'GET',
            url: $(self).attr('href'),
        }).done(function(data){
            let message
            if(data.data.friendStatus){
                message = 'Friend Added'
                $('#friend-toggle-button').html('Remove Friend')
            }else{
                message = 'Friend Removed'
                $('#friend-toggle-button').html('Add Friend')
            }
            successPopUp(message)
            
        }).fail(function(error){
            console.log('error in adding friend in ajax')
            errorPopUp('Unable to add friend')
        })
    })
}