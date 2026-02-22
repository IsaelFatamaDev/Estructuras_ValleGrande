import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";

const BLOBS = [
     { style: { top: "-120px", left: "-120px", width: "600px", height: "600px" }, color: "bg-blue-800/25", duration: 13, x: [0, 60, -20, 0], y: [0, -35, 25, 0] },
     { style: { bottom: "-120px", right: "-80px", width: "500px", height: "500px" }, color: "bg-slate-700/20", duration: 16, x: [0, -40, 20, 0], y: [0, 40, -20, 0] },
];

const GitHubIcon = () => (
     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
     </svg>
);

export default function Login() {
     const { user, error, loginWithGithub } = useAuth();
     const navigate = useNavigate();
     const [loading, setLoading] = useState(false);

     useEffect(() => {
          if (user) navigate("/plataforma/semestre/1");
     }, [user, navigate]);

     async function handleLogin() {
          setLoading(true);
          await loginWithGithub();
          setLoading(false);
     }

     return (
          <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {BLOBS.map((blob, i) => (
                         <motion.div
                              key={i}
                              className={"absolute " + blob.color + " rounded-full blur-[120px]"}
                              style={blob.style}
                              animate={{ x: blob.x, y: blob.y }}
                              transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
                         />
                    ))}
               </div>

               <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                         backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                         backgroundSize: "60px 60px",
                    }}
               />

               <motion.div
                    className="relative z-10 w-full max-w-sm mx-4"
                    initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
               >
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-slate-950 backdrop-blur-sm">

                         <div className="flex flex-col items-center mb-8">
                              <motion.div
                                   className="relative mb-5"
                                   initial={{ scale: 0.7, opacity: 0 }}
                                   animate={{ scale: 1, opacity: 1 }}
                                   transition={{ duration: 0.55, delay: 0.1 }}
                              >
                                   <div className="absolute inset-0 rounded-xl bg-blue-600/15 blur-xl scale-125" />
                                   <img
                                        src="/ValleGrande.jpg"
                                        alt="Valle Grande"
                                        className="relative w-16 h-16 rounded-xl object-contain border border-slate-700/50"
                                   />
                              </motion.div>
                              <h1 className="text-2xl font-extrabold text-white tracking-tight">Bienvenido</h1>
                              <p className="text-slate-400 text-sm mt-1.5 text-center leading-relaxed">
                                   Accede a la plataforma académica de{" "}
                                   <span className="text-slate-200 font-semibold">Valle Grande</span>
                              </p>
                         </div>

                         <div className="space-y-3">
                              <motion.button
                                   onClick={handleLogin}
                                   disabled={loading}
                                   className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 rounded-xl transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                                   whileHover={{ scale: 1.02 }}
                                   whileTap={{ scale: 0.97 }}
                                   transition={{ type: "spring", stiffness: 320, damping: 22 }}
                              >
                                   {loading ? (
                                        <svg className="animate-spin w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24">
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                   ) : (
                                        <GitHubIcon />
                                   )}
                                   {loading ? "Conectando..." : "Continuar con GitHub"}
                              </motion.button>

                              {error && (
                                   <motion.p
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs text-center bg-red-950/30 border border-red-900/50 rounded-lg py-2 px-3"
                                   >
                                        {error}
                                   </motion.p>
                              )}
                         </div>

                         <div className="mt-6 pt-5 border-t border-slate-800">
                              <p className="text-slate-500 text-xs text-center mb-3">
                                   ¿No tienes cuenta de GitHub?
                              </p>
                              <a
                                   href="https://youtu.be/k-pq3oH9QAY"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="w-full flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-slate-600 text-slate-300 font-medium text-sm py-2.5 rounded-xl transition-all duration-150"
                              >
                                   <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                   </svg>
                                   Ver cómo crear tu cuenta
                              </a>
                         </div>

                         <p className="text-slate-700 text-[11px] text-center mt-4 leading-relaxed">
                              Solo se lee tu perfil público de GitHub. Uso exclusivamente académico.
                         </p>
                    </div>
               </motion.div>
          </div>
     );
}
