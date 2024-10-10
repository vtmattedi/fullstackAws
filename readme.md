# Fullstack posts application

Full stack example application written in typescript using AWS RDS with jwt authentication.
Check the project deployed [Here](https://fullstackaws.onrender.com/).

Check the frontend Project [Here](https://github.com/vtmattedi/fullstackAwsfront).

### Security

It implements JWT, access and refresh tokens using httpOnly and secure cookies.

### Running the app:

## Required Files
* .env with:
    * JWT_SECRET
    * JWT_REFRESH_SECRET 
    * SCRYPT_SALT 
    * FRONTEND_PORT *(optional)*
    * BACKEND_PORT  *(optional)*
    * AUTH_PORT  *(optional)*
    * DB_PWD 
    * DB_USER 
    * DB_HOST

* schema.sql with the db setup querries

With those files created run:

```javascript
npm install
npx tsx ./src/index.ts
```
or 
```javascript
// Live test Server 
npx nodemon
```
