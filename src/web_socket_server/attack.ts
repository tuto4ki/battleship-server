import { getEmptyCells, getKillCells, getKillOneCell } from './cells';
import { gameOver, isGameOver } from './game';
import { TRequestAttack, TRoom, TUser, EShotType, TPosition, TRequestRandomAttack, TWins, TCell, TUsersInRoom } from './type';

export function attack(
  data: TRequestAttack,
  roomsCurrent: TRoom,
  usersDB: Map<number, TUser>,
  winsDB: TWins[],
  roomsDB: Map<number, TRoom>
) {
  if (roomsCurrent.currentPlayer !== data.indexPlayer) {
    return;
  }

  const player = roomsCurrent.usersID.find((user) => user.index === data.indexPlayer);
  if (player?.attackMatrix[data.x][data.y]) {
    sendMessageAttack(player, [{ x: data.x, y: data.y }], roomsCurrent, usersDB, getEnumStatusAttack(player?.attackMatrix[data.x][data.y]));
    return;
  }

  const enemy = roomsCurrent.usersID.find((user) => user.index !== data.indexPlayer);
  if (enemy && player) {
    const statusAttack = getStatusAttack({ x: data.x, y: data.y }, enemy.shipsMatrix, enemy.ships);
  
    let turnIndexAttack = statusAttack === EShotType.miss ? enemy.index : data.indexPlayer;
    roomsCurrent.currentPlayer = turnIndexAttack;

    if (statusAttack === EShotType.killed) {
      const cellKill = getKillOneCell(enemy.ships, {x: data.x, y: data.y});
      if (cellKill) {
        const emptyCells = getEmptyCells(cellKill);
        sendMessageAttack(player, emptyCells, roomsCurrent, usersDB, EShotType.miss);
        const killCell = getKillCells(cellKill);
        sendMessageAttack(player, killCell, roomsCurrent, usersDB, EShotType.killed);
      }

      const isEndGame = isGameOver(player.attackMatrix);
      if (isEndGame) {
        gameOver(player, roomsCurrent, usersDB, roomsDB, winsDB);
      }

    } else {
      sendMessageAttack(player, [{ x: data.x, y: data.y }], roomsCurrent, usersDB, statusAttack);
    }

    if (
      (roomsCurrent.currentPlayer === enemy.index && !usersDB.get(enemy.index)?.ws) ||
      (roomsCurrent.currentPlayer === player.index && !usersDB.get(player.index)?.ws)
    ) {
      randomAttack(
        { gameId: roomsCurrent.indexRoom, indexPlayer: roomsCurrent.currentPlayer },
        roomsCurrent,
        usersDB,
        winsDB,
        roomsDB,
      );
    }
  }
}

function sendMessageAttack(
  player: TUsersInRoom,
  killCell: TPosition[],
  roomsCurrent: TRoom,
  usersDB: Map<number, TUser>,
  status: EShotType
) {
  const whoAttack = {
    type: "turn",
    data: JSON.stringify({ currentPlayer: roomsCurrent.currentPlayer}),
    id: 0,
  }
  const whoAttackJSON = JSON.stringify(whoAttack);

  for (let k = 0; k < killCell.length; k++) {
    player.attackMatrix[killCell[k].x][killCell[k].y] = getNumberStatusAttack(status);
    const attack = JSON.stringify({
      position: {
          x: killCell[k].x,
          y: killCell[k].y,
      },
      currentPlayer: player.index,
      status: status,
    });
    const attackJSON = JSON.stringify({
      type: 'attack',
      data: attack,
      id: 0,
    });

    for (let i = 0; i < roomsCurrent.usersID.length; i++) {
      const idUser = roomsCurrent.usersID[i].index;
  
      console.log("attack", attackJSON);
      usersDB.get(idUser)?.ws?.send(attackJSON);

      console.log("turn", whoAttackJSON);
      usersDB.get(idUser)?.ws?.send(whoAttackJSON);
    }
  }
}

export function randomAttack(data: TRequestRandomAttack, roomsCurrent: TRoom, usersDB: Map<number, TUser>, winsDB: TWins[], roomDB: Map<number, TRoom>) {
  if (roomsCurrent.currentPlayer !== data.indexPlayer) {
    return;
  }
  const player = roomsCurrent.usersID.find((user) => user.index === data.indexPlayer);
  if (player) {
    const randomShotMatrix = lineMatrix(player.attackMatrix);
    const randomCell = Math.floor(Math.random() * randomShotMatrix.length);
    attack({...data, x: randomShotMatrix[randomCell][0], y: randomShotMatrix[randomCell][1] }, roomsCurrent, usersDB, winsDB, roomDB);
  }
}

function getNumberStatusAttack(status: EShotType) {
  switch(status) {
    case EShotType.killed:
      return 2;
    case EShotType.shot:
      return 1;
    default:
      return 3;
  }
}

function getEnumStatusAttack(status: number) {
  switch(status) {
    case 2:
      return EShotType.killed;
    case 1:
      return EShotType.shot;
    default:
      return EShotType.miss;
  }
}

function getStatusAttack(posPlayer: TPosition, enemyShips: Array<Array<number>>, enemyMatrix: TCell[]): EShotType {
  if (enemyShips[posPlayer.x][posPlayer.y]) {
    enemyShips[posPlayer.x][posPlayer.y] = 0;
    const cellKill = getKillOneCell(enemyMatrix, posPlayer);
    if (cellKill) {
      const killCell = getKillCells(cellKill);
      let isShot = false;
      for (let i = 0; i < killCell.length; i++) {
        if (enemyShips[killCell[i].x][killCell[i].y]) {
          isShot = true;
        }
      }
      if (isShot) {
        return EShotType.shot;
      }
      return EShotType.killed;
    }
  }
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
