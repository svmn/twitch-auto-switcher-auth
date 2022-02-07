import { buildCorsHeaders } from './headers.util';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface OwnTokenResponse {
  accessToken: string;
}

const ACCESS_TOKEN_KV_KEY = 'access_token';

async function fetchAndStoreAccessToken(): Promise<OwnTokenResponse> {
  const body = new FormData();
  body.set('client_id', CLIENT_ID);
  body.set('client_secret', CLIENT_SECRET);
  body.set('grant_type', 'client_credentials');
  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body,
  });

  const { access_token } = await response.json<TokenResponse>();

  const content: OwnTokenResponse = {
    accessToken: access_token,
  };

  KV_STORAGE.put('access_token', JSON.stringify(content));

  return content;
}

export async function handleTokenRequest(request: Request): Promise<Response> {
  let content = await KV_STORAGE.get<OwnTokenResponse>(ACCESS_TOKEN_KV_KEY, 'json');
  if (!content) {
    content = await fetchAndStoreAccessToken();
  } else {
    const response = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: {
        Authorization: `Bearer ${content.accessToken}`,
      },
    });
    if (response.status !== 200) {
      content = await fetchAndStoreAccessToken();
    }
  }

  return new Response(JSON.stringify(content, null, 2), {
    headers: buildCorsHeaders(request),
  });
}
