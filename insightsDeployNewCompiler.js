const compilerOutput = require("./new-compiler-output-SimpleToken.json");

const getDependency = function(compiledContract) {
  let dependency = {};

  //   console.log(
  //     "Utils getDependency ->",
  //     compiledContract["sources"][compiledContract["sourceList"][0]]["AST"][
  //       "children"
  //     ]
  //   );

  const astContract = compiledContract["sources"]["test.sol"]["ast"];

  const exportedSymbols = astContract["exportedSymbols"];

  for (contract in exportedSymbols) {
    let id = exportedSymbols[contract][0];

    for (node of astContract["nodes"]) {
      if (id == node["id"]) {
        console.log(node["nodeType"]);
        console.log(node["name"]);
      }
    }
  }

  console.log(exportedSymbols);
  return dependency;
};

const parseTreeFind = function(node, key, found) {
  if (typeof node == "object") {
    for (child in node) {
      if (child == key) {
        found.push(node[child]);
      } else {
        parseTreeFind(node[child], key, found);
      }
    }
  }
};

const searchLibraries = function(arr) {
  let libraries = [];
  for (elem of arr) {
    try {
      if (elem.indexOf("library") >= 0) {
        // 'library SmallInt'や'type(library BigInt)'といった形式で存在
        let library = stripParenthesis(elem).split(" ")[1];
        if (libraries.indexOf(library) < 0) {
          libraries.push(library);
        }
      } else if (elem.indexOf("struct") >= 0) {
        // 'struct SmallInt.bigint'や'function (uint256) pure returns (struct BigInt.bigint memory)'といった形式で存在
        let items = stripParenthesis(elem).split(" ");
        for (index in items) {
          if (items[index] == "struct") {
            let library = items[parseInt(index) + 1].split(".")[0];
            if (libraries.indexOf(library) < 0) {
              libraries.push(library);
            }
          }
        }
      }
    } catch (e) {
      console.log("search error", elem);
    }
  }
  return libraries;
};

getDependency(compilerOutput);
