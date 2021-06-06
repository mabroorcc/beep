import Peer from "peerjs";
import { createContext } from "react";

export const peer = new Peer({ host: "localhost", port: 4004 });

export const PeerContext = createContext<Peer>(peer);
