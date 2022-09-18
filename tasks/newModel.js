import inquirer from 'inquirer';

export default async () => {
    const questions = await inquirer.prompt([
        {
            type: 'input',
            name: 'count',
            message: 'How many fields? | 1 | If you want to add more fields later, you can do it in the model file',
            default: 1,
        }
    ]);



    const fields = [];

    for (let i = 0; i < questions.count; i++) {
        const field = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter field name?',
                validate: function (name) {
                    if (name != null && name != '') {
                        return true;
                    } else {
                        return "Please enter field name";
                    }
                }
            },
            {
                type: 'list',
                name: 'type',
                message: 'Enter field type?',
                choices: ['String', 'Number', 'Date', 'Boolean', 'Object', 'Array'],
            },
            {
                type: 'input',
                name: 'default',
                message: 'Enter field default value?',
            },
            {
                type: 'confirm',
                name: 'required',
                message: 'Is required?',
            },
        ]);



        fields.push(field);

    }





    return fields;
};