import { SHIP_DATA } from './constants';

const matrix: Array<Array<number>> = [...Array(10)].map(() => Array(10).fill(0));

export function randomLocationShips() {
  for (let type in SHIP_DATA) {
    let count = SHIP_DATA[type][0];
    let decks = SHIP_DATA[type][1];
    for (let i = 0; i < count; i++) {
      let options = getCoordsDecks(decks);
      console.log(options, decks);
      createShip(options, decks);
    }
  }
  console.log(matrix);
}

const getRandom = (n: number): number => Math.floor(Math.random() * (n + 1));

function getCoordsDecks(decks: number): {
  x: number,
  y: number,
  kx: number,
  ky: number,
} {
  // kx == 0 и ky == 1 — корабль расположен горизонтально,
  // kx == 1 и ky == 0 - вертикально.
  const kx = getRandom(1);
  const ky = (kx == 0) ? 1 : 0;
	let	x: number, y: number;

  if (kx == 0) {
    x = getRandom(9);
    y = getRandom(10 - decks);
  } else {
    x = getRandom(10 - decks);
    y = getRandom(9);
  }

  const obj = {x, y, kx, ky}
  const result = checkLocationShip(obj, decks);

  if (!result) return getCoordsDecks(decks);
  return obj;
}

function checkLocationShip(obj: { x: number, y: number, kx: number, ky: number, fromX?: number, toX?: number, fromY?: number, toY?: number }, decks: number) {
  let { x, y, kx, ky, fromX, toX, fromY, toY } = obj;

  fromX = (x == 0) ? x : x - 1;
  if (x + kx * decks == 10 && kx == 1) toX = x + kx * decks;
  else if (x + kx * decks < 10 && kx == 1) toX = x + kx * decks + 1;
  // корабль расположен горизонтально вдоль нижней границы игрового поля
  else if (x == 9 && kx == 0) toX = x + 1;
  // корабль расположен горизонтально где-то по середине игрового поля
  else if (x < 9 && kx == 0) toX = x + 2;

  // формируем индексы начала и конца выборки по столбцам
  // принцип такой же, как и для строк
  fromY = (y == 0) ? y : y - 1;
  if (y + ky * decks == 10 && ky == 1) toY = y + ky * decks;
  else if (y + ky * decks < 10 && ky == 1) toY = y + ky * decks + 1;
  else if (y == 9 && ky == 0) toY = y + 1;
  else if (y < 9 && ky == 0) toY = y + 2;

  if (toX === undefined || toY === undefined) return false;

  // отфильтровываем ячейки, получившегося двумерного массива,
  // содержащие 1, если такие ячейки существуют - возвращаем false
  if (matrix.slice(fromX, toX)
    .filter(arr => arr.slice(fromY, toY).includes(1))
    .length > 0) return false;
  return true;
}

function createShip(cell: { x: number, y: number, kx: number, ky: number }, decks: number) {
  let { x, y, kx, ky } = cell;
  let k = 0;

  while (k < decks) {
    let i = x + k * kx, j = y + k * ky;

    matrix[i][j] = 1;
    k++;
  }
}