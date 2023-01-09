import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Migration from '../components/Migration'
import Logo1 from "../public/goge_logo.png";
import Logo2 from "../public/goge_logo_2.png";
import Rainbow from "../public/rainbow.png";
import { chains, wagmiClient } from "./clientConfig";
import { createClient, configureChains, WagmiConfig } from 'wagmi';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';


export default function Home() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} coolMode modalSize="compact">

          <div className='bg-white h-screen'>
            <Migration />
          </div>

        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}
