import * as express from 'express';

// declare module 'express-session' {
//   interface SessionData {
//     user: any;
//   }
// }

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}