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
