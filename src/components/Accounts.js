import React, { Component } from 'react';
import Web3 from 'web3';
import pify from 'pify';
import styled from 'styled-components';

var inputABI = [
  {
    constant: false,
    inputs: [],
    name: 'kill',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'greet',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_greeting', type: 'string' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  }
];

let web3;

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
}

const myContractAddress = '0xEe2aAd6178cA8D1bB6D2e55B36cf0D41Fb495Def';
export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Wallet = styled.div`
  padding: 1em;
  border: 1px solid #eee;
  background-color: #eee;
  margin: 2px;
  flex: 1 0 0;
`;

const Title = styled.h1`
  font-size: 0.8em;
  text-align: center;
  color: palevioletred;
`;

const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  color: green;
  border: 2px solid green;
`;

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 10,
      greeting: 'no greeting yet',
      accounts: []
    };
    // preserve the initial state in a new object
  }

  async handleGreet() {
    const MyContract = new web3.eth.Contract(inputABI, myContractAddress);
    const greeting = await MyContract.methods.greet().call();
    this.setState({ greeting });

    return greeting;
  }

  async handleCreateContract() {
    var greeterCompiled =
      '0x6060604052341561000f57600080fd5b6040516103a93803806103a983398101604052808051820191905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060019080519060200190610081929190610088565b505061012d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100c957805160ff19168380011785556100f7565b828001600101855582156100f7579182015b828111156100f65782518255916020019190600101906100db565b5b5090506101049190610108565b5090565b61012a91905b8082111561012657600081600090555060010161010e565b5090565b90565b61026d8061013c6000396000f30060606040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806341c0e1b514610051578063cfae321714610066575b600080fd5b341561005c57600080fd5b6100646100f4565b005b341561007157600080fd5b610079610185565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100b957808201518184015260208101905061009e565b50505050905090810190601f1680156100e65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610183576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b61018d61022d565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102235780601f106101f857610100808354040283529160200191610223565b820191906000526020600020905b81548152906001019060200180831161020657829003601f168201915b5050505050905090565b6020604051908101604052806000815250905600a165627a7a72305820bd8726453c09ec640d2c060a2d460966378f5bbd0dc30d8d04a7a2b1514ddaf10029';
    const accounts = await pify(web3.eth.getAccounts)();

    const MyContract = new web3.eth.Contract(inputABI, accounts[0]);

    const peeps = 'Newest Christa Contract!';
    const thing = await MyContract.deploy({
      data: greeterCompiled,
      arguments: [peeps]
    })
      .send(
        {
          from: accounts[0],
          gas: 6721975,
          gasPrice: '20000000000'
        },
        function(error, transactionHash) {
          console.log('winning!!!------', error, 'hash-----', transactionHash);
        }
      )
      .on('error', function(error) {
        console.log('shit broke');
      })
      .on('transactionHash', function(transactionHash) {
        console.log('transaction hash------', transactionHash);
      })
      .on('receipt', function(receipt) {
        console.log('recipt', receipt.contractAddress); // contains the new contract address
      })
      .on('confirmation', function(confirmationNumber, receipt) {
        console.log('confirmation======', confirmation);
      })
      .then(function(newContractInstance) {
        console.log('newContractInstance', newContractInstance.options.address); // instance with the new contract address
      });
  }

  async componentDidMount() {
    const accounts = await pify(web3.eth.getAccounts)();
    this.setState({ accounts });
  }

  handleClearText() {
    this.setState({ greeting: '' });
  }

  async handleClearContract() {
    const MyContract = new web3.eth.Contract(inputABI, myContractAddress);
    const greeting = await MyContract.methods.greet().call();
    console.log('greeting========', greeting);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" />
        <Container>
          {this.state.accounts.map(account => (
            <Wallet key={account}>
              <Title>{account}</Title>
              <Button onClick={this.handleGreet.bind(this)}>
                Create Contract
              </Button>
            </Wallet>
          ))}
        </Container>
        <p>{this.state.greeting}</p>

        <Button onClick={this.handleCreateContract.bind(this)}>
          Create Contract
        </Button>
        <Button onClick={this.handleClearText.bind(this)}>Clear</Button>
        <Button onClick={this.handleClearContract.bind(this)}>
          Kill Contract
        </Button>
      </div>
    );
  }
}

export default Accounts;
