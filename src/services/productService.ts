import { HttpProvider } from "../providers/HttpProvider";
import { httpClientService } from "./HttpClientService";

class ProductService {
  constructor(private http: HttpProvider) {}

  public saveProduct(body:{name:string, size:number, type:string}) {
    return this.http.post<{id: number}>({path: "/products", body});
  }
}

export const productService = new ProductService(httpClientService);
