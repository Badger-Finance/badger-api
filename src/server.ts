import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";

import { PlatformApplication } from "@tsed/common";
import { Configuration, Inject } from "@tsed/di";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import { join } from "path";

import { config } from "./config/index";
import { V2_CONTROLLERS, V3_CONTROLLERS } from "./controllers";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  componentsScan: false,
  mount: {
    "/v2": [V2_CONTROLLERS],
    "/v3": [V3_CONTROLLERS]
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: ["**/*.spec.ts"]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}
