import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SEMESTERS = [
     { num: "I", label: "Semestre" },
     { num: "II", label: "Semestre" },
     { num: "III", label: "Semestre" },
     { num: "IV", label: "Semestre" },
     { num: "V", label: "Semestre" },
     { num: "VI", label: "Semestre" },
];

const fadeUp = {
     hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
     show: (i = 0) => ({
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease: "easeOut", delay: i * 0.12 },
     }),
};

const cardVariant = {
     hidden: { opacity: 0, y: 20, scale: 0.92 },
     show: (i) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: "easeOut", delay: 0.7 + i * 0.07 },
     }),
};

const BLOBS = [
     {
          style: { top: "-160px", left: "-160px", width: "700px", height: "700px" },
          color: "bg-blue-800/25",
          duration: 13,
          x: [0, 70, -30, 0],
          y: [0, -40, 30, 0],
     },
     {
          style: { bottom: "-160px", right: "-80px", width: "600px", height: "600px" },
          color: "bg-slate-700/30",
          duration: 17,
          x: [0, -50, 20, 0],
          y: [0, 45, -20, 0],
     },
     {
          style: { top: "33%", right: "25%", width: "420px", height: "420px" },
          color: "bg-blue-950/20",
          duration: 11,
          x: [0, 35, -55, 0],
          y: [0, -55, 20, 0],
     },
];

export default function Hero() {
     const navigate = useNavigate();
     return (
          <section className="relative min-h-screen bg-slate-950 flex flex-col overflow-hidden">

               <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {BLOBS.map((blob, i) => (
                         <motion.div
                              key={i}
                              className={`absolute ${blob.color} rounded-full blur-[120px]`}
                              style={blob.style}
                              animate={{ x: blob.x, y: blob.y }}
                              transition={{
                                   duration: blob.duration,
                                   repeat: Infinity,
                                   ease: "easeInOut",
                                   repeatType: "mirror",
                              }}
                         />
                    ))}
               </div>

               <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                         backgroundImage:
                              "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                         backgroundSize: "60px 60px",
                    }}
               />

               <motion.header
                    className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-slate-800/60"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
               >
                    <div className="flex items-center gap-3">
                         <div className="w-1 h-6 bg-blue-500 rounded-full" />
                         <span className="text-slate-400 text-sm font-medium tracking-widest uppercase">
                              Plataforma Académica
                         </span>
                    </div>
                    <span className="text-slate-600 text-xs tracking-wider uppercase">
                         Instituto de Educación Superior
                    </span>
               </motion.header>

               <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">

                    <motion.div
                         className="mb-10 relative"
                         initial={{ opacity: 0, scale: 0.72, filter: "blur(14px)" }}
                         animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                         transition={{ duration: 0.85, ease: "easeOut", delay: 0.1 }}
                    >
                         <div className="absolute inset-0 rounded-2xl bg-blue-600/10 blur-2xl scale-110" />
                         <img
                              src="/ValleGrande.jpg"
                              alt="Valle Grande Instituto de Educación Superior"
                              className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl object-contain shadow-2xl shadow-slate-950 border border-slate-700/50"
                         />
                    </motion.div>

                    <motion.div
                         className="mb-6 inline-flex items-center gap-2 bg-slate-900 border border-slate-700/70 rounded-full px-4 py-1.5"
                         custom={0}
                         variants={fadeUp}
                         initial="hidden"
                         animate="show"
                    >
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                         <span className="text-slate-400 text-xs font-medium tracking-widest uppercase">
                              Proyectos &amp; Contenido Curricular
                         </span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-none">
                         {["Valle", "\u00a0"].map((word, i) => (
                              <motion.span
                                   key={i}
                                   initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
                                   animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                   transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                              >
                                   {word}
                              </motion.span>
                         ))}
                         <motion.span
                              className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600"
                              initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
                              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                              transition={{ duration: 0.65, delay: 0.58, ease: "easeOut" }}
                         >
                              Grande
                         </motion.span>
                    </h1>

                    <motion.p
                         className="text-slate-400 text-base md:text-xl font-light max-w-xl mb-3 leading-relaxed"
                         custom={2}
                         variants={fadeUp}
                         initial="hidden"
                         animate="show"
                    >
                         Instituto de Educación Superior
                    </motion.p>
                    <motion.p
                         className="text-slate-500 text-sm md:text-base max-w-2xl mb-12 leading-relaxed"
                         custom={3}
                         variants={fadeUp}
                         initial="hidden"
                         animate="show"
                    >
                         Explora los proyectos, estructuras y contenido desarrollado a lo largo
                         de los <span className="text-slate-300 font-medium">6 semestres</span> de la carrera.
                         Una plataforma pensada para estudiantes, por estudiantes y docentes.
                    </motion.p>

                    <motion.div
                         className="flex flex-col sm:flex-row gap-4 mb-16"
                         custom={4}
                         variants={fadeUp}
                         initial="hidden"
                         animate="show"
                    >
                         <motion.button
                              onClick={() => navigate("/plataforma/login")}
                              className="group px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/40"
                              whileHover={{ scale: 1.04, backgroundColor: "#3b82f6" }}
                              whileTap={{ scale: 0.96 }}
                              transition={{ type: "spring", stiffness: 320, damping: 22 }}
                         >
                              Explorar semestres
                              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
                         </motion.button>
                         <motion.button
                              className="px-8 py-3.5 bg-slate-800/80 text-slate-300 font-semibold rounded-xl border border-slate-700/60"
                              whileHover={{ scale: 1.04, backgroundColor: "rgba(51,65,85,0.85)" }}
                              whileTap={{ scale: 0.96 }}
                              transition={{ type: "spring", stiffness: 320, damping: 22 }}
                         >
                              <a href="https://vallegrande.edu.pe">Acerca del Instituto</a>
                         </motion.button>
                    </motion.div>

                    <motion.div
                         className="w-full max-w-3xl"
                         custom={5}
                         variants={fadeUp}
                         initial="hidden"
                         animate="show"
                    >
                         <p className="text-slate-600 text-xs uppercase tracking-widest mb-5 font-medium">
                              Contenido disponible
                         </p>
                         <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                              {SEMESTERS.map((sem, i) => (
                                   <motion.div
                                        key={i}
                                        className="group flex flex-col items-center gap-1 bg-slate-900/70 border border-slate-800 rounded-xl py-4 px-2 cursor-pointer"
                                        custom={i}
                                        variants={cardVariant}
                                        initial="hidden"
                                        animate="show"
                                        whileHover={{
                                             y: -7,
                                             borderColor: "rgba(29,78,216,0.65)",
                                             backgroundColor: "rgba(30,41,59,0.9)",
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                   >
                                        <span className="text-2xl font-black text-slate-200 group-hover:text-blue-400 transition-colors duration-200">
                                             {sem.num}
                                        </span>
                                        <span className="text-slate-600 text-[10px] uppercase tracking-wider group-hover:text-slate-500 transition-colors duration-200">
                                             {sem.label}
                                        </span>
                                   </motion.div>
                              ))}
                         </div>
                    </motion.div>
               </div>

               <div className="relative z-10 h-px w-full bg-linear-to-r from-transparent via-slate-700/50 to-transparent" />

               <motion.div
                    className="relative z-10 flex items-center justify-center gap-2 py-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
               >
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-slate-700 text-xs tracking-widest uppercase">
                         Isael Fatama · Dev
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
               </motion.div>

          </section>
     );
}
