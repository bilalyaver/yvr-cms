const appGenerator = () => {
    const file = `require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
require("./src/lib/db")();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const routers = require('./src/routers/index');
app.use('/api', routers);

app.listen(port, () => {
    console.log(\`🚀 Server ready at http://localhost:\${port}/api\`);
});
    `

    return file
}

export default appGenerator