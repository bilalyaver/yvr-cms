import log from "./log.js";
import fs from "fs";
import List from "listr"
import capitalizeFirstLetter from "../helpers/capitalizeFirstLetter.js";
import modelGenerator from "../temp/modelGenerator.js";
import routerGenerator from "../temp/routerGenerator.js";
import routerIndexGenerator from "../temp/routerIndexGenerator.js";
import controllerGenerator from "../temp/controllerGenerator.js";
import newModel from "../tasks/newModel.js";

const createModel = async (input) => {
    const modelName = input[0];
    const capitalizedModelName = capitalizeFirstLetter(input[0]);
    try {

        // const isThereRouter = fs.existsSync(`./src/models/${capitalizedModelName}.js`)

        // if (isThereRouter) {
        //     log.warning(`Model already exists`);
        //     return
        // }

        const modelFields = await newModel()

        const currentModelFields = {}
        modelFields.forEach(item => {
            currentModelFields[item.name] = {
                type: item.type,
                default: item.default,
                required: item.required
            }

        });


        const tasks = new List([
            {
                title: `Creating model`,
                task: () => {
                    return new List([
                        {
                            title: `Creating model file`,
                            task: () => {
                                fs.writeFileSync(`./src/models/${capitalizedModelName}.js`, modelGenerator(capitalizedModelName, JSON.stringify(currentModelFields, null, 4)));
                            }
                        },
                        {
                            title: `Creating route file`,
                            task: () => {
                                fs.writeFileSync(`./src/routers/${modelName}.js`, routerGenerator(modelName));
                            }
                        },
                        {
                            title: `Updating router index file`,
                            task: () => {
                                fs.writeFileSync(`./src/routers/index.js`, routerIndexGenerator(modelName));
                            }
                        },
                        {
                            title: `Creating controller file`,
                            task: () => {
                                fs.writeFileSync(`./src/controllers/${modelName}Controller.js`, controllerGenerator(modelName, capitalizedModelName));
                            }
                        }
                    ])
                }
            }
        ])

        tasks.run();

        log.success(`Router created successfully!`);

    } catch (err) {
        log.error(err);
    }
    //console.log(input);


}

export default createModel