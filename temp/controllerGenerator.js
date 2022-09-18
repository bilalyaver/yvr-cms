const controllerGenerator = (name, capitalizedModelName) => {
    const controller = `const {${capitalizedModelName}} = require('../helpers/models');


module.exports.getAll = async (req, res, next) => {
    try {
        const ${name.toLowerCase()} = await ${capitalizedModelName}.find();
        res.status(200).json({
            success: true,
            count: ${name.toLowerCase()}.length,
            data: ${name.toLowerCase()}
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getById = async (req, res, next) => {
    try {
        const ${name.toLowerCase()} = await ${capitalizedModelName}.findById(req.params.id);
        if (!${name.toLowerCase()}) {
            return res.status(404).json({
                success: false,
                error: 'No ${name.toLowerCase()} found'
            });
        }
        res.status(200).json({
            success: true,
            data: ${name.toLowerCase()}
        });
    } catch (err) {
        next(err);
    }
};

module.exports.create = async (req, res, next) => {
    
    try {
        const ${name.toLowerCase()} = await ${capitalizedModelName}.create(req.body);
        res.status(201).json({
            success: true,
            data: ${name.toLowerCase()}
        });
    } catch (err) {
        next(err);
    }
};

module.exports.update = async (req, res, next) => {
    
    try {
        const ${name.toLowerCase()} = await ${capitalizedModelName}.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!${name.toLowerCase()}) {
            return res.status(404).json({
                success: false,
                error: 'No ${name.toLowerCase()} found'
            });
        }
        res.status(200).json({
            success: true,
            data: ${name.toLowerCase()}
        });
    } catch (err) {
        next(err);
    }
};

module.exports.remove = async (req, res, next) => {
    try {
        const ${name.toLowerCase()} = await ${capitalizedModelName}.findByIdAndDelete(req.params.id);
        if (!${name.toLowerCase()}) {
            return res.status(404).json({
                success: false,
                error: 'No ${name.toLowerCase()} found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};`;
    return controller;
}


export default controllerGenerator