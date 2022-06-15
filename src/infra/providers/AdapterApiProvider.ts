import { CustomRequestInit } from "./HttpProvider";

export abstract class AdapterApiProvider {
    abstract call<T>(path:string, init: CustomRequestInit): Promise<T | Error>
  }
  