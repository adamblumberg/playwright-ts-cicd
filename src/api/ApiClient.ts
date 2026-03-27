import { type APIRequestContext, expect } from '@playwright/test';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  product_image: { id: string; by_name: string; name: string };
  is_location_offer: boolean;
  is_rental: boolean;
}

export interface ProductsResponse {
  current_page: number;
  data: Product[];
  total: number;
  per_page: number;
}

/**
 * Thin wrapper around Playwright's APIRequestContext to interact
 * with the Practice Software Testing REST API.
 */
export class ApiClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  private headers(): Record<string, string> {
    return this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {};
  }

  // ── Auth ──────────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request.post('/users/login', {
      data: { email, password },
    });
    expect(response.status(), `POST /users/login → ${response.status()}`).toBe(200);
    const body = (await response.json()) as LoginResponse;
    this.token = body.access_token;
    return body;
  }

  // ── Products ──────────────────────────────────────────────────────────

  async getProducts(params?: { page?: number; sort?: string; by_brand?: string }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page)     queryParams.set('page', String(params.page));
    if (params?.sort)     queryParams.set('sort', params.sort);
    if (params?.by_brand) queryParams.set('by_brand', params.by_brand);

    const url = `/products?${queryParams.toString()}`;
    const response = await this.request.get(url, { headers: this.headers() });
    expect(response.status()).toBe(200);
    return response.json() as Promise<ProductsResponse>;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request.get(`/products/${id}`, {
      headers: this.headers(),
    });
    expect(response.status()).toBe(200);
    return response.json() as Promise<Product>;
  }

  async searchProducts(query: string): Promise<ProductsResponse> {
    const response = await this.request.get(
      `/products/search?q=${encodeURIComponent(query)}`,
      { headers: this.headers() }
    );
    expect(response.status()).toBe(200);
    return response.json() as Promise<ProductsResponse>;
  }

  // ── Categories ────────────────────────────────────────────────────────

  async getCategories(): Promise<Category[]> {
    const response = await this.request.get('/categories', {
      headers: this.headers(),
    });
    expect(response.status()).toBe(200);
    return response.json() as Promise<Category[]>;
  }
}
