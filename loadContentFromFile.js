var solc = require("solc");
var fs = require("fs");

fs.readFile("./CrowdSale.sol", "utf-8", (err, source) => {
  if (err) throw err;
  var input = {
    sources: {
      "CrowdSale.sol": source
    },
    language: "Solidity"
  };

  var output = solc.compile(input, 1);
  console.log(JSON.stringify(output));
});
