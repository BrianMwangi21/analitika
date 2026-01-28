const API_BASE_URL = 'https://v3.football.api-sports.io';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

async function fetchApi(endpoint: string, options: ApiOptions = {}) {
  const apiKey = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY || process.env.API_FOOTBALL_KEY;
  
  if (!apiKey) {
    throw new Error('API key is not configured');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      'x-apisports-key': apiKey,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

export default fetchApi;
