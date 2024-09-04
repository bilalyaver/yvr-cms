import Listr from "listr"
import path from "path"
import fs from "fs"
import packageGenerator from "../temp/packageGenerator.js"
import appGenerator from "../temp/appGenerator.js"
import packageInstaller from "../utils/packageInstaller.js"
import clientPages from "../temp/clientPages.js"
import installComponents from "../utils/installComponents.js"
import schemaGenerator from "../temp/schemaGenerator.js"
import envGenerator from "../temp/envGenerator.js"
import clientFolder from "../temp/clientFolder.js"
import clientFiles from "../temp/clientFiles.js"
import clientLayouts from "../temp/clientLayouts.js"
import srcFolder from "../temp/srcFolders.js"
import clientComponents from "../temp/clientComponents.js"
import schemas from "../temp/schemaGenerator.js"

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
            title: "client folders created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "folders already exists"
                }
            },
            task: (ctx) => {
                clientFolder.forEach(element => {
                    fs.mkdirSync(path.join(process.cwd(), element));
                });
            }
        },
        {
            title: "src folders created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "folders already exists"
                }
            },
            task: (ctx) => {
                srcFolder.forEach(element => {
                    fs.mkdirSync(path.join(process.cwd(), element));
                });
            }
        },
        {
            title: "client files created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "client files already exists"
                }
            },
            task: (ctx) => {
                clientFiles.forEach(element => {
                    const clientFilePath = path.join(process.cwd(), element.path)
                    fs.writeFileSync(clientFilePath, element.content);
                });
            }
        },
        {
            title: "client components created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "components already exists"
                }
            },
            task: (ctx) => {
                clientComponents.forEach(element => {
                    const clientComponentPath = path.join(process.cwd(), element.path)
                    fs.writeFileSync(clientComponentPath, element.content);
                });
            }
        },
        {
            title: "client layouts created",
            task: (ctx) => {
                clientLayouts.forEach(element => {
                    const clientLayoutPath = path.join(process.cwd(), element.path)
                    fs.writeFileSync(clientLayoutPath, element.content);
                });
            }
        },
        {
            title: "client pages created",
            task: (ctx) => {
                clientPages.forEach(element => {
                    const clientPagePath = path.join(process.cwd(), element.path)
                    fs.writeFileSync(clientPagePath, element.content);
                });
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
                fs.writeFileSync(envPath, envGenerator(questions));
            }
        },
        {
            title: "required packages installing",
            task: (ctx) => {
                packageInstaller("express, react-dropzone, dotenv, cors, mongoose, bcrypt, slugify, jsonwebtoken,  next, @tanstack/react-table, cookies-next, cross-env, axios, class-variance-authority, clsx, lucide-react, tailwind-merge, tailwindcss-animate, tailwindcss --save-dev, postcss --save-dev, yvr-core");
                installComponents();
            }
        },
    ])

    tasks.run()
}


export default newProjectTask