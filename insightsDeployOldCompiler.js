const compilerOutput = require("./old-compiler-output-SimpleToken.json");

const getDependency = function(compiledContract) {
  let dependency = {};

  //   console.log(
  //     "Utils getDependency ->",
  //     compiledContract["sources"][compiledContract["sourceList"][0]]["AST"][
  //       "children"
  //     ]
  //   );

  for (let sourceInfo of compiledContract["sources"][
    compiledContract["sourceList"][0]
  ]["AST"]["children"]) {
    // console.log(sourceInfo);
    let contractName = sourceInfo["attributes"]["name"];
    if (!contractName) continue;
    let node = sourceInfo["children"];
    let found = [];
    parseTreeFind(node, "type", found);

    let dependentLibraries = searchLibraries(found);
    // console.log("dependent libraries ->", dependentLibraries);
    let ind = dependentLibraries.indexOf(contractName);
    if (ind >= 0) dependentLibraries.splice(ind, 1);
    dependency[contractName] = dependentLibraries;
  }
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

const dependencies = getDependency(compilerOutput);
const targetContract = "SimpleToken.sol:SimpleToken";

const deployContractInfo = {};

const deployDependentAll = (
  dependency,
  targetContract,
  deployContractInfo,
  cb
) => {
  if (deployContractInfo[targetContract]) {
    if (deployContractInfo[targetContract]["deployed"]) {
      return;
    }
  } else {
    deployContractInfo[targetContract] = {};
  }
  // 依存するライブラリのデプロイ
  if (dependency[targetContract] && dependency[targetContract].length > 0) {
    console.log("called once");
    for (let dependentContract of dependency[targetContract]) {
      deployDependentAll(
        dependency,
        dependentContract,
        deployContractInfo,
        function(result) {
          if (result["status"] == "error") {
            return cb(result);
          }
        }
      );
    }
  }
};

deployDependentAll(dependencies, targetContract, deployContractInfo, function(
  result
) {
  return console.log(result);
});

console.log("Deploy Contract Info", deployContractInfo);
