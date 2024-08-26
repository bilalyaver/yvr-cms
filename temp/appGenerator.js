const appGenerator = () => {
  const file = `require('dotenv').config();
const express = require('express');
const next = require('next');
const path = require('path');
const { createRoute, schemaManager } = require('yvr-core');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, 'client') });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  // Routers
  server.use('/schemaManager', schemaManager);
  server.use('/api', createRoute);

  server.all('/api/auth/*', (req, res) => {
    return handle(req, res);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(\`🚀 Server ready at http://localhost:\${port}/\`);
});
});`

  return file
}

export default appGenerator