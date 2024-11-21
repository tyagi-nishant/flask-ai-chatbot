let pastedFile = null; // Global variable to store the pasted file

document.addEventListener('paste', handlePaste);

function handlePaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    
    for (let index in items) {
        const item = items[index];
        if (item.kind === 'file') {
            const blob = item.getAsFile();
            resizeAndUploadImage(blob);
            event.preventDefault();
            displayImage(blob, 'user');
            break;
        }
    }
}

function resizeAndUploadImage(blob) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const maxWidth = 100;
            const maxHeight = 100;
            
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const resizedImageData = canvas.toDataURL('image/jpeg');
            
            // Create FormData and send to server
            const formData = new FormData();
            formData.append('text', document.getElementById('user-input').value);
            
            // Convert base64 to blob and append to FormData
            fetch(resizedImageData)
                .then(res => res.blob())
                .then(blob => {
                    formData.append('file', blob, 'pasted-image.jpg');
                    
                    // Send to server
                    fetch('/chatImage', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Update chat interface with response
                        displayMessage(data.response, 'bot');
                    });
                });
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(blob);
}


async function sendMessage() {
    const input = document.getElementById('user-input');
    const fileInput = document.getElementById('file-input');
    const pastedImageInput = document.getElementById('pasted-image-input');
    const message = input.value;
    let file = fileInput.files[0] || pastedImageInput.files[0];;  // Use pasted file if no file is uploaded
    if (message.trim() === '' && !file) return;

    // Display user message
    if (message.trim() !== '') {
        displayMessage(message, 'user');
    }

    if (file) {
        displayImage(file, 'user');
    }

    // Clear input
    input.value = '';
    fileInput.value = '';
    pastedImageInput.value = '';  // Clear the pasted file after sending

    // Determine the endpoint
    const endpoint = file ? '/chatImage' : '/chat';

    const formData = new FormData();
    formData.append('text', message);
    if (file) {
        formData.append('file', file);
    }
  
    console.log('endpoint is', endpoint);
    // Send message to server
    const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    console.log(data);
    displayMessage(data.response, 'bot');
}

// The rest of your functions remain unchanged
function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    if (message.includes('```')) {
        // Extract code block and format it
        const codeContent = message.split('```')[1];
        const codeElement = document.createElement('pre');
        codeElement.classList.add('code-block');
        codeElement.textContent = codeContent;

        // Copy button
        const copyButton = document.createElement('span');
        copyButton.classList.add('copy-button');
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => copyToClipboard(codeContent);

        messageElement.appendChild(codeElement);
        messageElement.appendChild(copyButton);
    } else {
        messageElement.textContent = message;
    }

    chatBox.appendChild(messageElement);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}
function displayImage(file, sender) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        const imageElement = document.createElement('img');
        imageElement.src = e.target.result;
        imageElement.classList.add('chat-image');

        // Set larger dimensions directly
        imageElement.style.width = '300px';  // Increase from current size to 300px
        imageElement.style.height = 'auto';  // Maintain aspect ratio


        messageElement.appendChild(imageElement);
        chatBox.appendChild(messageElement);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    };
    reader.readAsDataURL(file);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Code copied to clipboard!');
    });
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const fileInput = document.getElementById('file-input');
    const pastedImageInput = document.getElementById('pasted-image-input');
    const message = input.value;
    const file = fileInput.files[0] || pastedImageInput.files[0];
    if (message.trim() === '' && !file) return;

    // Display user message
    if (message.trim() !== '') {
        displayMessage(message, 'user');
    }

    if (file) {
        displayImage(file, 'user');
    }

    // Clear input
    input.value = '';
    fileInput.value = '';
    pastedImageInput.value = '';

    // Determine the endpoint
    const endpoint = file ? '/chatImage' : '/chat';

    const formData = new FormData();
    formData.append('text', message);
    if (file) {
        formData.append('file', file);
    }
  
    console.log('endpoint is',endpoint)
    // Send message to server
    const response = await fetch(endpoint, {
        method: 'POST',

        body: formData,
    });

    const data = await response.json();
    console.log(data);
    displayMessage(data.response, 'bot');
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    if (message.includes('```')) {
        // Extract code block and format it
        const codeContent = message.split('```')[1];
        const codeElement = document.createElement('pre');
        codeElement.classList.add('code-block');
        codeElement.textContent = codeContent;

        // Copy button
        const copyButton = document.createElement('span');
        copyButton.classList.add('copy-button');
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => copyToClipboard(codeContent);

        messageElement.appendChild(codeElement);
        messageElement.appendChild(copyButton);
    } else {
        messageElement.textContent = message;
    }

    chatBox.appendChild(messageElement);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}
function displayImage(file, sender) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);

        const imageElement = document.createElement('img');
        imageElement.src = e.target.result;
        imageElement.classList.add('chat-image');

        messageElement.appendChild(imageElement);
        chatBox.appendChild(messageElement);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    };
    reader.readAsDataURL(file);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Code copied to clipboard!');
    });
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

