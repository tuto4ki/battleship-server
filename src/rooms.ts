import { TRequestAddShips, TRoom, TUser, TResponseRoom } from './type';

export function createRoom(roomsDB: TRoom[], user: TUser) {
  try {
    const idRoom = roomsDB.length;
    roomsDB.push({
      indexRoom: idRoom,
      usersID: [{
        index: user.index,
        ships: [],
      }],
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
  /*
  for (let user of clients) {
    user.send(roomsJSON);
  }*/
}

export function addShips(roomsDB: TRoom[], data: TRequestAddShips) {
  let countUserReady = 0;
  const idUser = data.indexPlayer;
  for (let i = 0; i < roomsDB[data.gameId].usersID.length; i++) {
    if (roomsDB[data.gameId].usersID[i].index === idUser) {
      roomsDB[data.gameId].usersID[i].ships = data.ships;
    }

    if (roomsDB[data.gameId].usersID[i].ships.length > 0) {
      countUserReady++;
    }
  }

  if (roomsDB[data.gameId].usersID.length === countUserReady) {
    const obj = {
      ships: roomsDB[data.gameId].usersID[idUser].ships,
      currentPlayerIndex: idUser,
    };
    return {
      type: "start_game",
      data: JSON.stringify(obj),
      id: 0,
    }
  }
  return false;
}
