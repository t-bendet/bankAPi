const fs = require("fs");
const uniqId = require("uniqid");

const getClientsList = () =>
  JSON.parse(fs.readFileSync("./db/data.json").toString());
// new client with uniqe id
const createClient = () => {
  const clientsList = getClientsList();
  const newClient = {
    id: uniqId(),
    cash: 0,
    credit: 0,
  };
  clientsList.push(newClient);
  fs.writeFileSync("./db/data.json", JSON.stringify(clientsList));
  return newClient.id;
};

// check client is valid
const checkClientIsValid = (id) => {
  const validClient = getClientsList().find((el) => {
    return el.id === id;
  });
  return validClient ? true : false;
};
// check request is valid(numbers,positive numbers,params are there)
//TODO change to switch and chnage text
const checkRequestIsValid = (id, sum, id2) => {
  if (!checkClientIsValid(id)) {
    return [404, `user ${id} does not exist`];
  }
  if (!sum) {
    return [400, `a sum parameter is required`];
  }
  if (isNaN(Math.sign(sum))) {
    return [403, `sum must ba a valid number`];
  }
  if (Math.sign(sum) === 0) {
    return [403, `sum cant be zero `];
  }
  if (Math.sign(sum) === -1) {
    return [403, `sum cant be a negative number `];
  }
  if (id2) {
    if (!checkClientIsValid(id2)) {
      return [404, `user ${id2} does not exist`];
    }
  }
  return false;
};

// depositing money to client
const deposit = (id, sum) => {
  const clientsList = getClientsList();
  const clientIndex = clientsList.findIndex((el) => {
    return el.id === id;
  });
  clientsList[clientIndex].cash += sum;
  fs.writeFileSync("./db/data.json", JSON.stringify(clientsList));
  return clientsList[clientIndex].cash;
};
// update client credit
const updateCredit = (id, sum) => {
  const clientsList = getClientsList();
  const clientIndex = clientsList.findIndex((el) => {
    return el.id === id;
  });
  clientsList[clientIndex].credit += sum;
  fs.writeFileSync("./db/data.json", JSON.stringify(clientsList));
  return clientsList[clientIndex].credit;
};
// withdraw money

const withdraw = (id, sum) => {
  const clientsList = getClientsList();
  const clientIndex = clientsList.findIndex((el) => {
    return el.id === id;
  });
  const { credit, cash } = clientsList[clientIndex];
  const remainingCash = credit + cash - sum;
  if (remainingCash < 0) {
    return [false, remainingCash];
  } else {
    clientsList[clientIndex].cash -= sum;
    fs.writeFileSync("./db/data.json", JSON.stringify(clientsList));
    return [true, clientsList[clientIndex].cash];
  }
};

const transfer = (id, sum, id2) => {
  const clientsList = getClientsList();
  const client1Index = clientsList.findIndex((el) => {
    return el.id === id;
  });
  const client2Index = clientsList.findIndex((el) => {
    return el.id === id2;
  });
  const { credit, cash } = clientsList[client1Index];
  const remainingCash = credit + cash - sum;
  if (remainingCash < 0) {
    return [false, remainingCash];
  } else {
    clientsList[client1Index].cash -= sum;
    clientsList[client2Index].cash += sum;
    fs.writeFileSync("./db/data.json", JSON.stringify(clientsList));
    return [true, clientsList[client1Index].cash];
  }
};

const getClient = (id) => {
  const clientsList = getClientsList();
  const clientIndex = clientsList.findIndex((el) => {
    return el.id === id;
  });
  if (clientIndex === -1) {
    return false;
  } else {
    return clientsList[clientIndex];
  }
};

exports.createClient = createClient;
exports.deposit = deposit;
exports.checkRequestIsValid = checkRequestIsValid;
exports.updateCredit = updateCredit;
exports.withdraw = withdraw;
exports.transfer = transfer;
exports.getClient = getClient;
exports.getClientsList = getClientsList;
