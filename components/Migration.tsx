import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { Contract, ethers } from "ethers";
import GogeToken1 from "../pages/GogeTokenV1.json";
import GogeToken2 from "../pages/GogeTokenV2.json";

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc_testnet_chapel");

// get GOGE V1 token contract
const contractV1 = new ethers.Contract(
  GogeToken1.address,
  GogeToken1.abi,
  provider
);

// get GOGE V2 token contract
const contractV2 = new ethers.Contract(
  GogeToken2.address,
  GogeToken2.abi,
  provider
);

// setup Migration component
const Migration = () => {
  const [connected, setConnected] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const [wallet, setWallet] = useState("");
  const [web3Provider, setProvider] = useState(null) as any;

  const [balanceV1, setBalanceV1] = useState("0.0");
  const [balanceV2, setBalanceV2] = useState("0.0");

  async function connect() {
    const ethereum = (window as any).ethereum;
  
    if (ethereum) {
      // grab first value of accounts array returned
      const [account] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(account);
      console.log(account);

      const bal:string = ethers.utils.formatEther(await contractV1.balanceOf(account));
      setBalanceV1(bal);

      const web3Provider = new ethers.providers.Web3Provider(ethereum); 
      setProvider(web3Provider);
      console.log(web3Provider.getNetwork());

      setConnected(true);
    } else {
      console.log("Please install Wallet");
    }
  }
  
  async function migrate() {
    if(web3Provider !== null && wallet.length > 0) {
      // check balance
      const balV1:ethers.BigNumber = await contractV1.balanceOf(wallet);
      // check price feed given the balance

      // if greater than equivalent amount of $2, replace zero with price feed results
      if(balV1.gt(0)) {
        const signer = web3Provider.getSigner();
        const approvalTx = await contractV1.connect(signer).approve(GogeToken2.address, balV1);
        // wait until transaction is mined.
        await approvalTx.wait();

        const migrateTx = await contractV2.connect(signer).migrate();
        // wait until transaction is mined.
        await migrateTx.wait();
        
        const balV2 = ethers.utils.formatEther(await contractV2.balanceOf(wallet));
        setBalanceV2(balV2);
        setMigrated(true);
      } else {
        setBalanceV1("Insufficient GOGE V1 balance!");
      }
    }
  }

  return (
      <>
          <div className="top-migration-section px-10">
              <div className="w-2/6 xs:w-5/6 sm:w-4/6 md:w-2/6 lg:w-2/6 xl:w-2/6 py-7 m-auto text-center font-semibold"><span>Goge Migration Page</span><br /><span className="text-sm">Migrate your v1 tokens for v2 tokens.</span></div>
          </div>
          <div className="flex h-screen">
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
                                  <h1 className="font-bold text-purple-700">GOGE V1 Balance:</h1>
                                  <h2 className="text-truncate text-purple-700">{balanceV1}</h2>
                                </div>
                            }
                          </div>
                          <div className="mt-5 flex flex-col items-center">
                              <button
                              type="button"
                              onClick={connected ? migrate : connect}
                              className="inline-flex m-auto content-center migrate-button px-4 py-2 sm:text-sm"
                              >
                                {connected ? "Migrate Tokens" : "Connect Wallet"}
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