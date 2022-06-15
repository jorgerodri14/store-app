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
  
      const response = await fetch(path, options as RequestInit);
  
      const data = await response.json();
  
      if (response.status === HTTP_STATUS.CREATED_STATUS) return data;
  
      throw new Error(data.message);
      
    }
  }
  