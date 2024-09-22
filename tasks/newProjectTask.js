import Listr from "listr"
import path from "path"
import fs from "fs"
import packageGenerator from "../temp/packageGenerator.js"
import packageInstaller from "../utils/packageInstaller.js"
import installComponents from "../utils/installComponents.js"
import { fileURLToPath } from 'url'; // ESM'de __dirname kullanımı
import folders from "../temp/folders.js"
import files from "../temp/files.js"
import envGenerator from "../temp/envGenerator.js"
import nextConfigGenerator from "../temp/nextConfigGenerator.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newProjectTask = (questions) => {
    const tasks = new Listr([
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
        // {
        //     title: "app.js file created",
        //     skip: (ctx) => {
        //         if (ctx.packagePath) {
        //             return "app.js file already exists"
        //         }
        //     },
        //     task: (ctx) => {
        //         const appPath = path.join(process.cwd(), 'app.js')
        //         fs.writeFileSync(appPath, appGenerator());

        //     }
        // },
        {
            title: "folders created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "folders already exists"
                }
            },
            task: (ctx) => {
                folders.forEach(element => {
                    fs.mkdirSync(path.join(process.cwd(), element));
                });
            }
        },
        {
            title: "files created",
            skip: (ctx) => {
                if (ctx.packagePath) {
                    return "client files already exists"
                }
            },
            task: (ctx) => {
                files.forEach(element => {
                    const clientFilePath = path.join(process.cwd(), element.path)
                    fs.writeFileSync(clientFilePath, element.content);
                });
            }
        },
        {
            title: "dynamic files created",
            task: (ctx) => {
                const envPath = path.join(process.cwd(), '.env')
                fs.writeFileSync(envPath, envGenerator(questions));
                const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')
                fs.writeFileSync(nextConfigPath, nextConfigGenerator(questions));
            }
        },
        {
            title: "required packages installing",
            task: (ctx) => {
                packageInstaller("express, react-dropzone, dotenv, cors, @ckeditor/ckeditor5-react, yvr-image-editor, mongoose, bcrypt, slugify, jsonwebtoken,  next@14.2.13, @tanstack/react-table, cookies-next, cross-env, axios, class-variance-authority, clsx, lucide-react, tailwind-merge, tailwindcss-animate, tailwindcss --save-dev, postcss --save-dev, yvr-core@latest");
                installComponents();
            }
        },
        {
            title: "favicon.ico file copied",
            skip: (ctx) => {
                const faviconDestPath = path.join(process.cwd(), 'client/public', 'favicon.ico');
                if (fs.existsSync(faviconDestPath)) {
                    return "favicon.ico already exists";
                }
            },
            task: (ctx) => {
                const faviconSourcePath = path.join(__dirname, '../temp', 'favicon.ico'); // Favicon'un olduğu yer
                const faviconDestPath = path.join(process.cwd(), 'client/public', 'favicon.ico'); // Hedef dizin

                fs.copyFileSync(faviconSourcePath, faviconDestPath);
            }
        },
    ])

    tasks.run()
}


export default newProjectTask