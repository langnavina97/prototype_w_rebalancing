import React, { Component } from "react";

// Mainnet
import IndexSwap from "./abis/IndexSwap.json";
import Rebalancing from "./abis/Rebalancing.json";
import NFTSwap from "./abis/NFTPortfolio.json";

// Testnet
import IndexSwap2 from "./abis2/IndexSwap.json";
import NFTSwap2 from "./abis2/NFTPortfolio.json";

import IERC from "./abis/IERC20.json";
import pancakeSwapRouter from "./abis/IPancakeRouter02.json";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Grid, Button, Card, Form, Input, Image, Message, Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import velvet from "./velvet.png";
import metamask from "./metamask-fox.svg";
import swal from 'sweetalert';
import ReactGA, { exception } from 'react-ga';

import "./App.css";

const axios = require('axios');

const networks = {
  bscTestnet: {
    chainId: `0x${Number(97).toString(16)}`,
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-2-s1.binance.org:8545/",
      "https://data-seed-prebsc-1-s2.binance.org:8545/",
      "https://data-seed-prebsc-2-s2.binance.org:8545/",
      "https://data-seed-prebsc-1-s3.binance.org:8545/",
      "https://data-seed-prebsc-2-s3.binance.org:8545/"
    ],
    blockExplorerUrls: ["https://polygonscan.com/"]
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org"
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com/"]
  }
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
      account: '',

      RebalanceVenus: null,
      VenusContract: null,

      NFTTokenContract: null,
      DeFiTokenContract: null,
      NFTPortfolioContract: null,

      BluechipContract: null,
      RebalanceBLUE: null, 

      MetaContract: null,
      RebalanceMETA: null,

      Top10Contract: null,
      RebalanceTOP10: null,

      address: "",
      connected: false,
      
      chainId: "",

      defiToMintMainnet: 0,
      nftToMintMainnet: 0,

      withdrawValueDefi: 0,
      withdrawValueNFT: 0,

      nftTokenBalance: 0,
      defiTokenBalance: 0,

      defiTokenBalanceMainnet: 0,

      rebalance1: 0,
      rebalance2: 0,
      rebalance3: 0,
      rebalance4: 0,
      rebalance5: 0,
      rebalance6: 0,
      rebalance7: 0,
      rebalance8: 0,
      rebalance9: 0,
      rebalance10: 0,

      tokensVenus: [],
      denormsVenus: [],

      rebalanceB1: 0,
      rebalanceB2: 0,
      rebalanceB3: 0,
      rebalanceB4: 0,
      rebalanceB5: 0,

      tokensBluechip: [],
      denormsBluechip: [],

      rebalanceTOP101: 0,
      rebalanceTOP102: 0,
      rebalanceTOP103: 0,
      rebalanceTOP104: 0,
      rebalanceTOP105: 0,
      rebalanceTOP106: 0,
      rebalanceTOP107: 0,
      rebalanceTOP108: 0,
      rebalanceTOP109: 0,
      rebalanceTOP1010: 0,

      tokensTOP10: [],
      denormsTOP10: [],

      rebalanceM1: 0,
      rebalanceM2: 0,
      rebalanceM3: 0,
      rebalanceM4: 0,

      tokensMeta: [],
      denormsMeta: [],
      
      ethPerc: 0,
      btcPerc: 0,

      rate: 0
    }
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    //await this.getRate();
    //swal("The project is in the alpha stage, proceed at your own risk");

    const web3 = window.web3;
    const chainIdDec = await web3.eth.getChainId();

    this.setState({chainId: chainIdDec})

   
  }

  // first up is to detect ethereum provider
  async loadWeb3() {
    const provider = await detectEthereumProvider();

    // modern browsers
    if (provider) {
      console.log('MetaMask is connected');

      window.web3 = new Web3(provider);
    } else {
      console.log('No ethereum wallet detected');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const chainIdDec = await web3.eth.getChainId();
    const accounts = await window.web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    if(accounts[0]) {
      this.setState({ connected: true })
    }
    if(chainIdDec == "56") {
      this.setState({ account: accounts[0]}) 
      const NFTPortfolioContract = new web3.eth.Contract(NFTSwap.abi, "0x40A367c5320440a1aa78aCBC5af0A017Ed1F3772"); 

      const RebalanceVenus = new web3.eth.Contract(Rebalancing.abi, "0x4198530f637fEA7e6F70BE0cc2e4707725aa8c84"); // Venus
      const VenusContract = new web3.eth.Contract(IndexSwap.abi, "0xaCA0cd1E0aD9F049a07d32f8A017D7043CAe1c2C");

      const RebalanceBLUE = new web3.eth.Contract(Rebalancing.abi, "0x8396b811E3a262CA65B45e0aE0703BAFCE1744dB"); 
      const BluechipContract = new web3.eth.Contract(IndexSwap.abi, "0x8E2bDe9089f1838C4176e8bbC32Da5F11801C053");

      const RebalanceTOP10 = new web3.eth.Contract(Rebalancing.abi, "0xb9Cd6CD233d60011DC51c680A0C1c69CfD01A21f"); 
      const Top10Contract = new web3.eth.Contract(IndexSwap.abi, "0xF3D3aA1da8dd835e7ec1B05784E08f872F7c4869"); 

      const RebalanceMETA = new web3.eth.Contract(Rebalancing.abi, "0xA4Fb067e8509B64A4d099431e3f26f5593109d50"); 
      const MetaContract = new web3.eth.Contract(IndexSwap.abi, "0x5331a330A64d0a73ddBB9eD787AC71DE1cb736e1"); 
      
      this.setState({ RebalanceVenus, NFTPortfolioContract, BluechipContract, Top10Contract, MetaContract, VenusContract,
      RebalanceBLUE, RebalanceTOP10, RebalanceMETA});
    } 
  }

    async changeNetwork (networkName) {
      try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks[networkName]
            }
          ]
        });
      } catch (err) {
        console.log(err);
      }
      window.location.reload();
      const web3 = window.web3;
      const chainIdDec = await web3.eth.getChainId();
      this.setState({chainId: chainIdDec});
      await this.loadBlockchainData();
      
    };

    handleNetworkSwitch = async (networkName) => {
      await this.changeNetwork(networkName);
    };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  connectWallet = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      console.log("Connected");
      this.setState({
        connected: true
      })

    } else {
      alert("Metamask not found");
    }

    this.loadBlockchainData();
    window.location.reload();
  }

  rebalanceVenus = async() => {
    let rebalance1 = this.state.rebalance1 * 100;
    let rebalance2 = this.state.rebalance2 * 100;
    let rebalance3 = this.state.rebalance3 * 100;
    let rebalance4 = this.state.rebalance4 * 100;
    let rebalance5 = this.state.rebalance5 * 100;
    let rebalance6 = this.state.rebalance6 * 100;
    let rebalance7 = this.state.rebalance7 * 100;
    let rebalance8 = this.state.rebalance8 * 100;
    let rebalance9 = this.state.rebalance9 * 100;
    let rebalance10 = this.state.rebalance10 * 100;

    let rebalance = [rebalance1, rebalance2, rebalance3, rebalance4, rebalance5,rebalance6,rebalance7, rebalance8, rebalance9, rebalance10];
    const sum = rebalance.reduce((a, b) => a + b, 0)
    console.log(sum);
    if(sum != 10000) {
      swal("The sum has to be 100%!");
      return;
    }
    await this.state.RebalanceVenus.methods.updateWeights(rebalance).send({from: this.state.account});
  }

  updateTokensVenus = async() => {
    let tokenList = this.state.tokensVenus;
    let denorms = this.state.denormsVenus;
    
    let tokens = tokenList.split(",");
    let denormList= denorms.split(",");

    await this.state.RebalanceVenus.methods.updateTokens(tokens, denormList).send({from: this.state.account});
  }

  pauseVenus = async() => {
    await this.state.RebalanceVenus.methods.setPause(true).send({from: this.state.account});
  }

  unpauseVenus = async() => {
    await this.state.RebalanceVenus.methods.setPause(false).send({from: this.state.account});
  }

  chargeFeeVenus = async() => {
    await this.state.RebalanceVenus.methods.feeModule().send({from: this.state.account});
  }

  rebalanceBluechip = async() => {
    let rebalance1 = this.state.rebalanceB1 * 100;
    let rebalance2 = this.state.rebalanceB2 * 100;
    let rebalance3 = this.state.rebalanceB3 * 100;
    let rebalance4 = this.state.rebalanceB4 * 100;
    let rebalance5 = this.state.rebalanceB5 * 100;

    let rebalance = [rebalance1, rebalance2, rebalance3, rebalance4, rebalance5];
    const sum = rebalance.reduce((a, b) => a + b, 0)
    if(sum != 10000) {
      swal("The sum has to be 100%!");
      return;
    }
    await this.state.RebalanceBLUE.methods.updateWeights(rebalance).send({from: this.state.account});
  }

  updateTokensBluechip = async() => {
    let tokenList = this.state.tokensBluechip;
    let denorms = this.state.denormsBluechip;
    
    let tokens = tokenList.split(",");
    let denormList= denorms.split(",");

    await this.state.RebalanceBLUE.methods.updateTokens(tokens, denormList).send({from: this.state.account});
  }

  pauseBlue = async() => {
    await this.state.RebalanceBLUE.methods.setPause(true).send({from: this.state.account});
  }

  unpauseBlue = async() => {
    await this.state.RebalanceBLUE.methods.setPause(false).send({from: this.state.account});
  }

  chargeFeeBlue = async() => {
    await this.state.RebalanceBLUE.methods.feeModule().send({from: this.state.account});
  }

  rebalanceMeta = async() => {
    let rebalance1 = this.state.rebalanceM1 * 100;
    let rebalance2 = this.state.rebalanceM2 * 100;
    let rebalance3 = this.state.rebalanceM3 * 100;
    let rebalance4 = this.state.rebalanceM4 * 100;

    let rebalance = [rebalance1, rebalance2, rebalance3, rebalance4];
    const sum = rebalance.reduce((a, b) => a + b, 0)
    if(sum != 10000) {
      swal("The sum has to be 100%!");
      return;
    }
    await this.state.MetaContract.methods.updateWeights(rebalance).send({from: this.state.account});
  }

  updateTokensMeta = async() => {
    let tokenList = this.state.tokensMeta;
    let denorms = this.state.denormsMeta;

    let tokens = tokenList.split(",");
    let denormList= denorms.split(",");

    await this.state.RebalanceMETA.methods.updateTokens(tokens, denormList).send({from: this.state.account});
  }

  pauseMeta = async() => {
    await this.state.RebalanceMETA.methods.setPause(true).send({from: this.state.account});
  }

  unpauseMeta = async() => {
    await this.state.RebalanceMETA.methods.setPause(false).send({from: this.state.account});
  }

  chargeFeeMeta = async() => {
    await this.state.RebalanceMETA.methods.feeModule().send({from: this.state.account});
  }

  rebalanceTOP10 = async() => {
    let rebalance1 = this.state.rebalanceTOP101 * 100;
    let rebalance2 = this.state.rebalanceTOP102 * 100;
    let rebalance3 = this.state.rebalanceTOP103 * 100;
    let rebalance4 = this.state.rebalanceTOP104 * 100;
    let rebalance5 = this.state.rebalanceTOP105 * 100;
    let rebalance6 = this.state.rebalanceTOP106 * 100;
    let rebalance7 = this.state.rebalanceTOP107 * 100;
    let rebalance8 = this.state.rebalanceTOP108 * 100;
    let rebalance9 = this.state.rebalanceTOP109 * 100;
    let rebalance10 = this.state.rebalanceTOP1010 * 100;

    let rebalance = [rebalance1, rebalance2, rebalance3, rebalance4, rebalance5,rebalance6,rebalance7, rebalance8, rebalance9, rebalance10];
    const sum = rebalance.reduce((a, b) => a + b, 0)
    console.log(sum);
    if(sum != 10000) {
      swal("The sum has to be 100%!");
      return;
    }
    await this.state.Top10Contract.methods.updateWeights(rebalance).send({from: this.state.account});
  }

  updateTokensTOP10 = async() => {
    let tokenList = this.state.tokensTOP10;
    let denorms = this.state.denormsTOP10;

    let tokens = tokenList.split(",");
    let denormList= denorms.split(",");

    await this.state.RebalanceTOP10.methods.updateTokens(tokens, denormList).send({from: this.state.account});
  }

  pauseTOP10 = async() => {
    await this.state.RebalanceTOP10.methods.setPause(true).send({from: this.state.account});
  }

  unpauseTOP10= async() => {
    await this.state.RebalanceTOP10.methods.setPause(false).send({from: this.state.account});
  }

  chargeFeeTOP10 = async() => {
    await this.state.RebalanceTOP10.methods.feeModule().send({from: this.state.account});
  }

  render() {

    window.addEventListener("load", function() {
      if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    
        // detect Metamask account change
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log('accountsChanges',accounts);
    
        });
    
         // detect Network account change
        window.ethereum.on('networkChanged', function(networkId){
          console.log('networkChanged',networkId);
        });

      } else {
        console.warn(
          "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
        );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
          new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
        );
      }

     
    });

    const web3 = window.web3;

    let button;
    if (!this.state.connected) {
      button = <Button style={{ position: "absolute", top: "60px", right: "20px" }} onClick={this.connectWallet} color="orange">
          <Image style={{ "padding-top": "7px" }} floated="left" size="mini" src={metamask} />
          <p>Connect to MetaMask</p>
        </Button>
    } else {
      button = <p style={{ position: "absolute", top: "110px", right: "20px", color: "#C0C0C0" }}><b>Account:</b> {this.state.account}</p>
    }

    let testnet;
   
      let buttonSwitch;
      if(this.state.chainId == "56" && this.state.connected) {
        buttonSwitch = <Button style={{ position: "absolute", top: "60px", right: "20px" }} onClick={() => this.handleNetworkSwitch("bscTestnet")} color="orange" type="submit" >Change to Testnet</Button>
      } else if (this.state.connected) {
        buttonSwitch = <Button style={{ position: "absolute", top: "60px", right: "20px" }} onClick={() => this.handleNetworkSwitch("bsc")} color="orange" type="submit" >Change to Mainnet</Button>
      }
      
      let mainnet;
      if(this.state.chainId != "97") {
        mainnet = 
        <div>
        <Grid divided='vertically'>
          <Grid.Row columns={2} style={{ margin: "20px" }}>
            <Grid.Column>

              <Card.Group>
                <Card style={{ width: "900px" }}>
                  <Card.Content style={{ background: "#406ccd" }}>
                    <Card.Header style={{ color: "white" }}>
                      Yield by Venus - Asset Management
                      </Card.Header>
                    <Card.Description>

                      <Form onSubmit={this.rebalanceVenus}>
                        <Input maxLength="5" label='BTC (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance1" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input maxLength="5" label='ETH (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance2" onChange={this.handleInputChange}></Input><br></br>
                        <Input maxLength="5" label='BNB (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance3" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input maxLength="5" label='XRP (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance4" onChange={this.handleInputChange}></Input><br></br>
                        <Input maxLength="5" label='ADA (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance5" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input maxLength="5" label='DOT (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance6" onChange={this.handleInputChange}></Input><br></br>
                        <Input maxLength="5" label='TRX (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance7" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input maxLength="5" label='CAKE (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance8" onChange={this.handleInputChange}></Input><br></br>
                        <Input maxLength="5" label='BCH (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance9" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Input maxLength="5" label='FIL (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalance10" onChange={this.handleInputChange}></Input><br></br>
                       
                        <Button color="green" style={{ margin: "20px", width: "150px" }}>Rebalance</Button>
                      </Form>

                      <Form onSubmit={this.updateTokensVenus}>
                      <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Token List: [t1, t2, ..., tx]" name="tokensVenus" onChange={this.handleInputChange}></Input><br></br>
                      <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Denorms: [d1, d2, ..., dx]" name="denormsVenus" onChange={this.handleInputChange}></Input><br></br>
 
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Update Tokens</Button>
                    </Form>

                    <Button onClick={this.pauseVenus} color="green" style={{ margin: "20px", width: "150px" }}>Pause</Button>
                    <Button onClick={this.unpauseVenus} color="green" style={{ margin: "20px", width: "150px" }}>Unpause</Button>

                    <Button onClick={this.chargeFeeVenus} color="green" style={{ margin: "20px", width: "150px" }}>Charge Fee</Button>

                    

                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>
            </Grid.Column>

            <Grid.Column>

            <Card.Group>
              <Card style={{ width: "900px" }}>
                <Card.Content style={{ background: "#406ccd" }}>
                  <Card.Header style={{ color: "white" }}>
                    TOP10 Portfolio - Asset Management
                    </Card.Header>
                  <Card.Description>

                    <Form onSubmit={this.rebalanceTOP10}>
                      <Input maxLength="5" label='BTC (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP101" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Input maxLength="5" label='ETH (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP102" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='XRP (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP103" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Input maxLength="5" label='ADA (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP104" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='AVAX (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP105" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Input maxLength="5" label='DOT (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP106" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='TRX (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP107" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Input maxLength="5" label='DOGE (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP108" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='SOL (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP109" onChange={this.handleInputChange}></Input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Input maxLength="5" label='WBNB (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceTOP1010" onChange={this.handleInputChange}></Input><br></br>
                    
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Rebalance</Button>
                    </Form>

                    <Form onSubmit={this.updateTokensTOP10}>
                      <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Token List: [t1, t2, ..., tx]" name="tokensTOP10" onChange={this.handleInputChange}></Input><br></br>
                      <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Denorms: [d1, d2, ..., dx]" name="denormsTOP10" onChange={this.handleInputChange}></Input><br></br>
 
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Update Tokens</Button>
                    </Form>

                    <Button onClick={this.pauseTOP10} color="green" style={{ margin: "20px", width: "150px" }}>Pause</Button>
                    <Button onClick={this.unpauseTOP10} color="green" style={{ margin: "20px", width: "150px" }}>Unpause</Button>

                    <Button onClick={this.chargeFeeTOP10} color="green" style={{ margin: "20px", width: "150px" }}>Charge Fee</Button>

                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
            </Grid.Column>
        
            <Grid.Column>
            <Card.Group>
              <Card style={{ width: "900px" }}>
                <Card.Content style={{ background: "#406ccd" }}>
                  <Card.Header style={{ color: "white" }}>
                    Blue Chip Portfolio - Asset Management
                    </Card.Header>
                  <Card.Description>

                    <Form onSubmit={this.rebalanceBluechip}>
                      <Input maxLength="5" label='BTC (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceB1" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='ETH (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceB2" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='XRP (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceB3" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='ADA (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceB4" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='WBNB (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceB5" onChange={this.handleInputChange}></Input><br></br>
                      
                    
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Rebalance</Button>
                    </Form>

                    <Form onSubmit={this.updateTokensBluechip}>
                      <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Token List: [t1, t2, ..., tx]" name="tokensBluechip" onChange={this.handleInputChange}></Input><br></br>
                      <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Denorms: [d1, d2, ..., dx]" name="denormsBluechip" onChange={this.handleInputChange}></Input><br></br>
 
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Update Tokens</Button>
                    </Form>

                    <Button onClick={this.pauseBlue} color="green" style={{ margin: "20px", width: "150px" }}>Pause</Button>
                    <Button onClick={this.unpauseBlue} color="green" style={{ margin: "20px", width: "150px" }}>Unpause</Button>

                    <Button onClick={this.chargeFeeBlue} color="green" style={{ margin: "20px", width: "150px" }}>Charge Fee</Button>

                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
            </Grid.Column>

            <Grid.Column>
            <Card.Group>
              <Card style={{ width: "900px" }}>
                <Card.Content style={{ background: "#406ccd" }}>
                  <Card.Header style={{ color: "white" }}>
                    META Portfolio - Asset Management
                    </Card.Header>
                  <Card.Description>

                    <Form onSubmit={this.rebalanceMeta}>
                      <Input maxLength="5" label='MANA (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceM1" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='SAND (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceM2" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='AXS (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceM3" onChange={this.handleInputChange}></Input><br></br>
                      <Input maxLength="5" label='BAKE (%)' style={{ width: "150px", padding: 3 }} required type="text" placeholder="%" name="rebalanceM4" onChange={this.handleInputChange}></Input><br></br>
                      
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Rebalance</Button>
                    </Form>

                    <Form onSubmit={this.updateTokensMeta}>
                      <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Token List: [t1, t2, ..., tx]" name="tokensMeta" onChange={this.handleInputChange}></Input><br></br>
                      <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Denorms: [d1, d2, ..., dx]" name="denormsMeta" onChange={this.handleInputChange}></Input><br></br>
 
                      <Button color="green" style={{ margin: "20px", width: "150px" }}>Update Tokens</Button>
                    </Form>

                    <Button onClick={this.pauseMeta} color="green" style={{ margin: "20px", width: "150px" }}>Pause</Button>
                    <Button onClick={this.unpauseMeta} color="green" style={{ margin: "20px", width: "150px" }}>Unpause</Button>

                    <Button onClick={this.chargeFeeMeta} color="green" style={{ margin: "20px", width: "150px" }}>Charge Fee</Button>

                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
            </Grid.Column>
            </Grid.Row>
        </Grid>
        </div>
      }

    return (
      <div className="App">
        <div>
        <Message negative>
          <Message.Header>The project is in the alpha stage, proceed at your own risk.</Message.Header>
        </Message>
      </div>
        <br></br>

        <Image src={velvet} size="medium" verticalAlign='middle'></Image>

        {button}
        {buttonSwitch}
        
        {mainnet}
        
        {testnet}
      </div >
    );
  }
}

export default App;
