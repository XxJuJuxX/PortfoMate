import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

// Create the injected connector instance for MetaMask
const injectedConnector = new InjectedConnector();

function ConnectToMetaMask() {
  const { active, activate, account, library: provider } = useWeb3React();

  useEffect(() => {
    if (!active) {
      activate(injectedConnector);
    }
  }, [active, activate]);

  const connectToMetaMaskHandler = () => {
    if (!account) {
      activate(injectedConnector);
    }
  };

  return (
    <React.Fragment>
      {account ? (
        <span>Connected: {account}</span>
      ) : (
        <button onClick={connectToMetaMaskHandler}>Connect</button>
      )}
    </React.Fragment>
  );
}

export default ConnectToMetaMask;

