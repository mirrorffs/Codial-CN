
{
    let chatBoxContainer = $('.chat-box-wrapper')
    let UserChatBox =  $('#user-chat-box')
    let chatBoxToggle = $('.chat-box-buttons');
    
    chatBoxToggle.click(function(e){
        console.log('chatbox')
        chatBoxContainer.toggleClass('.minimised-ht')
    })

}


