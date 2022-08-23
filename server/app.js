// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// import

const express = require('express');
const dog = require("./routes/dogs");
require("express-async-errors");
// used in express.static to obtain absolute path
const path = require('path');

// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// Initialize
const app = express();

// res.on is an event listener and "finish" returns when an response if formulated
const logger = (req, res, next) => {
  res.on('finish', () => {
    // read and log the status code of the response
    console.log(res.statusCode);
  });

  console.log(`Method - ${req.method}`);
  console.log(`URL - ${req.path}`);

  // used to connect with next middleware
  next();
}

// calls the logger middleware and json method for all paths and methods
app.use(express.json());
app.use(logger);
app.use("/dogs", dog);

app.use("/static", express.static(path.join(__dirname, "assets")));

// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------


// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});


// -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------
// Error handling

// would throw an error for all requests so need to be placed at the end to catch the wrong paths
app.use((req, res, next) => {
  // can set status when throwing or when catching
  const err = new Error("The requested resource couldn't be found.")
  err.status = 404;
  throw err;
})

// error handling function needs to have 4 parameters
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500);

  const isProduction = process.env.NODE_ENV === 'production';

  res.json({
    statusCode: err.status || 500,
    message: err.message || "Something went wrong",
    stack: isProduction ? null : err.stack,
  });
})

// -------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
const port = process.env.PORT;
app.listen(port, () => console.log('Server is listening on port', port));
