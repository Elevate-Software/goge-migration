import React from "react";
import { useState } from "react";
import { Contract, ethers } from "ethers";
import GogeToken1 from "../pages/GogeTokenV1.json";
import GogeToken2 from "../pages/GogeTokenV2.json";
import Confetti from 'react-confetti';
import Image from 'next/image'
import Logo1 from "../public/goge_logo.png";
import Logo2 from "../public/goge_logo_2.png";
import Rainbow from "../public/rainbow.png";
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useAccount, useProvider, useSigner } from 'wagmi'
import { useContract } from 'wagmi'

// setup Migration component
const Migration = () => {
    const [status, setStatus] = useState("");
    const [migrated, setMigrated] = useState(false);
    const [balanceV1, setBalanceV1] = useState("0.0");
    const [balanceV2, setBalanceV2] = useState("0.0");

    const {data: signer} = useSigner({});

    const gogeV1 = useContract({
        address: GogeToken1.address,
        abi: GogeToken1.abi,
        signerOrProvider: signer
    })
    const gogeV2 = useContract({
        address: GogeToken2.address,
        abi: GogeToken2.abi,
        signerOrProvider: signer
    })

    const { address, isConnected, isDisconnected } = useAccount({
        onConnect({ address }) {
            // if(signer) {
            //     console.log(gogeV1.balanceOf(address));
            // }
            // setBalanceV1(ethers.utils.formatEther(gogeV1.balanceOf(address)));
        },
        onDisconnect() {
            console.log('Yeet')
        }
    }) // wagmi hook
    const provider = useProvider() // wagmi hook

    // // get GOGE V1 token contract
    // const contractV1 = new ethers.Contract(
    //     GogeToken1.address,
    //     GogeToken1.abi,
    //     provider
    // );

    // // get GOGE V2 token contract
    // const contractV2 = new ethers.Contract(
    //     GogeToken2.address,
    //     GogeToken2.abi,
    //     provider
    // );

    async function connect() {
        if (isConnected) {
            const balV1: string = ethers.utils.formatEther(await gogeV1.balanceOf(address));
            setBalanceV1(balV1);

            const balV2: string = ethers.utils.formatEther(await gogeV2.balanceOf(address));
            setBalanceV2(balV2);
        }
    }

    async function migrate() {

        if (signer !== null && isConnected) {
            // check balance
            const balV1: ethers.BigNumber = await gogeV1.balanceOf(address);
            setBalanceV1(ethers.utils.formatEther(balV1));
            // check price feed given the balance

            // if greater than equivalent amount of $2, replace zero with price feed results
            if (balV1.gt(0)) {
                const approvalTx = await gogeV1.approve(GogeToken2.address, balV1);
                setStatus("Approving");

                // wait until transaction is mined.
                await approvalTx.wait();
                setStatus("Waiting Confirmation");
                const migrateTx = await gogeV2.migrate();

                // wait until transaction is mined.
                setStatus("Migrating");
                await migrateTx.wait();

                const balV2 = ethers.utils.formatEther(await gogeV2.balanceOf(address));
                setBalanceV2(balV2);
                setMigrated(true);
                setStatus("Migrated")
            } else {
                setBalanceV1("Insufficient GOGE V1 balance!");
            }
        }
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
                    {/* <div className='inline-flex m-auto content-center migrate-button px-4 py-2 sm:text-sm' onClick={connect}>{account ? truncate(account) : 'Connect Wallet'}</div> */}
                    <ConnectButton />
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
                            <div className="mt-5 flex flex-col items-center">
                                <button
                                    className="inline-flex m-auto content-center migrate-button px-4 py-2 sm:text-sm"
                                    type="button"
                                    onClick={migrate}
                                    disabled={(status == 'ConnectedNoTokens') ? true : (status == 'Approving') ? true : (status == 'WaitingConfirmation') ? true : (status == 'Migrating') ? true : (status == 'Migrated') ? true : false}
                                >
                                    {
                                        "Migrate"
                                        // (isConnected) ? "Migrate" :
                                        //     (status == 'ConnectedNoTokens') ? "No Tokens To Migrate" :
                                        //         (status == 'ConnectedTokens') ? 'Migrate' :
                                        //             (status == 'Approving') ? 'Approving...' :
                                        //                 (status == 'WaitingConfirmation') ? 'Please Approve Migrate in MetaMask' :
                                        //                     (status == 'Migrating') ? 'Migrating...' :
                                        //                         (status == 'Migrated') ? 'Tokens Migrated!' :
                                        //                             ''}
                                    }
                                </button>
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