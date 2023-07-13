import WebSocket from 'ws';

import { getUserByWs } from './common';
import { createGame } from './game';
import { randomLocationShips } from './randomShips';
import { addShips, createRoom, updateRooms } from './rooms';
import { TRoom, TUser } from './type';
import { BOT_INDEX } from './constants';

export function startSingleMode(usersDB: Map<number, TUser>, roomsDB: Map<number, TRoom>, ws: WebSocket) {
  const singleUser = getUserByWs(usersDB, ws);
  if (singleUser) {
    const indexRoom = createRoom(roomsDB, singleUser);
  
    if (indexRoom !== undefined) {
      createGame(roomsDB, usersDB, indexRoom, BOT_INDEX);
    
      updateRooms(roomsDB, usersDB);

      const { ships, matrix } = randomLocationShips();
      const botShips = {
        indexPlayer: BOT_INDEX,
        gameId: indexRoom,
        ships: ships,
      };

      const itemRoom = roomsDB.get(indexRoom);
      if(itemRoom) {
        addShips(itemRoom, usersDB, botShips);
      }
    }
    
  }
}
