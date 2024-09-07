const envGenerator = (questions) => {
    return `PORT=${questions.port}
DB_URI=mongodb://localhost:27017/${questions.name}
JWT_SECRET=temporarySecret
JWT_EXPIRE=1d
API_KEY=temporaryKey
PUBLIC_URL=http://localhost:8080`
}

export default envGenerator