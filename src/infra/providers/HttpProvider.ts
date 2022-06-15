export type CustomRequestInit = Omit<RequestInit, 'body'> & {  body?: {} };

export abstract class HttpProvider {
  abstract post<P>(path: string, body: {}): Promise<P | Error>;
}
