import { BackendServer, AuthServer, FrontendServer, AllInOneServer } from "./app"
import { runSqlFile } from "./app/Model/createdb";
import { assertDotEnv } from "./app/Asserter";
import { UsernameLookup } from "./app/Model/UsernameLookup";

if (!assertDotEnv()) {
    console.log('failed to load .env.')
    throw new Error('Failed to load .env')
}
const result = runSqlFile('./schema.sql').then(() => {
    UsernameLookup.loadUsernames();
});

if (!result) {
    console.log('Error creating database');
    throw new Error('Failed to run Querry ')
}
else
    console.log('Database loaded successfully');

const app = new AllInOneServer().server.listen(process.env.PORT??4500);

