export type CustomRequestInit = Omit<RequestInit, 'body'> & { path: string, body?: {} };

export abstract class HttpProvider {
  abstract post<P>(request: CustomRequestInit): Promise<P>;
}
