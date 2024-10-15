import express from "express";
import { allRouter } from "./app/Routers/allInOneRouter";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as path from "path";

/*Here I created a basic server because I could have 3 separated server, front, api, and auth*/
/*But for constrains in the hosting plataform, I have decided to make only one server*/
/*The big advantage of having 3 servers is that you could scale them separately */

class BasicServer {
  public server: express.Application;
  constructor() {
    this.server = express();
  }
  protected middleware() {
    this.server.use(express.json());
  }

  protected withcors(origns: string) {
    this.server.use(cors({
      origin: origns, // allow to server to accept request from different origin
      credentials: true // allow session cookie from browser to pass through
    }))
    console.log('cors enabled for:', origns);
  }

  protected withCookies() {
    console.log('cookies enabled');
    this.server.use(cookieParser());
  }

  protected router(_router: express.Router) {
    this.server.use(_router);
  }
}

class AllInOneServer extends BasicServer {
  constructor() {
    super();
    this.middleware();
    this.withCookies();
    this.withcors('http://localhost:' + process.env.FRONTEND_PORT);
    this.router(allRouter); /*Router for Apis + Auth*/

    /*Serves the React Page*/
    this.server.use(express.static(path.resolve('./front')));
    this.server.use('*', (req,res) => {
      res.sendFile(path.resolve('./front/index.html'))
      });
  }
}


export { AllInOneServer };


/*Three Servers Example*/

// class AuthServer extends BasicServer {
//   constructor() {
//     if (!assertDotEnv) {
//       console.log('failed to load .env file');
//       throw new Error('failed to load .env file');
//     }
//     super();
//     this.middleware();
//     this.withCookies();
//     this.withcors('http://localhost:' + process.env.FRONTEND_PORT);
//     this.router(authRouter);
//   }
// }

// class BackendServer extends BasicServer {
//   constructor() {
//     super();
//     this.middleware();
//     this.withcors('http://localhost:' + process.env.FRONTEND_PORT);
//     this.router(dataRouter);
//   }
// }

// class FrontendServer extends BasicServer {
//   constructor() {
//     super();
//     const p = path.resolve('./front');
//     this.server.use(express.static(p));
//   }


// }

//export { FrontendServer, AuthServer, BackendServer, AllInOneServer };