import { WebSocket } from 'ws';
import { MESSAGE_ERROR } from './constants';
import { TUser } from './type';
import { getUserByName, lastIndex } from './common';

export default function registr(user: TUser, usersDB: Map<number, TUser>, ws: WebSocket) {
  if (!isValidationUser(user)) {
    return {
      type: 'reg',
      data: JSON.stringify({
        name: user.name,
        index: -1,
        error: true,
        errorText: MESSAGE_ERROR.validation,
      }),
      id: 0,
    };
  }

  const indexUser = getUserByName(usersDB, user.name);

  if (indexUser) {
    if (indexUser.password === user.password) {
      return {
        type: 'reg',
        data: JSON.stringify({
          name: user.name,
          index: indexUser.index,
          error: false,
          errorText: '',
        }),
        id: 0,
      };
    }
    return {
      type: 'reg',
      data: JSON.stringify({
        name: user.name,
        index: indexUser.index,
        error: true,
        errorText: MESSAGE_ERROR.passwordDif,
      }),
      id: 0,
    };
  }

  const idUsers = lastIndex(usersDB) + 1;

  usersDB.set(idUsers, {
    name: user.name,
    password: user.password,
    index: idUsers,
    ws: ws,
  });
  return {
    type: 'reg',
    data: JSON.stringify({
      name: user.name,
      index: idUsers,
      error: false,
      errorText: '',
    }),
    id: 0,
  };
}

function isValidationUser(user: TUser) {
  if (user.name.length < 2 || user.password.length < 5) {
    return false;
  }
  return true;
}
