import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import GogeToken1 from "../pages/GogeTokenV1.json";
import GogeToken2 from "../pages/GogeTokenV2.json";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize'
import Image from 'next/image'
import Link from 'next/link'
import GogeDog from "../public/goge_logo_real.png";
import GogeName from "../public/goge_logo.png";
import Rainbow from "../public/rainbow.png";

// Web3 connect wallet import
import { Web3Button } from '@web3modal/react'
// Wagmi imports
import { useAccount, useBalance, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { prepareWriteContract, writeContract } from '@wagmi/core'

// setup Migration component
const Migration = () => {
  const [balanceV1, setBalanceV1] = useState("0.0");
  const [balanceV2, setBalanceV2] = useState("0.0");
  const [migrated, setMigration] = useState(false);
  const [approved, setApproval] = useState(false);
  const { width, height } = useWindowSize();

  // Get address using Wagmi
  const { isConnected: connected, address: wallet } = useAccount({
    onConnect(data) {
      console.log('Connected:', data.address);
    },
    onDisconnect() {
      console.log('Disconnected')
    },
  });

  // Get V1 balance using Wagmi
  const {data: bal } = useBalance({
    address: wallet,
    token: "0xa30d02c5cdb6a76e47ea0d65f369fd39618541fe",
    enabled: connected,
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
    token: "0x40079f576625B764E191AF9C38Ecb2e19D69B675",
    enabled: connected,
    onSuccess(data) {
      setBalanceV2(data.formatted)
      console.log('Success V2 balance:', data.formatted)
    },
    onError(error) {
      console.error('Error V2 balance', error)
    },
  })

  // Prepare approval of V1 balance
  const { config: approveConfig } = usePrepareContractWrite({
    address: "0xa30d02c5cdb6a76e47ea0d65f369fd39618541fe",
    abi: GogeToken1.abi,
    functionName: "approve",
    args:["0x40079f576625B764E191AF9C38Ecb2e19D69B675", ethers.utils.parseUnits(balanceV1)],
    enabled: connected && (bal && typeof bal !== "undefined"),
    onSuccess(data){
        console.log(`Prepared ${data.functionName} to approve ${balanceV1} V1 tokens for ${wallet}`)
    },
    onError(error) {
        console.error('Failed to prepare approval', error);
    }
  })

  const { writeAsync: approveTx } = useContractWrite({
    ...approveConfig,
    mode: "prepared",
  })

  useEffect(() => {
    if(!connected) {
        console.log('Please connect a wallet to the application!')
        setBalanceV1("0.0")
        setBalanceV2("0.0")
    }
  }, [connected])

  return (
      <>
        {migrated ? <Confetti width={width} height={height}/> : null}

        <nav className="flex justify-between items-center bg-[#3E274F]">
          <Link href="https://goge.co/">
            <div className='flex items-center py-4 pl-16'>
              <Image className="w-12 h-12 sm:block" src={GogeDog} alt="Goge"/>
              <Image className="ml-3 hidden sm:block" src={GogeName} alt="Goge"/>
            </div>
          </Link>
          <Image className="hidden sm:block" src={Rainbow} alt="Goge" />
          <div className='pr-16'>
            <Web3Button icon="hide" label="Connect Wallet" balance="hide"/>
          </div>
        </nav>
    
        <div className="top-migration-section px-12">
          <div className="w-2/6 xs:w-5/6 sm:w-4/6 md:w-2/6 lg:w-2/6 xl:w-2/6 py-3 m-auto text-center font-semibold">
            <span className="text-lg">Goge Migration Page</span>
            <br/>
            <span className="text-md">Migrate your V1 tokens to V2 tokens!</span>
          </div>
          <div className="w-2/6 xs:w-5/6 sm:w-4/6 md:w-2/6 lg:w-2/6 xl:w-2/6 py-3 m-auto flex flex-row justify-center gap-4">
              <a className="p-1 border border-2 border-solid border-[#3E274F] rounded-md hover:bg-purple-400 text-sm font-bold gap-1" href="https://bscscan.com/address/0xa30d02c5cdb6a76e47ea0d65f369fd39618541fe#writeContract" rel="noreferrer noopener" target="_blank">
                V1 Contract
              </a>
              <a className="p-1 border border-2 border-solid border-[#3E274F] rounded-md hover:bg-purple-400 text-sm font-bold gap-1" href="https://bscscan.com/address/0x40079f576625B764E191AF9C38Ecb2e19D69B675#writeContract" rel="noreferrer noopener" target="_blank">
                V2 Contract
              </a>
          </div>
        </div>

        <div className="flex pt-28">
            <div className="m-auto w-1/6 xs:w-5/6 sm:w-4/6 md:w-1/6 lg:w-1/6 xl:w-1/6">
                <div className="migrate-box">
                    <div className="m-auto px-4 py-5 sm:p-6">
                        <div className="max-w-xl text-sm">
                          {
                            (migrated || balanceV2 !== "0.0") && (balanceV1 === "0.0") ? 
                              <div>
                                <h1 className="font-bold">GOGE V2 Balance:</h1>
                                <h2 className="text-truncate">{balanceV2}</h2>
                              </div>
                              :
                              <div>
                                <h1 className="font-bold">Migratable V1 Tokens:</h1>
                                <h2 className="text-truncate">{balanceV1}</h2>
                              </div>
                          }
                        </div>
                        <div className="pt-4 flex content-center">
                          <button className="inline-flex m-auto migrate-button px-4 py-2 sm:text-sm font-bold disabled:text-neutral-500 disabled:border-2"
                              disabled={!connected ? true : (balanceV1 === '0.0') ? true : migrated ? true : false}
                              onClick={ 
                                !approved ? 
                                  async () => {
                                    await approveTx?.()
                                    .then(async (tx) => {
                                      const receipt = await tx.wait() 
                                      if(receipt.status == 1) {
                                        console.log('Approval transaction succeeded!', receipt.logs)
                                        setApproval(true)
                                        return;
                                      }
                                      console.error('Approval transaction reverted!', receipt.logs)
                                      setApproval(false)
                                    })
                                    .catch(() => {
                                        console.error('User rejected approval!')
                                    })
                                  } : 
                                  async () => {
                                    try {
                                      // Prepare migration transaction
                                      const config = await prepareWriteContract({
                                        address: "0x40079f576625B764E191AF9C38Ecb2e19D69B675",
                                        abi: GogeToken2.abi,
                                        functionName: "migrate",
                                      });
                                      // Start migration transaction
                                      const migrateTx = await writeContract(config)
                                      // Ensure that migration transaction is mined
                                      const receipt = await migrateTx.wait()
                                      // Verify status of migration transaction 1 is success, 0 is revert
                                      if(receipt.status == 1) {
                                        console.log('Migration transaction succeeded!', receipt.logs)
                                        setMigration(true)
                                        return;
                                      }
                                      console.error('Migration transaction reverted!', receipt.logs)
                                      setMigration(false)
                                    } catch(err) {
                                      console.error('Migration transaction error!', err)
                                    }
                                  }
                              }
                          >
                            {!connected  ? "Please Connect Wallet" : (migrated || balanceV2 !== "0.0") ? "Tokens Migrated!" : (balanceV1 === '0.0') ? "No Tokens to Migrate" : !approved ? "Approve Migration" : "Migrate Tokens"}
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