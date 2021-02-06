import { ProtocolController } from "./controller/ProtocolController";
import { LinkController } from "./controller/LinkController";
import { SettController } from "./controller/SettController";
import { ChartController } from "./controller/ChartController";
import { GeyserController } from "./controller/GeyserController";
import { ClawController } from "./controller/ClawController";

/**
 * Controller registry forces serverless offline to load
 * the appropriate controller routes on start. Default
 * lazy loading makes dealing with local development a pain
 * without this.
 */
export const controllers = [
  LinkController,
  ProtocolController,
  SettController,
  ChartController,
  GeyserController,
  ClawController,
];
