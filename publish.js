const gh = require("gh-pages");

gh.publish("./build", (e) => {
  if (e) throw e;

  console.log("Succes Publish!");
});
