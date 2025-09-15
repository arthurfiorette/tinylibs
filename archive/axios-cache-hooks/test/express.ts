import type { Server } from 'node:http';
import express from 'express';
export const app = express();

app.get('/', (_, res) => {
  res.status(404).end();
});

app.use('/:name', (req, res) => {
  res.json({ name: req.params.name }).end();
});

let server!: Server;

export const listen = () => {
  return new Promise<void>((res) => {
    server = app.listen(39874, 'localhost', () => {
      console.log('test server running');
      res();
    });
  });
};

export const shutdown = () => {
  return new Promise<void>((res, rej) => {
    server.close((err) => (err ? rej(err) : res()));
  });
};
