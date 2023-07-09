import { FIELD_SIZE } from './constants';
import { gameOver } from './game';
import { TRequestAttack, TRoom, TUser, EShotType, TPosition, TRequestRandomAttack, TWins } from './type';

export function attack(data: TRequestAttack, roomsCurrent: TRoom, usersDB: TUser[], winsDB: TWins[]) {
  console.log(data, roomsCurrent, usersDB);
  if (roomsCurrent.currentPlayer !== data.indexPlayer) {
    return;
  }
  const enemy = roomsCurrent.usersID.find((user) => user.index !== data.indexPlayer);
  const player = roomsCurrent.usersID.find((user) => user.index === data.indexPlayer);
  if (enemy && player) {
    const statusAttack = getStatusAttack({ x: data.x, y: data.y }, player?.attackMatrix, enemy?.shipsMatrix);

    const attack = JSON.stringify({
      position: {
          x: data.x,
          y: data.y,
      },
      currentPlayer: data.indexPlayer,
      status: statusAttack,
    });
    const attackJSON = JSON.stringify({
      type: 'attack',
      data: attack,
      id: 0,
    });

    let turnIndexAttack = statusAttack === EShotType.miss ? enemy.index : data.indexPlayer;
    roomsCurrent.currentPlayer = turnIndexAttack;
    const whoAttack = {
      type: "turn",
      data: JSON.stringify({ currentPlayer: turnIndexAttack}),
      id: 0,
    }
    const whoAttackJSON = JSON.stringify(whoAttack);

    for (let i = 0; i < roomsCurrent.usersID.length; i++) {
      const idUser = roomsCurrent.usersID[i].index;
      
      console.log("attack", attackJSON);
      usersDB[idUser].ws.send(attackJSON);

      console.log("turn", whoAttackJSON);
      usersDB[idUser].ws.send(whoAttackJSON);
    }

    gameOver(player, roomsCurrent, usersDB, winsDB);
  }
}

export function randomAttack(data: TRequestRandomAttack, roomsCurrent: TRoom, usersDB: TUser[], winsDB: TWins[]) {
  if (roomsCurrent.currentPlayer !== data.indexPlayer) {
    return;
  }
  const player = roomsCurrent.usersID.find((user) => user.index === data.indexPlayer);
  if (player) {
    const randomShotMatrix = lineMatrix(player.attackMatrix);
    console.log(randomShotMatrix);
    const randomCell = Math.floor(Math.random() * randomShotMatrix.length);
    attack({...data, x: randomShotMatrix[randomCell][0], y: randomShotMatrix[randomCell][1] }, roomsCurrent, usersDB, winsDB);
  }
}

/**
 * shot - 1
 * killed - 2
 * miss - 3
 */
function getStatusAttack(posPlayer: TPosition, attackMatrix: Array<Array<number>>, enemyShips: Array<Array<number>>): EShotType {
  if (enemyShips[posPlayer.x][posPlayer.y]) {
    enemyShips[posPlayer.x][posPlayer.y] = 0;
    if (
      (posPlayer.x - 1 > 0 && enemyShips[posPlayer.x - 1][posPlayer.y]) ||
      (posPlayer.x + 1 < FIELD_SIZE && enemyShips[posPlayer.x + 1][posPlayer.y]) ||
      (posPlayer.y - 1 > 0 && enemyShips[posPlayer.x][posPlayer.y - 1]) ||
      (posPlayer.y + 1 < FIELD_SIZE && enemyShips[posPlayer.x][posPlayer.y + 1])
    ) {
      attackMatrix[posPlayer.x][posPlayer.y] = 1;
      return EShotType.shot;
    }
    attackMatrix[posPlayer.x][posPlayer.y] = 2;
    return EShotType.killed;
  }
  attackMatrix[posPlayer.x][posPlayer.y] = 3;
  return EShotType.miss;
}

function lineMatrix(attackMatrix: Array<Array<number>>): Array<Array<number>> {
  const arrLine = new Array();
  for (let i = 0; i < attackMatrix.length; i++) {
    for (let j = 0; j < attackMatrix.length; j++) {
      if (attackMatrix[i][j] === 0) {
        arrLine.push([i, j]);
      }
    }
  }
  return arrLine;
}
