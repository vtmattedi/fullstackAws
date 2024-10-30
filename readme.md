<h1 align="center" style="font-weight: Bold">:desktop_computer: Fullstack posts application </h1>

This is a project that showcases a fullstack application that integrates a MVC pattern, a ~~AWS~~ Neon RDS database and a React front-end.

<div style="display:flex; flex-direction: row; align-content: center; gap: 5px; align-items: center;">
<img src="https://img.shields.io/website.svg?down_color=red&down_message=down&up_color=green&up_message=up&url=http%3A%2F%2Fcv.lbesson.qc.to" align=center></img>
<p align=center>
This project is currently been host on render you can check out the project deployed
<a href="https://fullstackaws.onrender.com/">Here</a>.</p>
</div>

The app, is a network example where you can check a global feed in real time, post content, edit content and see other users posts. It implements JWT authentication with session based refresh tokens and access tokens. It connects to a postgress database (currently using neon).

It originally used AWS and its MySQL database however, the only options was to have a ipv4 to access that Database and it is not cover under the free tier, so after a month I switched to neon's postgress solution. 

Some of the feature you will find on this project:

- Create/Edit/Delete posts.
- Create and delete Account.
- Edit your username.
- Check other Users and thier posts.
- See a global feed of all posts in real time.
- Secure session with JWT tokens.
- Logout from everywhere feature.
- ~~AWS integration, using MySQL RDS service.~~
- Neon Postgress DB
- Fully responsive website. (Check it out on your phone and on desktop).
- Light/Dark Theme that persists per user per device.

Check out the front-end project [Here](https://github.com/vtmattedi/fullstackAwsfront).

<details><summary ><i>Note of website availability on render.</i></summary>

---

The free tier on render makes the server spin down after beeing inactive so I made little python script that constantly pings the server so it is always readly available (if the server is not up it takes up to a few minutes to get it running again) however, to save a few minutes on render I shut the script down between 1 and 5 am (GMT -3), therefore it is expected for the web page to take a long time on first access during those hours.

</details>

## 🔏 Security

The authentication method used on this project are based on two steps:

* a JWT access token using the `Bearer` header, used on every request to the server.
* a JWT refresh token, used to log in, log out, delete account and get a new access token.

The token contains only the user ID (uid) for whom it was issued.

### 🔓Authorization Logic:

* At login or after sign up, the user is issued an access token and a cookie is set with a refresh token (httponly, secure).
* The user must provide the access token on every api call using the 'Bearer' header, but there is no need to send the refresh token cookie.
* The access token is set to be only 15 seconds.
* The user can solicitate a new access token using the refresh token cookie.
* For logout/delete account the user must provide the cookie.
* Once the user logs out the refresh token is invalidated. If the user chooses to logout from everywhere, the application invalidates all refresh tokens issued to that account.
* Once the refresh token expires the user must log in again.

## 🖌️Front-end

The front-end of the project was devolped in React and I do not need the whole project here, only the build folder. Ideally I would have it as a sub-module and during the deployment I would build the project
and then serve the build folder. Unfortunately, render's free tier have limited pipeline usage. Therefore, at least for now i am manually building the front-end and copying it over to here.

### ⏲️ Session on the front-end

 On the front-end project, there is two hooks:

* useAxiosCred
* useAxiosJwt

When the useAxiosJwt is used, in case of failure due to code 401: not authorized, it will automaticaly request a new token and retry the request.

For more information about the front-end app check its own [repository]().

## 🖱️Running the app:

### 🗃️ Required Files

* **.env:** File with you enviroment secrets check the [example](/.example.env).
* **schema.sql:** The sql commands to make sure the databates exists and contains the proper tables.

Both of those files are expected to be on root folder of the project.

With those files created run:

```JavaScript
//Install the required modules
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

You can also use:

```JavaScript
npm run start:prod //Starts the app.
npm run start:dev  //Starts the live server.
```

## 💠Multiple servers

The original idea was to have mulitple servers: one only for authentication, one to interact with most of the database and one to serve the front-end. That would open the possibility of scaling the servers separately. The usage of JWT makes this possible if we have the same `JWT_SECRET`. However, due to constrains on the free host solution, I have opted for a single server solution.

## 📍Endpoints

<details open>
<summary><b>Authentication</b></summary>

---

<details open>
<summary>
<picture><img  src="https://img.shields.io/badge/POST-blue?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/auth/signup</code>
</summary>

- **Expects**: User signup details in the request body (email, username, password).
- **Returns**: Status indicating success or failure of the signup process. If successful, the proper tokens and user id.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{201}}$</td>
>             <td><code>{accessToken: string, uid: int}</code></td>
>             <td>Signup successful, set refreshToken cookie.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{400}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Invalid input. the <code>message</code> will contain information about what is wrong with the input.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{409}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Email already registred to an account.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img  src="https://img.shields.io/badge/POST-blue?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/auth/login</code>
</summary>

- **Expects**: User login details in the request body (email, password).
- **Returns**: Status indicating success or failure of the login process. If successful, the proper tokens and user id.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{accessToken: string, uid: int}</code></td>
>             <td>Login successful, set refreshToken cookie.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{401}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Unauthorized, invalid credentials.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img  src="https://img.shields.io/badge/DELETE-red?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/auth/logout</code>
</summary>

- **Expects**: Cookie with the refresh token.
- **Returns**: Status indicating success or failure of the logout process.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>              <td><code>{message: string}</code></td>
>             <td>Logout successful, refreshToken cookie clear.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{401}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Invalid refreshToken cookie.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img  src="https://img.shields.io/badge/DELETE-red?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/auth/logoutEverywhere</code>
</summary>

- **Expects**: Cookie with the refresh token.
- **Returns**: Status indicating success or failure of the logout process for all sessions.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>               <td><code>{message: string, terminated: int}</code></td>
>             <td>Logout successful from all sessions, all refresh tokens with the token's uid deleted from the valid database.<code>terminated</code> indicates how many tokens were invalidated.</td>. refreshToken cookie cleared.
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{401}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Invalid refresh token.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img  src="https://img.shields.io/badge/POST-blue?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/auth/tokens</code>
</summary>

- **Expects**: Cookie with the refresh token.
- **Returns**: New access token if refresh is successful.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{accessToken: string, uid: int}</code></td>
>             <td>New access token issued.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{401}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Unauthorized, invalid refresh token.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img  src="https://img.shields.io/badge/DELETE-red?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/auth/deleteAccount</code>
</summary>

- **Expects**: Cookie with the refresh token.
- **Returns**: Status indicating success or failure of the account deletion process.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Account deletion successful.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{401}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Unauthorized, invalid credentials.</td>
>         </tr>
>    <tr>
>             <td>${\color{red}\textbf{403}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Forbidden, trying to delete an account that is not the same as the refresh token or protected accounts.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details></details>
<br>
<details >
<summary><b>Data API</b></summary>
<br>
<p>All Routes on this list (<code>/api/*</code>) are authenticated via a <a href="./src/app/Controllers/authMiddleware.ts">middleware</a> and require an access token. Failure to provide a valid token in the request header, will result in the following response:
</p>

<table>
<thead>
</thead>
<tbody>
<tr>
   <tr style="align-text: center;">
        <th>Code</th>
        <th>Body</th>
        <th>Description</th>
    </tr>
<td>${\color{red}\textbf{401}}$</td>
<td><code>{error: string}</code></td>
<td>Not Authenticated</td>
</tr>
</tbody>
</table>

<hr><details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/allposts</code>
</summary>

- **Expects**: Size of the posts array in the URL parameters (optional, default = 100).
- **Returns**: Array of the posts from all users.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{posts: Array< Posts > }</code></td>
>             <td>Array of posts objects.</td>
>         </tr>
>         <tr>
>             <td>${\color{green}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal Server Error</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>
<details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/posts/:id</code>
</summary>

- **Expects**:

  * User ID in the URL path (optional, if missing will default to user's id. Anything other than positive numbers are treated as missing).
  * Size in the URL parameters (optional, if missing will default to 100.
    Anything other than positive numbers are treated as missing).
- **Returns**: Posts from the target id with a maximum of the requested size.
- **Example**:

  * `<code>`/api/posts?size=100 `</code>` -> Gets the last 100 posts of the uid present in the accessToken.
  * `<code>`/api/posts/10?size=30 `</code>` -> Gets the last 30 posts of user with uid = 10.
  * `<code>`/api/posts/10?size=j `</code>` -> Gets the last 100 posts of user with uid = 10.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{posts: Array< Posts >}</code></td>
>             <td>Array of posts from target id.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/newposts</code>
</summary>

- **Expects**:
  * A `<code>`lastId `</code>` in the URL parameters.
  * A `<code>`targetId `</code>` in the URL parameters. (optional, if not present will be defaulted to all users)
- **Returns**: An array of posts created after the last id provided (from the target id if provided) and an array of the deleted post IDs in the last 10 minutes.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{posts: Array< Posts >, deleted Array< int >}</code></td>
>             <td>New posts since lastId and deleted posts' IDs.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/POST-blue?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/newpost</code>
</summary>

- **Expects**: New post details in the request body (title, content).
- **Returns**: Status indicating success or failure of the post creation process.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{201}}$</td>
>             <td><code>{message:string, postId: int}</code></td>
>             <td>New post created successfully.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{400}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Invalid input.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/PUT-orange?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/editpost</code>
</summary>

- **Expects**: Updated post details in the request body ( postid, title, content).
- **Returns**: Status code indicating success or failure of the post deletion process and a status message.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Post updated successfully.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{400}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Invalid input. Either title or content are empty.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{403}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Unauthorized, token's ID does not match post owners.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{404}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Post not found (post id not present in the database).</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/DELETE-red?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/deletepost</code>
</summary>

- **Expects**: Post ID in the URL parameters.
- **Returns**: Status code indicating success or failure of the post deletion process and a status message.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>              <td><code>{message: string}</code></td>
>             <td>Post deleted successfully.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{403}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Unauthorized, token's ID does not match post's owner.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{404}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Post not found. (Post ID does not exist in the database).</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{message: string}</code></td>
>             <td>Internal server error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/dashboard</code>
</summary>

- **Expects**: `uid` in the request body.
- **Returns**: The user's own information, including username, email, ID, and creation date.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{ user: string, email: string, id: int, created_at: string }</code></td>
>             <td>User information retrieved successfully.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{404}}$</td>
>             <td><code>{ message: 'User not found' }</code></td>
>             <td>User ID not found in the system.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{ message: 'Internal Server Error' }</code></td>
>             <td>Server encountered an error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/POST-blue?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/edituser</code>
</summary>

- **Expects**: `uid` in the request body, along with updated `username` or `email`.
- **Returns**: Status indicating whether the user details were successfully updated.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{ message: string }</code></td>
>             <td>User details successfully updated.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{400}}$</td>
>             <td><code>{ message: string }</code></td>
>             <td>Missing or invalid fields in request body.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{ message: string }</code></td>
>             <td>Server encountered an error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/finduser</code>
</summary>

- **Expects**:  `searchTerm` as a URL parameter.
- **Returns**: An array of users that match the `searchTerm`.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{ user: Array< User > }</code></td>
>             <td> Array of users matching <code>searchTerm</code>. If <code>searchTerm</code> has length < 2 or is empty it will always return an empty array.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>
<details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/userinfo/:id</code>
</summary>

- **Expects**: `userid` as a URL path.
- **Returns**: Information about a specific user if found.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>{ user: User }</code></td>
>             <td>User information retrieved successfully.</td>
>         </tr>
>         <tr>
>             <td>${\color{red}\textbf{404}}$</td>
>             <td><code>{ message: string }</code></td>
>             <td>User ID not found in the system.</td>
>         </tr>
>         <tr>
>            <td>${\color{red}\textbf{500}}$</td>
>             <td><code>{ message: string }</code></td>
>             <td>Server encountered an error.</td>
>         </tr>
>     </tbody>
> </table>
> </details>

<hr>
</details>

</details>

<br>
<details>
<summary><b>Others</b></summary>
<hr>
<details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/api/healthy</code>
</summary>

- **Info**: Health check route.
- **Expects**: Nothing.
- **Returns**: OK if server if live.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code> "Server is live."</code></td>
>             <td>Should always respond with code 200.</td>
>         </tr>    
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/</code>
</summary>

- **Expects**: Nothing.
- **Returns**: The HTML for the index page.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code>HTML file</code></td>
>             <td>Serves the front-end app.</td>
>         </tr>    
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/GET-green?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
<code>/%filename%</code>
</summary>

- **Info**: static files for the front-end app.
- **Expects**: Nothing.
- **Returns**: The file if it exists.

> <details>
> <summary><b><i>Check the response table</b></i></summary>
> <hr>
> <table>
>     <thead>
>         <tr style="align-text: center;">
>             <th>Code</th>
>             <th>Body</th>
>             <th>Description</th>
>         </tr>
>     </thead>
>     <tbody>
>         <tr>
>             <td>${\color{green}\textbf{200}}$</td>
>             <td><code> The file if it exists in the proper folder.</code></td>
>             <td>Should always respond with code 200.</td>
>         </tr>    
>     </tbody>
> </table>
> </details>

<hr>
</details>

<details>
<summary>
<picture><img src="https://img.shields.io/badge/ALL-magenta?style=plastic" style="margin: 5px" alt="static badge" align=center></picture>
Others
</summary>

- **Info**: If the path/method does not match with one of the above nor with a static file's name it will simply server the `ìndex.html` file.

</details>

</details>

## Used Tecnologies:
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![postgress](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=whit)

![React](https://img.shields.io/badge/React-226973?style=for-the-badge&logo=react&logoColor=61DAFB)
![bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
