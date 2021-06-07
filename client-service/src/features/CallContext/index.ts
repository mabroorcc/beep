import { createContext } from "react";
import Peer from "peerjs";
import { useState } from "react";

export interface ICall {
  callerId: string;
  peerConnection: Peer.MediaConnection;
}

export const useCall = () => {
  const [call, setCall] = useState<ICall | undefined>(undefined);
  const CallContext = createContext<ICall | undefined>(call);

  return { CallContext, call, setCall };
};
