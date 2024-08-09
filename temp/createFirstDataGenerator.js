const createFirstDataGenerator = (email, password) => {
    const file = `const { Admin } = require('./models');

const createFirstData = async () => {
    try {
            const admin = await Admin.findOne();
            if (!admin) {
                await Admin.create({
                    email: process.env.EMAIL,
                    password: process.env.PASSWORD
                });
            }
    } catch (error) {
        console.log(error);
    }
};

module.exports = createFirstData; 
    `

    return file
}

export default createFirstDataGenerator