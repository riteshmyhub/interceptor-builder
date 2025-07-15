import { createInstance } from "./functions/createInstance";
import { InterceptorBuilder } from "./functions/interceptor-builder";
import type { Interceptor, Req, Res, Instance } from "./types/type";

export default InterceptorBuilder;
export { createInstance };
export type { Interceptor, Req, Res, Instance };
