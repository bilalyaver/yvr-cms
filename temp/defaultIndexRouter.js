const defaultIndexRouter = () => {
    const routerIndexFile = `
const router = require('express').Router()


module.exports = router
    `

    return routerIndexFile
}

export default defaultIndexRouter