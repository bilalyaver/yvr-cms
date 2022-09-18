import Listr from "listr"
import path from "path"
import fs from "fs"
import packageGenerator from "../temp/packageGenerator.js"
import appGenerator from "../temp/appGenerator.js"
import packageInstaller from "../utils/packageInstaller.js"
import modelImport from "../temp/modelImport.js"
import dbGenerator from "../temp/dbGenerator.js"

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
            title: "env file created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "env file already exists"
                }
            },
            task: (ctx) => {
                const envPath = path.join(process.cwd(), '.env')
                fs.writeFileSync(envPath, `PORT=8080\nDB_URL=mongodb://localhost:27017/${questions.name}`);
            }
        },
        {
            title: "src folder created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "src folder already exists"
                }
            },
            task: (ctx) => {
                const srcPath = path.join(process.cwd(), 'src')
                fs.mkdirSync(srcPath);
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
            title: "required packages installing",
            task: (ctx) => {
                packageInstaller("express");
                packageInstaller("dotenv");
                packageInstaller("mongoose");
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
    ])

    tasks.run()
}


export default newProjectTask