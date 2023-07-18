import WebSocket, { WebSocketServer as WSWebSocketServer } from 'ws';
const WebSocketServer = WebSocket.Server || WSWebSocketServer;
import 'dotenv/config';

import { register } from './registr.js';
import { createRoom, addShips, updateRooms } from './rooms.js';
import { createGame, sendUpdateWins } from './game.js';
import { attack, randomAttack } from './attack.js';
import { TUser, TRoom, TWins } from './type.js';
import { getUserByWs } from './common.js';
import { disconnectUser } from './wsListener.js';
import { startSingleMode } from './singlePlay.js';
import { BOT_INDEX } from './constants.js';

const wsServer = new WebSocketServer({ port: Number(process.env.PORT) });
const usersDB: Map<number, TUser> = new Map<number, TUser>();
usersDB.set(BOT_INDEX, {
  name: 'bot',
  password: 'bot',
  index: BOT_INDEX,
});
const roomsDB: Map<number, TRoom> = new Map<number, TRoom>();
const winsDB: TWins[] = new Array<TWins>();

wsServer.on('connection', (ws) => {
  console.log(`Connection open port: ${wsServer.options.port};`);

  ws.on('message', (message) => {
    try {
      const jsonMessage = JSON.parse(message.toString());

      switch (jsonMessage.type) {
        case 'reg':
          const data = JSON.parse(jsonMessage.data);
          register(data, usersDB, ws);
          updateRooms(roomsDB, usersDB);
          sendUpdateWins(winsDB, usersDB);
          break;
        case 'create_room':
          const idUserCrt = getUserByWs(usersDB, ws);
          if (idUserCrt) {
            createRoom(roomsDB, idUserCrt);
            updateRooms(roomsDB, usersDB);
          }
          break;
        case 'add_user_to_room':
          const indexRoom = JSON.parse(jsonMessage.data).indexRoom;
          const idUserAdd = getUserByWs(usersDB, ws);
          if (idUserAdd) {
            createGame(roomsDB, usersDB, indexRoom, idUserAdd.index);
          }

          updateRooms(roomsDB, usersDB);
          break;
        case 'add_ships':
          const gameJSON = JSON.parse(jsonMessage.data);
          const currentRoomAddShips = roomsDB.get(gameJSON.gameId);
          if (currentRoomAddShips) {
            addShips(currentRoomAddShips, usersDB, gameJSON);
          }
          break;
        case 'attack':
          const attackJSON = JSON.parse(jsonMessage.data);
          const currentRoom = roomsDB.get(attackJSON.gameId);
          if (currentRoom) {
            attack(attackJSON, currentRoom, usersDB, winsDB, roomsDB);
          }
          break;
        case 'randomAttack':
          const attackRandomJSON = JSON.parse(jsonMessage.data);
          const room = roomsDB.get(attackRandomJSON.gameId);
          if (room) {
            randomAttack(attackRandomJSON, room, usersDB, winsDB, roomsDB);
          }
          break;
        case 'single_play':
          startSingleMode(usersDB, roomsDB, ws);
          break;
        default:
          console.log(`${jsonMessage.type} that command don\`t exist`);
      }
    } catch (error) {
      console.error(error);
    }
  });

  ws.on('close', () => {
    disconnectUser(ws, usersDB, roomsDB, winsDB);

    console.log('Connection close');
  });
});

wsServer.on('close', () => {
  console.log('Close connection!');
});
