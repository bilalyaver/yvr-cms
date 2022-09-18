import fs from 'fs';
import path from 'path';

const routerIndexGenerator = (name) => {
    const routersPath = path.join(process.cwd(), 'src/routers');

    let tempRouterIndexFile = ""

    fs.readdirSync(routersPath).forEach(file => {
        const name = file.split(".")[0];
        if (name != "index") {
            tempRouterIndexFile += `const ${name} = require('./${name}');\n
            router.use('/${name}', ${name});\n
            `
        }
        
    });

    const routerIndexFile = `const express = require('express');
    const router = express.Router(); 
    ${tempRouterIndexFile}
    module.exports = router;`

    return routerIndexFile

}

export default routerIndexGenerator