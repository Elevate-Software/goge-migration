import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { createClient, configureChains, WagmiConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, walletConnectWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets';

const BSC_TESTNET_RPC: string = process.env.NEXT_PUBLIC_ANKR_BSC_TESTNET!;
const BSC_RPC: string = process.env.NEXT_PUBLIC_ANKR_BSC!;

export const { chains, provider } = configureChains(
    [bscTestnet, bsc],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: BSC_TESTNET_RPC,
            }),
        }),
        jsonRpcProvider({
            rpc: (chain) => ({
                http: BSC_RPC,
            }),
        }),
    ],
);

// export const { connectors } = getDefaultWallets({
//     appName: 'Goge Migration App',
//     chains
// });

const connectors = connectorsForWallets([
    {
        groupName: 'Compatible Wallets',
        wallets: [
            injectedWallet({ chains }),
            metaMaskWallet({ chains }),
            walletConnectWallet({ chains }),
            trustWallet({ chains })
        ],
    },
]);

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
});