import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import crypto from 'crypto';

export type ApiErrorShape = {
  code: string;
  message: string;
  details?: unknown;
  traceId: string;
};

export class ApiError extends Error {
  code: string;
  details?: unknown;
  statusCode: number;
  constructor(code: string, message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function getTraceId(req: FastifyRequest): string {
  return (req.headers['x-trace-id'] as string) || crypto.randomUUID();
}

function normalizeOrigin(origin: string): string {
  try {
    return new URL(origin).origin;
  } catch {
    return '';
  }
}

export function registerApiBasics(
  app: FastifyInstance,
  opts?: {
    allowOrigins?: string[];
    csrfEnabled?: boolean;
  },
) {
  const allowOrigins = new Set(
    (opts?.allowOrigins || []).map((origin) => normalizeOrigin(origin)).filter(Boolean),
  );
  const csrfEnabled = opts?.csrfEnabled !== false;

  function isAllowedOrigin(origin: string): boolean {
    if (!origin) return false;
    const normalized = normalizeOrigin(origin);
    return normalized ? allowOrigins.has(normalized) : false;
  }

  app.addHook('onRequest', async (req, reply) => {
    const traceId = getTraceId(req);
    reply.header('x-trace-id', traceId);
    (req as any).traceId = traceId;

    const method = String(req.method || 'GET').toUpperCase();
    const originHeader = String(req.headers.origin || '');
    const requestOrigin = normalizeOrigin(originHeader);
    const pathOnly = String(req.url || '').split('?')[0];

    if (requestOrigin && !isAllowedOrigin(requestOrigin)) {
      throw new ApiError('CORS_ORIGIN_DENIED', 'Origin not allowed', 403, {
        origin: requestOrigin,
        path: pathOnly,
      });
    }

    if (requestOrigin && isAllowedOrigin(requestOrigin)) {
      reply.header('access-control-allow-origin', requestOrigin);
      reply.header('vary', 'Origin');
      reply.header('access-control-allow-credentials', 'false');
      reply.header('access-control-expose-headers', 'x-trace-id');
    }

    if (method === 'OPTIONS') {
      const requestedHeaders = String(
        req.headers['access-control-request-headers'] || 'authorization,content-type,x-trace-id,x-csrf-token',
      );
      reply.header('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      reply.header('access-control-allow-headers', requestedHeaders);
      reply.header('access-control-max-age', '600');
      reply.status(204).send();
      return;
    }

    if (csrfEnabled && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const secFetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();
      if (secFetchSite === 'cross-site') {
        throw new ApiError('CSRF_BLOCKED', 'Cross-site state-changing request blocked', 403, {
          path: pathOnly,
          method,
        });
      }
      if (requestOrigin && !isAllowedOrigin(requestOrigin)) {
        throw new ApiError('CSRF_BLOCKED', 'Origin is not trusted for state-changing request', 403, {
          origin: requestOrigin,
          path: pathOnly,
          method,
        });
      }
    }
  });

  app.setErrorHandler((err, req, reply) => {
    const traceId = (req as any).traceId || getTraceId(req);
    if (err instanceof ApiError) {
      const body: ApiErrorShape = {
        code: err.code,
        message: err.message,
        details: err.details,
        traceId,
      };
      reply.status(err.statusCode).send(body);
      return;
    }
    const body: ApiErrorShape = {
      code: 'INTERNAL_ERROR',
      message: 'Unexpected error',
      traceId,
    };
    reply.status(500).send(body);
  });

  app.get('/health', async () => ({ ok: true }));
}

export function requireJson(reply: FastifyReply) {
  reply.header('content-type', 'application/json; charset=utf-8');
}
