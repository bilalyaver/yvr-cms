const configFileGenerator = () => {
    const file = `const LocalStrategy = require('passport-local').Strategy;
const { Admin } = require('../helpers/models');

module.exports = function (passport) {
    const options = {
        usernameField: 'email',
        passwordField: 'password'
    };
    passport.use(new LocalStrategy(options, async (email, password, done) => {
        try {
            const foundAdmin = await Admin.findOne({ email }).select('+password');
            if (!foundAdmin) {
                return done(null, false, { message: 'Admin not found' });
            }

            const passwordCheck = await foundAdmin.checkPassword(password);
            if (!passwordCheck) {
                return done(null, false, { message: 'Password is incorrect' });
            } else {
                return done(null, foundAdmin);
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
    try {
        const user = await Admin.findById(id); 
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
};
    `

    return file
}

export default configFileGenerator