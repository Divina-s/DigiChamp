import Cookies from 'js-cookie';

export const token: string = Cookies.get('accessToken') ?? "";
export const base_url: string = import.meta.env.VITE_BASE_URL;

console.log("Token gotten :", token);

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Make an API call with fetch, using the access token from cookies.
 * @param url relative url (e.g. "/endpoint")
 * @param method HTTP method ("GET", "POST", etc)
 * @param data optional body payload for non-GET methods
 * @returns parsed JSON response
 */
export const apiAccess = async (
  url: string,
  method: HttpMethod,
  data: Record<string, any> = {}
): Promise<any> => {
  const url_access = base_url + url;
  const currentToken = Cookies.get('accessToken') ?? "";

  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${currentToken}`,
  });

  const request = new Request(url_access, {
    method,
    headers,
    body: method === "GET" ? null : JSON.stringify(data),
  });

  try {
    const response = await fetch(request);
    console.log('Token is ', currentToken);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    // Optionally update token if API returns a new one
    if (responseData?.access_token) {
      Cookies.set("accessToken", responseData.access_token);
    }

    return responseData;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Make an API call with query params for GET or JSON body for POST.
 * This replaces your axiosQuery using fetch only.
 */
export const fetchQuery = async (
  url: string,
  method: HttpMethod,
  dataParam: Record<string, any> = {}
): Promise<any> => {
  const currentToken = Cookies.get('accessToken') ?? "";
  const headers = new Headers({
    "Accept": "application/json",
    "Authorization": `Bearer ${currentToken}`,
  });

  let url_access = base_url + url;

  let options: RequestInit = {
    method,
    headers,
  };

  if (method === "GET" && Object.keys(dataParam).length > 0) {
    // Append query params to URL
    const queryString = new URLSearchParams(dataParam as any).toString();
    url_access += (url_access.includes('?') ? '&' : '?') + queryString;
  } else if (method !== "GET") {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(dataParam);
  }

  try {
    const response = await fetch(url_access, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    // Optionally update token if returned
    if (responseData?.access_token) {
      Cookies.set("accessToken", responseData.access_token);
    }

    return responseData;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
