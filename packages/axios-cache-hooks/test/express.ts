import express from 'express';
import type { Server } from 'http';
export const app = express();

app.use('/:name', (req, res) => {
  res.json({ name: req.params.name });
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
