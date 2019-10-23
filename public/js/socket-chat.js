var socket = io();
var params = new URLSearchParams(window.location.search);

if(!params.has('name') || !params.has('room')){
    window.location = 'index.html';
    throw new Error('The name and the room are necessary');
}

var user = { name: params.get('name'), room: params.get('room') }

socket.on('connect', function() {
    console.log('Connected to server');
    socket.emit('enterTheChat', user, function(res) {
        // console.log('User connected ', res);
        renderUsers(res);
    });
});

socket.on('disconnect', function() {
    console.log('We lost connection to the server');
});

// Emite mensaje
// socket.emit('createMessage', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('server response: ', resp);
// });

// Escucha el mensaje
socket.on('createMessage', function(message) {
    console.log('Server:', message);
    renderMessage(message, false);
    scrollBottom();
});

// When a user connects or disconnects
socket.on('connectedPeople', function(res){
    // console.log(res);
    renderUsers(res);
});

// Private messages
socket.on('privateMessage', function(message) {
    console.log('Private Message:', message);
});