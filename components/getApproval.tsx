import React from "react";
import { useState } from "react";
import GogeToken1 from "../pages/GogeTokenV1.json";
import GogeToken2 from "../pages/GogeTokenV2.json";
import { useAccount } from 'wagmi'
import { useContractRead } from 'wagmi'

const getApproval = () = > {

    const { address, isConnected, isDisconnected } = useAccount(); // wagmi hook

    const { data, isError, isLoading } = useContractRead({
        address: GogeToken1.address,
        abi: GogeToken1.abi,
        functionName: 'balanceOf',
        args: [address],
        onSettled(data, error) {
            console.log('Settled', { data, error })
        },
    });

};

export default getApproval;

