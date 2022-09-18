const dbGenerator = () => {
    const dbFile = `
const mongoose = require("mongoose")

const connectToDb = async () => {
  try {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connection Succeed');
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectToDb;
    `

    return dbFile
}

export default dbGenerator