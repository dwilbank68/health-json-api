# Node.js JSON API

    Node, Express, Mongo(ose)
    jwt authentication
    all routes under test coverage with mocha, expect, supertest


live at
https://wilbanks-node-api.herokuapp.com/

### endpoints

    post    '/todos'
    get     '/todos'
    get     '/todos/:id'
    delete  '/todos/:id'
    patch   '/todos/:id'
    get     '/users/me'
    post    '/users'            {email:'...', password:'...'}
    post    '/users/login'      {email:'...', password:'...'}
    delete  '/users/me/token'

### Running it locally

##### Starting the Server

    nodemon server/server.js

##### Running the tests
    
    npm run test-watch

##### Notes

    examples of native mongo driver commands are in the playground folder