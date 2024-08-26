import inquirer from 'inquirer';
import newProjectTask from '../tasks/newProjectTask.js';

export default async () => {
    const questions = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter project name?',
            validate: function (name) {
                if (name != null && name != '') {
                    if (name.includes(' ')) {
                        return 'Please enter a valid project name';
                    }
                    return true;
                } else {

                    return "Please enter project name";
                }
            },
            default: 'test'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter project description?',
        },
        {
            type: 'input',
            name: 'author',
            message: 'Enter project author?',
        },
        {
            type: 'input',
            name: 'port',
            message: 'Enter project port?',
            default: 8080
        },
        {
            type: 'list',
            name: 'db',
            message: 'Select database?',
            choices: ['mongodb'],
            default: 'mongodb'
        }
    ]);



    newProjectTask(questions);


    return questions;
};