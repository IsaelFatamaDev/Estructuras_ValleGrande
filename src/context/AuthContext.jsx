import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, githubProvider } from "../firebase";

const AuthContext = createContext(null);
export default AuthContext;

export function AuthProvider({ children }) {
     const [user, setUser] = useState(undefined);
     const [error, setError] = useState(null);

     useEffect(() => {
          const unsub = onAuthStateChanged(auth, (firebaseUser) => {
               setUser(firebaseUser || null);
          });
          return unsub;
     }, []);

     async function loginWithGithub() {
          setError(null);
          try {
               await signInWithPopup(auth, githubProvider);
          } catch (err) {
               if (err.code !== "auth/popup-closed-by-user") {
                    setError("No se pudo iniciar sesi\u00f3n con GitHub. Intenta de nuevo.");
               }
          }
     }

     async function logout() {
          await signOut(auth);
     }

     return (
          <AuthContext.Provider value={{ user, error, loginWithGithub, logout }}>
               {children}
          </AuthContext.Provider>
     );
}
