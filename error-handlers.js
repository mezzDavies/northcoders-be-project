exports.handle404s = (req, res) => {
  return res.status(404).send({ msg: "path not found" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "article not found" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log("err in handle500s >>>", err);
  return res.status(500).send({ msg: "server error" });
};
