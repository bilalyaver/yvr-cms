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
            }
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
            name: 'email',
            message: 'Enter dashboard email?',
            validate: function (email) {
                if (email != null && email != '') {
                    if (email.includes('@')) {
                        return true;
                    }
                    return 'Please enter a valid email';
                } else {
                    return 'Please enter email';
                }
            }
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter dashboard password?',
            validate: function (password) {
                if (password != null && password != '') {
                    return true;
                } else {
                    return 'Please enter password';
                }
            }
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