<h1 align="center" style="font-weight: Bold">:desktop_computer: Fullstack posts application </h1>

This is a project that showcases a fullstack application that integrates a MVC pattern, a AWS RDS database and a React front-end.

The app, is a network example where you can check a global feed in real time, post content, edit content and see other users posts. It implements JWT authentication with session based refresh tokens and access tokens.

This project is currently been host on render you can check out the project deployed [Here](https://fullstackaws.onrender.com/).

Check out the front-end Project [Here](https://github.com/vtmattedi/fullstackAwsfront).

<description>
<summary>*note*</summary>
The free tier on render makes the server spin down after beeing inactive so I made little python script that constantly pings the server so it is always readly available (if the server is not up it takes up to a few minutes to get it running again) however, to save a few minutes on render I shut the script down between 1 and 5 am (GMT -3), therefore it is expected for the web page to take a long time on first access during those hours. 
</description>

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

```bash
//Install the used modules
npm install
```
Then
```bash
npx tsx ./src/index.ts //Run the server.
```
Or 
```bash
 npx nodemon //Live test Server.
```
you can also use:
```bash
npm run start:prod //Starts the app.
npm run start:dev  //Starts the live server.
```
to run those commands 

## Multiple servers
The original idea was to have mulitple servers: one only for authentication, one to interact with most of the database and one to serve the front-end. That would open the possibility of scaling the servers separately, the usage of JWT makes this possible if we have the same `JWT_SECRET`. However, due to constrains on the free host solution.

## :round_pushpin:Endpoints
* <details>
<summary>*Authentication Routes*</summary>

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/auth/signup```
- **Expects**: User signup details in the request body.
- **Returns**: Status indicating success or failure of the signup process.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**201**|```{message: string}```|Signup successful|
    |**400**|```{message: string}```|Invalid input|
    |**500**|```{message: string}```|Internal server error|

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/auth/login```
- **Expects**: Body with email and password.
- **Returns**: 200 if successful, or an error if input is invalid or credentials are incorrect.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```{access token: string, uid: number}```|Login successful|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|
    |**400**|```{message: string}```|Invalid input|

#### ![Static Badge](https://img.shields.io/badge/DELETE-red?style=plastic) ```/auth/logout```
- **Expects**: Valid access token in headers.
- **Returns**: Status of the logout operation.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```{message: string}```|Logout successful|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/auth/token```
- **Expects**: Body with refresh token.
- **Returns**: A new access token.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```{access token: string}```|Token refresh successful|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|
</details>
<details>
<summary>Data Api Routes</summary>

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/newposts```
- **Expects**: Valid access token in headers.
- **Returns**: A list of new posts.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```[{post}, ...]```|List of new posts|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/api/newpost```
- **Expects**: Post content in the body.
- **Returns**: Status of post creation.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**201**|```{post: object}```|Post created|
    |**400**|```{message: string}```|Invalid input|
    |**500**|```{message: string}```|Internal server error|

#### ![Static Badge](https://img.shields.io/badge/PUT-orange?style=plastic) ```/api/editpost```
- **Expects**: Post content and post ID in the body.
- **Returns**: Status of the edit operation.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```{post: object}```|Post updated|
    |**400**|```{message: string}```|Invalid input|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|

#### ![Static Badge](https://img.shields.io/badge/DELETE-red?style=plastic) ```/api/deletepost```
- **Expects**: Post ID in the body.
- **Returns**: Status of the delete operation.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```{message: string}```|Post deleted|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/posts```
- **Expects**: Valid access token in headers.
- **Returns**: Posts created by the authenticated user.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```[{post}, ...]```|List of user posts|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/allposts```
- **Expects**: Valid access token in headers.
- **Returns**: All posts available in the system.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```[{post}, ...]```|List of all posts|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|

## User Routes

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/dashboard```
- **Expects**: Valid access token in headers.
- **Returns**: Dashboard data for the authenticated user.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```{user: object}```|User data fetched|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/api/edituser```
- **Expects**: User data in the body to update the profile.
- **Returns**: Status of the update operation.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```{user: object}```|User updated|
    |**400**|```{message: string}```|Invalid input|
    |**401**|```{message: string}```|Unauthorized|
    |**500**|```{message: string}```|Internal server error|

## Health Check

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/healtz```
- **Returns**: `200` status with "OK" for health check of the server.

    |**Code** |**Body**|**Description**|
    |:-------:|:--------:|:-------------:|
    |**200**|```"OK"```|Health check successful|

</details>

