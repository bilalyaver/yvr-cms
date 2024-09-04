const appGenerator = () => {
  const file = `require('dotenv').config();
const express = require('express');
const next = require('next');
const path = require('path');
const cors = require('cors');
const { createRoute, schemaManager, mediaRoute } = require('yvr-core');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, 'client') });



const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Public klasörünü statik yapma
  const publicPath = path.join(__dirname, 'public');
  server.use(express.static(publicPath));
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  // CORS
  server.use(cors());

  // Routers
  server.use('/schemaManager', schemaManager);
  server.use('/api', createRoute);
  server.use('/media', mediaRoute);

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