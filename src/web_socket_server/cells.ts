import { TPosition, TCell } from './type';
import { FIELD_SIZE } from './constants';
import { getDirection } from './common';

export function getEmptyCells(cellKill: TCell): Array<TPosition> {
  const emptyCells = new Array<TPosition>();
 
  const { directionX, directionY } = getDirection(cellKill.direction);

  const maxValueX = directionX * cellKill.length + (directionX ? 1 : 2);
  const bottomLine = cellKill.position.y + 1 + directionY * (cellKill.length - 1);
  if (bottomLine < FIELD_SIZE) {
    emptyCells.push(...getHorizontalLine(bottomLine, maxValueX, cellKill));
  }

  const topLine = cellKill.position.y - 1;
  if (topLine >= 0) {
    emptyCells.push(...getHorizontalLine(topLine, maxValueX, cellKill));
  }

  const maxValueY = directionY * cellKill.length + (directionY ? 1 : 2);
  const rightLine = cellKill.position.x + 1 + directionX * (cellKill.length - 1);
  if (rightLine < FIELD_SIZE) {
    emptyCells.push(...getVerticalLine(rightLine, maxValueY, cellKill));
  }

  const leftLine = cellKill.position.x - 1;
  if (leftLine >= 0) {
    emptyCells.push(...getVerticalLine(leftLine, maxValueY, cellKill));
  }

  return emptyCells;
}

export function getKillOneCell(ships: TCell[], {x, y}: TPosition): TCell | undefined {
  for (let i = 0; i < ships.length; i++) {
    const { directionX, directionY } = getDirection(ships[i].direction);
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
  const { directionX, directionY } = getDirection(cellKill.direction);

  const {x: startX, y: startY } = cellKill.position;

  for (let i = 0; i < cellKill.length; i++) {
    emptyCells.push({
      x: startX + directionX * i,
      y: startY + directionY * i,
    });
  }

  return emptyCells;
}

function getHorizontalLine(bottomLine: number, maxValueX: number, cellKill: TCell) {
  const emptyCells = new Array<TPosition>();
  if (bottomLine < FIELD_SIZE) {
    for (let i = -1; i < maxValueX; i++) {
      if (cellKill.position.x + i >= 0 && cellKill.position.x + i < FIELD_SIZE) {
        emptyCells.push({
          x: cellKill.position.x + i,
          y: bottomLine,
        });
      }
    }
  }
  return emptyCells;
}

function getVerticalLine(rightLine: number, maxValueY: number, cellKill: TCell) {
  const emptyCells = new Array<TPosition>();
  for (let i = 0; i < maxValueY; i++) {
    if (cellKill.position.y + i >= 0 && cellKill.position.y + i < FIELD_SIZE) {
      emptyCells.push({
        x: rightLine,
        y: cellKill.position.y + i,
      });
    }
  }
  return emptyCells;
}