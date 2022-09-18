const routerGenerator = (modelName) => {
    return `const express = require("express");
const ${modelName}Controller = require("../controllers/${modelName}Controller.js");
const router = express.Router();

router.get("/", ${modelName}Controller.getAll);
router.get("/:id", ${modelName}Controller.getById);
router.post("/", ${modelName}Controller.create);
router.put("/:id", ${modelName}Controller.update);
router.delete("/:id", ${modelName}Controller.remove);

module.exports = router;`
}

export default routerGenerator