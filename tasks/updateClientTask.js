import Listr from "listr"
import path from "path"
import fs from "fs"
import { fileURLToPath } from 'url'; // ESM'de __dirname kullanımı
import folders from "../temp/folders.js"
import files from "../temp/files.js"
import getVersion from "../helpers/getVersion.js";
import archiver from "archiver";
import axios from "axios";
import installComponents from "../utils/installComponents.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const archiveClientFolder = () => {
    return new Promise((resolve, reject) => {
        const today = new Date().toISOString().slice(0, 10);
        const output = fs.createWriteStream(path.join(process.cwd(), `client-backup-${today}.zip`));
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`Client folder archived: ${archive.pointer()} total bytes`);
            resolve();
        });

        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(path.join(process.cwd(), 'client'), false);
        archive.finalize();
    });
}

const updateClientTask = async (questions) => {
    const tasks = new Listr([
        {
            title: `Client files ${questions.saveClientFolder ? "saved" : "not saved"}`,
            task: async (ctx, task) => {
                if (questions.saveClientFolder) {
                    const isThere = fs.existsSync(path.join(process.cwd(), "client"));
                    const getPackageJson = fs.readFileSync(path.join(process.cwd(), "package.json"));
                    const yvrCoreVersion = JSON.parse(getPackageJson).devDependencies["yvr-core"].replace("^", "");

                    try {
                        const { data } = await axios.get("https://registry.npmjs.org/yvr-core/latest");
                        const yvrCoreLatestVersion = data?.version;
                        if (yvrCoreVersion == yvrCoreLatestVersion) {
                            if (isThere) {

                                await archiveClientFolder();

                                const clientPath = path.join(process.cwd(), "client");
                                fs.rmSync(clientPath, { recursive: true });

                                const clientFolders = folders.filter(folder => folder.includes("client"));

                                clientFolders.forEach(element => {
                                    fs.mkdirSync(path.join(process.cwd(), element));
                                });

                                const clientFiles = files.filter(file => file.path.includes("client"));

                                clientFiles.forEach(element => {
                                    const clientFilePath = path.join(process.cwd(), element.path)
                                    fs.writeFileSync(clientFilePath, element.content);
                                });

                                installComponents();

                                task.title = "Client files saved";

                            }
                        } else {
                            task.title = `yvr-core version ${yvrCoreVersion} is outdated. Latest version is ${yvrCoreLatestVersion}`;
                        }
                    } catch (error) {
                        task.title = error.message;
                    }
                } else {
                    task.title = "Client files not saved";
                }
            }
        },
        // {
        //     title: "folders created",
        //     skip: (ctx) => {
        //         if (ctx.packagePath) {
        //             return "folders already exists"
        //         }
        //     },
        //     task: (ctx) => {
        //         folders.forEach(element => {
        //             fs.mkdirSync(path.join(process.cwd(), element));
        //         });
        //     }
        // },
        // {
        //     title: "files created",
        //     skip: (ctx) => {
        //         if (ctx.packagePath) {
        //             return "client files already exists"
        //         }
        //     },
        //     task: (ctx) => {
        //         files.forEach(element => {
        //             const clientFilePath = path.join(process.cwd(), element.path)
        //             fs.writeFileSync(clientFilePath, element.content);
        //         });
        //     }
        // },


    ])

    tasks.run()
}


export default updateClientTask