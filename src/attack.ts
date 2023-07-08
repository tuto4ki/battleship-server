import { TRequestAttack, TRoom, TUser } from './type';

export function attack(data: TRequestAttack, roomsCurrent: TRoom, usersDB: TUser[]) {
  const resp = JSON.stringify({
    position: {
        x: data.x,
        y: data.y,
    },
    currentPlayer: data.indexPlayer,
    status: 'miss', //"miss"|"killed"|"shot",
  });
  const respJSON = JSON.stringify({
    type: 'attack',
    data: resp,
    id: 0,
  });

  let enemyIndex = roomsCurrent.usersID[0].index;
  if (data.indexPlayer === roomsCurrent.usersID[0].index) {
    enemyIndex = roomsCurrent.usersID[roomsCurrent?.usersID.length - 1].index;
  }

  const whoAttack = {
    type: "turn",
    data: JSON.stringify({ currentPlayer: enemyIndex}),
    id: 0,
  }
  const whoAttackJSON = JSON.stringify(whoAttack);

  for (let i = 0; i < roomsCurrent.usersID.length; i++) {
    //for (let client of clients) {
      //if (client.id === roomsCurrent.usersID[i].index) {
        const idUser = roomsCurrent.usersID[i].index;
        
        console.log("attack", respJSON);
        usersDB[idUser].ws.send(respJSON);

        console.log("turn", whoAttackJSON);
        usersDB[idUser].ws.send(whoAttackJSON);
      //}
    //}
  }
}
