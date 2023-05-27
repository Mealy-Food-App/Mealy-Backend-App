import dotenv from "dotenv";
dotenv.config();
import { development } from "./development.js";
import { production } from "./production.js";
import { staging } from "./staging.js";

const environment = process.env.NODE_ENV;

console.log("Sever set up to", environment, "!!!");

export const config = environment.trim() === "development" ? { ...development } : environment.trim() === "staging" ? { ...staging } : { ...production };

