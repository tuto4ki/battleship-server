import { MESSAGE_ERROR } from "./constants.js";

export default function registr(user, usersDB, ws) {
  const indexUser = usersDB.findIndex((item) => item.name === user.name);

  if (!isValidationUser(user)) {
    return {
      type: "reg",
      data: JSON.stringify({
        name: user.name,
        index: indexUser,
        error: true,
        errorText: MESSAGE_ERROR.validation,
      }),
      id: 0,
    };
  }
  
  if (indexUser >= 0) {
    if (usersDB[indexUser].password === user.password) {
      return {
        type: "reg",
        data: JSON.stringify({
          name: user.name,
          index: indexUser,
          error: false,
          errorText: "",
        }),
        id: 0,
      };
    }
    return {
      type: "reg",
      data: JSON.stringify({
        name: user.name,
        index: indexUser,
        error: true,
        errorText: MESSAGE_ERROR.passwordDif,
      }),
      id: 0,
    };
  }

  const idUsers = usersDB.length;
  ws.id = idUsers;
  usersDB.push({
    name: user.name,
    password: user.password,
    index: idUsers
  });
  return {
    type: "reg",
    data: JSON.stringify({
      name: user.name,
      index: idUsers,
      error: false,
      errorText: "",
    }),
    id: 0,
  };
}

function isValidationUser(user) {
  if (user.name.length < 2 || user.password.length < 5) {
    return false;
  }
  return true;
}
