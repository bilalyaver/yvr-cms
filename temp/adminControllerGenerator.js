const adminControllerGenerator = () => {
    const file = `
const schemas = require('../helpers/schemas');

const passport = require('passport');
require('../config/passportLocal.js')(passport);

const homePage = async (req, res) => {
    const filteredSchemas = schemas.filter(schema => schema.modelName != 'Admin');
    res.render('index', {
        title: 'Home Page',
         schemas: filteredSchemas
    });
}

const loginPage = async (req, res) => {
    res.render('login')
}

const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Hata varsa, hata yönetimini sağla
        }
        if (!user) {
            return res.redirect('/dashboard/login'); // Kullanıcı yoksa login sayfasına yönlendir
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Giriş işlemi sırasında hata olursa
            }
            return res.redirect('/dashboard'); // Başarılı giriş
        });
    })(req, res, next);
};



module.exports = {
    homePage,
    loginPage,
    login,
}



    `

    return file
}

export default adminControllerGenerator