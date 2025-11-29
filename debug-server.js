const http = require('http');
const port = process.env.PORT || 8080;

console.log(`Starting debug server on port ${port}...`);

const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello from Debug Server');
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Debug server running at http://0.0.0.0:${port}/`);
});

// Keep the process alive
process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down...');
    server.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down...');
    server.close();
    process.exit(0);
});
