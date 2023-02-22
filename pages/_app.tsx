import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { Web3Modal } from "@web3modal/react";
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { bsc } from "wagmi/chains";
import { AppProps } from 'next/app';

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.WALLET_CONNECT_PROJECT_ID) {
  throw new Error('You need to provide WALLET_CONNECT_PROJECT_ID env variable')
}

const projectId = process.env.WALLET_CONNECT_PROJECT_ID

// 2. Configure wagmi client
const { chains, provider } = configureChains([bsc], [walletConnectProvider({ projectId })])
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    appName: 'GogeMigration',
    chains
  }),
  provider
})

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains)

function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <>
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeColor="magenta" />
    </>
  )
}

export default MyApp