const envGenerator = (questions) => {
    return `PORT=${questions.port}
DB_URI=mongodb://localhost:27017/${questions.name}
JWT_SECRET_KEY=fgewgrehrehrejhre
JWT_EXPIRE=1d
SESSION_SECRET=fgewgrehrehrejhre
NEXT_PUBLIC_APP_ORIGIN=http://localhost:${questions.port}
API_URL=http://localhost:${questions.port}/api
API_KEY=n7rT14C6DlyYQdJPknwVfZWGkU5m1nYC
PUBLIC_PATH=http://localhost:8080`
}

export default envGenerator