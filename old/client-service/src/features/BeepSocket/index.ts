import { Socket } from "socket.io-client";
import { createContext } from "react";

export const BeepSocket = createContext<Socket | undefined>(undefined);
