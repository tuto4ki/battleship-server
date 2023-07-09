import { TRequestAddShips, TRoom, TUser, TResponseRoom, TCell } from './type';
import { FIELD_SIZE } from './constants';

export function createRoom(roomsDB: TRoom[], user: TUser) {
  try {
    const idRoom = roomsDB.length;
    roomsDB.push({
      indexRoom: idRoom,
      usersID: [{
        index: user.index,
        ships: [],
        shipsMatrix: [],
        attackMatrix: [],
      }],
      currentPlayer: user.index,
    });
    return {
      type: "update_room",
      data: JSON.stringify([{
        roomId: idRoom,
        roomUsers: [{
          name: user.name,
          index: user.index,
        }],
      }]),
      id: 0,
    };
  } catch (err) {
    console.error((err as Error).message);
  }
}

function getRooms(roomsDB: TRoom[], usersDB: TUser[]) {
  const rooms = roomsDB.reduce((arr, item) => {
    if (item.usersID.length < 2 ) {
      arr.push({
        roomId: item.indexRoom,
        roomUsers: [{
          name: usersDB[item.usersID[0].index].name,
          index: usersDB[item.usersID[0].index].index,
        }],
      });
    }
    return arr;
  }, new Array<TResponseRoom>());
  
  return {
    type: "update_room",
    data: JSON.stringify(rooms),
    id: 0,
  };
}


export function updateRooms(roomsDB: TRoom[], usersDB: TUser[]) {
  const rooms = getRooms(roomsDB, usersDB);
  const roomsJSON = JSON.stringify(rooms);
  console.log("update_room", roomsJSON);
  usersDB.forEach((user) => {
    user.ws.send(roomsJSON);
  });
}

export function addShips(roomsDB: TRoom[], usersDB: TUser[], data: TRequestAddShips) {
  let countUserReady = 0;
  const idUser = data.indexPlayer;
  for (let i = 0; i < roomsDB[data.gameId].usersID.length; i++) {
    if (roomsDB[data.gameId].usersID[i].index === idUser) {
      roomsDB[data.gameId].usersID[i].ships = data.ships;
      roomsDB[data.gameId].usersID[i].shipsMatrix = createShipsMatrix(roomsDB[data.gameId].usersID[i].ships);
      roomsDB[data.gameId].usersID[i].attackMatrix = createFillMatrix(FIELD_SIZE, 0);
    }

    if (roomsDB[data.gameId].usersID[i].ships.length > 0) {
      countUserReady++;
    }
  }

  if (roomsDB[data.gameId].usersID.length === countUserReady) {
    roomsDB[data.gameId].currentPlayer = data.indexPlayer;
    for(let i = 0; i < roomsDB[data.gameId].usersID.length; i++) {
      const user = roomsDB[data.gameId].usersID[i];
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
      usersDB[user.index]?.ws?.send(startGameJSON);
      const whoAttack = {
        type: "turn",
        data: JSON.stringify({ currentPlayer: roomsDB[data.gameId].currentPlayer}),
        id: 0,
      }

      const whoAttackJSON = JSON.stringify(whoAttack);
      console.log("turn", whoAttack)
      usersDB[user.index]?.ws?.send(whoAttackJSON);

    }
  }
  return false;
}

function createShipsMatrix(ships: TCell[]) {
  const matrix: Array<Array<number>> = createFillMatrix(FIELD_SIZE, 0);
  for (let i = 0; i < ships.length; i++) {
    const direction_x = ships[i].direction ? 0 : 1;
    const direction_y = ships[i].direction ? 1 : 0;
    const start_x = ships[i].position.x;
    const start_y = ships[i].position.y;
    for (let j = 0; j < ships[i].length; j++) {
      matrix[start_x + direction_x * j][start_y + direction_y * j] = 1;
    }
  }
  return matrix;
}

function createFillMatrix(size: number, number: number): Array<Array<number>> {
  const arr = new Array<Array<number>>(size);
  for (let i = 0 ; i < size; i++) {
    arr[i] = new Array<number>(size);
    for (let j = 0; j < size; j++){
      arr[i][j] = number;
    }
  }
  return arr;
}
