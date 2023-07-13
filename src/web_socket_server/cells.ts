import { TPosition, TCell } from './type';
import { FIELD_SIZE } from './constants';

export function getEmptyCells(cellKill: TCell): Array<TPosition> {
  const emptyCells = new Array<TPosition>();
 
  const directionX = cellKill.direction ? 0 : 1;
  const directionY = cellKill.direction ? 1 : 0;

  const maxValueX = directionX * cellKill.length + (directionX ? 1 : 2);
  const bottomLine = cellKill.position.y + 1 + directionY * (cellKill.length - 1);
  if (bottomLine < FIELD_SIZE) {
    for (let j = -1; j < maxValueX; j++) {
      if (cellKill.position.x + j >= 0 && cellKill.position.x + j < FIELD_SIZE) {
        emptyCells.push({
          x: cellKill.position.x + j,
          y: bottomLine,
        });
      }
    }
  }

  const topLine = cellKill.position.y - 1;
  if (topLine >= 0) {
    for (let j = -1; j < maxValueX; j++) {
      if (cellKill.position.x + j >= 0 && cellKill.position.x + j < FIELD_SIZE) {
        emptyCells.push({
          x: cellKill.position.x + j,
          y: topLine,
        });
      }
    }
  }

  const maxValueY = directionY * cellKill.length + (directionY ? 1 : 2);
  const rightLine = cellKill.position.x + 1 + directionX * (cellKill.length - 1);
  if (rightLine < FIELD_SIZE) {
    for (let j = 0; j < maxValueY; j++) {
      if (cellKill.position.y + j >= 0 && cellKill.position.y + j < FIELD_SIZE) {
        emptyCells.push({
          x: rightLine,
          y: cellKill.position.y + j,
        });
      }
    }
  }

  const leftLine = cellKill.position.x - 1;
  if (leftLine >= 0) {
    for (let j = 0; j < maxValueY; j++) {
      if (cellKill.position.y + j >= 0 && cellKill.position.y + j < FIELD_SIZE) {
        emptyCells.push({
          x: leftLine,
          y: cellKill.position.y + j,
        });
      }
    }
  }

  return emptyCells;
}

export function getKillOneCell(ships: TCell[], {x, y}: TPosition): TCell | undefined {
  for (let i = 0; i < ships.length; i++) {
    const directionX = ships[i].direction ? 0 : 1;
    const directionY = ships[i].direction ? 1 : 0;
    if (
      ships[i].position.x <= x &&
      x <= ships[i].position.x + directionX * ships[i].length &&
      ships[i].position.y <= y &&
      y <= ships[i].position.y + directionY * ships[i].length
    ) {
      return ships[i];
    }
  }
  return;
}

export function getKillCells (cellKill: TCell): Array<TPosition> {
  const emptyCells = new Array<TPosition>();

  const directionX = cellKill.direction ? 0 : 1;
  const directionY = cellKill.direction ? 1 : 0;

  const start_x = cellKill.position.x;
  const start_y = cellKill.position.y;

  for (let j = 0; j < cellKill.length; j++) {
    emptyCells.push({
      x: start_x + directionX * j,
      y: start_y + directionY * j,
    });
  }

  return emptyCells;
}