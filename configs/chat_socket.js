const { Server } = require("socket.io");


module.exports.chatSocket = function(socketServer){
    // let io= require('socket.io')(socketServer , {
    //     cors: {
    //       origin: "http://localhost:8000",
    //       methods: ["GET", "POST"],
    //       credentials: true
    //     }
    //   });
    const io = new Server(socketServer,{
        cors: {
            origin: "http://localhost:8000",
            methods: ["GET", "POST"],
            credentials: true
          }
        });

    io.on('connection',(socket)=>{
        console.log('socket connected',socket.id )
        socket.on('disconnect',function(){
            console.log('socket disconnected')
        })

        socket.on('join_room',function(data){
            socket.join(data.chat_room)
            console.log('joining req received',data )
            io.to(data.chat_room).emit('user_joined', data)
        })

        socket.on('send_message',function(data){
            io.to(data.chat_room).emit('received_message', data)
        })
    })

}


