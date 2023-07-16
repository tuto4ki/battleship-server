import { createFillMatrix, getTypeShips, getRandom, getDirection } from './common';
import { FIELD_SIZE, SHIP_DATA } from './constants';
import { TCell, TPosition } from './type';

export function getRandomLocationShips() {
  const matrix: Array<Array<number>> = createFillMatrix(FIELD_SIZE, 0);
  const ships: Array<TCell> = new Array<TCell>();
  for (let type in SHIP_DATA) {
    let countShip = SHIP_DATA[type][0];
    let lengthShip = SHIP_DATA[type][1];
    for (let i = 0; i < countShip; i++) {
      let options = getCoordsOnDesks(lengthShip, matrix, ships);

      createShip(options, matrix, ships);
    }
  }
  return { ships, matrix };
}

function getCoordsOnDesks(
  lengthShip: number,
  matrix: Array<Array<number>>,
  ships: Array<TCell>)
: Pick<TCell, 'position' | 'direction' | 'length'> {
  const direction = Boolean(getRandom(1));
	let	x: number, y: number;

  if (direction) {
    x = getRandom(FIELD_SIZE - 1);
    y = getRandom(FIELD_SIZE - lengthShip);
  } else {
    x = getRandom(FIELD_SIZE - lengthShip);
    y = getRandom(FIELD_SIZE - 1);
  }

  const cell = {
    position: { x, y },
    direction,
    length: lengthShip,
  };
  const result = checkLocationShip(cell, lengthShip, matrix);

  if (!result) {
    return getCoordsOnDesks(lengthShip, matrix, ships);
  }
  return cell;
}

function checkLocationShip(
  cell: { position: TPosition, direction: boolean },
  lengthShip: number,
  matrix: Array<Array<number>>
) {
  const { directionX, directionY } = getDirection(cell.direction);
  const { start: startX, end: endX } = getBorder(cell.position.x, directionX, lengthShip);
  const { start: startY, end: endY } = getBorder(cell.position.y, directionY, lengthShip);
  
  if (endX === -1 || endY === -1) return false;

  const countCells =
    matrix.slice(startX, endX)
    .filter(arr => arr.slice(startY, endY).includes(1))
    .length;

  if (countCells > 0) return false;
  return true;
}

function createShip(
  cell: Pick<TCell, 'position' | 'direction' | 'length'>,
  matrix: Array<Array<number>>,
  ships: Array<TCell>
) {
  const { directionX, directionY } = getDirection(cell.direction);

  ships.push({
    position: cell.position,
    direction: Boolean(directionY),
    length: cell.length,
    type: getTypeShips(cell.length),
  });

  for (let k = 0; k < cell.length; k++) {
    const i = cell.position.x + k * directionX;
    const j = cell.position.y + k * directionY;

    matrix[i][j] = 1;
  }
}

function getBorder(coord: number, direction: number, lengthShip: number) {
  const start = (coord == 0) ? coord : coord - 1;
  let end = -1;
  if (direction == 1) {
    const length = coord + direction * lengthShip;
    end = Math.min(length + 1, FIELD_SIZE)
  } else if (direction === 0) {
    if (coord == FIELD_SIZE - 1) {
      end = coord + 1;
    } else if (coord < FIELD_SIZE - 1) {
      end = coord + 2;
    }
  }
  return { start, end };
}