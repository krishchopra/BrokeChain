"use client";
import React, { useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "@/app/components/LoginButton";
import { useOkto, OktoContextType, BuildType, AuthType } from "okto-sdk-react";
import GetButton from "@/app/components/GetButton";
import TransferTokens from "@/app/components/TransferTokens";
import { useAppContext } from "@/app/components/AppContext";
import AuthButton from "@/app/components/AuthButton";
import SendRawTransaction from "@/app/components/SendRawTransaction";
import { EmailOTPVerification } from "@/app/components/EmailOTPVerification";
import { PhoneOTPVerification } from "@/app/components/PhoneOTPVerification";

export default function Home() {
  const { data: session } = useSession();
  const { apiKey, setApiKey, buildType, setBuildType } = useAppContext();
  const {
    isReady,
    isLoggedIn,
    authenticate,
    authenticateWithUserId,
    logOut,
    getPortfolio,
    transferTokens,
    getWallets,
    createWallet,
    getSupportedNetworks,
    getSupportedTokens,
    getUserDetails,
    orderHistory,
    getNftOrderDetails,
    showWidgetModal,
    showOnboardingModal,
    getRawTransactionStatus,
    transferTokensWithJobStatus,
    transferNft,
    transferNftWithJobStatus,
    executeRawTransaction,
    executeRawTransactionWithJobStatus,
    setTheme,
    getTheme,
    readContractData
  } = useOkto() as OktoContextType;
  const idToken = useMemo(() => (session ? session.id_token : null), [session]);

  async function handleCreateWallet() {
    try {
      const wallet = await createWallet();
      console.log("wallet", wallet);
    } catch (error) {
      console.error("Error creating wallet", error);
    }
  }

  useEffect(() => {
    // if(!isReady) return;
    if (isLoggedIn) {
      console.log("Okto is authenticated");
      handleCreateWallet();
    } else if (idToken) {
      console.log("Okto is not authenticated");
      authenticate(idToken, (result: any, error: any) => {
        console.log("authenticated", result, error);
      });
    }
  }, [isLoggedIn, idToken, isReady]);

  return (
    <main className="flex min-h-screen flex-col items-center space-y-6 p-12 bg-violet-200">
      <div className="text-black font-bold text-3xl mb-8">Okto SDK</div>
      <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
        <div className={`w-3 h-3 rounded-full ${isLoggedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium">
          Status: {isLoggedIn ? 'Logged In' : 'Not Logged In'}
        </span>
      </div>

       <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
        <GetButton title="Get Portfolio" apiFn={getPortfolio} />
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
        <GetButton title="Create wallet" apiFn={handleCreateWallet} />
      </div>

      
    </main>
  );
}
