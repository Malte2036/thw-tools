import { CustomError, HttpError, UnauthorizedError } from './error';

export type ApiRequestOptions = {
  idToken: string;
  token: string;
};

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const checkIfResposeIsUnauthorized = (res: Response) => {
  if (res.status === 401) {
    console.log('Unauthorized. Destroying session...');
    // destroySession().then(() => {
    //   window.location.reload();
    // });

    throw new UnauthorizedError();
  }
  if (res.status === 403) {
    throw new UnauthorizedError();
  }
};

export type ResponeData<T> = {
  data: T;
  fromCache: boolean;
};

function responseToData<T>(response: Response, data: T): ResponeData<T> {
  return {
    data,
    fromCache: response.headers.get('x-served-from') === 'cache',
  };
}

async function createHeaders(
  { idToken, token }: ApiRequestOptions,
  includeContentType = true
): Promise<Headers> {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);

  if (includeContentType) {
    headers.append('Content-Type', 'application/json');
  }

  headers.append('x-id-token', idToken);

  return headers;
}

export async function apiGet<T>(
  path: string,
  { idToken, token }: ApiRequestOptions,
  verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
  const url = new URL(path, PUBLIC_API_URL);

  try {
    const response = await fetch(url, {
      headers: await createHeaders({ idToken, token }),
    });

    if (!response.ok) {
      checkIfResposeIsUnauthorized(response);

      const errorData = await response.json();

      throw new HttpError(
        response.status,
        `Failed to fetch data from ${url}: ${errorData.message}`,
        errorData.message ?? response.statusText
      );
    }

    const data: T = await response.json();
    if (verifyData && !verifyData(data)) {
      throw new CustomError(`Failed to verify data.`);
    }

    return responseToData(response, data);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function apiPost<T>(
  path: string,
  { idToken, token }: ApiRequestOptions,
  body?: unknown,
  verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
  const url = new URL(path, PUBLIC_API_URL);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: await createHeaders({ idToken, token }),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      checkIfResposeIsUnauthorized(response);

      const errorData = await response.json();

      throw new HttpError(
        response.status,
        `Failed to post data from ${url}: ${errorData.message}`,
        errorData.message ?? response.statusText
      );
    }

    const data: T = await response.json();
    if (verifyData && !verifyData(data)) {
      throw new CustomError(`Failed to verify data.`);
    }

    return responseToData(response, data);
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
}

export async function apiPostFile<T>(
  path: string,
  { idToken, token }: ApiRequestOptions,
  file: File,
  verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
  const url = new URL(path, PUBLIC_API_URL);
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch(url, {
      method: 'POST',
      headers: await createHeaders({ idToken, token }, false),
      body: formData,
    });

    if (!response.ok) {
      checkIfResposeIsUnauthorized(response);

      const errorData = await response.json();

      throw new HttpError(
        response.status,
        `Failed to post file to ${url}: ${errorData.message}`,
        errorData.message ?? response.statusText
      );
    }

    const data: T = await response.json();
    if (verifyData && !verifyData(data)) {
      throw new CustomError(`Failed to verify data.`);
    }
    return responseToData(response, data);
  } catch (error) {
    console.error('Error posting file:', error);
    throw error;
  }
}

export async function apiPatch<T>(
  path: string,
  { idToken, token }: ApiRequestOptions,
  body?: unknown,
  verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
  const url = new URL(path, PUBLIC_API_URL);
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: await createHeaders({ idToken, token }),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      checkIfResposeIsUnauthorized(response);

      const errorData = await response.json();

      throw new HttpError(
        response.status,
        `Failed to patch data to ${url}: ${errorData.message}`,
        errorData.message ?? response.statusText
      );
    }

    const data: T = await response.json();
    if (verifyData && !verifyData(data)) {
      throw new CustomError(`Failed to verify data.`);
    }

    return responseToData(response, data);
  } catch (error) {
    console.error('Error patching data:', error);
    throw error;
  }
}

export async function apiPut<T>(
  path: string,
  { idToken, token }: ApiRequestOptions,
  body?: unknown,
  verifyData?: (data: T) => boolean
): Promise<ResponeData<T>> {
  const url = new URL(path, PUBLIC_API_URL);
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: await createHeaders({ idToken, token }),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      checkIfResposeIsUnauthorized(response);

      const errorData = await response.json();

      throw new HttpError(
        response.status,
        `Failed to put data to ${url}: ${errorData.message}`,
        errorData.message ?? response.statusText
      );
    }

    const data: T = await response.json();
    if (verifyData && !verifyData(data)) {
      throw new CustomError(`Failed to verify data.`);
    }

    return responseToData(response, data);
  } catch (error) {
    console.error('Error putting data:', error);
    throw error;
  }
}

export async function apiGetFile(path: string, { idToken, token }: ApiRequestOptions) {
  const url = new URL(path, PUBLIC_API_URL);
  try {
    const response = await fetch(url, {
      headers: await createHeaders({ idToken, token }),
    });

    if (!response.ok) {
      checkIfResposeIsUnauthorized(response);

      const errorData = await response.json();

      throw new HttpError(
        response.status,
        `Failed to get file from ${url}: ${errorData.message}`,
        errorData.message ?? response.statusText
      );
    }

    return response.blob();
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
}
