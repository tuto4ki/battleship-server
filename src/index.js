import WebSocket, { WebSocketServer as WSWebSocketServer } from 'ws';
const WebSocketServer = WebSocket.Server || WSWebSocketServer;
import 'dotenv/config';

import registr from './registr.js';
import { createRoom, getRooms, updateRooms } from './createRoom.js';
import createGame from './createGame.js';


const wsServer = new WebSocketServer({ port: Number(process.env.PORT) });
const usersDB = [];
const roomsDB = [];

wsServer.on("connection", (ws) => {
  console.log("Connection open");

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
          createRoom(roomsDB, usersDB[ws.id]);
          updateRooms(roomsDB, usersDB, wsServer.clients);
          break;
        case "add_user_to_room":
          const data2 = JSON.parse(jsonMessage.data);
          const indexRoom = +data2.indexRoom;
          const respCreateRoom = createGame(roomsDB, indexRoom, ws.id);
          const respCreateRoomJSON = JSON.stringify(respCreateRoom);
          console.log("add_user_to_room", respCreateRoomJSON);

          for(let i = 0; i < roomsDB[indexRoom].usersID.length; i++) {
            for (let user of wsServer.clients) {
              if (user.id === roomsDB[indexRoom].usersID[i]) {
                user.send(respCreateRoomJSON);
                break;
              }
            }
          }
          updateRooms(roomsDB, usersDB, wsServer.clients);
          break;
        default:
          console.log(`${jsonMessage.type} that command don\`t exist`);
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
