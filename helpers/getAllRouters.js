import fs from 'fs';
import path from 'path';
import log from '../utils/log.js';
import chalk from 'chalk';

const getAllRouters = async () => {
    const routersPath = path.join(process.cwd(), 'src/routers');
    const routers = fs.readdirSync(routersPath);
    const env = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');

    const currentPort = env.split('\n').find((line) => line.includes('PORT')).split('=')[1].trim();

    log.info(chalk.green(`http://localhost:${currentPort}`));

    routers.forEach(item => {
        const routerName = item.split('.')[0];
        if (routerName !== 'index') {
            const routerFilePath = path.join(routersPath, item);
            const routerContent = fs.readFileSync(routerFilePath, 'utf8');

            // Başlık ekle
            console.log(chalk.bold.blue(`\nRoutes for ${routerName}:\n`));

            const routes = extractRoutes(routerContent, routerName);
            routes.forEach(route => {
                console.log(route);
            });
        }
    });
};

const extractRoutes = (fileContent, routerName) => {
    const routes = [];
    const routeRegex = /(router\.(get|post|put|delete)\()(['"`](.*?)['"`])/g;
    let match;

    while ((match = routeRegex.exec(fileContent)) !== null) {
        const method = match[2].toUpperCase();
        const routePath = match[4];

        // Methodları renklendirme
        let coloredMethod;
        switch (method) {
            case 'GET':
                coloredMethod = chalk.blue(method);
                break;
            case 'POST':
                coloredMethod = chalk.green(method);
                break;
            case 'PUT':
                coloredMethod = chalk.yellow(method);
                break;
            case 'DELETE':
                coloredMethod = chalk.red(method);
                break;
            default:
                coloredMethod = method;
        }

        routes.push(`${coloredMethod}: /api/${routerName}${routePath}`);
    }

    return routes;
};

export default getAllRouters;