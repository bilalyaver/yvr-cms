const authCheckGenerator = () => {
    return `
        const isLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }else {
        res.redirect('/dashboard/login');
    }
};

exports.isLogin = isLogin;
    
    `
}

export default authCheckGenerator