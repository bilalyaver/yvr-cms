const dashboardRouterGenerator = () => {
    return `
const express = require("express");
const adminController = require("../controllers/adminController.js");
const { isLogin } = require("../middlewares/authCheck.js");
const router = express.Router();

router.get("/", isLogin, adminController.homePage);
router.get("/login", adminController.loginPage);
router.post("/login", adminController.login);

module.exports = router;
`
}

export default dashboardRouterGenerator