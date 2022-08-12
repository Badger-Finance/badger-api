import '@tsed/platform-express';
import './common/filters/tsed-exception-filter';
import './common/filters/api-exception-filter';
import '@tsed/swagger';
import { PlatformApplication } from '@tsed/common';
export declare class Server {
    app: PlatformApplication;
    /**
     * This method let you configure the express middleware required by your application to work.
     * @returns {Server}
     */
    $beforeRoutesInit(): void | Promise<void>;
}
