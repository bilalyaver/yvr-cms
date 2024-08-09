import Listr from "listr"
import path from "path"
import fs from "fs"
import packageGenerator from "../temp/packageGenerator.js"
import appGenerator from "../temp/appGenerator.js"
import packageInstaller from "../utils/packageInstaller.js"
import modelImport from "../temp/modelImport.js"
import dbGenerator from "../temp/dbGenerator.js"
import indexGenerator from "../temp/view/indexGenerator.js"
import layoutGenerator from "../temp/view/layoutGenerator.js"
import defaultIndexRouter from "../temp/defaultIndexRouter.js"
import viewPages from "../temp/view/viewPages.js"
import adminModelGenerator from "../temp/adminModelGenerator.js"
import createFirstDataGenerator from "../temp/createFirstDataGenerator.js"
import dashboardRouterGenerator from "../temp/dashboardRouterGenerator.js"
import adminControllerGenerator from "../temp/adminControllerGenerator.js"
import configFileGenerator from "../temp/configFileGenerator.js"
import schemasImport from "../temp/schemasImport.js"
import authCheckGenerator from "../temp/authCheckGenerator.js"

const newProjectTask = (questions) => {

    const tasks = new Listr([
        {
            title: "Is there 'package.json' file",
            task: (ctx) => {
                const packagePath = path.join(process.cwd(), 'package.json')
                if (fs.existsSync(packagePath)) {
                    ctx.packagePath = true

                }
            }
        },
        {
            title: "package.json file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "package.json file already exists"
                }
            },
            task: (ctx) => {
                const packagePath = path.join(process.cwd(), 'package.json')
                fs.writeFileSync(packagePath, JSON.stringify(packageGenerator(questions.name, questions.description, questions.author), null, 2));
            }
        },
        {
            title: "app.js file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "app.js file already exists"
                }
            },
            task: (ctx) => {
                const appPath = path.join(process.cwd(), 'app.js')
                fs.writeFileSync(appPath, appGenerator());
            }
        },
        {
            title: "src folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "view folder already exists"
                }
            },
            task: (ctx) => {
                const srcPath = path.join(process.cwd(), 'src')
                fs.mkdirSync(srcPath);
            }
        },
        {
            title: "views folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "view folder already exists"
                }
            },
            task: (ctx) => {
                const viewPath = path.join(process.cwd(), 'src/views')
                fs.mkdirSync(viewPath);
            }
        },
        {
            title: "layout folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "layout folder already exists"
                }
            },
            task: (ctx) => {
                const layoutPath = path.join(process.cwd(), 'src/views/layout')
                fs.mkdirSync(layoutPath);
            }
        },
        {
            title: "index.ejs file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "index.ejs file already exists"
                }
            },
            task: (ctx) => {
                const indexPath = path.join(process.cwd(), 'src/views/index.ejs')
                fs.writeFileSync(indexPath, indexGenerator());
                const loginPath = path.join(process.cwd(), 'src/views/login.ejs')
                fs.writeFileSync(loginPath, viewPages.login());
            }
        },
        {
            title: "layout.ejs file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "layout.ejs file already exists"
                }
            },
            task: (ctx) => {
                const layoutEjsPath = path.join(process.cwd(), 'src/views/layout/index.ejs')
                fs.writeFileSync(layoutEjsPath, layoutGenerator());
            }
        },
        {
            title: "env file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "env file already exists"
                }
            },
            task: (ctx) => {
                const envPath = path.join(process.cwd(), '.env')
                fs.writeFileSync(envPath, `PORT=8080\nDB_URL=mongodb://localhost:27017/${questions.name}\nJWT_SECRET_KEY=fgewgrehrehrejhre\nJWT_EXPIRE=1d\nEMAIL=${questions.email}\nPASSWORD=${questions.password}\nSESSION_SECRET=fgewgrehrehrejhre`);
            }
        },
        {
            title: "src/controllers folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/controllers folder already exists"
                }
            },
            task: (ctx) => {
                const controllersPath = path.join(process.cwd(), 'src/controllers');
                fs.mkdirSync(controllersPath);
            }
        },
        {
            title: "src/controllers/adminController.js file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/controllers/adminController.js file already exists"
                }
            },
            task: (ctx) => {
                const dashboardRouterPath = path.join(process.cwd(), 'src/controllers/adminController.js');
                fs.writeFileSync(dashboardRouterPath, adminControllerGenerator());
            }
        },
        {
            title: "src/models folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/models folder already exists"
                }
            },
            task: (ctx) => {
                const modelsPath = path.join(process.cwd(), 'src/models');
                fs.mkdirSync(modelsPath);
            }
        },
        {
            title: "src/models/Admin.js file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/models/Admin.js file already exists"
                }
            },
            task: (ctx) => {
                const modelsHelper = path.join(process.cwd(), 'src/models/Admin.js');
                fs.writeFileSync(modelsHelper, adminModelGenerator());
            }
        },
        {
            title: "src/routers folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/routers folder already exists"
                }
            },
            task: (ctx) => {
                const routersPath = path.join(process.cwd(), 'src/routers');
                fs.mkdirSync(routersPath);
            }
        },
        {
            title: "src/routers/index.js file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/routers/index.js file already exists"
                }
            },
            task: (ctx) => {
                const defaultIndexRouterPath = path.join(process.cwd(), 'src/routers/index.js');
                fs.writeFileSync(defaultIndexRouterPath, defaultIndexRouter());
            }
        },
        {
            title: "src/routers/dashboard.js file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/routers/dashboard.js file already exists"
                }
            },
            task: (ctx) => {
                const dashboardRouterPath = path.join(process.cwd(), 'src/routers/dashboard.js');
                fs.writeFileSync(dashboardRouterPath, dashboardRouterGenerator());
            }
        },
        {
            title: "src/middlewares folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/middlewares folder already exists"
                }
            },
            task: (ctx) => {
                const middlewaresPath = path.join(process.cwd(), 'src/middlewares');
                fs.mkdirSync(middlewaresPath);
            }
        },
        {
            title: "auth check file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "auth check file already exists"
                }
            },
            task: (ctx) => {
                const firstDataPath = path.join(process.cwd(), 'src/middlewares/authCheck.js');
                fs.writeFileSync(firstDataPath, authCheckGenerator());
            }
        },
        {
            title: "src/helpers folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/helpers folder already exists"
                }
            },
            task: (ctx) => {
                const helpersPath = path.join(process.cwd(), 'src/helpers');
                fs.mkdirSync(helpersPath);
            }
        },
        {
            title: "create first data file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "create first data file already exists"
                }
            },
            task: (ctx) => {
                const firstDataPath = path.join(process.cwd(), 'src/helpers/createFirstData.js');
                fs.writeFileSync(firstDataPath, createFirstDataGenerator());
            }
        },
        {
            title: "src/helpers/models.js file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/helpers/models.js file already exists"
                }
            },
            task: (ctx) => {
                const modelsHelper = path.join(process.cwd(), 'src/helpers/models.js');
                fs.writeFileSync(modelsHelper, modelImport());
            }
        },
        {
            title: "src/helpers/schemas.js file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src/helpers/schemas.js file already exists"
                }
            },
            task: (ctx) => {
                const schemasHelper = path.join(process.cwd(), 'src/helpers/schemas.js');
                fs.writeFileSync(schemasHelper, schemasImport());
            }
        },
        {
            title: "required packages installing",
            task: (ctx) => {
                packageInstaller("express");
                packageInstaller("dotenv");
                packageInstaller("mongoose");
                packageInstaller("ejs");
                packageInstaller("express-ejs-layouts");
                packageInstaller("bcrypt");
                packageInstaller("jsonwebtoken");
                packageInstaller("connect-flash");
                packageInstaller("express-session");
                packageInstaller("passport");
                packageInstaller("passport-local");
                packageInstaller("connect-mongodb-session");
            }
        },
        {
            title: "lib folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "lib folder already exists"
                }
            },
            task: (ctx) => {
                const libPath = path.join(process.cwd(), 'src/lib');
                fs.mkdirSync(libPath);
            }
        },
        {
            title: "lib/db.js file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "lib/db.js file already exists"
                }
            },
            task: (ctx) => {
                const dbPath = path.join(process.cwd(), 'src/lib/db.js');
                fs.writeFileSync(dbPath, dbGenerator());
            }
        },
        {
            title: "config folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "config folder already exists"
                }
            },
            task: (ctx) => {
                const configPath = path.join(process.cwd(), 'src/config');
                fs.mkdirSync(configPath);
            }
        },
        {
            title: "config/passportLocal file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "config/passportLocal file already exists"
                }
            },
            task: (ctx) => {
                const dbPath = path.join(process.cwd(), 'src/config/passportLocal.js');
                fs.writeFileSync(dbPath, configFileGenerator());
            }
        },
        // {
        //     title: "open in browser http://localhost:8080",
        //     task: (ctx) => {
        //         log.info("Run server with 'npm run dev' command")
        //         log.info("Open in browser http://localhost:8080/dashboard")
        //     }
        // }
    ])

    tasks.run()
}


export default newProjectTask