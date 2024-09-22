import inquirer from 'inquirer';
import updateClientTask from '../tasks/updateClientTask.js';

export default async () => {
    const questions = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'saveClientFolder',
            message: 'Save client folder? (y/n)',
        }
    ]);

    updateClientTask(questions);



    return questions;
};