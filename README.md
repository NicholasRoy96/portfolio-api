# User API

----
## Installation


> Please follow the steps below to run the API

1. `git clone https://github.com/NicholasRoy96/Test-API.git`
2. `cd HX-Test-API/`
3. `npm install`
4. `npm start`

----
## Testing

> Please follow the steps below to run the unit tests and show test coverage

1. `npm test`

----
## Routes


> Please see example requests below and/or use the example [Postman Collection](https://www.getpostman.com/collections/64728eff9ac89ab7ded3)

### getAll Users

`GET localhost:3000/users/getAll`

### get User

`GET localhost:3000/users/:id`

### create User

`POST localhost:3000/users`

`{
"email": "...",
"givenName": "...",
"familyName": "..."
}`

### update User

`PUT localhost:3000/users/:id`

`{
"email": "...",
"givenName": "...",
"familyName": "..."
}`

### delete User

`DELETE localhost:3000/users/:id`

----
## TODO


> Below is a list of potential improvements I could make if I had longer to spend building the API

- Host API
- Create front-end app to consume API
