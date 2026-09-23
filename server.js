import express from 'express';

const app = express();
console.log(process.env);
const NODE_ENV = process.env.NODE_ENV || 'production';
const name = process.env.NAME; // <-- NEW
const greeting = process.env.GREETING; // <-- NEW


app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    // Continue to the next middleware or route handler
    next();
});

app.get('/', (req, res) => {
    res.send(`Hello, ${name}! ${greeting}`); // <-- UPDATED
    app.get('/new-route', (req, res) => {
    res.send('This is a new route!'); });
});

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
    
});