import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { parse } from "querystring";

let fbClientConfig;

try {
  fbClientConfig = process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG ? parse(process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CONFIG) : undefined;
} catch (error) {
  console.log("FAILED_TO_PARSE_FB_CLIENT_CFG", { error })
}

// Initialize Firebase
export const app = typeof window === "undefined" ? undefined : initializeApp(fbClientConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = app ? getAuth(app) : undefined;
