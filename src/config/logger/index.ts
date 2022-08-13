<<<<<<< HEAD
import {$log, PlatformLoggerSettings} from "@tsed/common";
import {isProduction} from "../envs/index";
=======
import { $log, PlatformLoggerSettings } from "@tsed/common";

import { isProduction } from "../envs/index";
>>>>>>> 2f746f48 (chore: update configs)

if (isProduction) {
  $log.appenders.set("stdout", {
    type: "stdout",
    levels: ["info", "debug"],
    layout: {
      type: "json"
    }
  });

  $log.appenders.set("stderr", {
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
    layout: {
      type: "json"
    }
  });
}

<<<<<<< HEAD
export default <PlatformLoggerSettings> {
=======
export default <PlatformLoggerSettings>{
>>>>>>> 2f746f48 (chore: update configs)
  disableRoutesSummary: isProduction
};
