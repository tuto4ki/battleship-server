import { WebSocket } from 'ws';

export type TUser = {
  name: string;
  password: string;
  index: number;
  ws: WebSocket;
};

export type TWins = {
  idUser: number;
  wins: number;
}

export type TRoom = {
  indexRoom: number;
  usersID: TUsersInRoom[],
  currentPlayer: number,
}

export type TUsersInRoom = {
  index: number;
  ships: Array<TCell>;
  shipsMatrix: Array<Array<number>>;
  attackMatrix: Array<Array<number>>;
}

export type TRequestAddShips = {
  indexPlayer: number;
  gameId: number;
  ships: Array<TCell>;
}

export type TResponseRoom = {
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
  }[];
}

export type TRequestAttack = {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
}

export type TRequestRandomAttack = {
  gameId: number;
  indexPlayer: number;
}

export enum EShotType {
  miss = 'miss', // 3
  killed = 'killed', // 2
  shot = 'shot', // 1
};

export type TCell = {
  position: TPosition;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export type TPosition = {
  x: number;
  y: number;
}

export type TSHIP_DATA = {
  [key: string]: Array<number>,
}
