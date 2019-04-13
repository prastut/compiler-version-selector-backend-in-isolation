var solc = require("solc");

var input = {
  language: "Solidity",
  sources: {
    "test.sol": {
      content:
        'pragma solidity ^0.4.24;\n\nlibrary SafeMath {\n\n\tfunction mul(uint256 _a, uint256 _b) internal pure returns (uint256) {\n\t\tif (_a == 0) {\n\t\t\treturn 0;\n\t\t}\n\n\t\tuint256 c = _a * _b;\n\t\trequire(c / _a == _b);\n\n\t\treturn c;\n\t}\n\n\tfunction div(uint256 _a, uint256 _b) internal pure returns (uint256) {\n\t\trequire(_b > 0);\n\t\tuint256 c = _a / _b;\n\n\t\treturn c;\n\t}\n\n\tfunction sub(uint256 _a, uint256 _b) internal pure returns (uint256) {\n\t\trequire(_b <= _a);\n\t\tuint256 c = _a - _b;\n\n\t\treturn c;\n\t}\n\n\tfunction add(uint256 _a, uint256 _b) internal pure returns (uint256) {\n\t\tuint256 c = _a + _b;\n\t\trequire(c >= _a);\n\n\t\treturn c;\n\t}\n\n\tfunction mod(uint256 a, uint256 b) internal pure returns (uint256) {\n\t\trequire(b != 0);\n\t\treturn a % b;\n\t}\n}\n\ncontract ERC20 {\n\tfunction totalSupply() public view returns (uint256);\n\n\tfunction balanceOf(address _who) public view returns (uint256);\n\n\tfunction allowance(address _owner, address _spender)\n\t\tpublic view returns (uint256);\n\n\tfunction transfer(address _to, uint256 _value) public returns (bool);\n\n\tfunction approve(address _spender, uint256 _value)\n\t\tpublic returns (bool);\n\n\tfunction transferFrom(address _from, address _to, uint256 _value)\n\t\tpublic returns (bool);\n\n\tevent Transfer(\n\t\taddress indexed from,\n\t\taddress indexed to,\n\t\tuint256 value\n\t);\n\n\tevent Approval(\n\t\taddress indexed owner,\n\t\taddress indexed spender,\n\t\tuint256 value\n\t);\n}\n\ncontract StandardToken is ERC20 {\n\tusing SafeMath for uint256;\n\n\tmapping (address => uint256) private balances;\n\n\tmapping (address => mapping (address => uint256)) private allowed;\n\n\tuint256 private totalSupply_;\n\n\tfunction totalSupply() public view returns (uint256) {\n\t\treturn totalSupply_;\n\t}\n\n\tfunction balanceOf(address _owner) public view returns (uint256) {\n\t\treturn balances[_owner];\n\t}\n\n\tfunction allowance(\n\t\taddress _owner,\n\t\taddress _spender\n\t )\n\t\tpublic\n\t\tview\n\t\treturns (uint256)\n\t{\n\t\treturn allowed[_owner][_spender];\n\t}\n\n\tfunction transfer(address _to, uint256 _value) public returns (bool) {\n\t\trequire(_value <= balances[msg.sender]);\n\t\trequire(_to != address(0));\n\n\t\tbalances[msg.sender] = balances[msg.sender].sub(_value);\n\t\tbalances[_to] = balances[_to].add(_value);\n\t\temit Transfer(msg.sender, _to, _value);\n\t\treturn true;\n\t}\n\n\tfunction approve(address _spender, uint256 _value) public returns (bool) {\n\t\tallowed[msg.sender][_spender] = _value;\n\t\temit Approval(msg.sender, _spender, _value);\n\t\treturn true;\n\t}\n\n\tfunction transferFrom(\n\t\taddress _from,\n\t\taddress _to,\n\t\tuint256 _value\n\t)\n\t\tpublic\n\t\treturns (bool)\n\t{\n\t\trequire(_value <= balances[_from]);\n\t\trequire(_value <= allowed[_from][msg.sender]);\n\t\trequire(_to != address(0));\n\n\t\tbalances[_from] = balances[_from].sub(_value);\n\t\tbalances[_to] = balances[_to].add(_value);\n\t\tallowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);\n\t\temit Transfer(_from, _to, _value);\n\t\treturn true;\n\t}\n\n\tfunction increaseApproval(\n\t\taddress _spender,\n\t\tuint256 _addedValue\n\t)\n\t\tpublic\n\t\treturns (bool)\n\t{\n\t\tallowed[msg.sender][_spender] = (\n\t\t\tallowed[msg.sender][_spender].add(_addedValue));\n\t\temit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);\n\t\treturn true;\n\t}\n\n\tfunction decreaseApproval(\n\t\taddress _spender,\n\t\tuint256 _subtractedValue\n\t)\n\t\tpublic\n\t\treturns (bool)\n\t{\n\t\tuint256 oldValue = allowed[msg.sender][_spender];\n\t\tif (_subtractedValue >= oldValue) {\n\t\t\tallowed[msg.sender][_spender] = 0;\n\t\t} else {\n\t\t\tallowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);\n\t\t}\n\t\temit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);\n\t\treturn true;\n\t}\n\n\tfunction _mint(address _account, uint256 _amount) internal {\n\t\trequire(_account != 0);\n\t\ttotalSupply_ = totalSupply_.add(_amount);\n\t\tbalances[_account] = balances[_account].add(_amount);\n\t\temit Transfer(address(0), _account, _amount);\n\t}\n\n\tfunction _burn(address _account, uint256 _amount) internal {\n\t\trequire(_account != 0);\n\t\trequire(_amount <= balances[_account]);\n\n\t\ttotalSupply_ = totalSupply_.sub(_amount);\n\t\tbalances[_account] = balances[_account].sub(_amount);\n\t\temit Transfer(_account, address(0), _amount);\n\t}\n\n\tfunction _burnFrom(address _account, uint256 _amount) internal {\n\t\trequire(_amount <= allowed[_account][msg.sender]);\n\n\t\tallowed[_account][msg.sender] = allowed[_account][msg.sender].sub(_amount);\n\t\t_burn(_account, _amount);\n\t}\n}\n\ncontract SimpleToken is StandardToken {\n\tstring public name = "SimpleToken";\n\tstring public symbol = "SPT";\n\tuint8 public decimals = 18;\n\n\tconstructor(string _name, string _symbol, uint8 _decimals, uint _initialSupply) public {\n\t\tname = _name;\n\t\tsymbol = _symbol;\n\t\tdecimals = _decimals;\n\t\tuint _totalSupply = _initialSupply * 10**uint(decimals);\n\t\t_mint(msg.sender, _totalSupply);\n\t}\n\n}\n'
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