export default function createGame(roomsDB, indexRoom, indexUser) {
  for(let i = 0; i < roomsDB.length; i++) {
    if (roomsDB[i].indexRoom === indexRoom) {
      if (roomsDB[i].usersID.length < 2 && roomsDB[i].usersID[0] !== indexUser) {
        roomsDB[i].usersID.push(indexUser);
        return {
          type: "create_game",
          data: JSON.stringify({
            idGame: i,
            idPlayer: roomsDB[i].usersID[0],
          }),
          id: 0,
        };
      }
      return false;
    }
  }
  return false;
}