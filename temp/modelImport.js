const modelImport = () => {
    const modelImportFile = `const fs = require('fs');
const modelsPath = './src/models';
const models = {}
fs.readdirSync(modelsPath).forEach(file => {
    const name = file.split(".")[0]
    const path = require(\`../models/\${name}\`);
    models[name] = path
});

module.exports = models`

    return modelImportFile
}

export default modelImport