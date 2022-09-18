import fs from 'fs';
import path from 'path';
const packageList = ["dotenv", "express", "mongoose"];

const checkPackage = () => {
    const isThere = fs.existsSync(path.join(process.cwd(), 'package.json'));
    
    if (isThere) {
        const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
        var payload;
        packageList.forEach((pkgName) => {
            if (!pkg.dependencies[pkgName]) {
                payload = { isThere: false, message: `Please install ${pkgName} package`, command: `run "npm i ${pkgName}"` };
                return
            }
        });
        if (payload) {
            return payload
        } else {
            return { isThere: true }
        }
    }
}


export default checkPackage