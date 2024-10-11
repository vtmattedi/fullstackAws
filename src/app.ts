import express from "express";
import { authRouter } from "./app/routers/authRouter";
import { dataRouter } from "./app/routers/backendRouter";
import { allRouter } from "./app/routers/allInOneRouter";
import cors from "cors";
import cookieParser from "cookie-parser";
import { assertDotEnv } from "./app/Asserter";
import * as path from "path";

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

class AuthServer extends BasicServer {
  constructor() {
    if (!assertDotEnv) {
      console.log('failed to load .env file');
      throw new Error('failed to load .env file');
    }
    super();
    this.middleware();
    this.withCookies();
    this.withcors('http://localhost:' + process.env.FRONTEND_PORT);
    this.router(authRouter);
  }
}

class BackendServer extends BasicServer {
  constructor() {
    super();
    this.middleware();
    this.withcors('http://localhost:' + process.env.FRONTEND_PORT);
    this.router(dataRouter);
  }
}

class FrontendServer extends BasicServer {
  constructor() {
    super();
    const p = path.resolve('./front');
    console.log("Static path:", p);
    this.server.use(express.static(p));
  }


}

class AllInOneServer extends BasicServer {
  constructor() {
    super();
    this.middleware();
    this.withCookies();
    this.withcors('http://localhost:' + process.env.FRONTEND_PORT);
    this.router(allRouter);
    // this.server.use(express.static(path.resolve('./front')));
    // this.server.use('*', (req,res) => {
    //   res.sendFile(path.resolve('./front/index.html'))
    //   });
  }
}

export { FrontendServer, BackendServer, AuthServer, AllInOneServer };