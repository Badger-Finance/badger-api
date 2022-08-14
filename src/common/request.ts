import axios from "axios";

export async function request<T>(baseURL: string, params?: Record<string, string>): Promise<T> {
  try {
    const { data } = await axios.get(baseURL, { params });
    return data as T;
  } catch (error) {
    throw error;
  }
}
