var solc = require("solc");

var input = {
  language: "Solidity",
  sources: {
    "test.sol": {
      content:
        'pragma solidity ^0.4.24;\n\ncontract Voting {\n\tstruct Voter {\n\t\tuint weight;\n\t\tbool voted;\n\t}\n\n\tstruct Proposal {\n\t\tbytes32 name;\n\t\tuint voteCount;\n\t}\n\n\tbool public isOpen = true;\n\taddress public chairperson;\n\n\tmapping(address => Voter) public voters;\n\n\tProposal[] public proposals;\n\n\tconstructor(bytes32[] proposalNames) public {\n\t\tchairperson = msg.sender;\n\t\tvoters[chairperson].weight = 1;\n\n\t\tfor (uint i = 0; i < proposalNames.length; i++) {\n\t\t\tproposals.push(Proposal({\n\t\t\t\tname: proposalNames[i],\n\t\t\t\tvoteCount: 0\n\t\t\t}));\n\t\t}\n\t}\n\n\tfunction giveRightToVote(address voter) public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\trequire(msg.sender == chairperson, "Only chairperson can give right to vote.");\n\t\trequire(!voters[voter].voted, "The voter already voted.");\n\t\trequire(voters[voter].weight == 0, "Already granted");\n\t\tvoters[voter].weight = 1;\n\t}\n\n\tfunction vote(uint proposal) public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\tVoter storage sender = voters[msg.sender];\n\t\trequire(sender.weight > 0, "No voting right");\n\t\trequire(!sender.voted, "Already voted.");\n\t\tsender.voted = true;\n\n\t\tproposals[proposal].voteCount += sender.weight;\n\t}\n\n\tfunction winningProposal() public view returns (uint winningProposal_) {\n\t\tuint winningVoteCount = 0;\n\t\tfor (uint p = 0; p < proposals.length; p++) {\n\t\t\tif (proposals[p].voteCount > winningVoteCount) {\n\t\t\t\twinningVoteCount = proposals[p].voteCount;\n\t\t\t\twinningProposal_ = p;\n\t\t\t}\n\t\t}\n\t}\n\n\tfunction winnerName() public view returns (bytes32 winnerName_) {\n\t\twinnerName_ = proposals[winningProposal()].name;\n\t}\n\n\tfunction closeVoting() public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\trequire(msg.sender == chairperson, "Only chairperson can close voting.");\n\t\tisOpen = false;\n\t}\n\n}\n'
    },

    "x.sol": {
      content:
        'pragma solidity ^0.4.24;\n\ncontract Voting {\n\tstruct Voter {\n\t\tuint weight;\n\t\tbool voted;\n\t}\n\n\tstruct Proposal {\n\t\tbytes32 name;\n\t\tuint voteCount;\n\t}\n\n\tbool public isOpen = true;\n\taddress public chairperson;\n\n\tmapping(address => Voter) public voters;\n\n\tProposal[] public proposals;\n\n\tconstructor(bytes32[] proposalNames) public {\n\t\tchairperson = msg.sender;\n\t\tvoters[chairperson].weight = 1;\n\n\t\tfor (uint i = 0; i < proposalNames.length; i++) {\n\t\t\tproposals.push(Proposal({\n\t\t\t\tname: proposalNames[i],\n\t\t\t\tvoteCount: 0\n\t\t\t}));\n\t\t}\n\t}\n\n\tfunction giveRightToVote(address voter) public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\trequire(msg.sender == chairperson, "Only chairperson can give right to vote.");\n\t\trequire(!voters[voter].voted, "The voter already voted.");\n\t\trequire(voters[voter].weight == 0, "Already granted");\n\t\tvoters[voter].weight = 1;\n\t}\n\n\tfunction vote(uint proposal) public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\tVoter storage sender = voters[msg.sender];\n\t\trequire(sender.weight > 0, "No voting right");\n\t\trequire(!sender.voted, "Already voted.");\n\t\tsender.voted = true;\n\n\t\tproposals[proposal].voteCount += sender.weight;\n\t}\n\n\tfunction winningProposal() public view returns (uint winningProposal_) {\n\t\tuint winningVoteCount = 0;\n\t\tfor (uint p = 0; p < proposals.length; p++) {\n\t\t\tif (proposals[p].voteCount > winningVoteCount) {\n\t\t\t\twinningVoteCount = proposals[p].voteCount;\n\t\t\t\twinningProposal_ = p;\n\t\t\t}\n\t\t}\n\t}\n\n\tfunction winnerName() public view returns (bytes32 winnerName_) {\n\t\twinnerName_ = proposals[winningProposal()].name;\n\t}\n\n\tfunction closeVoting() public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\trequire(msg.sender == chairperson, "Only chairperson can close voting.");\n\t\tisOpen = false;\n\t}\n\n}\n'
    },

    "y.sol": {
      content:
        'pragma solidity ^0.4.24;\n\ncontract Voting {\n\tstruct Voter {\n\t\tuint weight;\n\t\tbool voted;\n\t}\n\n\tstruct Proposal {\n\t\tbytes32 name;\n\t\tuint voteCount;\n\t}\n\n\tbool public isOpen = true;\n\taddress public chairperson;\n\n\tmapping(address => Voter) public voters;\n\n\tProposal[] public proposals;\n\n\tconstructor(bytes32[] proposalNames) public {\n\t\tchairperson = msg.sender;\n\t\tvoters[chairperson].weight = 1;\n\n\t\tfor (uint i = 0; i < proposalNames.length; i++) {\n\t\t\tproposals.push(Proposal({\n\t\t\t\tname: proposalNames[i],\n\t\t\t\tvoteCount: 0\n\t\t\t}));\n\t\t}\n\t}\n\n\tfunction giveRightToVote(address voter) public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\trequire(msg.sender == chairperson, "Only chairperson can give right to vote.");\n\t\trequire(!voters[voter].voted, "The voter already voted.");\n\t\trequire(voters[voter].weight == 0, "Already granted");\n\t\tvoters[voter].weight = 1;\n\t}\n\n\tfunction vote(uint proposal) public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\tVoter storage sender = voters[msg.sender];\n\t\trequire(sender.weight > 0, "No voting right");\n\t\trequire(!sender.voted, "Already voted.");\n\t\tsender.voted = true;\n\n\t\tproposals[proposal].voteCount += sender.weight;\n\t}\n\n\tfunction winningProposal() public view returns (uint winningProposal_) {\n\t\tuint winningVoteCount = 0;\n\t\tfor (uint p = 0; p < proposals.length; p++) {\n\t\t\tif (proposals[p].voteCount > winningVoteCount) {\n\t\t\t\twinningVoteCount = proposals[p].voteCount;\n\t\t\t\twinningProposal_ = p;\n\t\t\t}\n\t\t}\n\t}\n\n\tfunction winnerName() public view returns (bytes32 winnerName_) {\n\t\twinnerName_ = proposals[winningProposal()].name;\n\t}\n\n\tfunction closeVoting() public {\n\t\trequire(isOpen == true, "This voting is already closed.");\n\t\trequire(msg.sender == chairperson, "Only chairperson can close voting.");\n\t\tisOpen = false;\n\t}\n\n}\n'
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
        "": ["ast"]
      }
    }
  }
};

solc.loadRemoteVersion("v0.4.24+commit.e67f0147", function(err, solcSnapshot) {
  if (err) {
    console.log("Error Inside loadRemote", err);
  } else {
    let compiledContract = solcSnapshot.compile(JSON.stringify(input));
    console.log(compiledContract);
  }
});
