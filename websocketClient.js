const WebSocket = require("ws");

// Replace with your WebSocket server URL
// const ws = new WebSocket("ws://localhost:3000");
const ws = new WebSocket("ws://192.168.8.105:3000");

// Event listener for when the connection is open
ws.on("open", () => {
  console.log("Connected to the WebSocket server");

  // Send a test SignIn message to the server
  const message = {
    type: "SignIn",
    username: "testUser",
    data: "testPassword",
  };
  ws.send(JSON.stringify(message));
  console.log("Message sent: ", JSON.stringify(message));
});

// Event listener for receiving messages from the server
ws.on("message", (message) => {
  console.log("Received:", message);
});

// Event listener for errors
ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

// Event listener for when the connection is closed
ws.on("close", () => {
  console.log("Disconnected from the WebSocket server");
});
