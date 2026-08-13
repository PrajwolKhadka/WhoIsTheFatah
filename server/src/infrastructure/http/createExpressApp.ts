import express, { Express } from "express";
import cors from "cors";

export function createExpressApp(clientUrl: string): Express {
  const app = express();
  app.use(cors({ origin: clientUrl }));
  app.get("/health", (_req, res) => res.json({ ok: true }));
  return app;
}
