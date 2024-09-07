const nextConfigGenerator = (questions) => {
    return `/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  env: {
    API_KEY: 'temporaryKey',
    IMAGE_PATH: 'http://localhost:${questions.port}/images',
  }
}

export default nextConfig;`
}

export default nextConfigGenerator