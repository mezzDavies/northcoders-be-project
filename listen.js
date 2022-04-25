const app = require("./app.js");
const { port = 9090 } = process.env;

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`app listening on ${port}`);
});
