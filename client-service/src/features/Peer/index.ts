import Peer from "peerjs";
import { createContext } from "react";

export const initializePeer = (id: string | undefined) => {
  return new Peer(id, { host: "localhost", port: 4004 });
};

export const PeerContext = createContext<Peer>(initializePeer(undefined));
