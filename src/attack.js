export function attack(data, roomsCurrent, clients) {
  const data = JSON.stringify({
    position: {
        x: data.x,
        y: data.y,
    },
    currentPlayer: data.indexPlayer,
    status: "miss"|"killed"|"shot",
  });
  const dataJSON = JSON.stringify({
    type: "attack",
    data: data,
    id: 0,
  });

  const enemyIndex = roomsCurrent.usersID[0].index;
  if (data.indexPlayer === roomsCurrent.usersID[0].index) {
    enemyIndex = roomsCurrent.usersID[1].index;
  }

  const whoAttack = {
    type: "turn",
    data: JSON.stringify({ currentPlayer: enemyIndex}),
    id: 0,
  }
  const whoAttackJSON = JSON.stringify(whoAttack);

  for (let i = 0; i < roomsCurrent.usersID.length; i++) {
    for (let client of clients) {
      if (client.id === roomsCurrent.usersID[i].index) {
        console.log("attack", dataJSON);
        client.send(dataJSON);

        console.log("turn", whoAttackJSON);
        client.send(whoAttackJSON);
      }
    }
  }
}
