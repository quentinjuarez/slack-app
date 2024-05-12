import type { Env } from "../config/env";

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
