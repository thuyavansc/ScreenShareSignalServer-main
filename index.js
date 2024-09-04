// const http = require("http")
// const socket = require("websocket").server
// const server = http.createServer(() => {
// })

// server.listen(3000, () => {

// })

// const users = []

// const Types = {
//     SignIn: "SignIn",
//     StartStreaming: "StartStreaming",
//     UserFoundSuccessfully: "UserFoundSuccessfully",
//     Offer: "Offer",
//     Answer: "Answer",
//     IceCandidates: "IceCandidates",
//     EndCall: "EndCall",
// }

// const webSocket = new socket({httpServer: server})

// webSocket.on('request', (req) => {
//     const connection = req.accept();

//     connection.on('message', (message) => {
//         try {
//             const data = JSON.parse(message.utf8Data);
//             const currentUser = findUser(data.username)
//             const userToReceive = findUser(data.target)
//             console.log(data)

//             switch (data.type) {
//                 case Types.SignIn:
//                     if (currentUser) {
//                         return
//                     }

//                     users.push({username: data.username, conn: connection, password: data.data})
//                     break
//                 case Types.StartStreaming :
//                     if (userToReceive) {
//                             sendToConnection(userToReceive.conn, {
//                                 type: Types.StartStreaming,
//                                 username: currentUser.username,
//                                 target: userToReceive.username
//                             })
//                     }
//                     break
//                 case Types.Offer :
//                     if (userToReceive) {
//                         sendToConnection(userToReceive.conn, {
//                             type: Types.Offer, username: data.username, data: data.data
//                         })
//                     }
//                     break
//                 case Types.Answer :
//                     if (userToReceive) {
//                         sendToConnection(userToReceive.conn, {
//                             type: Types.Answer, username: data.username, data: data.data
//                         })
//                     }
//                     break
//                 case Types.IceCandidates:
//                     if (userToReceive) {
//                         sendToConnection(userToReceive.conn, {
//                             type: Types.IceCandidates, username: data.username, data: data.data
//                         })
//                     }
//                     break
//                 case Types.EndCall:
//                     if (userToReceive) {
//                         sendToConnection(userToReceive.conn, {
//                             type: Types.EndCall, username: data.username
//                         })
//                     }
//                     break
//             }
//         } catch (e) {
//             console.log(e.message)
//         }

//     });
//     connection.on('close', () => {
//         users.forEach(user => {
//             if (user.conn === connection) {
//                 users.splice(users.indexOf(user), 1)
//             }
//         })
//     })
// });

// const sendToConnection = (connection, message) => {
//     connection.send(JSON.stringify(message))
// }

// const findUser = username => {
//     for (let i = 0; i < users.length; i++) {
//         if (users[i].username === username) return users[i]
//     }
// }

const http = require("http");
const WebSocketServer = require("websocket").server;

const server = http.createServer(() => {});

// Start the server and log the URL and port
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server started and running at ws://localhost:${PORT}`);
});

const users = [];

const Types = {
  SignIn: "SignIn",
  StartStreaming: "StartStreaming",
  UserFoundSuccessfully: "UserFoundSuccessfully",
  Offer: "Offer",
  Answer: "Answer",
  IceCandidates: "IceCandidates",
  EndCall: "EndCall",
};

const webSocket = new WebSocketServer({ httpServer: server });

// Handle connection requests
webSocket.on("request", (req) => {
  const connection = req.accept();
  console.log(`New connection accepted from ${req.origin}`);

  // Handle incoming messages
  connection.on("message", (message) => {
    try {
      const data = JSON.parse(message.utf8Data);
      const currentUser = findUser(data.username);
      const userToReceive = findUser(data.target);
      console.log(`Received message: ${JSON.stringify(data)}`);

      switch (data.type) {
        case Types.SignIn:
          if (currentUser) {
            console.log(`User ${data.username} is already signed in.`);
            return;
          }

          users.push({
            username: data.username,
            conn: connection,
            password: data.data,
          });
          console.log(`User ${data.username} signed in.`);
          break;

        case Types.StartStreaming:
          if (userToReceive) {
            sendToConnection(userToReceive.conn, {
              type: Types.StartStreaming,
              username: currentUser.username,
              target: userToReceive.username,
            });
            console.log(
              `StartStreaming message sent from ${currentUser.username} to ${userToReceive.username}`
            );
          }
          break;

        case Types.Offer:
          if (userToReceive) {
            sendToConnection(userToReceive.conn, {
              type: Types.Offer,
              username: data.username,
              data: data.data,
            });
            console.log(
              `Offer message sent from ${data.username} to ${userToReceive.username}`
            );
          }
          break;

        case Types.Answer:
          if (userToReceive) {
            sendToConnection(userToReceive.conn, {
              type: Types.Answer,
              username: data.username,
              data: data.data,
            });
            console.log(
              `Answer message sent from ${data.username} to ${userToReceive.username}`
            );
          }
          break;

        case Types.IceCandidates:
          if (userToReceive) {
            sendToConnection(userToReceive.conn, {
              type: Types.IceCandidates,
              username: data.username,
              data: data.data,
            });
            console.log(
              `IceCandidates message sent from ${data.username} to ${userToReceive.username}`
            );
          }
          break;

        case Types.EndCall:
          if (userToReceive) {
            sendToConnection(userToReceive.conn, {
              type: Types.EndCall,
              username: data.username,
            });
            console.log(
              `EndCall message sent from ${data.username} to ${userToReceive.username}`
            );
          }
          break;

        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (e) {
      console.log(`Error processing message: ${e.message}`);
    }
  });

  // Handle connection close
  connection.on("close", (reasonCode, description) => {
    users.forEach((user) => {
      if (user.conn === connection) {
        users.splice(users.indexOf(user), 1);
        console.log(`User ${user.username} disconnected.`);
      }
    });
  });
});

const sendToConnection = (connection, message) => {
  connection.send(JSON.stringify(message));
  console.log(`Message sent: ${JSON.stringify(message)}`);
};

const findUser = (username) => {
  return users.find((user) => user.username === username);
};
