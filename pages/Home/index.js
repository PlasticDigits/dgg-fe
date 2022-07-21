
import React, { Component, useEffect, useState } from 'react';
import Web3ModalButton from '../../components/Web3ModalButton';
import Footer from '../../components/Footer';
import "./index.module.scss";
import { useEthers, useContractFunction, useCall  } from '@usedapp/core'
import { utils, Contract } from 'ethers'
import useCountdown from "../../hooks/useCountdown";
import DggLogo from '../../public/static/assets/logo.png';
import DggMascot from '../../public/static/assets/images/Refined Mascot Full.png';
import BackgroundImage from '../../public/static/assets/images/bg.jpg';
import DggSaleAbi from "../../abi/DggSale.json";
import IERC20Abi from "../../abi/IERC20.json";
import {  ADDRESS_BUSD, ADDRESS_DGGSALE } from '../../constants/addresses';
import { UrlJsonRpcProvider } from '@ethersproject/providers';
const { formatEther, parseEther, Interface } = utils;

const DggSaleInterface = new Interface(DggSaleAbi);
const DggaleContract = new Contract(ADDRESS_DGGSALE,DggSaleInterface);

const displayWad = (wad)=>!!wad ? Number(formatEther(wad)).toFixed(2) : "..."

function Home() {
  const {account,library,chainId,activateBrowserWallet} = useEthers();
  
  const { state: stateDeposit, send: sendDeposit } = useContractFunction(DggaleContract, 'deposit');


  const [depositBnbInput,setDepositBnbInput] = useState(0.1)
  console.log("test")
  const { value: [minDepositWad], error: minDepositWadError } = useCall({
     contract: DggaleContract,
     method: 'minDepositWad',
     args: []
   }) ?? {value:[]}

  console.log(minDepositWad)

  const { value: [maxDepositWad], error: maxDepositWadError } = useCall({
     contract: DggaleContract,
     method: 'maxDepositWad',
     args: []
   }) ?? {value:[]}
  const { value: [hardcap], error: hardcapError } = useCall({
     contract: DggaleContract,
     method: 'hardcap',
     args: []
   }) ?? {value:[]}
  const { value: [totalDeposits], error: totalDepositsError } = useCall({
     contract: DggaleContract,
     method: 'totalDeposits',
     args: []
   }) ?? {value:[]}
  const { value: [startEpoch], error: startEpochError } = useCall({
     contract: DggaleContract,
     method: 'startEpoch',
     args: []
   }) ?? {value:[]}
  const { value: [endEpoch], error: endEpochError } = useCall({
     contract: DggaleContract,
     method: 'endEpoch',
     args: []
   }) ?? {value:[]}
  const { value: [depositedAmount], error: depositedAmountError } = useCall({
     contract: DggaleContract,
     method: 'depositedAmount',
     args: [account]
   }) ?? {value:[]}
   
  const startEpochTimer = useCountdown(startEpoch,"Started");
  const endEpochTimer = useCountdown(endEpoch,"Ended");

  return (<>
    <section id="top" className="hero has-text-centered">
        <div>
            <div className="hero-head has-text-left pb-5" style={{marginLeft:"auto",marginRight:"auto",maxWidth:"1080px"}}>
              <div className="mt-3 pb-0 mb-0" style={{float:"left"}}>
                  <a href="https://dogegod.io">
                    <figure className="image is-128x128 is-rounded m-0 is-pulled-left ml-2 mr-5 mb-0" style={{display:"inline-block",top:"2px",position:"relative"}}>
                        <img src={DggLogo} />
                    </figure>
                  </a>
                  <p className="title ml-5 mt-4" style={{color:"white"}}>DogeGod</p>
                  <p className="subtitle is-size-6 mr-5 " style={{color:"#ddd"}}>The most profitable source of Dogecoin on the planet.</p>
              </div>
                <Web3ModalButton />
              <div className="is-clearfix"></div>
            </div>
            <div className='hero-body p-0 m-0 pt-5 pb-5' style={{color:"#ddd", backgroundImage:`url(${BackgroundImage})`,backgroundAttachment:"fixed", backgroundSize:'cover'}}>
              <div className="container has-text-centered">
                <h2 className="is-size-3 mt-3">PRESALE: Use <span style={{color:"#edb71d"}}>BNB</span> or <span style={{color:"#4dc491"}}>STABLES</span></h2>
                <div className="p-2" style={{maxWidth:"300px",marginLeft:"auto",marginRight:"auto"}}>
                  <ul>
                    <hr className="m-2 has-background-primary"/>
                    <li style={{textShadow: "0px 0px 4px black"}}>20 USD = 2875k DGOD</li>
                    <li style={{textShadow: "0px 0px 4px black"}}>Hardcap: {displayWad(hardcap)} USD</li>
                    <li style={{textShadow: "0px 0px 4px black"}}>Total Deposits: {displayWad(totalDeposits)} USD</li>
                    <li style={{textShadow: "0px 0px 4px black"}}>Wallet Max: {displayWad(maxDepositWad)} USD</li>
                    <li style={{textShadow: "0px 0px 4px black"}}>Wallet Min: {displayWad(minDepositWad)} USD</li>
                    <hr className="m-2 has-background-primary"/>
                    <li style={{textShadow: "0px 0px 4px black"}}>Start Timer: {startEpochTimer}</li>
                    <li style={{textShadow: "0px 0px 4px black"}}>End Timer: {endEpochTimer}</li>
                    <hr className="m-2 has-background-primary"  />
                    <li style={{textShadow: "0px 0px 4px black"}}>Your Deposit: {displayWad(depositedAmount)} USD</li>
                    <hr className="m-2 has-background-primary"/>
                  </ul>
                </div>
                <div className='mt-6'>
                  <input id="amountEtherInput" name="amountEtherInput" type="number" className='mb-3 input is-normal' step="0.1" min="0" max="100"
                    style={{maxWidth:"95px",border:"solid 2px #191919"}}
                    value={depositBnbInput}
                    onChange={(event)=>{
                      console.log("EVENT");
                      console.log(event.target.value);
                      let inputNum = Number(event.target.value);
                      if(!Number.isFinite(inputNum)) return;
                      let minNum = !!minDepositWad ? Number(formatEther(minDepositWad)) : 0;
                      console.log("minNum",minNum)
                      if(!!minDepositWad && (inputNum < minNum)) inputNum = minNum;
                      console.log("postmin",inputNum);
                      let maxNum = !!maxDepositWad ? Number(formatEther(maxDepositWad)) : 100;
                      if(!!maxDepositWad && (inputNum > maxNum)) inputNum = maxNum;
                      console.log("postmax",inputNum);
                      inputNum = Math.floor(inputNum*10)/10;
                      console.log("final",inputNum);
                      setDepositBnbInput(inputNum);
                    }} /> 
                    <span style={{position:"relative",top:"7px"}}><span style={{textShadow: "0px 0px 4px black",marginLeft:"4px"}}>BNB</span></span><br/>
                  <button className='is-size-5 button is-primary' style={{color:!!account?"#191919":"#444",backgroundColor:!!account?"#edb71d":"#555",border:"solid 4px #29805b"}}
                    onClick={()=>sendDeposit({value:parseEther(depositBnbInput.toString())})}
                  >DEPOSIT</button><br/>
                  <figure className="image is-128x128 is-rounded mt-6" style={{display:"inline-block",top:"2px",position:"relative"}}>
                      <img src={DggMascot} />
                  </figure>
                </div>
              </div>
            </div>
        </div>
    </section>
    
    <Footer />
    
  </>);
}

export default Home
