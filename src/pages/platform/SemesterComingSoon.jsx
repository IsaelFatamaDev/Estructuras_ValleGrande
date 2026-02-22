import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const NAMES = {
     2: { title: "Desarrollo Web Fundamental", sub: "Java · Java Swing · MySQL · HTML · Tailwind · Flask" },
     3: { title: "Backend con Spring Boot", sub: "SpringBoot · Angular · SQL Server" },
     4: { title: "Full Stack Integrador", sub: "SpringBoot · WebFlux · React · MongoDB" },
     5: { title: "Microservicios Enterprise", sub: "SpringBoot · WebFlux · React · PostgreSQL · RabbitMQ · Docker" },
};

export default function SemesterComingSoon() {
     const { id } = useParams();
     const info = NAMES[Number(id)] || { title: "Semestre " + id, sub: "" };

     return (
          <div className="min-h-full flex items-center justify-center px-8 py-16">
               <motion.div
                    className="text-center max-w-sm"
                    initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
               >
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center mx-auto mb-5">
                         <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                         </svg>
                    </div>
                    <h2 className="text-white font-extrabold text-xl mb-2">{info.title}</h2>
                    <p className="text-slate-500 text-sm mb-1">{info.sub}</p>
                    <p className="text-slate-600 text-xs mt-4 leading-relaxed">
                         Este semestre se habilitará próximamente. El contenido se irá añadiendo a medida que avance el ciclo académico.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
                         <span className="text-slate-600 text-xs">Próximamente disponible</span>
                    </div>
               </motion.div>
          </div>
     );
}
