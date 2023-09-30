// the following line of code is accessing our server
const socket = io('http://127.0.0.1:8000')

const form = document.getElementById('send-form');
const messageInp = document.getElementById('message');
const messageContainer = document.querySelector('.message-container');

var send = new Audio('send-sound.mp3');
var recieve = new Audio('recieve-sound.mp3');

const append = (data, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = data;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

// ***** USER JOINED *****
const username = prompt("Enter your name to join");
// socket.functonName('id', variable);
socket.emit('new-user-joined', username);

// io in socket.on() means socket is listening
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center');
})

// ***** SEND AND RECIEVE MESSAGE *****
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // append the message on the frontend
    const message = messageInp.value;
    append(`${username}: ${message}`, 'right');
    // now send message with 'send' event to the server
    socket.emit('send', message);
    messageInp.value = '';
    send.play();
})

socket.on('recieve', data => {
    append(`${data.name}: ${data.text}`, 'left');
    recieve.play();
})

// ***** LEFT THE CHAT *****
socket.on('left', member => {
    append(`${member.name} left the chat`, 'left');
})