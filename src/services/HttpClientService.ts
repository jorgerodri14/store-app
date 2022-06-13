import { HTTP_STATUS } from "../constants/httpStatus";
import { CustomRequestInit, HttpProvider } from "../providers/HttpProvider";

class HttpClientService implements HttpProvider {
  public async post<P>(
    request: CustomRequestInit
  ): Promise<P> {
    const response = await fetch(request.path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.body),
    });

    const data = await response.json();

    if(response.status === HTTP_STATUS.CREATED_STATUS) return data

    throw Error(data.message)
  }
}

export const httpClientService = new HttpClientService();
