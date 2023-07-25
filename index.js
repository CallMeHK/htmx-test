const Ejs = require('ejs');
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');

const server = Hapi.Server({ port: 3000 });

const todos = []

const rootHandler = (request, h) => {
  return h.view('index', {
    todos
  });
};

const submitTodoHandler = (request, h) => {
  const newTodo = request.payload.todo
  todos.unshift(newTodo)
  return `<div>${newTodo}</div>`
}

const init = async () => {
  await server.register(Vision);
  server.views({
    engines: { ejs: Ejs },
    relativeTo: __dirname,
    path: 'templates'
  });
  server.route({ method: 'GET', path: '/', handler: rootHandler });
  server.route({ method: 'POST', path: '/todo/submit', handler: submitTodoHandler });
  await server.start();
  console.log('Server running at:', server.info.uri);
};
init();
