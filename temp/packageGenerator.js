const packageGenerator = (projectName, description, author) => {
    const packageFile = {
        name: projectName,
        "version": "1.0.0",
        "description": description,
        "main": "index.js",
        "scripts": {
            "dev": "cross-env NODE_ENV=development nodemon app.js",
            "start": "cross-env NODE_ENV=production node app.js",
            "build": "next build ./client"
        },
        "keywords": [],
        "author": author,
        "license": "ISC",
        "dependencies": {}
    }

    return packageFile
}

export default packageGenerator