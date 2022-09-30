import { HTTP_STATUS } from "../../constants/httpStatus";
import { AdapterApiProvider } from "../providers/AdapterApiProvider";
import { CustomRequestInit } from "../providers/HttpProvider";

export class FetchAdaptator implements AdapterApiProvider {
  public async call(path: string, init: CustomRequestInit) {
    let options = { ...init };

    if (init.method !== "GET")
      options = {
        headers: { ...init.headers, "Content-Type": "application/json" },
        body: JSON.stringify(init.body),
        ...init,
      };

    try {
      const response = await fetch(path, options as RequestInit);

      if (!response.ok) throw response;
      const data = await response.json();

      if (response.status === HTTP_STATUS.CREATED_STATUS) return data;
    } catch (error) {
      if (error instanceof Response) await this.handleErrors(error);

      throw new Error("Connection error, please try later");
    }
  }

  private async handleErrors(err: Response) {
    if (err.status === HTTP_STATUS.ERROR_SERVER)
      throw new Error("Unexpected error, please try again");

    if (err.status === HTTP_STATUS.INVALID_REQUEST) {
      const data = await err.json();

      throw new Error(data.message);
    }
  }
}
