import { TRequestAddShips, TRoom, TUser, TResponseRoom, TCell } from './type';
import { FIELD_SIZE, PLAYER_COUNT } from './constants';
import { createFillMatrix, lastIndex } from './common';

export function createRoom(roomsDB: Map<number, TRoom>, user: TUser) {
  try {
    const idRoom = lastIndex(roomsDB) + 1;
    roomsDB.set(idRoom, {
      indexRoom: idRoom,
      usersID: [{
        index: user.index,
        ships: [],
        shipsMatrix: [],
        attackMatrix: [],
      }],
      currentPlayer: user.index,
    });
    return idRoom;
  } catch (err) {
    console.error((err as Error).message);
  }
}

function getRooms(roomsDB: Map<number, TRoom>, usersDB: Map<number, TUser>) {
  const rooms = [...roomsDB].reduce((arr, item) => {
    if (item[1].usersID.length < PLAYER_COUNT ) {
      const user = usersDB.get(item[1].usersID[0].index);
      
      if (user) {
        const isUserInGame = userInGame(roomsDB, user);
        if (isUserInGame)
          arr.push({
            roomId: item[1].indexRoom,
            roomUsers: [{
              name: user.name,
              index: user.index,
            }],
          });
      }
    }
    return arr;
  }, new Array<TResponseRoom>());
  
  return {
    type: "update_room",
    data: JSON.stringify(rooms),
    id: 0,
  };
}

function userInGame (roomsDB: Map<number, TRoom>, user: TUser): boolean {
  for(let room of roomsDB.values()) {
    if (room.usersID.length === PLAYER_COUNT) {
      const userPlay = room.usersID.find((userInGame) => userInGame.index === user.index);
      
      if (userPlay) {
        return false;
      }
    }
  }
  return true;
}

export function updateRooms(roomsDB: Map<number, TRoom>, usersDB: Map<number, TUser>) {
  const rooms = getRooms(roomsDB, usersDB);
  const roomsJSON = JSON.stringify(rooms);
  console.log("update_room", roomsJSON);
  usersDB.forEach((user) => {
    user.ws?.send(roomsJSON);
  });
}

export function addShips(currentRoom: TRoom, usersDB: Map<number, TUser>, data: TRequestAddShips) {
  let countUserReady = 0;
  const idUser = data.indexPlayer;
  for (let i = 0; i < currentRoom.usersID.length; i++) {
    if (currentRoom.usersID[i].index === idUser) {
      currentRoom.usersID[i].ships = data.ships;
      currentRoom.usersID[i].shipsMatrix = createShipsMatrix(currentRoom.usersID[i].ships);
      currentRoom.usersID[i].attackMatrix = createFillMatrix(FIELD_SIZE, 0);
    }

    if (currentRoom.usersID[i].ships.length > 0) {
      countUserReady++;
    }
  }

  if (currentRoom.usersID.length === countUserReady) {
    currentRoom.currentPlayer = data.indexPlayer;
    for(let i = 0; i < currentRoom.usersID.length; i++) {
      const user = currentRoom.usersID[i];
      const startGame = {
        type: "start_game",
        data: JSON.stringify({
          ships: user.ships,
          currentPlayerIndex: user.index,
        }),
        id: 0,
      }

      const startGameJSON = JSON.stringify(startGame);
      console.log("start_game", startGameJSON);
      usersDB.get(user.index)?.ws?.send(startGameJSON);
      const whoAttack = {
        type: "turn",
        data: JSON.stringify({ currentPlayer: currentRoom.currentPlayer}),
        id: 0,
      }

      const whoAttackJSON = JSON.stringify(whoAttack);
      console.log("turn", whoAttack)
      usersDB.get(user.index)?.ws?.send(whoAttackJSON);

    }
  }
  return false;
}

function createShipsMatrix(ships: TCell[]) {
  const matrix: Array<Array<number>> = createFillMatrix(FIELD_SIZE, 0);
  for (let i = 0; i < ships.length; i++) {
    const directionX = ships[i].direction ? 0 : 1;
    const directionY = ships[i].direction ? 1 : 0;
    const start_x = ships[i].position.x;
    const start_y = ships[i].position.y;
    for (let j = 0; j < ships[i].length; j++) {
      matrix[start_x + directionX * j][start_y + directionY * j] = 1;
    }
  }
  return matrix;
}

export function removeRoom(roomDB: Map<number, TRoom>, index: number) {
  roomDB.delete(index);
}
