import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import GogeToken1 from "../pages/GogeTokenV1.json";
import GogeToken2 from "../pages/GogeTokenV2.json";
import Confetti from 'react-confetti';
import Image from 'next/image'
import Logo1 from "../public/goge_logo.png";
import Logo2 from "../public/goge_logo_2.png";
import Rainbow from "../public/rainbow.png";

// Web3 connect wallet import
import { Web3Button } from '@web3modal/react'
// Wagmi imports
import { useAccount, useBalance, useContractWrite, usePrepareContractWrite } from 'wagmi'

// setup Migration component
const Migration = () => {
  const [balanceV1, setBalanceV1] = useState("0.0");
  const [balanceV2, setBalanceV2] = useState("0.0");

  // Get address using Wagmi
  const { isConnected: isConnected, address: wallet } = useAccount({
    onConnect(data) {
      console.log('Success wallet:', data.address);
    },
    onDisconnect() {
      console.log('Disconnected')
    },
  });

  // Get V1 balance using Wagmi
  useBalance({
    address: wallet,
    token: "0xf89c10e67b2F8bDd2a44cF4E081378e0EAA5C428",
    enabled: isConnected,
    onSuccess(data) {
      setBalanceV1(data.formatted)
      console.log('Success V1 balance:', data.formatted)
    },
    onError(error) {
      console.error('Error V1 balance', error)
    },
  })

  //Get V2 balance using Wagmi
  useBalance({
    address: wallet,
    token: "0x1618efC9867F3Bd7D2bf80ce5f7E6174Fd3bEf96",
    enabled: isConnected,
    onSuccess(data) {
      setBalanceV2(data.formatted)
      console.log('Success V2 balance:', data.formatted)
    },
    onError(error) {
      console.error('Error V2 balance', error)
    },
  })

  const { config: approveConfig } = usePrepareContractWrite({
    address: "0xf89c10e67b2F8bDd2a44cF4E081378e0EAA5C428",
    abi: GogeToken1.abi,
    functionName: "approve",
    args:[GogeToken2.address, ethers.utils.parseUnits(balanceV1)],
    enabled: isConnected && !ethers.utils.parseUnits(balanceV1).isZero(),
    onSuccess(data){
        console.log(`Prepared ${data.functionName} to approve ${balanceV1} V1 tokens for ${wallet}`)
    },
    onError(error) {
        console.error('Failed to prepare approval', error);
    }
  })

  const { isSuccess: approveSuccess, writeAsync: approveTx } = useContractWrite({
    ...approveConfig,
    mode: "prepared",
    onSuccess() {
        console.log(`Successfully approved GogeV1 balance for ${wallet}`)
    },
    onError(error) {
        console.error('Failed to perform approval', error)
    }
  })

  const { config: migrateConfig } = usePrepareContractWrite({
    address: "0x1618efC9867F3Bd7D2bf80ce5f7E6174Fd3bEf96",
    abi: GogeToken2.abi,
    functionName: "migrate",
    enabled: isConnected && approveSuccess, // unless disabled, this will always run immediately!
    onSuccess(data){
        console.log(`Prepared ${data.functionName} to migrate tokens for ${wallet}`)
    },
    onError(error) {
        console.error('Failed to prepare migration', error);
    }
  })

  const { isSuccess: migrateSuccess, writeAsync: migrateTx } = useContractWrite({
    ...migrateConfig,
    mode: "prepared",
    onSuccess() {
        console.log(`Successfully migrated V1 tokens to V2 for ${wallet}`)
        console.log('V1 Balance: ', balanceV1);
    },
    onError(error) {
        console.error('Failed to perform migration', error)
    }
  })

  useEffect(() => {
    if(!isConnected) {
        console.log('Please connect a wallet to the application!')
        setBalanceV1("0.0")
        setBalanceV2("0.0")
    }
  }, [isConnected])

  return (
      <>
        {migrateSuccess ? <Confetti /> : null}

        <nav className="bg-white font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-1 px-6 goge-navbar shadow sm:items-baseline w-full">
              <div className="mb-2 sm:mb-0">
                <Image src={Logo2} className="inline" alt="goge" /><Image className="inline" src={Logo1} alt="dog" />
              </div>
              <div className="mb-2 sm:mb-0">
                <Image src={Rainbow} className="inline xs:relative sm:absolute md:absolute lg:absolute  xl:absolute top-5" alt="rainbow" />
              </div>
              <div className="mt-5 flex flex-col items-center">
                {/*<div className='inline-flex m-auto content-center migrate-button px-4 py-2 sm:text-sm' onClick={connect}>{account ? truncate(account) : 'Connect Wallet'}</div>*/}
                <div className="pr-4">
                  <Web3Button icon="show" label="Connect Wallet" balance="hide" />
                </div>
              </div>
          </nav>
    
          <div className="top-migration-section px-10">
              <div className="w-2/6 xs:w-5/6 sm:w-4/6 md:w-2/6 lg:w-2/6 xl:w-2/6 py-7 m-auto text-center font-semibold"><span>Goge Migration Page</span><br /><span className="text-sm">Migrate your v1 tokens for v2 tokens.</span></div>
          </div>

          <div className="flex pt-28 bg-white">
              <div className="m-auto w-1/6 xs:w-5/6 sm:w-4/6 md:w-1/6 lg:w-1/6 xl:w-1/6">
                  <div className="migrate-box">
                      <div className="m-auto px-4 py-5 sm:p-6">
                          <div className="mt-2 max-w-xl text-sm">
                            {
                              migrateSuccess ? 
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
                          <div className="pt-4 flex content-center">
                            <button className="inline-flex m-auto migrate-button px-4 py-2 sm:text-sm"
                                disabled={!isConnected ? true : (balanceV1 == '0.0') ? true : migrateSuccess ? true : false}
                                onClick={ 
                                  !approveSuccess ? 
                                    async () => {
                                      await approveTx?.()
                                      .catch(() => {
                                          console.error('User rejected approval!');
                                      })
                                    } : 
                                    async () => {
                                      await migrateTx?.()
                                      .catch(() => {
                                          console.error('User rejected migration!')
                                    })
                                }}
                            >
                              {!isConnected  ? "Please Connect Wallet" : (balanceV1 == '0.0' && !migrateSuccess) ? "No Tokens to Migrate" : migrateSuccess ? "Tokens Migrated!" : !approveSuccess ? "Approve Migration" : "Migrate Tokens"}
                            </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </>
  )

}

export default Migration;

/*<div className="mt-5 flex flex-col items-center">
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
</div>*/