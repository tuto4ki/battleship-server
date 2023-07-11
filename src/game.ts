import { CELL_COUNT } from './constants';
import { removeRoom } from './rooms';
import { TRoom, TUser, TUsersInRoom, TWins } from './type';

export default function createGame(roomsDB: Map<number, TRoom>, usersDB: Map<number, TUser>, indexRoom: number, indexUser: number) {
  const room = roomsDB.get(indexRoom);
  if (room?.indexRoom === indexRoom) {
    if (room.usersID.length < 2 && room.usersID[0].index !== indexUser) {
      room.usersID.push({
        index: indexUser,
        ships: [],
        shipsMatrix: [],
        attackMatrix: [],
      });

      for(let i = 0; i < room.usersID.length; i++) {
        const currentIdUser = room.usersID[i].index;
        const res = {
          type: "create_game",
          data: JSON.stringify({
            idGame: indexRoom,
            idPlayer: currentIdUser,
          }),
          id: 0,
        };
        const respJSON = JSON.stringify(res);
        console.log("create_game", respJSON);
        usersDB.get(currentIdUser)?.ws.send(respJSON);
      }
    }
    return false;
  }
  return false;
}

export function gameOver(player: TUsersInRoom, roomsCurrent: TRoom, usersDB: Map<number, TUser>, roomDB: Map<number, TRoom>, winsDB: TWins[]) {
  //if (isGameOver(player.attackMatrix)) {
    const winData = {
      winPlayer: player.index,
    };
    const winDataJSON = JSON.stringify({
      type: 'finish',
      data: JSON.stringify(winData),
      id: 0,
    });

    for (let i = 0; i < roomsCurrent.usersID.length; i++) {
      const idUser = roomsCurrent.usersID[i].index;

      console.log('finish', winDataJSON);
      usersDB.get(idUser)?.ws.send(winDataJSON);
    }

    const winsInBoard = winsDB.find((item) => item.idUser === player.index);
    if (winsInBoard) {
      winsInBoard.wins = winsInBoard.wins + 1;
    } else {
      winsDB.push({
        idUser: player.index,
        wins: 1,
      });
    }

    sendUpdateWins(winsDB, usersDB);
    removeRoom(roomDB, roomsCurrent.indexRoom);
    //return true;
  //}
  //return false;
}

export function isGameOver(ships: number[][]) {
  let count = 0;
  for(let i = 0; i < ships.length; i++) {
    for(let j = 0; j < ships[i].length; j++) {
      if (ships[i][j] === 2) {
        count++;
      }
    }
  }
  return count === CELL_COUNT;
}

export function sendUpdateWins(winsDB: TWins[], usersDB: Map<number, TUser>) {
  const updateWins = new Array();
  for (let i = 0; i < winsDB.length; i++) {
    const user =  usersDB.get(winsDB[i].idUser);
    updateWins.push({
      name: user?.name,
      wins: winsDB[i].wins,
    });
  }
  const updateWinsJSON = JSON.stringify({
    type: 'update_winners',
    data: JSON.stringify(updateWins),
    id: 0,
  })

  for (let user of usersDB.values()) {
    user.ws.send(updateWinsJSON)
  }
}
