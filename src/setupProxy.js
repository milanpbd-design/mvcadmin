const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    console.log('[Proxy] Setting up proxy middleware for /api');

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://127.0.0.1:5000',
            changeOrigin: true,
            secure: false,
            logLevel: 'debug',
            onProxyReq: (proxyReq, req, res) => {
                console.log(`[Proxy] ${req.method} ${req.path} -> http://localhost:5000${req.path}`);
            },
            onProxyRes: (proxyRes, req, res) => {
                console.log(`[Proxy] ${req.method} ${req.path} <- ${proxyRes.statusCode}`);
            },
            onError: (err, req, res) => {
                console.error('[Proxy] Error:', err.message);
                res.status(500).json({ error: 'Proxy error: ' + err.message });
            }
        })
    );

    console.log('[Proxy] Proxy middleware configured successfully');
};
