import WebSocket, { WebSocketServer as WSWebSocketServer } from 'ws';
const WebSocketServer = WebSocket.Server || WSWebSocketServer;
import 'dotenv/config';

import registr from './registr.js';
import { createRoom, addShips, updateRooms } from './rooms.js';
import createGame from './game.js';
import { attack, randomAttack } from './attack.js';
import { TUser, TRoom, TRequestAddShips } from './type.js';


const wsServer = new WebSocketServer({ port: Number(process.env.PORT) });
const usersDB: Array<TUser> = new Array<TUser>();
const roomsDB: Array<TRoom> = new Array<TRoom>();

wsServer.on("connection", (ws) => {
  console.log("Connection open");
  
  //const indexUser = 0;

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

          updateRooms(roomsDB, usersDB);
          break;
        case "create_room":
          const idUserCrt = usersDB.find((user) => user.ws === ws);
          if (idUserCrt) {
            createRoom(roomsDB, idUserCrt);
            updateRooms(roomsDB, usersDB);
          }
          break;
        case "add_user_to_room":
          const data2 = JSON.parse(jsonMessage.data);
          const indexRoom = +data2.indexRoom;
          const idUserAdd = usersDB.find((user) => user.ws === ws);
          if (idUserAdd) {
            createGame(roomsDB, usersDB, indexRoom, idUserAdd.index);
          }

          updateRooms(roomsDB, usersDB);
          break;
        case "add_ships":
          const gameJSON = JSON.parse(jsonMessage.data);
          addShips(roomsDB, usersDB, gameJSON);
          break;
        case "attack":
          const attackJSON = JSON.parse(jsonMessage.data);
          attack(attackJSON, roomsDB[attackJSON.gameId], usersDB);
          break;
        case 'randomAttack':
          const attackRandomJSON = JSON.parse(jsonMessage.data);
          randomAttack(attackRandomJSON, roomsDB[attackRandomJSON.gameId], usersDB);
          break;
        case 'single_play':
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
