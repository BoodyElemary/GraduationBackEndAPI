module.exports = (
  msg = "Internal server error",
  status = 500,
) => {
  const err = new Error(msg);
  err.status = status;
  return err;
};

// module.exports = {
//   createError,
//   BAD_REQUEST: 400,
//   UNAUTHORIZED: 401,
//   FORBIDDEN: 403,
//   NOT_FOUND: 404,
//   METHOD_NOT_ALLOWED: 405,
//   CONFLICT: 409,
//   GONE: 410,
//   LENGTH_REQUIRED: 411,
//   PRECONDITION_FAILED: 412,
//   PAYLOAD_TOO_LARGE: 413,
//   UNSUPPORTED_MEDIA_TYPE: 415,
//   RANGE_NOT_SATISFIABLE: 416,
//   EXPECTATION_FAILED: 417,
//   IM_A_TEAPOT: 418,
//   UNPROCESSABLE_ENTITY: 422,
//   TOO_MANY_REQUESTS: 429,
//   INTERNAL_SERVER_ERROR: 500,
//   NOT_IMPLEMENTED: 501,
//   BAD_GATEWAY: 502,
//   SERVICE_UNAVAILABLE: 503,
//   GATEWAY_TIMEOUT: 504,
// };
