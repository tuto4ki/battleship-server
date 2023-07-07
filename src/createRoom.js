export function createRoom(roomsDB, user) {
  try {
    const idRoom = roomsDB.length;
    roomsDB.push({
      indexRoom: idRoom,
      usersID: [user.index],
      ships: []
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
    console.error(err.message);
  }
}

export function getRooms(roomsDB, usersDB) {
  const rooms = roomsDB.reduce((arr, item) => {
    if (item.usersID.length < 2 ) {
      arr.push({
        roomId: item.indexRoom,
        roomUsers: [{
          name: usersDB[item.usersID[0]].name,
          index: usersDB[item.usersID[0]].index,
        }],
      });
    }
    return arr;
  }, []);
  
  return {
    type: "update_room",
    data: JSON.stringify(rooms),
    id: 0,
  };
}


export function updateRooms(roomsDB, usersDB, clients) {
  const rooms = getRooms(roomsDB, usersDB);
  const roomsJSON = JSON.stringify(rooms);
  console.log("update_room", roomsJSON);
  for (let user of clients) {
    user.send(roomsJSON);
  }
}