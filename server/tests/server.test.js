const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require('mongodb');

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const { todos, populateTodos,
        users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Eat a bug';
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})                               // 1
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);       // 2
            })
            .end((err, res)=>{
                if (err) { return done(err); }
                Todo.find({text})
                    .then((todos)=>{
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(err => done(err));
            })
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res)=>{
                if (err) {return done(err);}
                Todo.find()
                    .then((todos)=>{
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch(err => done(err));
            })
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {

    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)
    });

    it("should not return other user's todo doc", (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 404 if todo not found', (done) => {
        var wrongID = ObjectID().toHexString();
        request(app)
            .get(`/todos/${wrongID}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

});

describe('DELETE /todos/:id', () => {

    it('should remove a todo doc', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err,res)=>{
                if (err) { return done(err); }
                Todo.findById(hexId)
                    .then((todo)=>{
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch(err => done(err));

            })
    });

    it("should not remove another user's todo", (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end((err,res)=>{
                if (err) { return done(err); }
                Todo.findById(hexId)
                    .then((todo)=>{
                        expect(todo).toExist();
                        done();
                    })
                    .catch(err => done(err));

            })
    });

    it('should return 404 if todo not found', (done) => {
        var wrongID = ObjectID().toHexString();
        request(app)
            .delete(`/todos/${wrongID}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end(done)
    });

});

describe('PATCH /todos/:id', () => {

    it('should update a todo doc', (done) => {
        var hexId = todos[0]._id.toHexString();
        var body = {"text":"burn neighbor's truck", "completed":true};
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it("should not update another user's todo", (done) => {
        var hexId = todos[0]._id.toHexString();
        var body = {"text":"burn neighbor's truck", "completed":true};
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .send(body)
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var body = {"text":"paint pig and sell it", "completed":false};
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth',users[1].tokens[0].token)
            .send(body)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done)
    });

    // it('should return 404 if todo not found', (done) => {
    //     var wrongID = ObjectID().toHexString();
    //     request(app)
    //         .patch(`/todos/${wrongID}`)
    //         .expect(404)
    //         .end(done)
    // });
    //
    // it('should return 404 for non-object ids', (done) => {
    //     request(app)
    //         .patch('/todos/123')
    //         .expect(404)
    //         .end(done)
    // });

});

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);

    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'user@example.com';
        var password = 'password';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) return done(err);
                User
                    .findOne({ email })
                    .then((user) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);
                        done();
                    })
                    .catch((e) => { done(e) });
            })
    });
    
    it('should return validation errors if request invalid', (done) => {
        var email = 'user@example';
        var password = 'pa';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    });
    
    it('should not create user if email is not unique', (done) => {
        var email = users[0].email;
        var password = 'password';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) return done(err);
                User
                    .findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens[1]).toInclude({
                            access:'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    })
                    .catch((e) => done(e) );
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: "wrongPassword"
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) return done(err);
                User
                    .findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(1);
                        done();
                    })
                    .catch((e) => { done(e) });
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                User
                    .findById(users[0]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    })
                    .catch((e) => done(e) )
            })

    });
});

// 1 - supertest sends the ES6 object as JSON
// 2 - this expect is the imported library, not a method from supertest