##

| Action         | Method | Path                                                            |
| -------------- | ------ | --------------------------------------------------------------- |
| Add user       | POST   | /bank/new_client                                                |
| Depositing     | put    | /bank/clients/deposit/:id                                       |
| Update credit  | PUT    | /bank/clients/credit/:id(sum=int)                               |
| Withdraw money | PUT    | /bank/clients/withdraw/:id                                      |
| Transferring   | PUT    | /bank/clients/transfer (sum=int, from_client=id, to_client=id ) |
| Get user       | GET    | /bank/clients/:id                                               |
| Get all users  | GET    | /bank/clients/                                                  |
