import { BackendServer, AuthServer, FrontendServer } from "./app"
import { runSqlFile } from "./app/Model/createdb";
import { assertDotEnv } from "./app/Asserter";

if (!assertDotEnv()) {
    console.log('failed to load .env.')
    throw new Error('Failed to load .env')
}
const result = runSqlFile('./schema.sql');
if (!result) {
    console.log('Error creating database');
    throw new Error('Failed to run Querry ')
}
else
    console.log('Database loaded successfully');
const url = 'https://localhost:'
console.log("starting Auth server on " + url + process.env.AUTH_PORT)
const authServer = new AuthServer().server.listen(process.env.AUTH_PORT);
console.log("starting backend server on " + url + process.env.BACKEND_PORT)
const backendServer = new BackendServer().server.listen(process.env.BACKEND_PORT);
console.log("starting frontend server on " + url + process.env.FRONTEND_PORT)
const frontendServer = new FrontendServer().server.listen(process.env.FRONTEND_PORT);


