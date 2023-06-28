class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`)
        this.userEmail = userEmail
        this.socket = io.connect('http://localhost:3000')

        if(this.userEmail){
            this.connectionHandler()
        }
    }

    createMessagePill(data){
        let senderMail = data.user_email;
        let message = data.message
        console.log("create");
        let messageType = 'other-message' ;
        if(senderMail === this.userEmail){
            messageType = 'self-message';
        }

        return $(`
        <li class="${messageType}">
            <span>${message}</span>
            <div class="user-mail">${senderMail}</div>
        </li>
        `)
    }

    connectionHandler(){
        let self = this
            this.socket.on('connect',()=>{
            console.log('connection established with sockets')

            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chat_room: 'codial'
            })

            self.socket.on('user_joined',function(data){
                console.log('a user joined', data)
            } )

            $('#send-message').click(function(){
                let msg = $('#chat-message-input').val()
    
                if(msg != ''){
                    self.socket.emit('send_message',{
                        message: msg,
                        user_email: self.userEmail,
                        chat_room: 'codial'
                    })
                    $('#chat-message-input').val("");
                }
            })
    

            self.socket.on('received_message', function(data){
                console.log('message received', data.message)
    
                let messagePill = self.createMessagePill(data);
                $(".chat-messages-list").append(messagePill);
            
            })
   
        })
    }

}

