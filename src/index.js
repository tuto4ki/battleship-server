import WebSocket, { WebSocketServer as WSWebSocketServer } from 'ws';
const WebSocketServer = WebSocket.Server || WSWebSocketServer;
import 'dotenv/config';

import registr from './registr.js';
import createRoom from './createRoom.js';


const wsServer = new WebSocketServer({ port: Number(process.env.PORT) });
const usersDB = [];
const roomsDB = [];

wsServer.on("connection", (ws) => {
  console.log("Connection open", ws.url);

  ws.on("message", (message) => {
    try {
      const jsonMessage = JSON.parse(message.toString());

      switch (jsonMessage.type) {
        case "reg":
          const data = JSON.parse(jsonMessage.data);
          const resp = registr(data, usersDB, ws);
          const respJSON = JSON.stringify(resp);
          console.log("reg", respJSON);
          ws.send(respJSON);
          break;
        case "create_room":
          const respRoom = createRoom(roomsDB, usersDB[ws.id]);
          const respRoomJSON = JSON.stringify(respRoom);
          console.log("create_room", respRoomJSON);
          ws.send(respRoomJSON);
          break;
        default:
          console.log("That command don`t exist");
      }
    } catch (error) {
      console.error(error);
    }
  });

  ws.on("close", () => {
    console.log("Connection close");
  });
});

wsServer.on("close", () => {
  console.log("Close connection!");
});
