import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { createContext } from "react";

type firebaseContextType = {
  fbApp: FirebaseApp | undefined
  fbAuth: Auth | undefined
};

const contextParams: firebaseContextType = { fbApp: undefined, fbAuth: undefined };

export default createContext(contextParams);
