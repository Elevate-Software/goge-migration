/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost']
  },
  env: {
    NEXT_PUBLIC_META_RAFT_MINT_PRICE: process.env.NEXT_PUBLIC_META_RAFT_MINT_PRICE,
    NEXT_PUBLIC_META_RAFT_JSON_RPC_PROVIDER: process.env.NEXT_PUBLIC_META_RAFT_JSON_RPC_PROVIDER,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
  },
 }
 
 
 module.exports = nextConfig