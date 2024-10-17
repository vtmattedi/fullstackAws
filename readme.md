<h1 align="center" style="font-weight: Bold">:desktop_computer: Fullstack posts application </h1>

This is a project that showcases a fullstack application that integrates a MVC pattern, a AWS RDS database and a React front-end.

The app, is a network example where you can check a global feed in real time, post content, edit content and see other users posts. It implements JWT authentication with session based refresh tokens and access tokens.

This project is currently been host on render you can check out the project deployed [Here](https://fullstackaws.onrender.com/).

Check out the front-end Project [Here](https://github.com/vtmattedi/fullstackAwsfront).

<details><summary >Note of website availability on render</summary>

---

The free tier on render makes the server spin down after beeing inactive so I made little python script that constantly pings the server so it is always readly available (if the server is not up it takes up to a few minutes to get it running again) however, to save a few minutes on render I shut the script down between 1 and 5 am (GMT -3), therefore it is expected for the web page to take a long time on first access during those hours.

</details>

## 🔏 Security

The authentication method used on this project are based on two steps:

* a JWT access token using the `Bearer` header, used on every request to the server.
* a JWT refresh token, used to log in, log out, delete account and get a new refresh token.

The token contains only the user ID (uid) for whom it was issued.

### 🔓Authorization Logic:

* At login or after sign up, the user is issued a access token and a cookie is set with a refresh token (httponly, secure).
* The user must provide the acess token on every api call using the 'Bearer' header, but there is no need to send the refresh token cookie.
* The user can solicitate a new access token using the refresh token cookie.
* For logout/delete account the user must provide the cookie.
* Once the user logs out the refresh token is invalidated. If the user chooses to logout from everywhere, the application invalidates all refresh tokens issued to that account.
* Once the refresh token expires the user must log in again.

## 🖌️Front-end

The fornt-end of the project was devolped in React and I do not need the whole project here, only the build folder. Ideally I would have it as a sub-module and during the deployment I would build the project
and then serve the build folder. Unfortunately, render's free tier have limited pipeline usage. Therefore, at least for now i am manually building the front-end and copying it over to here.

### ⏲️ Session on the front-end

 On the front-end project, there is two hooks:

* useAxiosCred
* useAxiosJwt

When the useAxiosJwt is used, in case of failure due to code 401: not authorized, it will automaticaly request a new token and retry the request.

For more information about the front-end app check its own [repository]().

## 🖱️Running the app:

### 🗃️ Required Files

* **.env:** File with you enviroment secrets check the [example](/.example.env)
* **schema.sql:** The sql commands to make sure the databates exists and contains the proper tables.

Both of those files are expected to be on root folder of the project.

With those files created run:

```JavaScript
//Install the used modules
npm install
```

Then

```JavaScript
npx tsx ./src/index.ts //Run the server.
```

Or

```JavaScript
 npx nodemon //Live test Server.
```

you can also use:

```JavaScript
npm run start:prod //Starts the app.
npm run start:dev  //Starts the live server.
```

to run those commands

## 💠Multiple servers

The original idea was to have mulitple servers: one only for authentication, one to interact with most of the database and one to serve the front-end. That would open the possibility of scaling the servers separately, the usage of JWT makes this possible if we have the same `JWT_SECRET`. However, due to constrains on the free host solution, I have opted for a single server solution.

## 📍Endpoints

> ### Authentication Routes

<br>
<div style="display: flex; align-items: center;">
<img src = "https://img.shields.io/badge/POST-blue?style=plastic"
style="margin: 5px" alt= "static badge">
<code>/auth/signup</code>
</div>
<br>
<details>
<summary><b>Table</b></summary>
<hr>
<table>
    <thead>
        <tr style="align-text: center;">
            <th>Code</th>
            <th>Body</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="color: green; font-weight: bold"> 201</td>
            <td><code>{accessToken: string, uid: int}</code></td>
            <td>Signup successful, set refreshToken cookie.</td>
        </tr>
        <tr>
            <td style="color: red; font-weight: bold"> 400</td>
            <td><code>{message: string}</code></td>
            <td>Invalid input.</td>
        </tr>
        <tr>
           <td style="color: red; font-weight: bold"> 500</td>
            <td><code>{message: string}</code></td>
            <td>Internal server error.</td>
        </tr>
    </tbody>
</table>
</details>

- **Expects**: User signup details in the request body.
- **Returns**: Status indicating success or failure of the signup process.

><details>
> <summary><i>Check the return table</i></summary>
>
>  |**Code** |**Body**|**Description**|
>  |:-------:|:--------:|:-------------:|
>  |**201**|```{accessToken: string, uid: int}```|Signup successful, set refreshToken cookie.|
>  |**400**|```{message: string}```|Invalid input.|
>  |**500**|```{message: string}```|Internal server error.|

</details>
<hr>

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/auth/login```
- **Expects**: Body with email and password.
- **Returns**: 200 if successful, or an error if input is invalid or credentials are incorrect.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```{access token: string, uid: number}```|Login successful|
  |**400**|```{message: string}```|Invalid input|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>

#### ![Static Badge](https://img.shields.io/badge/DELETE-red?style=plastic) ```/auth/logout```
- **Expects**: Valid access token in headers.
- **Returns**: Status of the logout operation.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```{message: string}```|Logout successful|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/auth/token```
- **Expects**: Body with refresh token.
- **Returns**: A new access token.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```{access token: string}```|Token refresh successful|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>



### API Routes

<details>
  <summary>See Posts Routes</summary>

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/newposts```
- **Expects**: Valid access token in headers.
- **Returns**: An array of new posts and an array of deleted post ids.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```{posts: Array<Posts>, deleted: Array<number>}```|List of new posts after the requested id and the deleted posts in the last 10 minutes|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/api/newpost```
- **Expects**: Post content in the body.
- **Returns**: Status of post creation.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**201**|```{post: object}```|Post created|
  |**400**|```{message: string}```|Invalid input|
  |**500**|```{message: string}```|Internal server error|

</details>

#### ![Static Badge](https://img.shields.io/badge/PUT-orange?style=plastic) ```/api/editpost```
- **Expects**: Post content and post ID in the body.
- **Returns**: Status of the edit operation.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```{post: object}```|Post updated|
  |**400**|```{message: string}```|Invalid input|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>

#### ![Static Badge](https://img.shields.io/badge/DELETE-red?style=plastic) ```/api/deletepost```
- **Expects**: Post ID in the body.
- **Returns**: Status of the delete operation.

<details>
  <summary><i>Check the return table</i></summary>
  
  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```{message: string}```|Post deleted|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/posts```
- **Expects**: Valid access token in headers.
- **Returns**: Posts created by the authenticated user.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```[{post}, ...]```|List of user posts|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/allposts```
- **Expects**: Valid access token in headers.
- **Returns**: All posts available in the system.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```[{post}, ...]```|List of all posts|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>
</details>

## User Routes

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/dashboard```
- **Expects**: Valid access token in headers.
- **Returns**: Dashboard data for the authenticated user.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```{user: object}```|User data fetched|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>

#### ![Static Badge](https://img.shields.io/badge/POST-blue?style=plastic) ```/api/edituser```
- **Expects**: User data in the body to update the profile.
- **Returns**: Status of the update operation.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```{user: object}```|User updated|
  |**400**|```{message: string}```|Invalid input|
  |**401**|```{message: string}```|Unauthorized|
  |**500**|```{message: string}```|Internal server error|

</details>

#### Other Routes

<details>
  <summary><b>See Others</b></summary>

#### ![Static Badge](https://img.shields.io/badge/GET-green?style=plastic) ```/api/healtz```
- **Returns**: `200` status with "OK" for health check of the server.

<details>
  <summary><i>Check the return table</i></summary>

  |**Code** |**Body**|**Description**|
  |:-------:|:--------:|:-------------:|
  |**200**|```"OK"```|Health check successful|

</details>
</details>

---
