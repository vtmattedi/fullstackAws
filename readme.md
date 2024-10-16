# Fullstack posts application 

This is a project that showcases a fullstack application that integrates a MVC pattern, a AWS RDS database and a React front-end.

The app, is a network example where you can check a global feed in real time, post content, edit content and see other users posts. It implements JWT authentication with session based refresh tokens and access tokens.

This project is currently been host on render you can check out the project deployed [Here](https://fullstackaws.onrender.com/).

Check out the front-end Project [Here](https://github.com/vtmattedi/fullstackAwsfront).

## Security
The authentication method used on this project are based on two steps:

 * a JWT access token using the `Bearer` header, used on every request to the server.
 * a JWT refresh token, used to log in, log out, delete account and get a new refresh token.

The token contains only the user ID (uid) for whom it was issued.

### Authorization Logic 
 * At login or after sign up, the user is issued a access token and a cookie is set with a refresh token (httponly, secure).
 * The user must provide the acess token on every api call using the 'Bearer' header, but there is no need to send the refresh token cookie.
 * The user can solicitate a new access token using the refresh token cookie.
 * For logout/delete account the user must provide the cookie.
 * Once the user logs out the refresh token is invalidated. If the user chooses to logout from everywhere, the application invalidates all refresh tokens issued to that account.
 * Once the refresh token expires the user must log in again.


## Front-end

The fornt-end of the project was devolped in React and I do not need the whole project here, only the build folder. Ideally I would have it as a sub-module and during the deployment I would build the project
and then serve the build folder. Unfortunately, render's free tier have limited pipeline usage. Therefore, at least for now i am manually building the front-end and copying it over to here.

### Session on the front-end
 On the front-end project, there is two hooks:
 * useAxiosCred 
 * useAxiosJwt

When the useAxiosJwt is used, in case of failure due to code 401: not authorized, it will automaticaly request a new token and retry the request.

For more information about the front-end app check its own [repository]("https://www.github.com/vtmattedi/fullstackawsfront").

## Running the app:

### Required Files
* **.env:** File with you enviroment secrets check the [example](/.example.env)
* **schema.sql:** The sql commands to make sure the databates exists and contains the proper tables.

Both of those files are expected to be on root folder of the project.


With those files created run:

```javascript
//Install the used modules
npm install
```
Then
```javascript
npx tsx ./src/index.ts //Run the server.
```
Or 
```javascript
 npx nodemon //Live test Server.
```
you can also use:
```javascript
npm run start:prod //Starts the app.
npm run start:dev  //Starts the live server.
```
to run those commands 

## Multiple servers
The original idea was to have mulitple servers: one only for authentication, one to interact with most of the database and one to serve the front-end. That would open the possibility of scaling the servers separately, the usage of JWT makes this possible if we have the same `JWT_SECRET`. However, due to constrains on the free host solution.

## Endpoints

<details> 
<summary><b>Auth Apis:</b></summary>

#### /auth/login
- /auth/login 
    * expects: Body with email and password
    * Returns: 200 if successful or an error if failed to provide an input or no such credentials exists

    |**Code**                            |**Body**                                              |**Description**          |
    |--------------------------------|--------------------------------------------------|---------------------|
    |<p style="Color: green; font-weight: bold">200</p> |<b>access token</b>: string<br/><b>uid</b>: number|Login succesful      |
    |<p style="Color: red; font-weight: bold">401</p>   |<b>message</b>: string                              |Unauthorized         |
    |<p style="Color: red; font-weight: bold">500</p>   |<b>message</b>: string                              |Internal server error|
    |<p style="Color: red; font-weight: bold">400</p>   |<b>message</b>: string                              |Invalid input        |



    <table>
        <thead>
            <tr>
                <th>Code</th>
                <th>Body</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="color: green; font-weight: bold">200</td>
                <td><b>access token</b>: string<br/><b>uid</b>: number</td>
                <td>Login successful</td>
            </tr>
            <tr>
                <td style="color: red; font-weight: bold">401</td>
                <td><b>message</b>: string</td>
                <td>Unauthorized</td>
            </tr>
            <tr>
                <td style="color: red; font-weight: bold">500</td>
                <td><b>message</b>: string</td>
                <td>Internal server error</td>
            </tr>
            <tr>
                <td style="color: red; font-weight: bold">400</td>
                <td><b>message</b>: string</td>
                <td>Invalid input</td>
            </tr>
        </tbody>
    </table>


- /auth/signup
    * expects: Body with email, username and password:
    * returns: 201 if successful or an error if there is already an user with that email, or there are restrictions on the password/email or username chosen
- /auth/logout
    * expects: a refresh token cookie
    * returns: 200 and clears the cookie if successful or a code error if the refresh token is not valid
- /auth/logoutEveryone
    * expects: A refresh token cookie.
    * returns: 200 and clears all refresh tokens associated with the user id from the database, so all the session of that user will not be valid.

- /auth/token
    * expects: A refresh token cookie.
    * returns: A access token and the user id of the refresh token

- /auth/deleteaccount
    * expects: A refresh token cookie.
    * returns: 200 and deletes all session cookies that are associated with the user id of the requester. Also deletes the account from the database. 
</details>

<details>
<summary><b>Data Apis:</b></summary>
    - /api/dashboard

</details>

<details>
<summary><b>Data Apis:</b></summary>
    for all other requests the response is either a static file or file the file is not found and the request does not match any of the other types it will serve the index.html file of the react build.
</details>