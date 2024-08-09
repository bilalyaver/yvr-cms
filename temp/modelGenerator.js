const modelGenerator = (capitalizedModelName, currentModelFields) => {
    const modelTemplate = `const mongoose = require('mongoose');

const ${capitalizedModelName}Schema = new mongoose.Schema(
    ${currentModelFields}, { timestamps: true });
    
const ${capitalizedModelName} = mongoose.model("${capitalizedModelName}", ${capitalizedModelName}Schema);
    
module.exports = ${capitalizedModelName};
`;

    return modelTemplate;
}


export default modelGenerator