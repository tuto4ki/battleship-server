import { WebSocket } from 'ws';

export type TUser = {
  name: string;
  password: string;
  index: number;
  ws: WebSocket;
};

export type TRoom = {
  indexRoom: number;
  usersID: [{
    index: number;
    ships: [];
  }],
}

export type TRequestAddShips = {
  indexPlayer: number;
  gameId: number;
  ships: [];
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

export type TROOM = {
  indexRoom: number;
  userID: number;
  enemyId: number;
  ships: [
    {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: "small" | "medium" | "large" | "huge";
    }
  ];
  shipsEnemy: [
    {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: "small" | "medium" | "large" | "huge";
    }
  ];
};
