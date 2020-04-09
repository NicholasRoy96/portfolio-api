# User API

----
## Installation


> Please follow the steps below to run the API

1. `git clone https://github.com/NicholasRoy96/portfolio-api.git`
2. `cd portfolio-api/`
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
