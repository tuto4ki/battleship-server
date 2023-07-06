export default function createRoom(roomsDB, user) {
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
