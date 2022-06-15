import { HttpProvider } from "../providers/HttpProvider";
import { httpClientService } from "./HttpClientService";

class ProductService {
  constructor(private http: HttpProvider) {}

  public async saveProduct(body:{name:string, size:number, type:string}) {
    
      const data = await this.http.post<{id: number}>( "/products", body);
      return data      

  }
}

export const productService = new ProductService(httpClientService);
