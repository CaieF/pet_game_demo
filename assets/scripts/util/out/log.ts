import { log as ccLog } from "cc";

export function log(...args: any[]) {
  return ccLog(...args);
}