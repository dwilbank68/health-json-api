const {mongoose} = require("../server/db/mongoose");
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var id = '58039b57df7fd5284f77cd38';

Todo
    .findById(id)
    .then((todo)=>{
       console.log('Todo',todo);
    });