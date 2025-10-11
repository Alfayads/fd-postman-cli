/**
 * Core HTTP client for making requests
 * Independent of CLI and storage details
 */

import axios, { AxiosResponse, AxiosError } from 'axios';
import https from 'https';
import { RequestOptions, ResponseData } from '../models';

/**
 * Make an HTTP request with the given options
 * @param options - Request options
 * @returns Promise with response data
 */
export async function makeRequest(options: RequestOptions): Promise<ResponseData> {
  const startTime = Date.now();

  try {
    const response: AxiosResponse = await axios({
      method: options.method,
      url: options.url,
      headers: options.headers,
      params: options.params,
      data: options.data,
      timeout: options.timeout || 30000,
      validateStatus: () => true, // Don't throw on any status code
      maxRedirects: options.maxRedirects !== undefined ? options.maxRedirects : 5,
      httpsAgent:
        options.rejectUnauthorized === false
          ? new https.Agent({
              rejectUnauthorized: false,
            })
          : undefined,
    });

    const duration = Date.now() - startTime;

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      data: response.data,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // Server responded with error status
        return {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          headers: axiosError.response.headers as Record<string, string>,
          data: axiosError.response.data,
          duration,
        };
      } else if (axiosError.request) {
        // Request made but no response received
        throw new Error(`No response received: ${axiosError.message}`);
      }
    }

    // Something else went wrong
    throw error;
  }
}
