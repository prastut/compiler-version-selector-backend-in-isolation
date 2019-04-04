var solc = require("solc");

var input = {
	language: 'Solidity',
	sources: {
	  'test.sol': {
		content:
		  '',
	  },
	},
	settings: {
	  outputSelection: {
		'*': {
		  '*': ['abi', 'evm.bytecode'],
		},
	  },
	},
  }

solc.loadRemoteVersion('v0.4.24+commit.e67f0147', function(err, solcSnapshot) {
	    if (err) {
	      console.log("Error Inside loadRemote", err);
	    } else {
		  let compiledContract = solcSnapshot.compile(JSON.stringify(input));
		  console.log(compiledContract); 
}});
