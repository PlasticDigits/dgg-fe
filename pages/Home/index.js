
import React, { Component, useEffect, useState } from 'react';
import Web3ModalButton from '../../components/Web3ModalButton';
import Footer from '../../components/Footer';
import "./index.module.scss";
import { useEthers, useContractFunction, useCall  } from '@usedapp/core'
import {useCoingeckoPrice } from '@usedapp/coingecko';
import { utils, Contract } from 'ethers'
import useCountdown from "../../hooks/useCountdown";
import DggLogo from '../../public/static/assets/logo.png';
import DggMascot from '../../public/static/assets/images/Refined Mascot Full.png';
import BackgroundImage from '../../public/static/assets/images/bg.jpg';
import BackgroundVideo from '../../public/static/assets/vids/bgv1.mp4';
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
  const bnbPrice = useCoingeckoPrice("binancecoin");
  
  const { state: stateDeposit, send: sendDeposit } = useContractFunction(DggaleContract, 'deposit');


  const [depositBnbInput,setDepositBnbInput] = useState(0.1)
  const [depositUsdInput,setDepositUsdInput] = useState(20)

  const { value: [minDepositWad], error: minDepositWadError } = useCall({
     contract: DggaleContract,
     method: 'minDepositWad',
     args: []
   }) ?? {value:[]}

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
            <div className='hero-body p-0 m-0 pt-5 pb-5' style={{color:"#ddd", backgroundImage:`url(${BackgroundImage})`,backgroundAttachment:"fixed", backgroundSize:'cover',position:"relative",overflow:"hidden"}}>
              <video className="background-video" autoPlay loop muted >
                <source src={BackgroundVideo} type="video/mp4" />
              </video>
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
                <div className='mt-6 is-inline-block'>
                  <input id="amountEtherInput" name="amountEtherInput" type="number" className='mb-3 input is-normal' step="0.1" min="0" max="3"
                    style={{maxWidth:"70px",border:"solid 2px #191919",paddingRight:"3px"}}
                    value={depositBnbInput}
                    onChange={(event)=>{
                      let inputNum = Number(event.target.value);
                      console.log({inputNum})
                      if(!Number.isFinite(inputNum)) return;
                      console.log({inputNum})
                      let minNum = !!minDepositWad ? Number(formatEther(minDepositWad.add(parseEther("5")).mul(100).div(Math.floor(Number(bnbPrice)*100)))) : 0;
                      if(!!minDepositWad && (inputNum < minNum)) inputNum = minNum;
                      console.log({inputNum})
                      let maxNum = !!maxDepositWad ? Number(formatEther(maxDepositWad.sub(parseEther("5")).mul(100).div(Math.floor(Number(bnbPrice)*100)))) : 100;
                      if(!!maxDepositWad && (inputNum > maxNum)) inputNum = maxNum;
                      console.log({inputNum})
                      inputNum = Math.round(inputNum*100)/100;
                      setDepositBnbInput(inputNum);
                    }} /> 
                    <span style={{position:"relative",top:"7px"}}><span style={{textShadow: "0px 0px 4px black",marginLeft:"4px"}}>BNB</span></span><br/>
                    <button className='is-size-6 button is-primary' style={{color:!!account?"#191919":"#444",backgroundColor:!!account?"#edb71d":"#555",border:"solid 4px #edb71d"}}
                      onClick={()=>sendDeposit({value:parseEther(depositBnbInput.toString())})}
                    >DEPOSIT</button><br/>
                </div>
                <div className="is-inline-block m-3 is-size-3">OR</div>
                <div className='mt-6 is-inline-block'>
                  <input id="amountEtherInput" name="amountEtherInput" type="number" className='mb-3 input is-normal' step="5" min="0" max="850"
                    style={{maxWidth:"70px",border:"solid 2px #191919",paddingRight:"3px"}}
                    value={depositUsdInput}
                    onChange={(event)=>{
                      let inputNum = Number(event.target.value);
                      if(!Number.isFinite(inputNum)) return;
                      let minNum = !!minDepositWad ? Number(formatEther(minDepositWad)) : 0;
                      if(!!minDepositWad && (inputNum < minNum)) inputNum = minNum;
                      let maxNum = !!maxDepositWad ? Number(formatEther(maxDepositWad)) : 100;
                      if(!!maxDepositWad && (inputNum > maxNum)) inputNum = maxNum;
                      inputNum = Math.round(inputNum*100)/100;
                      setDepositUsdInput(inputNum);
                    }} /> 
                      <select name="Stablecoin" style={{position:"relative",top:"0.5em"}}>
                        <option value="CZUSD" selected>CZUSD</option>
                        <option value="BUSD">BUSD</option>
                        <option value="USDC">USDC</option>
                        <option value="USDT">USDT</option>
                      </select><br/>
                    <button className='is-size-6 button is-primary' style={{color:!!account?"#191919":"#444",backgroundColor:!!account?"#29805b":"#555",border:"solid 4px #29805b"}}
                      onClick={()=>sendDeposit({value:parseEther(depositUsdInput.toString())})}
                    >DEPOSIT</button><br/>
                </div>
                <br/>
                  <figure className="image is-128x128 is-rounded mt-6" style={{display:"inline-block",top:"2px",position:"relative"}}>
                      <img src={DggMascot} />
                  </figure>
              </div>
            </div>
        </div>
    </section>
    
    <Footer />
    
  </>);
}

export default Home
