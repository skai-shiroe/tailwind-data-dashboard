import axios, { AxiosError } from "axios";

type ApiError = {
  code: string;
  message: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  withCredentials: false, // Set to true only if your API requires credentials
});

const handleErrorMessage = (error: AxiosError<ApiError>): string => {
  const data = error.response?.data;

  if (!data) {
    return "Une erreur est survenue";
  }
  // Handle validation errors

  if ("errors" in data && typeof data === "object") {
    // Get first error message from any field
    const errorData = data as { errors: Record<string, string[]> };
    const firstError = Object.values(errorData.errors || {})[0]?.[0];
    return firstError || (data as ApiError).message;
  }

  // Handle general errors

  if ("code" in data && typeof data === "object") {
    return (data as ApiError).message;
  }

  return (data as ApiError).message || "Une erreur est survenue";
};
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.log("🚫 Error 400: Bad Request", error.response.data);
          break;
        case 401:
          console.log("🔒 Error 401: Unauthorized - Authentication Required", error.response.data);
          // Add logic for redirect to login
          break;
        case 403:
          console.log("⛔ Error 403: Forbidden - Access Denied", error.response.data);
          // Add modal display logic here
          break;
        case 404:
          console.log("❓ Error 404: Resource Not Found", error.response.data);
          break;
        case 422:
          console.log("📝 Error 422: Validation Error", error.response.data);
          break;
        case 500:
          console.log("🔥 Error 500: Internal Server Error", error.response.data);
          break;
        default:
          console.log(`❌ Error ${error.response.status}: Unexpected Error`, error.response.data);
      }
    }

    // Format error message for components
    const errorMessage = handleErrorMessage(error);
    const enhancedError = new Error(errorMessage) as Error & { cause: unknown };
    enhancedError.cause = error;

    return Promise.reject(enhancedError);
  }
);
export default api;
