const packageGenerator = (projectName, description, author) => {
    const packageFile = {
        name: projectName,
        "version": "1.0.0",
        "description": description,
        "main": "app.js",
        "scripts": {
            "dev": "yvr dev",
            "start": "yvr start",
            "build": "yvr build"
        },
        "keywords": [],
        "author": author,
        "license": "ISC",
        "dependencies": {}
    }

    return packageFile
}

export default packageGenerator