exports.promiseRejector = (code, item) => {
  return Promise.reject({
    status: code,
    msg: `${item} not found`,
  });
};
