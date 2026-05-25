import {
    ClerkExpressRequireAuth,
    LooseAuthProp,
    RequireAuthProp,
} from "@clerk/clerk-sdk-node";
import cors from "cors";
import dotenv from "dotenv";
import type { RequestHandler } from "express";
import express, { NextFunction, Request, Response } from "express";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so your React Native app can talk to this local server
app.use(cors());
app.use(express.json());

// Extend Express Request type definitions to match Clerk's auth properties
declare global {
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

// 🔓 Public endpoint test
app.get("/api/public", (req: Request, res: Response) => {
  res.json({ message: "Hello from the public DriveTribe API!" });
});

// 🔒 Protected endpoint test (Clerk middleware automatically validates the user token)
app.get(
  "/api/profile",
  ClerkExpressRequireAuth() as unknown as RequestHandler,
  (req: Request, res: Response) => {
    // Cast the request inside the block so TypeScript doesn't choke on the parameters
    const authedReq = req as RequireAuthProp<Request>;

    res.json({
      message: "Success! You hit a protected route.",
      clerkUserId: authedReq.auth.userId,
    });
  },
);

// Fallback error handler for when someone tries to access a protected route without logging in
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.message === "Unauthenticated") {
    res
      .status(401)
      .json({ error: "Unauthorized request. Please log in first." });
  } else {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 DriveTribe Backend active on http://localhost:${PORT}`);
});
