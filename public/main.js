const socket = io();

const clientsTotal = document.getElementById('clients-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})

socket.on('clients-total', (data) => {
    clientsTotal.innerHTML = `Online: ${data}`
});

function sendMessage() {
    if (messageInput.value === "") return;
    let date = dayjs().format('DD MMMM', 'HH')
    let hour = dayjs().format('HH:mm')

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: date + " " + hour
    }

    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    console.log(data);
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
                ${data.message}
                <span>${data.name} ● ${data.dateTime}</span>
            </p>
        </li>
    `

    messageContainer.innerHTML += element
    scrollToBottom();
}


function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: ` ${nameInput.value} is typing a message`
    })
});

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: ` ${nameInput.value} is typing a message`
    })
});

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ''
    })
});

socket.on('feedback', (data) => {
    clearFeedback();
    const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback"> ${data.feedback}</p>
        </li>
    `

    messageContainer.innerHTML += element
})


function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    });
}