export function buildBaseHeaders(request: Request): Record<string, string> {
  return {
    'content-type': 'application/json;charset=UTF-8',
    Vary: 'Origin',
    'cache-control': 'no-cache, no-store, must-revalidate, private',
    pragma: 'no-cache',
    expires: '0',
  };
}

export function buildCorsHeaders(request: Request): Record<string, string> {
  return {
    ...buildBaseHeaders(request),
    'Access-Control-Allow-Origin': request.headers.get('Origin') as string,
  };
}
