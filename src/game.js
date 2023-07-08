export default function createGame(roomsDB, indexRoom, indexUser, clients) {
  const room = roomsDB[indexRoom];
  if (room.indexRoom === indexRoom) {
    if (room.usersID.length < 2 && room.usersID[0].index !== indexUser) {
      room.usersID.push({
        index: indexUser,
        ships: [],
      });

      for(let i = 0; i < room.usersID.length; i++) {
        for (let user of clients) {
          if (user.id === room.usersID[i].index) {
            const res = {
              type: "create_game",
              data: JSON.stringify({
                idGame: indexRoom,
                idPlayer: user.id,
              }),
              id: 0,
            };
            const respJSON = JSON.stringify(res);
            console.log("create_game", respJSON);
            user.send(respJSON);
            break;
          }
        }
      }
    }
    return false;
  }
  return false;
}
