import { MiddlewareMethods } from '@tsed/platform-middlewares';
import { Context } from '@tsed/platform-params';
export default class DevelopmentFilter implements MiddlewareMethods {
    use(_: Context): void;
}
