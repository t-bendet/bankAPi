const express = require("express");
const app = express();
const {
  createClient,
  checkRequestIsValid,
  deposit,
  updateCredit,
  withdraw,
  transfer,
  getClient,
  getClientsList,
} = require("./utils");

app.use(express.json());

// add users
app.post("/bank/new_client", (req, res) => {
  const id = createClient();
  res.status(201).send(`client ${id} was created successfully`);
});

// depositing (query params:sum)
app.put("/bank/clients/deposit/:id", (req, res) => {
  const { id } = req.params;
  const { sum } = req.query;
  if (checkRequestIsValid(id, sum)) {
    const [code, message] = checkRequestIsValid(id, sum);
    return res.status(code).send(message);
  } else {
    const newSum = deposit(id, parseInt(sum));
    res.status(200).send(`client ${id} balance was updated by ${sum}
  new balance is ${newSum}`);
  }
});

// update credit (query params:sum)
app.put("/bank/clients/credit/:id", (req, res) => {
  const { id } = req.params;
  const { sum } = req.query;
  if (checkRequestIsValid(id, sum)) {
    const [code, message] = checkRequestIsValid(id, sum);
    return res.status(code).send(message);
  } else {
    const newSum = updateCredit(id, parseInt(sum));

    res.status(200).send(`client ${id} credit was updated by ${sum}
  new credit is ${newSum}`);
  }
});

// withdraw money (query params:sum)
app.put("/bank/clients/withdraw/:id", (req, res) => {
  const { id } = req.params;
  const { sum } = req.query;
  if (checkRequestIsValid(id, sum)) {
    const [code, message] = checkRequestIsValid(id, sum);
    return res.status(code).send(message);
  } else {
    const result = withdraw(id, parseInt(sum));
    if (!result[0]) {
      res.status(403).send(`client ${id} max withdrawal limit is ${
        parseInt(sum) + result[1]
      } 
      can not withdraw ${sum} 
      action cancelled`);
    } else {
      res.status(200).send(`client ${id} withdraw ${sum} from his account
      new balance is ${result[1]}`);
    }
  }
});

//transferring (query params:sum, from_client, to_client )
app.put("/bank/clients/transfer", (req, res) => {
  const { sum, from_client, to_client } = req.query;
  if (checkRequestIsValid(from_client, sum, to_client)) {
    const [code, message] = checkRequestIsValid(from_client, sum, to_client);
    return res.status(code).send(message);
  } else {
    const result = transfer(from_client, parseInt(sum), to_client);
    if (!result[0]) {
      res.status(403).send(`client ${from_client} max withdrawal limit is ${
        parseInt(sum) + result[1]
      } 
      can not transfer ${sum} 
      action cancelled`);
    } else {
      res.status(200)
        .send(`client ${from_client} transferred ${sum} from his account
        client ${from_client} new balance is ${result[1]}`);
    }
  }
});

// show user details (get)
app.get("/bank/clients/:id", (req, res) => {
  const { id } = req.params;
  const result = getClient(id);
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send("not found");
  }
});

// show all users details (get)
app.get("/bank/clients/", (req, res) => {
  res.status(200).send(getClientsList());
});

// PORT
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
