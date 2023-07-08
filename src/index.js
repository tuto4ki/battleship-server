import WebSocket, { WebSocketServer as WSWebSocketServer } from 'ws';
const WebSocketServer = WebSocket.Server || WSWebSocketServer;
import 'dotenv/config';

import registr from './registr.js';
import { createRoom, addShips, updateRooms } from './rooms.js';
import createGame from './game.js';
import { attack } from './attack.js';


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

          updateRooms(roomsDB, usersDB, wsServer.clients);
          break;
        case "create_room":
          createRoom(roomsDB, usersDB[ws.id]);
          updateRooms(roomsDB, usersDB, wsServer.clients);
          break;
        case "add_user_to_room":
          const data2 = JSON.parse(jsonMessage.data);
          const indexRoom = +data2.indexRoom;
          createGame(roomsDB, indexRoom, ws.id, wsServer.clients);

          updateRooms(roomsDB, usersDB, wsServer.clients);
          break;
        case "add_ships":
          const gameJSON = JSON.parse(jsonMessage.data);
          const startGame = addShips(roomsDB, gameJSON);
          if (startGame) {
            const startGameJSON = JSON.stringify(startGame);

            for(let i = 0; i < roomsDB[gameJSON.gameId].usersID.length; i++) {
              for (let user of wsServer.clients) {
                if (user.id === roomsDB[gameJSON.gameId].usersID[i].index) {

/*
                  const obj = JSON.stringify({
                    ships: roomsDB[gameJSON.gameId].usersID[i].ships,
                    currentPlayerIndex: gameJSON.indexPlayer,
                  });
                  const startGameJSON = JSON.stringify({
                    type: "start_game",
                    data: JSON.stringify(obj),
                    id: 0,
                  });
*/
                  console.log("start_game", startGameJSON);
                  user.send(startGameJSON);
                  const whoAttack = {
                    type: "turn",
                    data: JSON.stringify({ currentPlayer: gameJSON.indexPlayer}),
                    id: 0,
                  }
                  const whoAttackJSON = JSON.stringify(whoAttack);
                  console.log("turn", whoAttack)
                  user.send(whoAttackJSON);
                  break;
                }
              }
            }
          }
          break;
        case "attack":
          const attackJSON = JSON.parse(jsonMessage.data);
          attack(attackJSON, roomsDB[attackJSON.gameID, wsServer.clients]);
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
