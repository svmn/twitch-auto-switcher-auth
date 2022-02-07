import { buildBaseHeaders, buildCorsHeaders } from './headers.util';
import { handleOptions } from './options.handler';
import { handleTokenRequest } from './token.handler';

const allowedOrigins: Array<string | null> = CORS_ORIGIN.split(',') ?? [];

export async function handleRequest(request: Request): Promise<Response> {
  const origin = request.headers.get('Origin');
  if (!allowedOrigins.includes(origin)) {
    return new Response(null, {
      headers: buildBaseHeaders(request),
      status: 403,
    });
  }

  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }
  const url = new URL(request.url);
  if (url.pathname === '/token' && request.method === 'GET') {
    return handleTokenRequest(request);
  } else {
    return new Response(null, { headers: buildCorsHeaders(request), status: 404 });
  }
}
