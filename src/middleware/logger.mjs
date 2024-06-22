import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import fsPromise from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "MM-dd-yyyy\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(join(__dirname, "..", "logs"))) {
      await fsPromise.mkdir(join(__dirname, "..", "logs"));
    }
    await fsPromise.appendFile(
      join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};
