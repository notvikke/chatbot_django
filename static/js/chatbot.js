// --- Theme Toggle Functionality ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Apply saved theme on load
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggleBtn.innerHTML = "☀️";
} else {
    body.classList.remove('dark-mode'); // Ensure light is default
    themeToggleBtn.innerHTML = "🌙";
}

function toggleTheme() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        themeToggleBtn.innerHTML = "☀️";
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleBtn.innerHTML = "🌙";
        localStorage.setItem('theme', 'light');
    }
}

// --- Chat Functionality ---
const chatBox = document.getElementById("chat-box");
const userInputField = document.getElementById("user-input");
const typingIndicator = document.getElementById("typing-indicator");
const typingIndicatorContainer = typingIndicator.parentElement; // Get the container


function sendMessage() {
    const userInput = userInputField.value.trim();
    if (!userInput) return;

    userInputField.value = ""; // Clear input field

    appendMessage("You", userInput, "user-message"); // Display user message

    typingIndicator.style.display = "block"; // Show Typing Indicator
    typingIndicatorContainer.style.display = "block"; // Show container too
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll down

    console.log("Sending message:", userInput); // Debug log

    // Simulate API Fetch (REMOVE/REPLACE with your actual fetch)
    // setTimeout(() => {
    //     const botResponse = `You said: "${userInput}". This is a test response.`;
    //     appendMessage("Bot", botResponse, "bot-message");
    //     typingIndicator.style.display = "none"; // Hide indicator
    //     typingIndicatorContainer.style.display = "none"; // Hide container
    //     console.log("Simulated response received.");
    // }, 1500); // 1.5 second delay


    // Actual Fetch (Uncomment this section)
    fetch("/chatbot/api/", { // MAKE SURE THIS URL IS CORRECT
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => {
        if (!response.ok) {
             // Try to get error message from response body
             return response.text().then(text => {
                 throw new Error(`HTTP error ${response.status}: ${text || response.statusText}`);
             });
        }
        return response.json();
    })
    .then(data => {
        console.log("Received response:", data);
        if (data && data.response) { // Check if data and data.response exist
            appendMessage("Bot", data.response, "bot-message");
        } else {
             console.warn("Received data but no response field:", data);
            appendMessage("Bot", "Sorry, I received an unexpected response.", "bot-message");
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        // Display a user-friendly error, include details from the error object if available
        appendMessage("Bot", `Error: ${error.message || 'Unable to reach the chatbot.'}`, "bot-message");
    })
    .finally(() => {
        typingIndicator.style.display = "none"; // Hide indicator
        typingIndicatorContainer.style.display = "none"; // Hide container
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll down after response/error
    });
}

function appendMessage(sender, text, messageClass) {
    // 1. Create the main line container
    const messageLine = document.createElement("div");
    messageLine.classList.add("message-line", "fade-in"); // Base class + animation

    // 2. Create the avatar SPAN element
    const avatarElement = document.createElement("span");
    avatarElement.classList.add("avatar"); // Base avatar style
    avatarElement.setAttribute("aria-hidden", "true"); // Decorative

    // 3. Create the message bubble DIV
    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message", messageClass); // Base + specific bubble style
     // Safely set text content
     messageBubble.textContent = text; // Use textContent for security

    // 4. Configure based on sender and add correct classes/text
    if (messageClass === "user-message") {
        messageLine.classList.add("user-message-line"); // Right alignment class
        avatarElement.classList.add("user-avatar");    // User avatar color
        avatarElement.innerText = "U";                 // User initial
        // Structure: [Bubble] [Avatar]
        messageLine.appendChild(messageBubble);
        messageLine.appendChild(avatarElement);
    } else { // Assuming bot-message
        messageLine.classList.add("bot-message-line"); // Left alignment class
        avatarElement.classList.add("bot-avatar");     // Bot avatar color
        avatarElement.innerText = "B";                 // Bot initial
        // Structure: [Avatar] [Bubble]
        messageLine.appendChild(avatarElement);
        messageLine.appendChild(messageBubble);
    }

    // 5. Append the complete line to the chat box
    chatBox.appendChild(messageLine);

    // 6. Scroll to the bottom to show the new message
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleEnter(event) {
    // Send message on Enter key press, but not if Shift is held (for potential future multi-line input)
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevent default action (like form submission or newline)
        sendMessage();
    }
}

// Optional: Add a welcome message when the page loads
// window.addEventListener('DOMContentLoaded', () => {
//    appendMessage("Bot", "Hello! How can I assist you today?", "bot-message");
// });