const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db', 'db.json'));

// Aponta para a pasta correta: codigo/public
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'codigo', 'public')
});

server.use(middlewares);
server.use('/api', router);

// Rota fallback para SPA
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'codigo', 'public', 'index.html'));
});

// Porta do Render (usa variável de ambiente ou 3000 localmente)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
