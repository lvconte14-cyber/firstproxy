# FirstProxy - Working HTTP Proxy for Chromebook

A lightweight, working HTTP/HTTPS proxy server that works on Chromebook and other platforms.

## Features

✓ **HTTP Proxy** - Forward HTTP requests  
✓ **HTTPS Tunneling** - CONNECT method for encrypted traffic  
✓ **Chromebook Compatible** - Works on ChromeOS with proper configuration  
✓ **Simple Setup** - No complex dependencies  
✓ **Self-Signed SSL Support** - Handles untrusted certificates  

## Installation

```bash
git clone https://github.com/lvconte14-cyber/firstproxy.git
cd firstproxy
npm install
```

## Quick Start

```bash
npm start
```

The proxy will run on `http://localhost:8080`

To use a custom port:
```bash
PORT=3000 npm start
```

## Configuration on Chromebook

### Method 1: Chrome Browser Settings
1. Open Chrome Settings
2. Search "Proxy"
3. Open "Proxy settings"
4. Configure your network proxy to: `localhost:8080`

### Method 2: System-wide (ChromeOS)
1. Settings > Network > Wi-Fi (or Ethernet)
2. Click the network you're connected to
3. Expand "Proxy" section
4. Select "Manual proxy configuration"
5. HTTP Proxy: `localhost:8080`
6. HTTPS Proxy: `localhost:8080`

## How It Works

- **HTTP requests** are forwarded directly to the target server
- **HTTPS requests** use the CONNECT tunneling method for end-to-end encryption
- All headers are properly forwarded and response streams are piped efficiently
- Self-signed SSL certificates are accepted by default

## Running on Server

For a public/remote proxy, modify the bind address:

```javascript
// In proxy.js, change:
proxyServer.listen(PORT, '0.0.0.0', () => {
  // Now listens on all interfaces
});
```

Then access from another device:
```
http://YOUR_SERVER_IP:8080
```

## Troubleshooting

**Connection refused?**
- Ensure the proxy server is running
- Check the port isn't already in use: `lsof -i :8080`

**HTTPS not working?**
- The proxy uses CONNECT tunneling for HTTPS
- Ensure no firewall is blocking the port

**Chromebook not connecting?**
- Use `localhost:8080` or `127.0.0.1:8080` for local machine
- For remote machine, use the actual IP address

## License

MIT