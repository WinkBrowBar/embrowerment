import dns from "node:dns";
import mongoose from "mongoose";
import { config } from "../config.js";

/**
 * Connects to MongoDB. For mongodb+srv:// URIs, if the system resolver refuses SRV lookups
 * (common on macOS with some routers/VPNs: "querySrv ECONNREFUSED"), retry using public DNS.
 * Override the fallback with DNS_SERVERS=8.8.8.8,1.1.1.1 in .env.
 */
export async function connectDb() {
  if (process.env.DNS_SERVERS) dns.setServers(process.env.DNS_SERVERS.split(",").map(s => s.trim()));
  try {
    return await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 15000 });
  } catch (e) {
    const srvFail = config.mongoUri.startsWith("mongodb+srv://") && /querySrv|ENOTFOUND|ECONNREFUSED|ETIMEOUT/.test(`${e.code} ${e.message}`);
    if (!srvFail || process.env.DNS_SERVERS) throw e;
    console.warn(`[db] SRV lookup failed (${e.code || e.message}); retrying with public DNS 8.8.8.8 / 1.1.1.1`);
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    return mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 15000 });
  }
}
