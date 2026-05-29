#!/usr/bin/env node

const http = require('http');
const https = require('https');
const url = require('url');
const net = require('net');

const PORT = process.env.PORT || 8080;

// Create proxy server
const proxyServer = http.createServer((req, res) => {
  const targetUrl = url.parse(req.url);
  const protocol = targetUrl.protocol === 'https:' ? https : http;

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
    path: targetUrl.path || '/',
    method: req.method,
    headers: req.headers,
    rejectUnauthorized: false // Allow self-signed certificates
  };

  // Remove host header to avoid issues
  delete options.headers['host'];

  const proxyReq = protocol.request(options, (proxyRes) => {
    // Forward response headers
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Forward response body
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway: ' + err.message);
  });

  // Forward request body
  req.pipe(proxyReq);
});

// Handle CONNECT for HTTPS tunneling
proxyServer.on('connect', (req, socket, head) => {
  const { hostname, port } = url.parse('http://' + req.url);
  
  const targetSocket = net.createConnection(
    port || 443,
    hostname,
    () => {
      socket.write(
        'HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-Agent: ChromebookProxy/1.0\r\n' +
        '\r\n'
      );
      targetSocket.write(head);
      socket.pipe(targetSocket);
      targetSocket.pipe(socket);
    }
  );

  targetSocket.on('error', (err) => {
    console.error('Target connection error:', err);
    socket.end();
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
    targetSocket.end();
  });
});

proxyServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Proxy server running on http://localhost:${PORT}`);
  console.log(`✓ Configure your Chromebook to use: localhost:${PORT}`);
  console.log(`✓ Supports HTTP and HTTPS (CONNECT tunneling)`);
});
