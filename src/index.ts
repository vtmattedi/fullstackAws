import { AllInOneServer } from "./app"
import { runSqlFile } from "./app/Model/createdb";
import { assertDotEnv } from "./app/Asserter";
import { UsernameLookup } from "./app/Model/UsernameLookup";

// Load the .env file
if (!assertDotEnv()) {
    console.log('failed to load .env.')
    throw new Error('Failed to load .env')
}
// Makes sure the database is created and load the usernames on the lookup table
const result = runSqlFile('./schema.sql').then(() => {
    console.log('Database loaded successfully');
    UsernameLookup.loadUsernames();
    // Start the server    
    const app = new AllInOneServer().server.listen(process.env.PORT ?? 4500);
    console.log(`Server started on port ${process.env.PORT ?? 4500}`);

}).catch((err) => {
    console.log('Error creating database:', err);
    throw new Error('Failed to run Querry ')
});


