import { TRoom, TUser } from './type';

export default function createGame(roomsDB: TRoom[], usersDB: TUser[], indexRoom: number, indexUser: number) {
  const room = roomsDB[indexRoom];
  if (room.indexRoom === indexRoom) {
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
        usersDB[currentIdUser].ws.send(respJSON);
      }
    }
    return false;
  }
  return false;
}
