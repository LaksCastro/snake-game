const gh = require("gh-pages");

gh.publish("./docs", (e) => {
  if (e) throw e;

  console.log("Succes Publish!");
});
