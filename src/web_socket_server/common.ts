import WebSocket from 'ws';
import { TUser } from './type';

export function getUserByName(userDB: Map<number, TUser>, name: string) {
  for (let user of userDB.values()) {
    if (user.name === name) {
      return user;
    }
  }
  return false;
}

export function getUserByWs(userDB: Map<number, TUser>, ws: WebSocket) {
  for (let user of userDB.values()) {
    if (user.ws === ws) {
      return user;
    }
  }
  return false;
}

export function lastIndex<T>(map: Map<number, T>) {
  if (map.size === 0) {
    return -1;
  }
  return Array.from(map)[map.size - 1][0];
}

export function getTypeShips(type: number) {
  switch(type) {
    case 4:
      return 'huge';
    case 3:
      return 'large';
    case 2:
      return 'medium';
    default:
      return 'small';
  }
}

export function createFillMatrix(size: number, number: number): Array<Array<number>> {
  return [...Array(size)].map(() => Array(size).fill(number));
}

export function getRandom(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

export function getDirection(direction: boolean) {
  const directionX = direction ? 0 : 1;
  const directionY = direction ? 1 : 0;
  return {
    directionX,
    directionY
  };
}
