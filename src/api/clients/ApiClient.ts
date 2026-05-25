import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
}

export class ApiClient {
    private readonly request: APIRequestContext;

     constructor(request: APIRequestContext) {
        this.request = request;
    }

    private async buildResponse<T>(response: Awaited<ReturnType<APIRequestContext['get']>>): Promise<ApiResponse<T>> {
         const text = await response.text();

         return {
             statusCode: response.status(),
             data: text ? JSON.parse(text) as T : null as T,
         };
     }

    async get<T>(
        url: string,
        query?: Record<string, string | number | boolean>
    ): Promise<ApiResponse<T>> {
         const response = await this.request.get(url, {params: query});
         return this.buildResponse<T>(response);
    }

    async post<T>(
        url: string,
        body?: unknown,
        query?: Record<string, string | number | boolean>
    ): Promise<ApiResponse<T>> {
        const response = await this.request.post(url, {
            data: body,
            params: query,
        });
        return this.buildResponse<T>(response);
    }

    async put<T>(
        url: string,
        body?: unknown,
        query?: Record<string, string | number | boolean>
    ): Promise<ApiResponse<T>> {
        const response = await this.request.put(url, {
            data: body,
            params: query,
        });
        return this.buildResponse<T>(response);
    }

    async delete<T>(
        url: string,
        query?: Record<string, string | number | boolean>
    ): Promise<ApiResponse<T>> {
        const response = await this.request.delete(url, {
            params: query,
        });
        return this.buildResponse<T>(response);
    }

    validateStatus(response: ApiResponse<unknown>, expectedStatus: number | numbers[]): void {
        const validStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];

        if (!validStatuses.includes(response.statusCode)) {
            throw new Error(
                `Expected status ${validStatuses.join(' or ')}, got ${response.statusCode}. Body: ${JSON.stringify(response.data)}`
            );
        }
    }
}