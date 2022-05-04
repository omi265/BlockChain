import React, { Component } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import OmniToken from "../abis/OmniToken.json";
import DaiToken from "../abis/DaiToken.json";
import Bank from "../abis/Bank.json";
import "./App.css";
import Web3 from "web3";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const netId = await web3.eth.net.getId();
    console.log(netId);

    const daiData = DaiToken.networks[netId];
    if (daiData) {
      const dai = new web3.eth.Contract(DaiToken.abi, daiData.address);
      this.setState({ dai });
      console.log(dai);
      let daiBalance = await dai.methods.balanceOf(this.state.account).call();
      console.log(daiBalance);
      if (daiBalance == null) {
        daiBalance = 0;
      }
      this.setState({ daiBalance: daiBalance.toString() });
      console.log({ balance: daiBalance });
    } else {
      window.alert("DaiToken contract not deployed to detected network.");
    }

    const omniData = OmniToken.networks[netId];
    if (omniData) {
      const omni = new web3.eth.Contract(OmniToken.abi, omniData.address);
      this.setState({ omni });
      let omniBalance = await omni.methods.balanceOf(this.state.account).call();
      console.log(omniBalance);
      if (omniBalance == null) {
        omniBalance = 0;
      }
      this.setState({ omniBalance: omniBalance.toString() });
      console.log({ balance: omniBalance });
    } else {
      window.alert("OmniToken contract not deployed to detected network.");
    }

    const bankData = Bank.networks[netId];
    console.log(bankData);
    if (bankData) {
      const bank = new web3.eth.Contract(Bank.abi, bankData.address);
      this.setState({ bank });
      console.log(bank);
      console.log(this.state.bank);
      let stakedBalance = await bank.methods
        .stakeBalance(this.state.account)
        .call();
      console.log(stakedBalance);
      if (stakedBalance == null) {
        stakedBalance = 0;
      }
      this.setState({ bankBalance: stakedBalance.toString() });
      console.log({ balance: stakedBalance });
    } else {
      window.alert("Bank contract not deployed to detected network.");
    }
    console.log(this.state.loading);
    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.dai.methods.approve(this.state.bank._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.bank.methods.stake(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  verifyTokens = (address) => {
    this.setState({ loading: true })
      this.state.bank.methods.verify(address).send({ from: this.state.account }).on('transactionHash', (hash) => {
        console.log(address)
        this.setState({ loading: false })
      })
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      dai: {},
      omni: {},
      bank: {},
      daiBalance: "0",
      omniBalance: "0",
      bankBalance: "0",
      loading: true,
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading
        </p>
      );
    } else {
      content = (
        <Main
          account={this.state.account}
          daiBalance={this.state.daiBalance}
          omniBalance={this.state.omniBalance}
          bankBalance={this.state.bankBalance}
          stakeTokens={this.stakeTokens}
          verifyTokens={this.verifyTokens}
        />
      );
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
