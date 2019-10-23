const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utilities/utilities');
const users = new Users();

io.on('connection', (client) => {
    console.log('Logged in user');
    
    client.on('enterTheChat', (user, callback) => {

        if(!user.name || !user.room){
            return callback({
                error: true,
                message: 'The name/room is necessary.'
            });
        }

        client.join(user.room);

        users.addPerson(client.id, user.name, user.room);

        client.broadcast.to(user.room).emit('connectedPeople', users.getPersonByRooms(user.room));

        client.broadcast.to(user.room).emit('createMessage', createMessage('Administrator', `${user.name} joined`));


        callback(users.getPersonByRooms(user.room));
    });

    client.on('createMessage', (data, callback) => {
        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);

        client.broadcast.to(person.room).emit('createMessage', message);

       
        callback(message);

    });
    

    client.on('disconnect', () => {
        let person = users.deletePerson(client.id);

        client.broadcast.to(person.room).emit('createMessage', createMessage('Administrator', `${person.name} left the chat`));

        client.broadcast.to(person.room).emit('connectedPeople', users.getPersonByRooms(person.room));

    });

    client.on('privateMessage', (data) => {
        let person = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));
    });

});