"use client";
import React, { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { OktoProvider, BuildType } from "okto-sdk-react";
import { useSession, signIn, signOut } from "next-auth/react";

// Create a context with a default value
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(() => {
    // Try to load from localStorage during initialization
    if (typeof window !== 'undefined') {
      return localStorage.getItem('oktoApiKey') || process.env.NEXT_PUBLIC_OKTO_CLIENT_API || "";
    }
    return process.env.NEXT_PUBLIC_OKTO_CLIENT_API || "";
  });

  const [buildType, setBuildType] = useState(() => {
    // Try to load from localStorage during initialization
    if (typeof window !== 'undefined') {
      return localStorage.getItem('oktoBuildType') || BuildType.SANDBOX;
    }
    return BuildType.SANDBOX;
  });

  const { data: session } = useSession();

  // Save to localStorage whenever values change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('oktoApiKey', apiKey);
      localStorage.setItem('oktoBuildType', buildType);
    }
  }, [apiKey, buildType]);

  async function handleGAuthCb() {
    await signIn("google");
    return "";
  }

  return (
    <AppContext.Provider value={{ apiKey, setApiKey, buildType, setBuildType }}>
      <OktoProvider apiKey={apiKey} buildType={buildType} gAuthCb={handleGAuthCb}>
        {children}
      </OktoProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
