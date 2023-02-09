import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Contract, ethers } from "ethers";
import GogeToken1 from "../pages/GogeTokenV1.json";
import GogeToken2 from "../pages/GogeTokenV2.json";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import Image from 'next/image'
import Logo1 from "../public/goge_logo.png";
import Logo2 from "../public/goge_logo_2.png";
import Rainbow from "../public/rainbow.png";
import { truncate } from 'truncate-ethereum-address';
import { stat } from "fs";
import { Component } from "react";
// Web3Modal import
import { Web3Modal } from "@web3modal/react";
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react'


// Wagmi import
import { configureChains, createClient, WagmiConfig, useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { bscTestnet, bsc } from "wagmi/chains";

if(!process.env.WALLET_CONNECT_PROJECT_ID){
    throw new Error('You need to provide WALLET_CONNECT_PROJECT_ID env variable')
}

const projectId = process.env.WALLET_CONNECT_PROJECT_ID


const chains = [bscTestnet]
const { provider } = configureChains(chains, [walletConnectProvider({ projectId })])
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    appName: 'GogeMigration',
    chains
  }),
  provider
})

export const ethereumClient = new EthereumClient(wagmiClient, chains)


//const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc_testnet_chapel");
let account = ''

// get GOGE V1 token contract
/*const contractV1 = new ethers.Contract(
  GogeToken1.address,
  GogeToken1.abi,
  provider
);

// get GOGE V2 token contract
const contractV2 = new ethers.Contract(
  GogeToken2.address,
  GogeToken2.abi,
  provider
);*/

// setup Migration component
const Migration = () => {
  const [enabledBalance, setEnabledBalance] = useState(false);
  const [status, setStatus] = useState("");
  const [connected, setConnected] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const [wallet, setWallet] = useState("");
  const [web3Provider, setProvider] = useState(null) as any;
  const { width, height } = useWindowSize();
  const [balanceV1, setBalanceV1] = useState("0.0");
  const [balanceV2, setBalanceV2] = useState("0.0");
  const [ready, setReady] = useState(false)

  // Get address using Wagmi
  const { address: addressWallet } = useAccount({
    onConnect(data) {
      console.log('Success addressWallet:', data.address);
    },
    onDisconnect() {
      console.log('Disconnected')
    },
  }) as any;

  // Get balance using Wagmi
  const { data: balanceWallet } = useBalance({
    address: addressWallet,
    formatUnits: 'ether',
    onSuccess(data) {
      console.log('Success balanceWallet:', data.formatted.substring(0,5))
    },
    onError(error) {
      console.log('Error balanceWallet', error)
    },
  })

  const { data: nftBalance } = useContractRead({
    address: '0xf89c10e67b2F8bDd2a44cF4E081378e0EAA5C428',
    abi: GogeToken1.abi,
    functionName: 'balanceOf',
    args: [addressWallet],
    enabled: enabledBalance,
    watch: true,
    onSuccess(data) {
      setBalanceV1(Number(data).toString())
      console.log('Success V1 Balance:', balanceV1);
    },
    onError(error) {
      console.log('Error Balance:', error)
    },
  })

  useEffect(() => {
    if(!!addressWallet) {
      setEnabledBalance(true);
    } else {
    }
  }, [addressWallet])

  async function connect() {
    const ethereum = (window as any).ethereum;
  
    /*if (ethereum) {
      // grab first value of accounts array returned
      [account] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(account);

      const balV1:string = ethers.utils.formatEther(await contractV1.balanceOf(account));
      setBalanceV1(balV1);

      const balV2:string = ethers.utils.formatEther(await contractV2.balanceOf(account));
      setBalanceV2(balV2);

      const web3Provider = new ethers.providers.Web3Provider(ethereum); 
      setProvider(web3Provider);
      console.log(web3Provider.getNetwork());

      setConnected(true);

      //update status based on amount of V1 tokens
      if(balV1 == '0.0'){
        setStatus("ConnectedNoTokens");
      } else { 
        setStatus('ConnectedTokens'); 
      }

    } else {
      console.log("Please install Wallet");
    }*/
  }
  
  async function migrate() {

    /*if(web3Provider !== null && wallet.length > 0) {
      // check balance
      const balV1:ethers.BigNumber = await contractV1.balanceOf(wallet);
      // check price feed given the balance

      // if greater than equivalent amount of $2, replace zero with price feed results
      if(balV1.gt(0)) {
        const signer = web3Provider.getSigner();
        const approvalTx = await contractV1.connect(signer).approve(GogeToken2.address, balV1);
        setStatus("Approving");
        // wait until transaction is mined.
        await approvalTx.wait();

        setStatus("WaitingConfirmation");
        
        const migrateTx = await contractV2.connect(signer).migrate();
        // wait until transaction is mined.

        setStatus("Migrating");

        await migrateTx.wait();

        const balV2 = ethers.utils.formatEther(await contractV2.balanceOf(wallet));
        setBalanceV2(balV2);
        setMigrated(true);
        setStatus("Migrated")
      } else {
        setBalanceV1("Insufficient GOGE V1 balance!");
      }
    }*/
  }

  return (
      <>
        {migrated ? <Confetti /> : null}

        <nav className="bg-white font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-1 px-6 goge-navbar shadow sm:items-baseline w-full">
              <div className="mb-2 sm:mb-0">
                <Image src={Logo2} className="inline" alt="goge" /><Image className="inline" src={Logo1} alt="dog" />
              </div>
              <div className="mb-2 sm:mb-0">
                <Image src={Rainbow} className="inline" alt="rainbow" />
              </div>
              <div className="mt-5 flex flex-col items-center">
                {/*<div className='inline-flex m-auto content-center migrate-button px-4 py-2 sm:text-sm' onClick={connect}>{account ? truncate(account) : 'Connect Wallet'}</div>*/}
                <div className="pr-4">
                  <Web3Button icon="show" label="Connect Wallet" balance="hide" />

                  <Web3NetworkSwitch />

                </div>
              </div>
          </nav>
    
          <div className="top-migration-section px-10">
              <div className="w-2/6 xs:w-5/6 sm:w-4/6 md:w-2/6 lg:w-2/6 xl:w-2/6 py-7 m-auto text-center font-semibold"><span>Goge Migration Page</span><br /><span className="text-sm">Migrate your v1 tokens for v2 tokens.</span></div>
          </div>

          <div className="flex pt-28 bg-white">
              <div className="m-auto w-1/6 xs:w-5/6 sm:w-4/6 md:w-1/6 lg:w-1/6 xl:w-1/6">
                  <div className="migrate-box">
                      <div className="px-4 py-5 sm:p-6">
                          <div className="mt-2 max-w-xl text-sm">
                            {
                              migrated ? 
                                <div>
                                  <h1 className="font-bold text-purple-700">GOGE V2 Balance:</h1>
                                  <h2 className="text-truncate text-purple-700">{balanceV2}</h2>
                                </div>
                                :
                                <div>
                                  <h1 className="font-bold text-purple-700">Migratable V1 Tokens:</h1>
                                  <h2 className="text-truncate text-purple-700">{balanceV1}</h2>
                                </div>
                            }
                          </div>
                          {/*<div className="mt-5 flex flex-col items-center">
                              <button
                              className="inline-flex m-auto content-center migrate-button px-4 py-2 sm:text-sm"
                              type="button"
                              onClick={connected ? migrate : connect}
                              disabled={(status == 'ConnectedNoTokens') ? true : (status == 'Approving') ? true : (status == 'WaitingConfirmation') ? true : (status == 'Migrating') ? true : (status == 'Migrated') ? true : false}
                              >
                                { 
                                  (!status) ? "Connect Wallet" : 
                                  (status == 'ConnectedNoTokens') ? "No Tokens To Migrate" : 
                                  (status == 'ConnectedTokens') ? 'Migrate' : 
                                  (status == 'Approving') ? 'Approving...' : 
                                  (status == 'WaitingConfirmation') ? 'Please Approve Migrate in MetaMask' : 
                                  (status == 'Migrating') ? 'Migrating...' : 
                                  (status == 'Migrated') ? 'Tokens Migrated!' : 
                                   ''}
                              </button>
                                </div>*/}
                          <div className="pt-4 flex items-center">
                            <Web3Button icon="show" label="Connect Wallet" balance="show" />
                          </div>
                      </div>
                  </div>
                  <br></br>
                  <div className="text-center text-sm">
                      Disclaimer: You must be holding more than $2 of the v1 token to migrate
                  </div>
              </div>
          </div>
      </>
  )

}

export default Migration;