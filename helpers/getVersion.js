
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

const getVersion = () => {
    return version
}

export default getVersion;