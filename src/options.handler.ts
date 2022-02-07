import { buildCorsHeaders } from './headers.util';

const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export function handleOptions(request: Request): Response {
  const headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    const respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Headers': headers.get('Access-Control-Request-Headers') as string,
      ...buildCorsHeaders(request),
    };
    return new Response(null, {
      status: 204,
      headers: respHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      status: 204,
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    });
  }
}
