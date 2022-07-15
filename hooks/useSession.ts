import { User } from "firebase/auth";
import { useContext, useEffect, useState } from "react";

import FirebaseContext from "../context/FirebaseContext";

export default function useSession() {
  const { fbApp, fbAuth } = useContext(FirebaseContext);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fbAuth?.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, [])

  return { fbApp, fbAuth, user }
}
