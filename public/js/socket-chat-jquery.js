// Params
var params = new URLSearchParams(window.location.search);
var userName = params.get('name');
var userRoom = params.get('name');
// JQuery references
var divUsers = $('#divUsers');
var formSend = $('#formSend');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');
// Functions to render users
function renderUsers(persons) {
    console.log(persons);

    var html = ``;

    html += `<li>
                <a href="javascript:void(0)" class="active"> Chat de 
                    <span> ${params.get('room')}</span>
                </a>
            </li>`;

    for(var i=0; i < persons.length; i++){
        html += `<li>
                    <a data-id="${persons[i].id}" href="javascript:void(0)">
                        <img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> 
                        <span>${persons[i].name} 
                            <small class="text-success">online</small>
                        </span>
                    </a>
                </li>`;
    }

    divUsers.html(html);

}

function renderMessage(message, myMessage) {
    var html = ``;
    var date = new Date(message.date);
    var hour = date.getHours()+':'+ date.getMinutes();
    var adminClass = 'info';
    if(message.name === 'Administrator') {
        adminClass = 'danger';
    }

    if(myMessage){
        html += `<li class="reverse">
                    <div class="chat-content">
                        <h5>${message.name}</h5>
                        <div class="box bg-light-inverse">${message.message}</div>
                    </div>
                    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                    <div class="chat-time">${hour}</div>
                </li>`;
    }else{
        html += `<li class="animated fadeIn">`;
            if(message.name !== 'Administrator'){
                html += ` <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>`;
           }
        html += `<div class="chat-content">
                    <h5>${message.name}</h5>
                    <div class="box bg-light-${adminClass}">${message.message}</div>
                </div>
                <div class="chat-time">${hour}</div>
                </li>`;
    }

    divChatbox.append(html);
}

function scrollBottom() {
    var newMessage = divChatbox.children('li:last-child');
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);        
    }
}


divUsers.on('click', 'a', function(){
    var id = $(this).data('id');
    if(id){
        console.log(id);
    }
});

formSend.on('submit', function(e){
    e.preventDefault();
    // console.log(txtMessage.val());
    if(txtMessage.val().trim().length === 0){
        return;
    }

    // Send Message
    socket.emit('createMessage', {
        user: userName,
        message: txtMessage.val()
    }, function(resp) {
        console.log('server response: ', resp);
        txtMessage.val('').focus();
        renderMessage(resp, true);
        scrollBottom();
    });

});