import fs from 'fs';
import path from 'path';
import log from '../utils/log.js';
import chalk from 'chalk';

const getAllRouters = async () => {
    const routersPath = path.join(process.cwd(), 'routers');
    const routers = fs.readdirSync(routersPath);
    const env = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');

    const currentPort = env.split('\n').find((line) => line.includes('PORT')).split('=')[1].trim();

    log.info(chalk.green(`http://localhost:${currentPort}`));

    routers.forEach(item => {
        const routerName = item.split('.')[0];
        if (routerName != 'index') {

            console.log(`${chalk.blue("GET")}: /api/${routerName}\n${chalk.blue("GET")}: /api/${routerName}/:id\n${chalk.green("POST")}: /api/${routerName}\n${chalk.green("PUT")}: /api/${routerName}/:id\n${chalk.red("DELETE")}: /api/${routerName}/:id`);
        }
    });

}




export default getAllRouters