import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
     hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
     show: (i = 0) => ({
          opacity: 1, y: 0, filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
     }),
};

const TRACKS = [
     {
          id: "desktop",
          label: "Track Desktop",
          color: "blue",
          accent: "text-blue-400",
          border: "border-blue-500/30",
          bg: "bg-blue-500/8",
          activeBg: "bg-blue-600/20 border-blue-500/50",
          badge: "bg-blue-500/15 border-blue-500/25 text-blue-400",
          tools: [
               { name: "Java", desc: "Lenguaje principal del track", icon: "☕" },
               { name: "Java Swing", desc: "Interfaces gráficas de escritorio", icon: "🖥" },
               { name: "MySQL", desc: "Base de datos relacional", icon: "🗄" },
               { name: "IntelliJ IDEA", desc: "IDE de desarrollo", icon: "⚡" },
          ],
     },
     {
          id: "web",
          label: "Track Web",
          color: "violet",
          accent: "text-violet-400",
          border: "border-violet-500/30",
          bg: "bg-violet-500/8",
          activeBg: "bg-violet-600/20 border-violet-500/50",
          badge: "bg-violet-500/15 border-violet-500/25 text-violet-400",
          tools: [
               { name: "HTML & CSS", desc: "Estructura y estilos base", icon: "🌐" },
               { name: "Tailwind CSS", desc: "Framework de utilidades CSS", icon: "🎨" },
               { name: "JavaScript", desc: "Lógica del frontend", icon: "JS" },
               { name: "Python + Flask", desc: "Backend ligero con Python", icon: "🐍" },
               { name: "MySQL", desc: "Base de datos relacional", icon: "🗄" },
          ],
     },
];

const JAVA_PACKAGES = [
     { pkg: "view", accent: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20", desc: "Interfaces gráficas Swing.", suffix: "Sufijo View", example: "ClientCrudView, ClientEditView" },
     { pkg: "controller", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", desc: "Lógica de eventos de la UI.", suffix: "Sufijo Controller", example: "ClientCrudController" },
     { pkg: "service", accent: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", desc: "Lógica de negocio.", suffix: "Sufijo Service", example: "ClientCrudService" },
     { pkg: "dto", accent: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20", desc: "Objetos de transferencia de datos.", suffix: "Sufijo Dto", example: "ClientDto" },
     { pkg: "model", accent: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20", desc: "Clases de dominio (entidades).", suffix: "", example: "Client, Producto" },
     { pkg: "dao", accent: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20", desc: "Persistencia y consultas SQL.", suffix: "Sufijo DAO", example: "ClientDAO" },
     { pkg: "db", accent: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20", desc: "Clase de conexión a la BD.", suffix: "AccessDB.java", example: "AccessDB" },
     { pkg: "util", accent: "text-green-400", bg: "bg-green-500/8 border-green-500/20", desc: "Clases utilitarias del proyecto.", suffix: "", example: "DateUtil, Validator" },
     { pkg: "exception", accent: "text-red-400", bg: "bg-red-500/8 border-red-500/20", desc: "Excepciones personalizadas.", suffix: "", example: "NegocioException" },
     { pkg: "prueba", accent: "text-slate-400", bg: "bg-slate-500/8 border-slate-500/20", desc: "Casos de prueba unitaria.", suffix: "", example: "ClientServiceTest" },
];

const JAVA_STRUCTURE = `mi-proyecto/          ← nombre del proyecto en minúsculas
└── src/
    └── pe/
        └── edu/
            └── vallegrande/
                └── miproyecto/
                    ├── view/
                    │   ├── ClientCrudView.java
                    │   └── ClientEditView.java
                    ├── controller/
                    │   └── ClientCrudController.java
                    ├── service/
                    │   └── ClientCrudService.java
                    ├── dto/
                    │   └── ClientDto.java
                    ├── model/
                    │   └── Client.java
                    ├── dao/
                    │   └── ClientDAO.java
                    ├── db/
                    │   └── AccessDB.java
                    ├── util/
                    └── exception/`;

const FLASK_STRUCTURE = `mi-proyecto/
├── app/                        ← paquete principal
│   ├── __init__.py             ← create_app() — factory function
│   ├── config.py               ← configuración por entorno
│   ├── database.py             ← conexión MySQL / SQLAlchemy
│   ├── models/                 ← clases ORM (tablas)
│   │   ├── __init__.py
│   │   └── cliente.py
│   ├── routes/                 ← blueprints por módulo
│   │   ├── __init__.py
│   │   └── clientes.py
│   ├── services/               ← lógica de negocio
│   │   └── cliente_service.py
│   ├── static/
│   │   ├── css/
│   │   ├── js/
│   │   │   └── main.js
│   │   └── img/
│   └── templates/
│       ├── base.html           ← incluye CDN de Tailwind
│       └── clientes/
│           ├── index.html
│           └── form.html
├── .env                        ← variables de entorno (no subir a Git)
├── .gitignore
├── app.py                      ← punto de entrada
└── requirements.txt`;

const TAILWIND_CDN = `<!-- base.html -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>{% block title %}Mi Proyecto{% endblock %}</title>
</head>
<body class="bg-gray-100">
  {% block content %}{% endblock %}
</body>
</html>`;

const TECH_STACK = [
     {
          track: "Track Desktop",
          accent: "blue",
          techs: [
               { name: "Java 17+", role: "Lenguaje principal", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
               { name: "Java Swing", role: "Interfaces gráficas de escritorio", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
               { name: "MySQL", role: "Base de datos relacional", color: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20" },
               { name: "JDBC", role: "Conexión Java → MySQL", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
               { name: "IntelliJ IDEA", role: "IDE de desarrollo", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
          ],
     },
     {
          track: "Track Web",
          accent: "violet",
          techs: [
               { name: "Python 3", role: "Lenguaje del backend", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
               { name: "Flask", role: "Framework web ligero", color: "text-green-400", bg: "bg-green-500/8 border-green-500/20" },
               { name: "MySQL", role: "Base de datos relacional", color: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20" },
               { name: "HTML & CSS", role: "Estructura y estilos base", color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20" },
               { name: "Tailwind 4", role: "Framework CSS vía CDN", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
               { name: "JavaScript", role: "Interactividad del frontend", color: "text-yellow-300", bg: "bg-yellow-400/8 border-yellow-400/20" },
               { name: "VS Code", role: "Editor de código", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20" },
          ],
     },
];

const COMMITS = [
     { type: "feat", color: "text-green-400 bg-green-500/10 border-green-500/25", desc: "Nueva funcionalidad", ex: "feat: agregar formulario de registro" },
     { type: "fix", color: "text-red-400 bg-red-500/10 border-red-500/25", desc: "Corrección de bug", ex: "fix: corregir validación de campos vacíos" },
     { type: "style", color: "text-pink-400 bg-pink-500/10 border-pink-500/25", desc: "Cambios de estilos (CSS/Tailwind)", ex: "style: ajustar padding del navbar" },
     { type: "refactor", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25", desc: "Reestructura sin cambiar comportamiento", ex: "refactor: separar lógica de conexión a Conexion.java" },
     { type: "docs", color: "text-sky-400 bg-sky-500/10 border-sky-500/25", desc: "Cambios en documentación", ex: "docs: actualizar README con instrucciones de instalación" },
     { type: "chore", color: "text-slate-400 bg-slate-500/10 border-slate-500/25", desc: "Tareas de mantenimiento", ex: "chore: agregar .gitignore" },
     { type: "test", color: "text-violet-400 bg-violet-500/10 border-violet-500/25", desc: "Pruebas unitarias o de integración", ex: "test: agregar test a EntidadDAO" },
     { type: "perf", color: "text-orange-400 bg-orange-500/10 border-orange-500/25", desc: "Mejoras de rendimiento", ex: "perf: optimizar consulta SQL con índice" },
];



export default function Semester2() {
     const [activeTrack, setActiveTrack] = useState("desktop");
     const track = TRACKS.find((t) => t.id === activeTrack);

     return (
          <div className="min-h-full px-6 md:px-10 py-10 max-w-5xl mx-auto space-y-12">

               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                         <span className="bg-violet-600/20 border border-violet-600/40 text-violet-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Semestre II
                         </span>
                         <span className="text-slate-600 text-xs">·</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                         Desarrollo Web Fundamental
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                         Semestre dividido en dos tracks paralelos:{" "}
                         <span className="text-blue-400 font-medium">aplicaciones de escritorio con Java Swing</span>{" "}
                         y{" "}
                         <span className="text-violet-400 font-medium">desarrollo web con Flask y Tailwind CSS</span>.
                         Ambos comparten MySQL como capa de datos.
                    </p>
               </motion.div>

               {/* Stack tecnológico */}
               <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-5">
                         <div className="w-1 h-5 bg-slate-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Stack tecnológico</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {TECH_STACK.map((group, gi) => (
                              <div key={gi} className={`rounded-2xl border p-5 ${group.accent === 'blue' ? 'border-blue-500/20 bg-blue-500/5' : 'border-violet-500/20 bg-violet-500/5'}`}>
                                   <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${group.accent === 'blue' ? 'text-blue-400' : 'text-violet-400'}`}>
                                        {group.track}
                                   </p>
                                   <div className="flex flex-wrap gap-2">
                                        {group.techs.map((t, ti) => (
                                             <div key={ti} className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${t.bg}`}>
                                                  <span className={`text-xs font-black font-mono ${t.color}`}>{t.name}</span>
                                                  <span className="text-slate-600 text-[11px] hidden sm:block">{t.role}</span>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         ))}
                    </div>
               </motion.div>

               {/* Tracks */}
               <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex gap-2 mb-5">
                         {TRACKS.map((t) => (
                              <button
                                   key={t.id}
                                   onClick={() => setActiveTrack(t.id)}
                                   className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${activeTrack === t.id ? t.activeBg : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"}`}
                              >
                                   {t.label}
                              </button>
                         ))}
                    </div>

                    <AnimatePresence mode="wait">
                         <motion.div
                              key={activeTrack}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.25 }}
                         >
                              <div className={`rounded-2xl border p-6 ${track.border} ${track.bg}`}>
                                   <div className="flex items-center gap-2 mb-5">
                                        <div className="w-1 h-5 bg-current rounded-full opacity-70" />
                                        <h2 className={`font-bold text-base ${track.accent}`}>{track.label}</h2>
                                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-widest ${track.badge}`}>
                                             {track.tools.length} tecnologías
                                        </span>
                                   </div>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {track.tools.map((tool, i) => (
                                             <motion.div
                                                  key={i}
                                                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-4"
                                                  whileHover={{ y: -2, borderColor: "rgba(139,92,246,0.3)" }}
                                                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                             >
                                                  <div className={`text-xl mb-2 ${track.accent}`}>{tool.icon}</div>
                                                  <p className="text-slate-200 font-semibold text-sm leading-tight">{tool.name}</p>
                                                  <p className="text-slate-500 text-xs mt-0.5">{tool.desc}</p>
                                             </motion.div>
                                        ))}
                                   </div>
                              </div>
                         </motion.div>
                    </AnimatePresence>
               </motion.div>

               <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="w-1 h-5 bg-blue-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Arquitectura de paquetes Java</h2>
                         <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">IntelliJ · Swing</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-1 leading-relaxed max-w-2xl">
                         Las soluciones se plantean bajo enfoque de servicios por capas. El artifact base es:
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 mb-6 font-mono text-sm inline-flex items-center gap-2">
                         <span className="text-slate-500">artifact:</span>
                         <span className="text-blue-400">pe.edu.vallegrande</span>
                         <span className="text-slate-600">.</span>
                         <span className="text-yellow-400">&lt;nombre-proyecto&gt;</span>
                         <span className="text-slate-600">.</span>
                         <span className="text-violet-400">&lt;paquete&gt;</span>
                    </div>

                    <div className="space-y-2 mb-6">
                         {JAVA_PACKAGES.map((p, i) => (
                              <div key={i} className={`flex items-start gap-4 border rounded-xl px-4 py-3 ${p.bg}`}>
                                   <span className={`shrink-0 font-mono text-xs font-black w-24 pt-0.5 ${p.accent}`}>{p.pkg}</span>
                                   <div className="flex-1 min-w-0">
                                        <p className="text-slate-300 text-sm leading-tight">{p.desc}</p>
                                        {p.example && <p className="text-slate-600 text-xs mt-0.5 font-mono">{p.example}</p>}
                                   </div>
                                   {p.suffix && <span className="shrink-0 text-slate-600 text-xs font-mono hidden sm:block">{p.suffix}</span>}
                              </div>
                         ))}
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                         <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">estructura-java/</span>
                         </div>
                         <pre className="text-sm font-mono leading-relaxed p-5 overflow-x-auto">
                              <code>
                                   {JAVA_STRUCTURE.split('\n').map((line, i) => {
                                        const isDir = line.includes('/') && !line.includes('.java') && !line.includes('.jar') && !line.includes('.md');
                                        const isFile = line.includes('.java') || line.includes('.jar') || line.includes('.md');
                                        return (
                                             <div key={i}>
                                                  <span className="text-slate-600">{line.match(/^[│├└─\s]+/)?.[0] || ''}</span>
                                                  <span className={isDir ? 'text-blue-400' : isFile ? 'text-slate-300' : 'text-slate-400'}>
                                                       {line.replace(/^[│├└─\s]+/, '')}
                                                  </span>
                                             </div>
                                        );
                                   })}
                              </code>
                         </pre>
                    </div>
               </motion.div>

               <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-1 h-5 bg-violet-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Estándar de proyecto Python + Flask</h2>
                         <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">VS Code</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed max-w-2xl">
                         Arquitectura por <span className="text-violet-400 font-medium">Blueprints</span> con separación en capas: rutas, servicios y modelos. Tailwind CSS integrado vía <span className="text-sky-400 font-medium">CDN</span> directamente en <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">base.html</code>, sin npm ni herramientas de compilación.
                    </p>
                    {/* snippet CDN */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-4">
                         <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">app/templates/base.html</span>
                         </div>
                         <pre className="text-xs font-mono leading-relaxed p-5 overflow-x-auto">
                              <code>
                                   {TAILWIND_CDN.split('\n').map((line, i) => {
                                        const isTag = line.trim().startsWith('<');
                                        const isComment = line.trim().startsWith('<!--');
                                        const isScript = line.includes('cdn.tailwindcss');
                                        return (
                                             <div key={i}>
                                                  <span className={isComment ? 'text-slate-500 italic' : isScript ? 'text-sky-400' : isTag ? 'text-violet-400' : 'text-slate-400'}>{line}</span>
                                             </div>
                                        );
                                   })}
                              </code>
                         </pre>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                         <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                              <div className="flex gap-1.5">
                                   <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                   <span className="w-3 h-3 rounded-full bg-green-500/60" />
                              </div>
                              <span className="text-slate-500 text-xs font-mono ml-2">estructura-flask/</span>
                         </div>
                         <pre className="text-sm font-mono leading-relaxed p-5 overflow-x-auto">
                              <code>
                                   {FLASK_STRUCTURE.split('\n').map((line, i) => {
                                        const isDir = line.includes('/') && !line.includes('.');
                                        const isComment = line.includes('←');
                                        const isFile = !isDir && line.includes('.');
                                        return (
                                             <div key={i}>
                                                  <span className="text-slate-600">{line.match(/^[│├└─\s]+/)?.[0] || ''}</span>
                                                  <span className={isComment ? 'text-slate-600 italic' : isDir ? 'text-violet-400' : isFile ? 'text-slate-300' : 'text-slate-400'}>
                                                       {line.replace(/^[│├└─\s]+/, '')}
                                                  </span>
                                             </div>
                                        );
                                   })}
                              </code>
                         </pre>
                    </div>
               </motion.div>

               <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-1 h-5 bg-green-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Conventional Commits</h2>
                         <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Git</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-2 leading-relaxed max-w-2xl">
                         Formato estándar para mensajes de commit. Facilita el historial de cambios y la colaboración en equipo.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 mb-5 font-mono text-sm">
                         <span className="text-slate-500">$ git commit -m &quot;</span>
                         <span className="text-green-400">tipo</span>
                         <span className="text-slate-500">(</span>
                         <span className="text-yellow-400">alcance</span>
                         <span className="text-slate-500">): </span>
                         <span className="text-slate-300">descripción corta en minúsculas</span>
                         <span className="text-slate-500">&quot;</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {COMMITS.map((c, i) => (
                              <div key={i} className={`flex items-start gap-3 border rounded-xl p-4 ${c.color}`}>
                                   <span className={`shrink-0 font-mono text-xs font-black px-2 py-1 rounded-lg border ${c.color}`}>{c.type}</span>
                                   <div className="min-w-0">
                                        <p className="text-slate-300 text-sm font-medium leading-tight">{c.desc}</p>
                                        <p className="text-slate-600 text-xs mt-1 font-mono truncate">{c.ex}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </motion.div>

               <motion.div
                    custom={4} variants={fadeUp} initial="hidden" animate="show"
                    className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex items-start gap-4"
               >
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-600/30 flex items-center justify-center text-violet-400 text-lg">
                         ℹ
                    </div>
                    <div>
                         <p className="text-slate-300 font-semibold text-sm mb-1">Semestre en preparación</p>
                         <p className="text-slate-500 text-xs leading-relaxed">
                              El contenido completo, proyectos y retos de este semestre se habilitarán progresivamente.
                              Los recursos de estándares ya están disponibles para descarga.
                         </p>
                    </div>
               </motion.div>

          </div>
     );
}
