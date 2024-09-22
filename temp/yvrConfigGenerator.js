import getVersion from "../helpers/getVersion.js"



const yvrConfigGenerator = () => {
    const yvrConfigFile = {
        "version": getVersion(),
        "routes": {
          "blog": {
            "enabled": true,
            "authRequired": false,
            "corsEnabled": false
          }
        },
        "swagger": {
          "enabled": true,
          "authRequired": false,
          "corsEnabled": false
        }
      }

    return yvrConfigFile
}

export default yvrConfigGenerator