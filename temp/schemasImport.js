const schemasImport = () => {
    return `
const fs = require('fs');
const path = require('path');
const modelsPath = path.resolve(__dirname, '../models');
const modelsSchemaDetails = [];

function convertSchemaTypes(schemaObj) {
    const converted = [];
    for (const [key, value] of Object.entries(schemaObj)) {
        let typeValue;

        if (typeof value.type === 'function') {
            typeValue = value.type.name.toLowerCase();
        } else if (Array.isArray(value.type) && typeof value.type[0] === 'function') {
            // Eğer type bir dizi ve içindeki ilk eleman function ise, adını al
            typeValue = \`[\${value.type[0].name.toLowerCase()}]\`;
        } else {
            typeValue = value.type;
        }

        converted.push({
            fieldName: key,
            ...value,
            type: typeValue  // String olarak dönüştürülen type
        });
    }
    return converted;
}


fs.readdirSync(modelsPath).forEach(file => {
    const modelName = file.split('.')[0];
    const model = require(path.join(modelsPath, file));
    const tempObj = {
        modelName,
        schema: convertSchemaTypes(model.schema.obj)
    };
    
    modelsSchemaDetails.push(tempObj);
});

module.exports = modelsSchemaDetails;
    `;
}

export default schemasImport;