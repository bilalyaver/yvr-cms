import cp from 'child_process'
import log from './log.js'

const packageInstaller = (module) => {
    try {
        require.resolve(module)
    } catch (e) {

        cp.execSync(`npm install ${module}`, () => {
            try {
                return require(module)
            } catch (e) {
                console.log(e)
            }
        })

    }
   log.success(`Installed "${module}"`)

}

export default packageInstaller