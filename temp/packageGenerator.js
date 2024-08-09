const packageGenerator = (projectName, description, author) => {
    const packageFile = {
        name: projectName,
        "version": "1.0.0",
        "description": description,
        "main": "index.js",
        "scripts": {
            "dev": "NODE_ENV=development && nodemon app.js test",
            "start": "NODE_ENV=production && node app.js"
        },
        "keywords": [],
        "author": author,
        "license": "ISC",
        "dependencies": {}
    }

    return packageFile
}

export default packageGenerator