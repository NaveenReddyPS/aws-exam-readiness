
import { createServer } from 'node:http';
import { handler } from './index.mjs';

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/submit') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
    return;
  }

  try {
    let rawBody = '';

    for await (const chunk of req) {
      rawBody += chunk;
    }

    const result = await handler({ body: rawBody });

    res.writeHead(result.statusCode, {
      ...result.headers,
      'Access-Control-Allow-Origin': '*'
    });

    res.end(result.body);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid request' }));
  }
});

server.listen(3001, '127.0.0.1', () => {
  console.log('CloudReady backend running at http://127.0.0.1:3001');
});
