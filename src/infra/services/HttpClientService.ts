import { FetchAdaptator } from "../adapters/FetchAdapter";
import { AdapterApiProvider } from "../providers/AdapterApiProvider";
import { HttpProvider } from "../providers/HttpProvider";

class HttpClientService implements HttpProvider {

  constructor(private adaptator: AdapterApiProvider){}
  public async post<P>(path: string, body: {}): Promise<P | Error> {
    const data = await this.adaptator.call<P>(path, {body, method:'POST'})
    return data;
  }
}

export const httpClientService = new HttpClientService(new FetchAdaptator());
