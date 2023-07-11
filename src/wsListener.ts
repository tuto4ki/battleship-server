import { WebSocket } from 'ws';

import { getUserByWs } from './common';
import { PLAYER_COUNT } from './constants';
import { gameOver } from './game';
import { removeRoom, updateRooms } from './rooms';
import { TRoom, TUser, TWins } from './type';

export function disconnectUser(ws: WebSocket, usersDB: Map<number, TUser>, roomsDB: Map<number, TRoom>, winsDB: TWins[]) {
  const user = getUserByWs(usersDB, ws);
  if (user) {
    for(let room of roomsDB.values()) {
      if (room.usersID.length === PLAYER_COUNT) {
        if (room.usersID[0].index === user.index) {
          gameOver(room.usersID[1], room, usersDB, roomsDB, winsDB);
        } else if (room.usersID[1].index === user.index) {
          gameOver(room.usersID[0], room, usersDB, roomsDB, winsDB);
        }
      } else if (room.usersID.length === 1 && room.usersID[0].index === user.index) {
        removeRoom(roomsDB, room.indexRoom);
      }
    }
    updateRooms(roomsDB, usersDB);
  }
}