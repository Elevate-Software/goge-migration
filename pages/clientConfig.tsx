import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { createClient, configureChains, WagmiConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

export const { chains, provider } = configureChains(
    [bscTestnet, bsc],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: 'https://rpc.ankr.com/bsc_testnet_chapel',
            }),
        }),
        jsonRpcProvider({
            rpc: (chain) => ({
                http: 'https://rpc.ankr.com/bsc',
            }),
        }),
    ],
);

export const { connectors } = getDefaultWallets({
    appName: 'Goge Migration App',
    chains
});

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
});
