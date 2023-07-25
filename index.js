const Ejs = require('ejs');
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const path = require('path')

const server = Hapi.Server({ port: 3000 });

let todos = [ { id: 1, description: 'hello' }, { id: 2,  description: 'world' }, { id: 3,  description: '!!!!!!' } ]
let id = 4

const rootHandler = (request, h) => {
  return h.view('index', {
    todos
  });
};

const createTodoHandler = (request, h) => {
  const newTodo = { id, description: request.payload.todo }
  todos.unshift(newTodo)
  id++
  return Ejs.renderFile(path.resolve(__dirname, './templates/todo.ejs'), { todo: newTodo })
}

const deleteTodoHandler = (request, h) => {
  const todoId = parseInt(request.payload.id)
  todos = todos.filter(({id}) => id !== todoId)
  return `<div></div>`
}

const updateTodoModal = (request, h) => {
  const todo = request.payload.todo
  return Ejs.renderFile(path.resolve(__dirname, './templates/edit-modal.ejs'), { todo })
} 

const updateTodoHandler = (request, h) => {
  const updatedTodo = request.payload.todo
  todos.unshift(newTodo)
  id++
  return Ejs.renderFile(path.resolve(__dirname, './templates/todo.ejs'), { todo: newTodo })
}

const init = async () => {
  await server.register(Vision);
  server.views({
    engines: { ejs: Ejs },
    relativeTo: __dirname,
    path: 'templates'
  });
  server.route({ method: 'GET', path: '/', handler: rootHandler });
  server.route({ method: 'POST', path: '/todo/create', handler: createTodoHandler });
  server.route({ method: 'POST', path: '/todo/delete', handler: deleteTodoHandler });
  server.route({ method: 'POST', path: '/todo/update/modal', handler: updateTodoModal });
  await server.start();
  console.log('Server running at:', server.info.uri);
};
init();
