import { logEvents } from "./logger.mjs";

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.header.origin}`,
    "errLog.log"
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({ message: err.message });
};

export default errorHandler;
