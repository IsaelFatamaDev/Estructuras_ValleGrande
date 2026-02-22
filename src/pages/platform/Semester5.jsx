import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
     hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
     show: (i = 0) => ({
          opacity: 1, y: 0, filter: "blur(0px)",
          transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
     }),
};

const SECTIONS = [
     { id: "patterns", label: "Patrones de Diseño", icon: "🧩", accent: "emerald" },
     { id: "communication", label: "Comunicación", icon: "🔗", accent: "sky" },
     { id: "databases", label: "Bases de Datos", icon: "🗄", accent: "violet" },
     { id: "security", label: "Seguridad", icon: "🔐", accent: "amber" },
     { id: "backend", label: "Backend Estándar", icon: "⚙", accent: "teal" },
     { id: "frontend", label: "Frontend Estándar", icon: "🖥", accent: "rose" },
     { id: "deployment", label: "Despliegue", icon: "🚀", accent: "orange" },
];

const DESIGN_PATTERNS = [
     {
          name: "Arquitectura Hexagonal",
          aka: "Ports & Adapters",
          accent: "emerald",
          desc: "Desacopla la lógica de negocio del mundo exterior (DB, HTTP, mensajería). El dominio no conoce Spring, ni la BD, ni el framework.",
          layers: [
               { name: "domain/", role: "Entidades de negocio, reglas puras, interfaces (ports)", color: "text-emerald-400" },
               { name: "application/", role: "Casos de uso — orquesta el dominio, NO accede a infraestructura directamente", color: "text-teal-400" },
               { name: "infrastructure/", role: "Adaptadores: REST controllers, repositorios JPA/R2DBC, Kafka producers", color: "text-cyan-400" },
          ],
          when: "Microservicio mediano-grande con lógica de negocio rica. Ideal para el sistema multi-organización si una entidad (org, user) tiene reglas complejas.",
          structure: `vg-ms-users/
├── src/main/java/pe/edu/vallegrande/users/
│   ├── domain/
│   │   ├── model/
│   │   │   └── User.java              ← POJO puro, sin @Table ni @Entity
│   │   ├── port/
│   │   │   ├── in/
│   │   │   │   └── UserUseCase.java    ← interfaz de entrada (lo que la app ofrece)
│   │   │   └── out/
│   │   │       └── UserRepository.java ← interfaz de salida (lo que la app necesita)
│   │   └── exception/
│   │       └── UserNotFoundException.java
│   ├── application/
│   │   └── service/
│   │       └── UserService.java        ← implementa UserUseCase, usa UserRepository port
│   └── infrastructure/
│       ├── adapter/
│       │   ├── in/
│       │   │   └── rest/
│       │   │       └── UserRest.java   ← @RestController, adapta HTTP → UseCase
│       │   └── out/
│       │       └── persistence/
│       │           ├── UserEntity.java  ← @Table/@Document (aquí sí va la anotación)
│       │           ├── UserR2dbcRepo.java ← extiende ReactiveCrudRepository
│       │           └── UserPersistenceAdapter.java ← implementa UserRepository port
│       └── config/
│           └── CorsConfig.java`,
     },
     {
          name: "MVC por capas (Layered)",
          aka: "Controller → Service → Repository",
          accent: "sky",
          desc: "El patrón que se usa en Semestre III y IV. Organización vertical por tipo técnico. Sencillo y predecible, ideal para microservicios CRUD sin lógica compleja.",
          layers: [
               { name: "rest/", role: "Endpoints HTTP. Sufijo Rest en WebFlux.", color: "text-sky-400" },
               { name: "service/ + impl/", role: "Interfaz + implementación. Lógica de negocio.", color: "text-teal-400" },
               { name: "repository/", role: "Acceso a datos. Extiende ReactiveCrudRepository o ReactiveMongoRepository.", color: "text-violet-400" },
               { name: "model/", role: "Entidades @Table (R2DBC) o @Document (MongoDB).", color: "text-indigo-400" },
          ],
          when: "Microservicio pequeño-mediano, CRUD directo. La mayoría de servicios del proyecto PRS pueden usar esta arquitectura.",
          structure: `vg-ms-users/
├── src/main/java/pe/edu/vallegrande/users/
│   ├── config/
│   │   └── CorsConfig.java
│   ├── rest/
│   │   └── UserRest.java           ← @RestController
│   ├── service/
│   │   ├── UserService.java        ← interfaz
│   │   └── impl/
│   │       └── UserServiceImpl.java ← @Service, implementa la interfaz
│   ├── repository/
│   │   └── UserRepository.java     ← ReactiveCrudRepository / ReactiveMongoRepository
│   ├── model/
│   │   └── User.java               ← @Table o @Document
│   ├── dto/
│   │   └── UserDto.java
│   ├── exception/
│   │   └── GlobalExceptionHandler.java
│   └── VgMsUsersApplication.java`,
     },
     {
          name: "CQRS",
          aka: "Command Query Responsibility Segregation",
          accent: "violet",
          desc: "Separa las operaciones de lectura (Query) de las de escritura (Command). Cada lado puede tener su propio modelo, base de datos y optimización.",
          layers: [
               { name: "command/", role: "Handlers de escritura: create, update, delete. Pueden emitir eventos.", color: "text-violet-400" },
               { name: "query/", role: "Handlers de lectura: findAll, findById. Pueden leer de una vista optimizada.", color: "text-pink-400" },
               { name: "event/", role: "Eventos de dominio que sincronizan el lado de lectura con el de escritura.", color: "text-amber-400" },
          ],
          when: "Escenarios donde la lectura y escritura tienen requisitos muy diferentes (ej: un dashboard que lee de MongoDB pero escribe en Oracle). Avanzado — evaluar si la complejidad se justifica.",
          structure: `vg-ms-users/
├── src/main/java/pe/edu/vallegrande/users/
│   ├── command/
│   │   ├── handler/
│   │   │   └── CreateUserHandler.java
│   │   └── model/
│   │       └── CreateUserCommand.java
│   ├── query/
│   │   ├── handler/
│   │   │   └── GetUserHandler.java
│   │   └── model/
│   │       └── UserView.java
│   ├── event/
│   │   └── UserCreatedEvent.java
│   ├── shared/
│   │   ├── model/User.java
│   │   └── repository/UserRepository.java
│   └── infrastructure/
│       ├── rest/UserRest.java
│       └── config/CorsConfig.java`,
     },
];

const PATTERN_COMPARISON = [
     { criteria: "Complejidad", layered: "⭐", hexagonal: "⭐⭐⭐", cqrs: "⭐⭐⭐⭐" },
     { criteria: "Desacoplamiento", layered: "Bajo", hexagonal: "Alto", cqrs: "Muy alto" },
     { criteria: "Testabilidad", layered: "Media", hexagonal: "Alta (dominio puro)", cqrs: "Alta" },
     { criteria: "Curva de aprendizaje", layered: "Baja", hexagonal: "Media-Alta", cqrs: "Alta" },
     { criteria: "Ideal para", layered: "CRUD simple", hexagonal: "Lógica de negocio rica", cqrs: "Lectura/escritura muy distintas" },
     { criteria: "Cantidad de archivos", layered: "Pocos", hexagonal: "Muchos (ports, adapters)", cqrs: "Muchos (commands, queries, events)" },
     { criteria: "Recomendado PRS", layered: "✅ Servicios CRUD", hexagonal: "✅ Servicio core (users, orgs)", cqrs: "⚠ Solo si se justifica" },
];

const COMM_PATTERNS = [
     {
          type: "Síncrona",
          accent: "sky",
          icon: "↔",
          desc: "El servicio emisor espera la respuesta del receptor antes de continuar. Comunicación directa por HTTP/REST o gRPC.",
          tools: [
               { name: "WebClient", role: "Cliente HTTP reactivo de Spring WebFlux — reemplaza RestTemplate", color: "text-sky-400" },
               { name: "OpenFeign (reactivo)", role: "Cliente declarativo con interfaces — spring-cloud-starter-openfeign", color: "text-teal-400" },
          ],
          pros: ["Fácil de entender e implementar", "Respuesta inmediata — útil para validaciones", "Trazabilidad directa de errores"],
          cons: ["Acoplamiento temporal — si el receptor cae, el emisor falla", "Mayor latencia en cadenas largas", "No escala bien con muchos servicios encadenados"],
          snippet: `// WebClient — llamada reactiva entre microservicios
@Service
@RequiredArgsConstructor
public class OrgServiceClient {
    private final WebClient.Builder webClientBuilder;

    public Mono<OrgDto> getOrg(String orgId) {
        return webClientBuilder.build()
            .get()
            .uri("http://vg-ms-orgs/api/orgs/{id}", orgId)
            .retrieve()
            .bodyToMono(OrgDto.class);
    }
}`,
     },
     {
          type: "Asíncrona",
          accent: "amber",
          icon: "⚡",
          desc: "El servicio emisor publica un mensaje/evento y continúa sin esperar respuesta. El receptor lo procesa cuando puede. Desacoplamiento total.",
          tools: [
               { name: "Apache Kafka", role: "Broker de eventos distribuido — alta throughput, particiones, réplicas", color: "text-amber-400" },
               { name: "RabbitMQ", role: "Message broker con colas — más sencillo, AMQP, buen default", color: "text-orange-400" },
               { name: "Spring Cloud Stream", role: "Abstracción que conecta con Kafka o Rabbit vía binders", color: "text-emerald-400" },
          ],
          pros: ["Desacoplamiento total — el emisor no conoce al receptor", "Tolerancia a fallos — mensajes se persisten en el broker", "Escala horizontalmente — Kafka maneja millones de eventos/s"],
          cons: ["Eventual consistency — el dato no se actualiza al instante", "Más difícil de debuggear y rastrear", "Requiere infraestructura extra (Kafka/Rabbit cluster)"],
          snippet: `// Kafka Producer — publicar evento de usuario creado
@Service
@RequiredArgsConstructor
public class UserEventPublisher {
    private final KafkaTemplate<String, UserEvent> kafka;

    public void publishCreated(User user) {
        UserEvent event = new UserEvent("USER_CREATED", user.getId(), user.getName());
        kafka.send("user-events", user.getId(), event);
    }
}

// Kafka Consumer — otro microservicio escucha el evento
@Service
public class UserEventListener {
    @KafkaListener(topics = "user-events", groupId = "vg-ms-notifications")
    public void onUserEvent(UserEvent event) {
        if ("USER_CREATED".equals(event.getType())) {
            // enviar email de bienvenida, crear perfil, etc.
        }
    }
}`,
     },
];

const COMM_DECISION = [
     { scenario: "Validar si una organización existe antes de crear un usuario", rec: "Síncrona", reason: "Necesita respuesta inmediata para decidir si procede", color: "text-sky-400" },
     { scenario: "Notificar a otros servicios que un usuario fue creado", rec: "Asíncrona", reason: "No requiere respuesta, fire-and-forget, múltiples consumidores", color: "text-amber-400" },
     { scenario: "Obtener datos de un servicio para armar un DTO compuesto", rec: "Síncrona", reason: "Se necesita la data ahora para construir la respuesta", color: "text-sky-400" },
     { scenario: "Sincronizar base de datos de lectura tras una escritura", rec: "Asíncrona", reason: "Eventual consistency es aceptable, desacopla los modelos", color: "text-amber-400" },
     { scenario: "Auditoría — registrar cada acción en un log central", rec: "Asíncrona", reason: "No debe bloquear la operación principal, Kafka ideal", color: "text-amber-400" },
];

const KAFKA_VS_RABBIT = [
     { criteria: "Modelo", kafka: "Log distribuido — particiones, offsets", rabbit: "Cola de mensajes — AMQP, exchanges, queues" },
     { criteria: "Throughput", kafka: "Muy alto — millones de msg/s", rabbit: "Medio-alto — miles de msg/s" },
     { criteria: "Persistencia", kafka: "Mensajes se retienen (configurable)", rabbit: "Mensajes se eliminan al consumir (default)" },
     { criteria: "Orden", kafka: "Garantizado por partición", rabbit: "Garantizado por cola" },
     { criteria: "Replay", kafka: "✅ Re-leer mensajes (offset reset)", rabbit: "❌ Una vez consumido, se borró" },
     { criteria: "Complejidad", kafka: "Alta — ZooKeeper/KRaft, particiones", rabbit: "Media — exchanges, bindings, dead-letter" },
     { criteria: "Ideal para", kafka: "Event sourcing, logs, stream processing", rabbit: "Tareas async, notificaciones, colas de trabajo" },
     { criteria: "Spring Boot", kafka: "spring-kafka + KafkaTemplate", rabbit: "spring-amqp + RabbitTemplate" },
     { criteria: "PRS", kafka: "✅ Auditoría, event streaming entre ms", rabbit: "✅ Notificaciones, tareas background" },
];

const RABBIT_SNIPPET = `// RabbitMQ Producer — publicar evento de usuario
@Service @RequiredArgsConstructor
public class UserEventPublisher {
    private final RabbitTemplate rabbit;

    public void publishCreated(User user) {
        UserEvent event = new UserEvent("USER_CREATED", user.getId(),
            user.getOrgId(), Instant.now());
        rabbit.convertAndSend("user-exchange", "user.created", event);
    }
}

// RabbitMQ Consumer — otro microservicio escucha
@Service
public class UserEventListener {
    @RabbitListener(queues = "notification-queue")
    public void onUserCreated(UserEvent event) {
        if ("USER_CREATED".equals(event.type())) {
            // enviar email de bienvenida, notificación push, etc.
        }
    }
}

// application.yaml — RabbitMQ config
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

// Config — declarar exchange + queue + binding
@Configuration
public class RabbitConfig {
    @Bean public TopicExchange userExchange() {
        return new TopicExchange("user-exchange");
    }
    @Bean public Queue notificationQueue() {
        return new Queue("notification-queue", true);
    }
    @Bean public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("user.*");
    }
}`;

const DB_OPTIONS = [
     {
          name: "Oracle DB",
          type: "SQL Relacional",
          accent: "red",
          icon: "🔴",
          driver: "oracle-r2dbc (reactivo)",
          entity: "@Table + @Id (Long)",
          repo: "ReactiveCrudRepository<T, Long>",
          yaml: "spring.r2dbc.url: r2dbc:oracle://localhost:1521/XEPDB1",
          pros: ["Integridad referencial con FK", "Transacciones ACID fuertes", "SQL estándar — JOINs, vistas, procedures"],
          cons: ["Más lento en escrituras masivas", "Schema rígido — cambios requieren migraciones", "Requiere instalación local pesada"],
          when: "Datos altamente relacionales: usuarios, organizaciones, roles, permisos. Donde las FK y constraints son críticas.",
     },
     {
          name: "MongoDB",
          type: "NoSQL Documentos",
          accent: "green",
          icon: "🟢",
          driver: "spring-boot-starter-data-mongodb-reactive",
          entity: "@Document + @Id (ObjectId)",
          repo: "ReactiveMongoRepository<T, ObjectId>",
          yaml: "spring.data.mongodb.uri: mongodb://localhost:27017/vg_db",
          pros: ["Schema flexible — documentos JSON, fácil evolucionar", "Escrituras rápidas, ideal para logs y eventos", "Escalado horizontal nativo (sharding)"],
          cons: ["Sin FK — integridad referencial manual", "JOINs limitados ($lookup)", "Consistencia eventual por defecto"],
          when: "Datos semi-estructurados: logs, auditoría, configuraciones, catálogos. Microservicios que no necesitan relaciones fuertes entre colecciones.",
     },
     {
          name: "MySQL",
          type: "SQL Relacional",
          accent: "blue",
          icon: "🔵",
          driver: "r2dbc-mysql (io.asyncer:r2dbc-mysql)",
          entity: "@Table + @Id (Long)",
          repo: "ReactiveCrudRepository<T, Long>",
          yaml: "spring.r2dbc.url: r2dbc:mysql://localhost:3306/vg_db",
          pros: ["Ligero, rápido, fácil de instalar", "Gran comunidad y documentación", "Compatible con R2DBC reactivo"],
          cons: ["Menos features enterprise que Oracle", "Procedures y vistas más limitadas", "Replication manual vs Oracle RAC"],
          when: "Alternativa ligera a Oracle para desarrollo local. Mismo patrón R2DBC, misma estructura de paquetes.",
     },
     {
          name: "PostgreSQL",
          type: "SQL Relacional",
          accent: "indigo",
          icon: "🟣",
          driver: "r2dbc-postgresql (org.postgresql:r2dbc-postgresql)",
          entity: "@Table + @Id (Long)",
          repo: "ReactiveCrudRepository<T, Long>",
          yaml: "spring.r2dbc.url: r2dbc:postgresql://localhost:5432/vg_db",
          pros: ["JSONB nativo — combina SQL + documentos", "Extensiones avanzadas (PostGIS, Full-Text Search)", "Open-source robusto, gran ecosistema"],
          cons: ["Más pesado que MySQL para CRUDs simples", "Configuración inicial más detallada", "Menos común en entornos enterprise legacy"],
          when: "Proyectos que necesitan JSONB, búsquedas full-text o datos geoespaciales. Alternativa open-source potente a Oracle.",
     },
];

const DB_STRATEGY = [
     { service: "vg-ms-users", db: "Oracle / PostgreSQL / MySQL", reason: "Usuarios + organizaciones + roles = muchas FK y constraints", color: "text-red-400" },
     { service: "vg-ms-orgs", db: "Oracle / PostgreSQL / MySQL", reason: "Organizaciones padre-hijo, jerarquía relacional", color: "text-red-400" },
     { service: "vg-ms-audit", db: "MongoDB", reason: "Logs de auditoría, alto volumen de escritura, schema libre", color: "text-green-400" },
     { service: "vg-ms-notifications", db: "MongoDB", reason: "Notificaciones con payload variable, no necesita FK", color: "text-green-400" },
     { service: "vg-ms-config", db: "MongoDB / PostgreSQL", reason: "Configuraciones por organización — JSON flexible o JSONB si se prefiere SQL", color: "text-green-400" },
];

const SECURITY_OPTIONS = [
     {
          name: "Keycloak",
          accent: "sky",
          icon: "🛡",
          type: "Self-hosted IAM",
          desc: "Servidor de identidad open-source (CNCF). Se despliega en tu propia infraestructura. Control total sobre datos, configuración y flujos.",
          features: [
               { name: "Multi-tenancy nativo", detail: "Un Realm por organización — aislamiento completo de usuarios y roles", color: "text-sky-400" },
               { name: "OAuth 2.0 + OIDC", detail: "Protocolo estándar. El frontend obtiene un JWT del token endpoint", color: "text-teal-400" },
               { name: "Roles y permisos granulares", detail: "Realm roles, Client roles, Groups, Policies — RBAC completo", color: "text-violet-400" },
               { name: "Federation (LDAP/AD)", detail: "Conectar con Active Directory para orgs que ya tienen directorio", color: "text-indigo-400" },
               { name: "Admin Console", detail: "UI web para gestionar realms, users, clients, flows sin código", color: "text-pink-400" },
               { name: "Self-hosted", detail: "Datos en tu servidor — cumplimiento de políticas de data residency", color: "text-amber-400" },
          ],
          pros: ["Control total sobre datos e infraestructura", "Multi-tenancy real con Realms", "Extensible con SPIs (proveedores custom)", "Flujos de login personalizables"],
          cons: ["Requiere mantener servidor propio (Docker / K8s)", "Curva de configuración inicial alta", "Consume recursos del cluster"],
          snippet: `# docker-compose.yaml — Keycloak
services:
  keycloak:
    image: quay.io/keycloak/keycloak:25.0
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: password
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8180:8080"

# application.yaml — Spring Boot + Keycloak
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8180/realms/vg-prs`,
     },
     {
          name: "Firebase Auth",
          accent: "amber",
          icon: "🔥",
          type: "Cloud-managed (Google)",
          desc: "Servicio de autenticación gestionado por Google (Firebase/GCP). Zero infraestructura — solo configurar y consumir. Ideal para MVPs y equipos pequeños.",
          features: [
               { name: "Proveedores múltiples", detail: "Google, GitHub, email/password, phone — configurar en consola Firebase", color: "text-amber-400" },
               { name: "Firebase Admin SDK", detail: "Verificar tokens JWT en Spring Boot con el SDK de servidor", color: "text-orange-400" },
               { name: "Sin servidor propio", detail: "Google gestiona la infraestructura — escala automático", color: "text-emerald-400" },
               { name: "Integración frontend", detail: "SDK de Firebase para React y Angular — login en 10 líneas", color: "text-sky-400" },
               { name: "Custom claims", detail: "Agregar roles en el JWT: admin.auth().setCustomUserClaims(uid, {role: 'admin'})", color: "text-violet-400" },
               { name: "Free tier generoso", detail: "50k MAU gratis — suficiente para el proyecto PRS", color: "text-lime-400" },
          ],
          pros: ["Cero infraestructura — sin mantener servidor", "Setup en minutos desde Firebase Console", "SDKs nativos para React, Angular, Flutter", "Escala automático sin configuración"],
          cons: ["Datos en Google Cloud — sin control de residency", "Multi-tenancy limitado (Identity Platform tier)", "Roles básicos — custom claims manuales", "Vendor lock-in con Google"],
          snippet: `// Spring Boot — verificar token Firebase
@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res, FilterChain chain) {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            FirebaseToken decoded = FirebaseAuth.getInstance()
                .verifyIdToken(token);
            // decoded.getUid(), decoded.getClaims()
        }
        chain.doFilter(req, res);
    }
}

// React — login con Firebase
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';

const login = () => signInWithPopup(auth, new GoogleAuthProvider());`,
     },
];

const SECURITY_COMPARISON = [
     { criteria: "Infraestructura", keycloak: "Self-hosted (Docker/K8s)", firebase: "Cloud gestionado (Google)" },
     { criteria: "Multi-tenancy", keycloak: "Nativo — 1 Realm = 1 org", firebase: "Limitado (Identity Platform)" },
     { criteria: "Protocolo", keycloak: "OAuth 2.0 / OIDC completo", firebase: "JWT propio + OAuth providers" },
     { criteria: "Roles", keycloak: "RBAC completo (realm + client)", firebase: "Custom claims manuales" },
     { criteria: "Costo", keycloak: "Free — pagas infra", firebase: "Free <50k MAU" },
     { criteria: "Curva aprendizaje", keycloak: "Alta (Realms, Flows, SPIs)", firebase: "Baja (SDK + Console)" },
     { criteria: "Control de datos", keycloak: "Total (tu servidor)", firebase: "Google Cloud" },
     { criteria: "Recomendación PRS", keycloak: "✅ Multi-org enterprise", firebase: "✅ MVP / equipo pequeño" },
];

const RBAC_ROLES = [
     { role: "SUPER_ADMIN", scope: "Sistema completo", permissions: "Gestionar todas las organizaciones, crear ORG_ADMIN, configurar sistema global", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
     { role: "ORG_ADMIN", scope: "Su organización", permissions: "CRUD usuarios de su org, gestionar niveles/cursos, ver reportes de su org", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
     { role: "TEACHER", scope: "Sus cursos asignados", permissions: "Registrar notas/asistencia, ver alumnos de sus secciones, subir recursos", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
     { role: "STUDENT", scope: "Su perfil", permissions: "Ver sus notas, asistencia, horario. Sin acceso a datos de otros estudiantes", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

const SECURITY_ENDPOINT_RULES = [
     { method: "GET", path: "/api/users/**", roles: "ORG_ADMIN, TEACHER, STUDENT", note: "Lectura — todos los roles autenticados de la org" },
     { method: "POST", path: "/api/users", roles: "ORG_ADMIN", note: "Crear usuarios — solo admin de la organización" },
     { method: "PUT", path: "/api/users/{id}", roles: "ORG_ADMIN", note: "Editar — solo admin de la organización" },
     { method: "DELETE", path: "/api/users/{id}", roles: "SUPER_ADMIN", note: "Eliminar — solo super admin del sistema" },
     { method: "GET", path: "/api/orgs/**", roles: "SUPER_ADMIN", note: "Ver todas las orgs — solo admin global" },
     { method: "POST", path: "/api/enrollment", roles: "ORG_ADMIN", note: "Matricular — solo admin de la org" },
     { method: "POST", path: "/api/grades", roles: "TEACHER", note: "Registrar notas — solo docentes asignados" },
];

const PRS_ECOSYSTEM = [
     { service: "vg-ms-gateway", desc: "API Gateway — Spring Cloud Gateway. Ruteo, rate limiting, filtro JWT global", db: "—", color: "text-sky-400" },
     { service: "vg-ms-auth", desc: "Adapter de Keycloak/Firebase. Token exchange, sync de perfiles, refresh", db: "PostgreSQL", color: "text-amber-400" },
     { service: "vg-ms-users", desc: "CRUD usuarios. Roles por org (RBAC). Perfil, estado activo/inactivo, auditoría", db: "PostgreSQL", color: "text-emerald-400" },
     { service: "vg-ms-orgs", desc: "Organizaciones, sedes, niveles (Inicial / Primaria / Secundaria), grados, secciones", db: "PostgreSQL", color: "text-indigo-400" },
     { service: "vg-ms-enrollment", desc: "Matrículas, períodos académicos, asignación alumno → nivel → grado → sección", db: "PostgreSQL", color: "text-violet-400" },
     { service: "vg-ms-academic", desc: "Cursos, horarios, notas, asistencia. Docentes asignados por sección y curso", db: "PostgreSQL", color: "text-teal-400" },
     { service: "vg-ms-audit", desc: "Log central de TODOS los eventos del sistema. Consume de Kafka, inmutable", db: "MongoDB", color: "text-orange-400" },
     { service: "vg-ms-notifications", desc: "Emails, push, SMS. Consume eventos de usuarios, matrículas, notas", db: "MongoDB", color: "text-pink-400" },
     { service: "vg-ms-reports", desc: "Dashboards, reportes PDF/Excel. Lee de múltiples ms vía API y eventos", db: "MongoDB", color: "text-cyan-400" },
     { service: "vg-ms-config", desc: "Feature flags, parámetros por org, configuración dinámica del sistema", db: "PostgreSQL", color: "text-lime-400" },
];

const BE_PACKAGES = {
     layered: [
          { pkg: "config/", accent: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20", role: "CORS, SecurityWebFilterChain, WebClient beans, Kafka/Rabbit config. @Configuration." },
          { pkg: "security/", accent: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20", role: "JwtAuthenticationFilter, RoleConstants. Validación de JWT y extracción de roles." },
          { pkg: "rest/", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", role: "Endpoints reactivos con @PreAuthorize. Sufijo Rest. Retorna Mono<>/Flux<>." },
          { pkg: "service/", accent: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20", role: "Interfaz del servicio. Define el contrato de negocio." },
          { pkg: "service/impl/", accent: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20", role: "Implementación @Service. Lógica + validaciones + eventos + llamadas entre ms." },
          { pkg: "repository/", accent: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", role: "R2DBC Repository + @Query custom. Métodos derivados para filtros por orgId, status." },
          { pkg: "model/", accent: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20", role: "Entidades @Table (R2DBC PostgreSQL). Enum de roles. Campos de auditoría (createdAt)." },
          { pkg: "dto/", accent: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20", role: "Request/Response DTOs con validaciones @NotBlank, @Email. Sin campos sensibles." },
          { pkg: "mapper/", accent: "text-lime-400", bg: "bg-lime-500/8 border-lime-500/20", role: "Conversión Entity ↔ DTO. Métodos estáticos toEntity(), toResponse()." },
          { pkg: "exception/", accent: "text-red-400", bg: "bg-red-500/8 border-red-500/20", role: "@ControllerAdvice + excepciones custom: NotFoundException, ForbiddenOrgException." },
          { pkg: "event/", accent: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20", role: "Publishers Kafka/Rabbit, Listeners, records de evento, serialización JSON." },
          { pkg: "client/", accent: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20", role: "WebClient calls a otros ms (vg-ms-orgs, vg-ms-auth). Clases *ServiceClient." },
     ],
     hexagonal: [
          { pkg: "domain/models/", accent: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20", role: "Entidades de dominio PURAS (User.java). Value Objects (Role, DocumentType, RecordStatus). Sin @Table ni Spring." },
          { pkg: "domain/ports/in/", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", role: "Interfaces de casos de uso: ICreateUserUseCase, IGetUserUseCase, IUpdateUserUseCase, IDeleteUserUseCase, etc." },
          { pkg: "domain/ports/out/", accent: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20", role: "Interfaces de salida: IUserRepository, IUserEventPublisher, IOrganizationClient, ISecurityContext." },
          { pkg: "domain/exceptions/", accent: "text-red-400", bg: "bg-red-500/8 border-red-500/20", role: "DomainException (abstract), BusinessRuleException, NotFoundException, DuplicateDocumentException, ValidationException." },
          { pkg: "domain/services/", accent: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20", role: "UserAuthorizationService — lógica de autorización RBAC pura, sin Spring. Valida quién puede crear qué rol." },
          { pkg: "application/usecases/", accent: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", role: "Implementaciones: CreateUserUseCaseImpl, GetUserUseCaseImpl, UpdateUserUseCaseImpl, DeleteUserUseCaseImpl, etc." },
          { pkg: "application/dto/", accent: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20", role: "CreateUserRequest, UpdateUserRequest, UserResponse, ApiResponse<T>, ErrorMessage, PageResponse." },
          { pkg: "application/events/", accent: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20", role: "UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent, UserRestoredEvent, UserPurgedEvent con correlationId." },
          { pkg: "application/mappers/", accent: "text-lime-400", bg: "bg-lime-500/8 border-lime-500/20", role: "UserMapper @Component — toModel(Request), toResponse(User), toEntity(User), toModel(Entity)." },
          { pkg: "infrastructure/adapters/in/", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", role: "UserRest, SetupRest @RestController. GlobalExceptionHandler @ControllerAdvice. Inyecta puertos de entrada." },
          { pkg: "infrastructure/adapters/out/", accent: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20", role: "persistence/ (UserRepositoryImpl), messaging/ (UserEventPublisherImpl), external/ (AuthClient, OrgClient, NotifClient)." },
          { pkg: "infrastructure/config/", accent: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20", role: "SecurityConfig, R2dbcConfig, RabbitMQConfig, WebClientConfig, Resilience4jConfig, RequestContextFilter." },
          { pkg: "infrastructure/persistence/", accent: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20", role: "entities/ (UserEntity @Table R2DBC) + repositories/ (UserR2dbcRepository extends R2dbcRepository)." },
          { pkg: "infrastructure/security/", accent: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20", role: "GatewayHeadersFilter, GatewayHeadersExtractor, AuthenticatedUser, SecurityContextAdapter. Headers del Gateway." },
     ],
     cqrs: [
          { pkg: "command/handler/", accent: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20", role: "CreateUserHandler, UpdateUserHandler, DeleteUserHandler. Valida, persiste y emite evento." },
          { pkg: "command/model/", accent: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20", role: "Records inmutables: CreateUserCommand, UpdateUserCommand. Datos de entrada para escritura." },
          { pkg: "command/repository/", accent: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", role: "UserWriteRepository — ReactiveCrudRepository escribe en PostgreSQL." },
          { pkg: "query/handler/", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", role: "GetUserHandler, ListUsersByOrgHandler. Solo lectura, queries optimizadas." },
          { pkg: "query/model/", accent: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/20", role: "UserView — proyección optimizada para lectura. Solo campos necesarios." },
          { pkg: "query/repository/", accent: "text-violet-300", bg: "bg-violet-500/8 border-violet-500/20", role: "UserReadRepository — queries de solo lectura, vistas desnormalizadas." },
          { pkg: "event/", accent: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/20", role: "UserCreatedEvent, UserUpdatedEvent, UserEventPublisher (Kafka), UserEventProjector (@KafkaListener)." },
          { pkg: "shared/model/", accent: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20", role: "User @Table R2DBC, Role enum. Compartidos entre command y query." },
          { pkg: "shared/dto/", accent: "text-lime-400", bg: "bg-lime-500/8 border-lime-500/20", role: "UserRequest, UserResponse. DTOs compartidos entre command y query handlers." },
          { pkg: "infrastructure/rest/", accent: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20", role: "UserRest @RestController. Delega POST a command handlers y GET a query handlers." },
          { pkg: "infrastructure/config/", accent: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20", role: "SecurityConfig, KafkaConfig, WebClientConfig. Configuración de Spring." },
          { pkg: "infrastructure/security/", accent: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20", role: "JwtAuthenticationFilter. Extracción de JWT y roles del token." },
          { pkg: "infrastructure/client/", accent: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20", role: "OrgServiceClient — WebClient calls a vg-ms-orgs para validar organización." },
     ],
};

const BE_STRUCTURES = {
     layered: `📦 vg-ms-users/
├── 📂 src/main/java/pe/edu/vallegrande/users/
│   ├── 📂 config/              ← CorsConfig, SecurityConfig, WebClient, Kafka
│   ├── 📂 security/            ← JwtAuthFilter, RoleConstants
│   ├── 📂 rest/                ← @RestController endpoints
│   ├── 📂 service/             ← interfaces de negocio
│   │   └── 📂 impl/            ← implementaciones @Service
│   ├── 📂 repository/          ← ReactiveCrudRepository + @Query
│   ├── 📂 model/               ← @Table entities + enums (Role, Status)
│   ├── 📂 dto/                 ← Request, Response, Mapper
│   ├── 📂 exception/           ← @ControllerAdvice + custom exceptions
│   ├── 📂 event/               ← Kafka events (publish + listen)
│   ├── 📂 client/              ← WebClient → otros microservicios
│   └── ☕ VgMsUsersApplication.java
├── 📂 src/main/resources/
│   └── 📋 application.yaml     ← r2dbc:postgresql + kafka + jwt
├── 📂 src/test/
├── 🐳 Dockerfile
└── 📄 pom.xml`,
     hexagonal: `📦 vg-ms-users/
├── 📂 src/main/java/pe/edu/vallegrande/vgmsusers/
│   ├── ☕ VgMsUsersApplication.java
│   ├── 📂 domain/                         ← CAPA PURA — sin frameworks
│   │   ├── 📂 models/                     ← POJOs puros @Builder, sin @Table
│   │   │   └── 📂 valueobjects/           ← Role, DocumentType, RecordStatus
│   │   ├── 📂 ports/
│   │   │   ├── 📂 in/                     ← interfaces de casos de uso (ICreate, IGet, IUpdate…)
│   │   │   └── 📂 out/                    ← IUserRepository, IEventPublisher, ISecurityContext…
│   │   ├── 📂 exceptions/                 ← DomainException base + BusinessRule, NotFound, Conflict…
│   │   └── 📂 services/                   ← RBAC puro (UserAuthorizationService)
│   ├── 📂 application/                    ← CASOS DE USO + DTOs
│   │   ├── 📂 usecases/                   ← Create, Get, Update, Delete, Restore, Purge
│   │   ├── 📂 dto/
│   │   │   ├── 📂 common/                 ← ApiResponse, ErrorMessage, PageResponse
│   │   │   ├── 📂 request/                ← CreateUserRequest, UpdateUserRequest
│   │   │   └── 📂 response/               ← UserResponse
│   │   ├── 📂 events/                     ← UserCreated, Updated, Deleted, Restored, Purged
│   │   └── 📂 mappers/                    ← UserMapper @Component
│   └── 📂 infrastructure/                 ← ADAPTADORES — Spring, DB, Rabbit
│       ├── 📂 adapters/
│       │   ├── 📂 in/rest/                ← UserRest, SetupRest, GlobalExceptionHandler
│       │   └── 📂 out/
│       │       ├── 📂 persistence/         ← UserRepositoryImpl
│       │       ├── 📂 messaging/           ← UserEventPublisherImpl (RabbitMQ)
│       │       └── 📂 external/            ← AuthClient, OrgClient, NotifClient (@CircuitBreaker)
│       ├── 📂 config/                     ← Security, R2dbc, RabbitMQ, WebClient, Resilience4j
│       ├── 📂 persistence/
│       │   ├── 📂 entities/               ← UserEntity @Table Persistable<String>
│       │   └── 📂 repositories/           ← UserR2dbcRepository
│       └── 📂 security/                   ← GatewayHeaders, SecurityContextAdapter
├── 📂 src/main/resources/
│   ├── 📋 application.yml                 ← profiles dev/prod
│   └── 📂 db/migration/                   ← Flyway SQL migrations
├── 📂 src/test/
├── 🐳 Dockerfile
└── 📄 pom.xml`,
     cqrs: `📦 vg-ms-users/
├── 📂 src/main/java/pe/edu/vallegrande/users/
│   ├── 📂 command/                        ← LADO DE ESCRITURA
│   │   ├── 📂 handler/                    ← CreateUser, UpdateUser, DeleteUser
│   │   ├── 📂 model/                      ← CreateUserCommand, UpdateUserCommand (records)
│   │   └── 📂 repository/                 ← UserWriteRepository → PostgreSQL
│   ├── 📂 query/                          ← LADO DE LECTURA
│   │   ├── 📂 handler/                    ← GetUser, ListByOrg
│   │   ├── 📂 model/                      ← UserView (proyección optimizada)
│   │   └── 📂 repository/                 ← UserReadRepository (solo lectura)
│   ├── 📂 event/                          ← Eventos + Projector (sincroniza lectura)
│   ├── 📂 shared/
│   │   ├── 📂 model/                      ← User @Table, Role enum
│   │   └── 📂 dto/                        ← UserRequest, UserResponse
│   ├── 📂 infrastructure/
│   │   ├── 📂 rest/                       ← UserRest delega a command/query
│   │   ├── 📂 config/                     ← Security, Kafka, WebClient
│   │   ├── 📂 security/                   ← JwtAuthFilter
│   │   └── 📂 client/                     ← OrgServiceClient
│   └── ☕ VgMsUsersApplication.java
├── 📂 src/main/resources/
│   └── 📋 application.yaml
├── 📂 src/test/
├── 🐳 Dockerfile
└── 📄 pom.xml`,
};

const BE_SNIPPETS = {
     layered: `// ═══ model/User.java — PostgreSQL R2DBC ═══
@Table("users")
@Data @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id private Long id;
    private String name;
    private String email;
    private String orgId;
    @Column("role") private Role role;
    private String status;
    private LocalDateTime createdAt;
}

// ═══ model/Role.java — enum de roles del sistema ═══
public enum Role { SUPER_ADMIN, ORG_ADMIN, TEACHER, STUDENT }

// ═══ config/SecurityConfig.java — RBAC por endpoint ═══
@Configuration @EnableReactiveMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(ex -> ex
                .pathMatchers(HttpMethod.GET, "/api/users/**")
                    .hasAnyRole("ORG_ADMIN", "TEACHER", "STUDENT")
                .pathMatchers(HttpMethod.POST, "/api/users")
                    .hasRole("ORG_ADMIN")
                .pathMatchers(HttpMethod.DELETE, "/api/users/**")
                    .hasRole("SUPER_ADMIN")
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
            .build();
    }
}

// ═══ service/impl/UserServiceImpl.java — enterprise ═══
@Service @RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository repo;
    private final UserEventPublisher events;
    private final OrgServiceClient orgClient;

    @Override
    public Flux<UserResponse> findByOrg(String orgId) {
        return repo.findByOrgIdAndStatus(orgId, "A")
            .map(UserMapper::toResponse);
    }

    @Override
    public Mono<UserResponse> create(UserRequest req) {
        return orgClient.getOrg(req.orgId())
            .switchIfEmpty(Mono.error(new ForbiddenOrgException(req.orgId())))
            .then(Mono.defer(() -> {
                User user = UserMapper.toEntity(req);
                user.setCreatedAt(LocalDateTime.now());
                user.setStatus("A");
                return repo.save(user);
            }))
            .doOnSuccess(u -> events.publish("USER_CREATED", u))
            .map(UserMapper::toResponse);
    }
}

// ═══ event/UserEventPublisher.java — Kafka ═══
@Service @RequiredArgsConstructor
public class UserEventPublisher {
    private final KafkaTemplate<String, UserEvent> kafka;
    public void publish(String type, User user) {
        kafka.send("user-events", user.getId().toString(),
            new UserEvent(type, user.getId(), user.getOrgId(), Instant.now()));
    }
}

// ═══ client/OrgServiceClient.java — WebClient síncrono ═══
@Service @RequiredArgsConstructor
public class OrgServiceClient {
    private final WebClient.Builder wcb;
    public Mono<OrgDto> getOrg(String orgId) {
        return wcb.build().get()
            .uri("http://vg-ms-orgs/api/orgs/{id}", orgId)
            .retrieve().bodyToMono(OrgDto.class);
    }
}

// ═══ rest/UserRest.java — endpoints con @PreAuthorize ═══
@RestController @RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserRest {
    private final UserService svc;
    @GetMapping("/org/{orgId}") @PreAuthorize("hasAnyRole('ORG_ADMIN','TEACHER')")
    public Flux<UserResponse> byOrg(@PathVariable String orgId) {
        return svc.findByOrg(orgId);
    }
    @PostMapping @PreAuthorize("hasRole('ORG_ADMIN')")
    public Mono<UserResponse> create(@Valid @RequestBody UserRequest req) {
        return svc.create(req);
    }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Mono<Void> remove(@PathVariable Long id) {
        return svc.delete(id);
    }
}

// ═══ application.yaml — PostgreSQL + Kafka + JWT ═══
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/vg_users_db
    username: postgres
    password: postgres
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8180/realms/vg-prs
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer`,
     hexagonal: `// ═══ domain/models/User.java — POJO puro con lógica de dominio ═══
@Getter @Builder(toBuilder = true)
@NoArgsConstructor @AllArgsConstructor
public class User {
    private String id;
    private String organizationId;
    private RecordStatus recordStatus;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private String firstName;
    private String lastName;
    private DocumentType documentType;
    private String documentNumber;
    private String email;
    private String phone;
    private String address;
    private String zoneId;
    private String streetId;
    private Role role;

    public void validateContact() {
        boolean hasEmail = email != null && !email.isBlank();
        boolean hasPhone = phone != null && !phone.isBlank();
        if (!hasEmail && !hasPhone)
            throw new IllegalArgumentException("Must have at least one contact method");
    }

    public User markAsDeleted(String deletedBy) {
        return this.toBuilder()
            .recordStatus(RecordStatus.INACTIVE)
            .updatedAt(LocalDateTime.now()).updatedBy(deletedBy).build();
    }
}

// ═══ domain/ports/in/ICreateUserUseCase.java ═══
public interface ICreateUserUseCase {
    Mono<User> execute(User user, String createdBy);
}

// ═══ domain/ports/out/IUserRepository.java ═══
public interface IUserRepository {
    Mono<User> save(User user);
    Mono<User> update(User user);
    Mono<User> findById(String id);
    Flux<User> findByOrganizationIdAndRecordStatus(String orgId, String status);
    Mono<Boolean> existsByDocumentNumber(String documentNumber);
    Mono<Void> deleteById(String id);
    Flux<User> findByRole(Role role);
}

// ═══ domain/ports/out/IUserEventPublisher.java ═══
public interface IUserEventPublisher {
    Mono<Void> publishUserCreated(User user, String createdBy);
    Mono<Void> publishUserUpdated(User user, Map<String, Object> changes, String updatedBy);
    Mono<Void> publishUserDeleted(String userId, String orgId, String deletedBy, String reason);
    Mono<Void> publishUserPurged(User user, String purgedBy, String reason);
}

// ═══ domain/services/UserAuthorizationService.java — RBAC puro ═══
public class UserAuthorizationService {
    public static void validateCanCreateUserWithRole(Set<Role> creatorRoles, Role target) {
        boolean isSuperAdmin = creatorRoles.contains(Role.SUPER_ADMIN);
        boolean isAdmin = creatorRoles.contains(Role.ADMIN);
        if (!isSuperAdmin && !isAdmin)
            throw new BusinessRuleException("Only SUPER_ADMIN or ADMIN can create users");
        if (isSuperAdmin && target != Role.SUPER_ADMIN && target != Role.ADMIN)
            throw new BusinessRuleException("SUPER_ADMIN can only create ADMIN");
        if (isAdmin && target != Role.CLIENT && target != Role.OPERATOR)
            throw new BusinessRuleException("ADMIN can only create CLIENT or OPERATOR");
    }
}

// ═══ application/usecases/CreateUserUseCaseImpl.java ═══
@Service @RequiredArgsConstructor
public class CreateUserUseCaseImpl implements ICreateUserUseCase {
    private final IUserRepository userRepository;
    private final IOrganizationClient organizationClient;
    private final IUserEventPublisher eventPublisher;
    private final ISecurityContext securityContext;

    @Override @Transactional
    public Mono<User> execute(User user, String createdBy) {
        return validateRoleAuthorization(user)
            .then(validateDocumentNotExists(user.getDocumentNumber()))
            .then(validateOrganizationHierarchy(user))
            .flatMap(v -> {
                User toSave = User.builder()
                    .id(UUID.randomUUID().toString())
                    .organizationId(user.getOrganizationId())
                    .recordStatus(RecordStatus.ACTIVE)
                    .createdAt(LocalDateTime.now()).createdBy(createdBy)
                    .firstName(user.getFirstName()).lastName(user.getLastName())
                    .documentType(user.getDocumentType())
                    .documentNumber(user.getDocumentNumber())
                    .email(user.getEmail()).phone(user.getPhone())
                    .role(user.getRole()).build();
                return userRepository.save(toSave);
            })
            .flatMap(saved -> eventPublisher
                .publishUserCreated(saved, createdBy).thenReturn(saved));
    }
}

// ═══ infrastructure/adapters/in/rest/UserRest.java ═══
@RestController @RequestMapping("/api/v1/users") @RequiredArgsConstructor
public class UserRest {
    private final ICreateUserUseCase createUserUseCase;
    private final IGetUserUseCase getUserUseCase;
    private final UserMapper userMapper;
    private final ISecurityContext securityContext;

    @PostMapping
    public Mono<ResponseEntity<ApiResponse<UserResponse>>> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        return securityContext.getCurrentUserId()
            .flatMap(userId -> createUserUseCase.execute(
                userMapper.toModel(request), userId))
            .map(user -> ResponseEntity.status(201)
                .body(ApiResponse.success(userMapper.toResponse(user), "Created")));
    }

    @GetMapping("/organization")
    public Mono<ResponseEntity<ApiResponse<List<UserResponse>>>> byMyOrg() {
        return securityContext.getCurrentOrganizationId()
            .flatMap(orgId -> getUserUseCase.findActiveByOrganizationId(orgId)
                .map(userMapper::toResponse).collectList())
            .map(users -> ResponseEntity.ok(ApiResponse.success(users, "OK")));
    }
}

// ═══ infrastructure/adapters/out/messaging/UserEventPublisherImpl.java ═══
@Component @RequiredArgsConstructor
public class UserEventPublisherImpl implements IUserEventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private static final String EXCHANGE = "jass.events";

    @Override
    public Mono<Void> publishUserCreated(User user, String createdBy) {
        return Mono.fromRunnable(() -> rabbitTemplate.convertAndSend(
            EXCHANGE, "user.created",
            UserCreatedEvent.builder()
                .userId(user.getId()).organizationId(user.getOrganizationId())
                .email(user.getEmail()).role(user.getRole().name())
                .createdBy(createdBy).timestamp(Instant.now()).build()
        ));
    }
}

// ═══ infrastructure/security/GatewayHeadersFilter.java ═══
@Component @Order(Ordered.HIGHEST_PRECEDENCE) @RequiredArgsConstructor
public class GatewayHeadersFilter implements WebFilter {
    private final GatewayHeadersExtractor headersExtractor;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        AuthenticatedUser user = headersExtractor
            .extractFromRequest(exchange.getRequest());
        return chain.filter(exchange)
            .contextWrite(Context.of("AUTHENTICATED_USER", user));
    }
}

// ═══ application.yml + application-dev.yml (RabbitMQ) ═══
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/vg_users_db
    username: postgres
  rabbitmq:
    host: localhost
    port: 5672
  flyway:
    enabled: true
    locations: classpath:db/migration`,
     cqrs: `// ═══ command/model/CreateUserCommand.java ═══
public record CreateUserCommand(
    String name, String email, String orgId, Role role) {}

// ═══ command/handler/CreateUserHandler.java ═══
@Service @RequiredArgsConstructor
public class CreateUserHandler {
    private final UserWriteRepository writeRepo;
    private final UserEventPublisher events;
    private final OrgServiceClient orgClient;

    public Mono<UserResponse> handle(CreateUserCommand cmd) {
        return orgClient.getOrg(cmd.orgId())
            .switchIfEmpty(Mono.error(
                new ForbiddenOrgException(cmd.orgId())))
            .then(Mono.defer(() -> {
                User user = new User(null, cmd.name(), cmd.email(),
                    cmd.orgId(), cmd.role(), "A", LocalDateTime.now());
                return writeRepo.save(user);
            }))
            .doOnSuccess(u -> events.publish(
                new UserCreatedEvent(u.getId(), u.getOrgId(), Instant.now())))
            .map(UserMapper::toResponse);
    }
}

// ═══ query/handler/ListUsersByOrgHandler.java ═══
@Service @RequiredArgsConstructor
public class ListUsersByOrgHandler {
    private final UserReadRepository readRepo;

    public Flux<UserView> handle(String orgId) {
        return readRepo.findActiveByOrgId(orgId);
    }
}

// ═══ event/UserEventProjector.java — sincroniza vista de lectura ═══
@Service @RequiredArgsConstructor
public class UserEventProjector {
    private final UserReadRepository readRepo;

    @KafkaListener(topics = "user-events", groupId = "vg-ms-users-projector")
    public void onEvent(UserCreatedEvent event) {
        readRepo.insertView(event.userId(), event.orgId()).subscribe();
    }
}

// ═══ infrastructure/rest/UserRest.java — delega a command/query ═══
@RestController @RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserRest {
    private final CreateUserHandler createHandler;
    private final ListUsersByOrgHandler listHandler;

    @PostMapping @PreAuthorize("hasRole('ORG_ADMIN')")
    public Mono<UserResponse> create(@Valid @RequestBody CreateUserCommand cmd) {
        return createHandler.handle(cmd);
    }

    @GetMapping("/org/{orgId}") @PreAuthorize("hasAnyRole('ORG_ADMIN','TEACHER')")
    public Flux<UserView> byOrg(@PathVariable String orgId) {
        return listHandler.handle(orgId);
    }
}`,
};

const FE_ANGULAR_STRUCTURE = `📦 vg-ms-users-fe/                    ← Angular 17+ (standalone, SSR-ready)
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 core/                       ← Singleton — se carga UNA vez en root
│   │   │   ├── 📂 services/
│   │   │   │   ├── 🔷 auth.service.ts     ← login, logout, token, getUserRole()
│   │   │   │   ├── 🔷 user.service.ts     ← CRUD usuarios (HttpClient + Observable)
│   │   │   │   ├── 🔷 org.service.ts      ← organizaciones, niveles, sedes
│   │   │   │   └── 🔷 enrollment.service.ts
│   │   │   ├── 📂 guards/
│   │   │   │   ├── 🔷 auth.guard.ts       ← redirige a /login si no hay token
│   │   │   │   └── 🔷 role.guard.ts       ← verifica rol mínimo (ADMIN, CLIENT…)
│   │   │   ├── 📂 interceptors/
│   │   │   │   ├── 🔷 token.interceptor.ts    ← inyecta Bearer JWT en cada request
│   │   │   │   └── 🔷 error.interceptor.ts    ← captura 401/403, redirige o toast
│   │   │   └── 📂 models/
│   │   │       ├── 🔷 user.model.ts           ← export interface User { }
│   │   │       ├── 🔷 org.model.ts            ← export interface Org { }
│   │   │       └── 🔷 api-response.model.ts   ← export interface ApiResponse<T> { }
│   │   ├── 📂 shared/                     ← Componentes, pipes, directivas reutilizables
│   │   │   ├── 📂 components/
│   │   │   │   ├── 📂 navbar/             ← nav dinámico según rol
│   │   │   │   ├── 📂 sidebar/            ← menú lateral colapsable por rol
│   │   │   │   ├── 📂 modal/              ← modal genérico con @Input/@Output
│   │   │   │   ├── 📂 data-table/         ← tabla paginada, filtrable, reutilizable
│   │   │   │   └── 📂 toast/              ← notificaciones success/error/warning
│   │   │   ├── 📂 pipes/
│   │   │   │   ├── 🔷 date-format.pipe.ts
│   │   │   │   └── 🔷 role-label.pipe.ts  ← SUPER_ADMIN → "Super Administrador"
│   │   │   └── 📂 directives/
│   │   │       └── 🔷 has-role.directive.ts   ← *hasRole="'ADMIN'" — oculta por rol
│   │   ├── 📂 layouts/                    ← Contenedores de layout
│   │   │   ├── 📂 admin-layout/           ← sidebar + topbar + router-outlet (ADMIN+)
│   │   │   └── 📂 public-layout/          ← login, registro, reset password
│   │   ├── 📂 features/                   ← Módulos por funcionalidad (lazy loaded)
│   │   │   ├── 📂 dashboard/              ← métricas por org, cards con totales
│   │   │   ├── 📂 users/
│   │   │   │   ├── 📂 user-list/          ← tabla + filtros + paginación
│   │   │   │   └── 📂 user-form/          ← crear/editar con ReactiveFormsModule
│   │   │   ├── 📂 organizations/
│   │   │   │   ├── 📂 org-list/           ← lista de orgs (solo SUPER_ADMIN)
│   │   │   │   └── 📂 org-detail/         ← niveles, sedes, configuración
│   │   │   ├── 📂 enrollment/
│   │   │   │   ├── 📂 enrollment-list/    ← matrículas por período y nivel
│   │   │   │   └── 📂 enrollment-form/    ← asignar alumno → grado → sección
│   │   │   ├── 📂 academic/
│   │   │   │   ├── 📂 grades/             ← registro de notas por curso/sección
│   │   │   │   ├── 📂 attendance/         ← asistencia diaria por sección
│   │   │   │   └── 📂 schedule/           ← horario semanal por grado
│   │   │   └── 📂 reports/
│   │   │       ├── 📂 report-dashboard/   ← gráficos Chart.js / ng2-charts
│   │   │       └── 📂 report-export/      ← exportar PDF/Excel
│   │   ├── 🔷 app.component.ts
│   │   ├── 🔷 app.routes.ts              ← rutas lazy con canActivate por rol
│   │   └── 🔷 app.config.ts              ← provideRouter + provideHttpClient + interceptors
│   ├── 📂 environments/
│   │   ├── 🔷 environment.ts             ← apiUrl, production: false
│   │   └── 🔷 environment.prod.ts
│   └── 📄 index.html
├── ⚙️ angular.json
├── ⚙️ tsconfig.json
└── 📦 package.json`;

const FE_REACT_STRUCTURE = `📦 vg-ms-users-fe/                    ← React 19 + Vite + Tailwind
├── 📂 src/
│   ├── 📂 core/                       ← Singleton — se importa UNA vez en root
│   │   ├── 📂 services/
│   │   │   ├── 📜 auth.service.js     ← login, logout, token, getUserRole()
│   │   │   ├── 📜 user.service.js     ← CRUD usuarios (axios + async/await)
│   │   │   ├── 📜 org.service.js      ← organizaciones, niveles, sedes
│   │   │   └── 📜 enrollment.service.js
│   │   ├── 📂 interceptors/
│   │   │   ├── 📜 axiosConfig.js      ← baseURL + interceptor Bearer JWT
│   │   │   └── 📜 errorHandler.js     ← captura 401/403, redirige
│   │   └── 📂 models/
│   │       ├── 📜 user.model.js       ← JSDoc typedefs: User, UserRequest
│   │       ├── 📜 org.model.js        ← Organization, Level, Section
│   │       └── 📜 api-response.model.js
│   ├── 📂 shared/                     ← Componentes y hooks reutilizables
│   │   ├── 📂 components/
│   │   │   ├── 📂 navbar/             ← nav dinámico según rol
│   │   │   ├── 📂 sidebar/            ← menú lateral colapsable por rol
│   │   │   ├── 📂 modal/              ← modal genérico con props
│   │   │   ├── 📂 data-table/         ← tabla paginada, filtrable, reutilizable
│   │   │   └── 📂 toast/              ← notificaciones success/error/warning
│   │   ├── 📂 hooks/
│   │   │   ├── 📜 useAuth.js          ← login, logout, role, token
│   │   │   ├── 📜 useDebounce.js      ← debounce para búsquedas
│   │   │   └── 📜 useLocalStorage.js
│   │   └── 📂 guards/
│   │       ├── ⚛️ ProtectedRoute.jsx   ← redirige a /login si no hay auth
│   │       └── ⚛️ RoleRoute.jsx        ← verifica rol mínimo (ADMIN, CLIENT…)
│   ├── 📂 layouts/                    ← Contenedores de layout
│   │   ├── ⚛️ AdminLayout.jsx         ← sidebar + topbar + <Outlet> (ADMIN+)
│   │   └── ⚛️ PublicLayout.jsx        ← login, registro, reset password
│   ├── 📂 features/                   ← Páginas por funcionalidad (lazy loaded)
│   │   ├── 📂 dashboard/
│   │   │   └── ⚛️ DashboardPage.jsx   ← métricas por org, cards con totales
│   │   ├── 📂 users/
│   │   │   ├── ⚛️ UserListPage.jsx    ← tabla + filtros + paginación
│   │   │   └── ⚛️ UserFormPage.jsx    ← crear/editar con React Hook Form
│   │   ├── 📂 organizations/
│   │   │   ├── ⚛️ OrgListPage.jsx     ← lista de orgs (solo SUPER_ADMIN)
│   │   │   └── ⚛️ OrgDetailPage.jsx   ← niveles, sedes, configuración
│   │   ├── 📂 enrollment/
│   │   │   ├── ⚛️ EnrollmentList.jsx  ← matrículas por período y nivel
│   │   │   └── ⚛️ EnrollmentForm.jsx  ← asignar alumno → grado → sección
│   │   ├── 📂 academic/
│   │   │   ├── ⚛️ GradesPage.jsx      ← registro de notas por curso/sección
│   │   │   ├── ⚛️ AttendancePage.jsx  ← asistencia diaria por sección
│   │   │   └── ⚛️ SchedulePage.jsx    ← horario semanal por grado
│   │   └── 📂 reports/
│   │       ├── ⚛️ ReportDashboard.jsx ← gráficos Recharts
│   │       └── ⚛️ ReportExport.jsx   ← exportar PDF/Excel
│   ├── 📂 context/                    ← Context API para estado global
│   │   ├── ⚛️ AuthContext.jsx         ← AuthProvider + useAuthContext
│   │   └── ⚛️ ThemeContext.jsx        ← dark/light mode
│   ├── 📂 utils/                      ← Funciones puras reutilizables
│   │   ├── 📜 formatDate.js
│   │   ├── 📜 roleUtils.js           ← SUPER_ADMIN → "Super Administrador"
│   │   └── 📜 constants.js           ← API_URL, ROLES, STATUS
│   ├── ⚛️ App.jsx                     ← <Routes> + lazy() + <Suspense>
│   ├── ⚛️ main.jsx                    ← <BrowserRouter> + providers + <App />
│   └── 🎨 index.css                   ← @import 'tailwindcss'
├── 📝 .env                            ← VITE_API_URL=http://localhost:8080/api
├── 📄 index.html
├── 📦 package.json
└── ⚙️ vite.config.js`;

const FE_ANGULAR_SNIPPET = `// ═══ core/services/user.service.ts ═══
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = environment.apiUrl + '/users';

  getAll(): Observable<User[]> { return this.http.get<User[]>(this.base); }

  getByOrg(orgId: string): Observable<User[]> {
    return this.http.get<User[]>(\`\${this.base}/org/\${orgId}\`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.base, user);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(\`\${this.base}/\${id}\`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.base}/\${id}\`);
  }
}

// ═══ core/guards/role.guard.ts — protege rutas por rol ═══
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const role = auth.getUserRole();
    return allowedRoles.includes(role) ? true : router.parseUrl('/unauthorized');
  };
};

// ═══ core/interceptors/token.interceptor.ts ═══
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } });
  }
  return next(req);
};

// ═══ core/interceptors/error.interceptor.ts ═══
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) router.navigate(['/login']);
      if (err.status === 403) router.navigate(['/unauthorized']);
      return throwError(() => err);
    })
  );
};

// ═══ shared/directives/has-role.directive.ts ═══
@Directive({ selector: '[hasRole]', standalone: true })
export class HasRoleDirective {
  private auth = inject(AuthService);
  @Input() set hasRole(role: string) {
    this.auth.getUserRole() === role
      ? this.vcr.createEmbeddedView(this.tpl)
      : this.vcr.clear();
  }
  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}
}

// ═══ app.routes.ts — rutas protegidas por rol ═══
export const routes: Routes = [
  { path: '', component: AdminLayoutComponent,
    canActivate: [authGuard], children: [
    { path: 'dashboard',
      loadComponent: () => import('./features/dashboard/dashboard.component') },
    { path: 'users',
      loadComponent: () => import('./features/users/user-list/user-list.component'),
      canActivate: [roleGuard(['SUPER_ADMIN', 'ORG_ADMIN'])] },
    { path: 'enrollment',
      loadComponent: () => import('./features/enrollment/enrollment-list/enrollment-list.component'),
      canActivate: [roleGuard(['ORG_ADMIN'])] },
    { path: 'grades',
      loadComponent: () => import('./features/academic/grades/grades.component'),
      canActivate: [roleGuard(['ORG_ADMIN', 'TEACHER'])] },
  ]},
  { path: 'login', component: PublicLayoutComponent, children: [
    { path: '', loadComponent: () => import('./features/auth/login/login.component') },
  ]},
];

// ═══ app.config.ts ═══
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])),
  ],
};`;

const FE_REACT_SNIPPET = `// ═══ core/interceptors/axiosConfig.js — baseURL + JWT ═══
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) window.location.href = '/login';
    if (err.response?.status === 403) window.location.href = '/unauthorized';
    return Promise.reject(err);
  }
);

// ═══ core/services/user.service.js — CRUD via axios ═══
import { api } from '../interceptors/axiosConfig';

export const userService = {
  getAll:       ()          => api.get('/api/v1/users'),
  getByOrg:     (orgId)     => api.get(\`/api/v1/users/organization/\${orgId}\`),
  create:       (data)      => api.post('/api/v1/users', data),
  update:       (id, data)  => api.put(\`/api/v1/users/\${id}\`, data),
  remove:       (id)        => api.delete(\`/api/v1/users/\${id}\`),
  restore:      (id)        => api.patch(\`/api/v1/users/\${id}/restore\`),
};

// ═══ shared/hooks/useAuth.js — auth state + role check ═══
import { useState, useCallback } from 'react';
import { api } from '../../core/interceptors/axiosConfig';

export function useAuth() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null'));

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('access_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const hasRole = (role) => user?.roles?.includes(role);
  return { user, login, logout, hasRole, isAuth: !!user };
}

// ═══ shared/guards/ProtectedRoute.jsx ═══
import { Navigate, Outlet } from 'react-router-dom';
export default function ProtectedRoute({ isAuth }) {
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

// ═══ shared/guards/RoleRoute.jsx ═══
import { Navigate, Outlet } from 'react-router-dom';
export default function RoleRoute({ hasRole, allowed }) {
  return allowed.some(hasRole)
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
}

// ═══ App.jsx — rutas protegidas con lazy + Suspense ═══
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './shared/guards/ProtectedRoute';
import RoleRoute from './shared/guards/RoleRoute';

const Dashboard   = lazy(() => import('./features/dashboard/DashboardPage'));
const UserList    = lazy(() => import('./features/users/UserListPage'));
const UserForm    = lazy(() => import('./features/users/UserFormPage'));
const OrgList     = lazy(() => import('./features/organizations/OrgListPage'));
const Enrollment  = lazy(() => import('./features/enrollment/EnrollmentList'));

export default function App() {
  const { isAuth, hasRole } = useAuth();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<ProtectedRoute isAuth={isAuth} />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<RoleRoute hasRole={hasRole}
              allowed={['SUPER_ADMIN','ADMIN']} />}>
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/organizations" element={<OrgList />} />
            </Route>
            <Route path="/enrollment" element={<Enrollment />} />
          </Route>
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Suspense>
  );
}`;

const FE_NAMING_ANGULAR = [
     { what: "Component", rule: "kebab-case carpeta + .component.ts", example: "user-list/user-list.component.ts → UserListComponent", color: "text-rose-400", bg: "bg-rose-500/8 border-rose-500/20" },
     { what: "Service", rule: "kebab-case + .service.ts", example: "user.service.ts → UserService", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { what: "Guard", rule: "kebab-case + .guard.ts", example: "auth.guard.ts → authGuard (functional)", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
     { what: "Interceptor", rule: "kebab-case + .interceptor.ts", example: "token.interceptor.ts → tokenInterceptor", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { what: "Pipe", rule: "kebab-case + .pipe.ts", example: "date-format.pipe.ts → DateFormatPipe", color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20" },
     { what: "Interfaz/Model", rule: "PascalCase + .model.ts", example: "user.model.ts → export interface User { }", color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20" },
];

const FE_NAMING_REACT = [
     { what: "Component / Page", rule: "PascalCase · .jsx", example: "UserListPage.jsx → export default function UserListPage()", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
     { what: "Custom Hook", rule: "camelCase · prefijo use · .js", example: "useAuth.js → export function useAuth()", color: "text-teal-400", bg: "bg-teal-500/8 border-teal-500/20" },
     { what: "Service", rule: "camelCase · .service.js", example: "user.service.js → export const userService = {}", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
     { what: "Context", rule: "PascalCase · sufijo Context · .jsx", example: "AuthContext.jsx → createContext()", color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/20" },
     { what: "Guard", rule: "PascalCase · .jsx", example: "ProtectedRoute.jsx → redirige si no auth", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
     { what: "Utility / Props", rule: "camelCase · .js", example: "formatDate.js, roleUtils.js, constants.js", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
];

// ─── DEPLOYMENT / ORQUESTACIÓN ─────────────────────────────────────

const DEPLOY_PATTERNS = [
     {
          name: "Orquestación",
          icon: "🎛",
          accent: "orange",
          desc: "Un componente central (orquestador) coordina la secuencia de llamadas entre microservicios. Controla el flujo completo de una transacción distribuida.",
          pros: ["Flujo visible y depurable", "Rollback centralizado (Saga)", "Fácil de entender y testear", "Control total del orden de ejecución"],
          cons: ["Single point of failure si el orquestador cae", "Acoplamiento al orquestador", "Puede volverse bottleneck con mucha carga"],
          tools: ["Spring Cloud Gateway", "Camunda", "Temporal.io", "AWS Step Functions"],
          example: "API Gateway recibe request → llama vg-ms-users → luego vg-ms-orgs → luego vg-ms-notifications → responde al cliente",
     },
     {
          name: "Coreografía",
          icon: "💃",
          accent: "pink",
          desc: "No hay coordinador central. Cada microservicio reacciona a eventos publicados por otros. La lógica distribuida emerge del flujo de eventos.",
          pros: ["Sin single point of failure", "Bajo acoplamiento entre servicios", "Escalabilidad natural", "Cada servicio es autónomo"],
          cons: ["Flujo difícil de seguir (event spaghetti)", "Debug complejo en transacciones largas", "Requiere idempotencia en consumidores", "Difícil garantizar orden"],
          tools: ["RabbitMQ", "Apache Kafka", "Amazon SNS/SQS", "Redis Streams"],
          example: "vg-ms-users publica 'user.created' → vg-ms-auth escucha y crea credenciales → vg-ms-notifications escucha y envía bienvenida",
     },
];

const DEPLOY_COMPARISON = [
     { criteria: "Coordinación", orchestration: "Centralizada — el orquestador decide el flujo", choreography: "Distribuida — cada ms reacciona a eventos" },
     { criteria: "Acoplamiento", orchestration: "Medio — dependen del orquestador", choreography: "Bajo — solo conocen los eventos" },
     { criteria: "Visibilidad", orchestration: "✅ Alta — flujo visible en un lugar", choreography: "⚠️ Baja — hay que rastrear eventos" },
     { criteria: "Escalabilidad", orchestration: "⚠️ Limitada por el orquestador", choreography: "✅ Alta — cada ms escala independientemente" },
     { criteria: "Rollback/Saga", orchestration: "✅ Saga centralizada", choreography: "⚠️ Saga coreografiada (más compleja)" },
     { criteria: "Debugging", orchestration: "✅ Fácil — logs centralizados", choreography: "⚠️ Requiere tracing distribuido" },
     { criteria: "Ejemplo en PRS", orchestration: "API Gateway → ms-users → ms-orgs → ms-notif", choreography: "ms-users publica → ms-auth + ms-notif escuchan" },
     { criteria: "Recomendación PRS", orchestration: "✅ Para flujos críticos (crear usuario, matrícula)", choreography: "✅ Para eventos no-críticos (notificaciones, logs)" },
];

const DEPLOY_TOOLS = [
     {
          name: "Docker Compose",
          icon: "🐳",
          accent: "sky",
          desc: "Orquestación local para desarrollo. Define todos los microservicios, bases de datos y brokers en un solo archivo YAML. Ideal para levantar el entorno completo con un comando.",
          use: "Desarrollo local + CI/CD pipelines",
          pros: ["Un comando levanta todo: docker compose up", "Redes internas entre servicios", "Volúmenes persistentes para DBs", "Variables de entorno centralizadas"],
          cons: ["Solo para un host (no escala en producción)", "Sin auto-healing ni load balancing", "Sin rolling updates nativos"],
     },
     {
          name: "Kubernetes (K8s)",
          icon: "☸",
          accent: "blue",
          desc: "Orquestación de contenedores para producción. Auto-scaling, self-healing, rolling updates, service discovery, load balancing — todo automático.",
          use: "Staging + Producción",
          pros: ["Auto-scaling horizontal (HPA)", "Self-healing (reinicia pods caídos)", "Rolling updates sin downtime", "Service discovery + load balancing", "Secrets y ConfigMaps nativos"],
          cons: ["Curva de aprendizaje alta", "Requiere cluster (EKS, GKE, AKS)", "Overhead para proyectos pequeños"],
     },
     {
          name: "Docker Swarm",
          icon: "🐝",
          accent: "amber",
          desc: "Orquestación nativa de Docker. Más simple que Kubernetes pero con capacidades de cluster: replicación, load balancing y rolling updates.",
          use: "Producción de bajo/medio tráfico",
          pros: ["Integrado en Docker (sin instalar nada extra)", "Más simple que K8s", "Replicación y load balancing", "Rolling updates nativos"],
          cons: ["Menos features que K8s", "Comunidad más pequeña", "Sin auto-scaling avanzado", "Menos soporte cloud-native"],
     },
];

const DOCKER_COMPOSE_SNIPPET = `# docker-compose.yml — Entorno completo PRS
version: '3.9'
services:
  # ═══ INFRAESTRUCTURA ═══
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports: ["5672:5672", "15672:15672"]

  # ═══ MICROSERVICIOS ═══
  vg-ms-config:
    build: ./vg-ms-config
    ports: ["8888:8888"]

  vg-ms-eureka:
    build: ./vg-ms-eureka
    ports: ["8761:8761"]
    depends_on: [vg-ms-config]

  vg-ms-gateway:
    build: ./vg-ms-gateway
    ports: ["8080:8080"]
    depends_on: [vg-ms-eureka, vg-ms-config]
    environment:
      EUREKA_URI: http://vg-ms-eureka:8761/eureka

  vg-ms-users:
    build: ./vg-ms-users
    depends_on: [postgres, rabbitmq, vg-ms-eureka]
    environment:
      SPRING_R2DBC_URL: r2dbc:postgresql://postgres:5432/vg_users_db
      SPRING_RABBITMQ_HOST: rabbitmq
      EUREKA_URI: http://vg-ms-eureka:8761/eureka

  vg-ms-organizations:
    build: ./vg-ms-organizations
    depends_on: [postgres, rabbitmq, vg-ms-eureka]

  vg-ms-auth:
    build: ./vg-ms-auth
    depends_on: [postgres, vg-ms-eureka]

  vg-ms-notifications:
    build: ./vg-ms-notifications
    depends_on: [rabbitmq, vg-ms-eureka]

volumes:
  postgres_data:`;

function FileTree({ code }) {
     return <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-300 whitespace-pre">{code}</pre>;
}

function CodeBlock({ filename, code }) {
     return (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
               <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                    <div className="flex gap-1.5">
                         <span className="w-3 h-3 rounded-full bg-red-500/60" />
                         <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                         <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-slate-500 text-xs font-mono ml-2">{filename}</span>
               </div>
               <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-300 whitespace-pre">{code}</pre>
          </div>
     );
}

function TreeBlock({ label, code }) {
     return (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
               <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                    <div className="flex gap-1.5">
                         <span className="w-3 h-3 rounded-full bg-red-500/60" />
                         <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                         <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-slate-500 text-xs font-mono ml-2">{label}</span>
               </div>
               <FileTree code={code} />
          </div>
     );
}

export default function Semester5() {
     const [activeSection, setActiveSection] = useState("patterns");
     const [feChoice, setFeChoice] = useState("angular");
     const [bePattern, setBePattern] = useState("layered");
     const contentRef = useRef(null);

     const sectionColors = {
          patterns: { active: "bg-emerald-600/20 border-emerald-500/50 text-emerald-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
          communication: { active: "bg-sky-600/20 border-sky-500/50 text-sky-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
          databases: { active: "bg-violet-600/20 border-violet-500/50 text-violet-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
          security: { active: "bg-amber-600/20 border-amber-500/50 text-amber-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
          backend: { active: "bg-teal-600/20 border-teal-500/50 text-teal-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
          frontend: { active: "bg-rose-600/20 border-rose-500/50 text-rose-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
          deployment: { active: "bg-orange-600/20 border-orange-500/50 text-orange-300", inactive: "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300" },
     };

     const handleSectionChange = (id) => {
          setActiveSection(id);
          contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
     };

     return (<>
          <div className="min-h-full px-6 md:px-10 py-10 max-w-5xl mx-auto space-y-14">

               <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                         <span className="bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Semestre V · VI
                         </span>
                         <span className="bg-rose-600/20 border border-rose-600/40 text-rose-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Proyecto de Responsabilidad Social
                         </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
                         Arquitectura de Microservicios
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                         Estándares de arquitectura para el{" "}
                         <span className="text-emerald-400 font-semibold">proyecto multi-organización PRS</span> compartido entre Semestre V y VI.
                         Define <span className="text-sky-400 font-semibold">patrones de diseño</span>,{" "}
                         <span className="text-violet-400 font-semibold">comunicación entre servicios</span>,{" "}
                         <span className="text-amber-400 font-semibold">seguridad</span> y los estándares de paquetes para{" "}
                         <span className="text-teal-400 font-semibold">Spring Boot WebFlux</span> con{" "}
                         <span className="text-rose-400 font-semibold">Angular o React</span>.
                    </p>
               </motion.div>

               <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                         <h2 className="text-white font-bold text-lg">Secciones del estándar</h2>
                    </div>
                    <p className="text-slate-500 text-sm mb-5">Selecciona una sección para explorar su contenido.</p>
                    <div className="flex flex-wrap gap-2">
                         {SECTIONS.map((s) => (
                              <button
                                   key={s.id}
                                   onClick={() => handleSectionChange(s.id)}
                                   className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${activeSection === s.id ? sectionColors[s.id].active : sectionColors[s.id].inactive}`}
                              >
                                   <span>{s.icon}</span>
                                   <span>{s.label}</span>
                              </button>
                         ))}
                    </div>
               </motion.div>

               <div ref={contentRef}>
                    <AnimatePresence mode="wait">

                         {activeSection === "patterns" && (
                              <motion.div key="patterns" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                                   <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Patrones de diseño arquitectónico</h2>
                                             <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Arquitectura</span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 max-w-2xl">Tres patrones con los que el equipo puede estructurar cada microservicio. La elección depende de la complejidad del dominio.</p>
                                   </div>

                                   {DESIGN_PATTERNS.map((p) => (
                                        <div key={p.name} className="space-y-4">
                                             <div className="flex items-center gap-3">
                                                  <div className={`w-1 h-5 bg-${p.accent}-500 rounded-full`} />
                                                  <h3 className="text-white font-bold text-lg">{p.name}</h3>
                                                  <span className={`bg-${p.accent}-500/10 border border-${p.accent}-500/20 text-${p.accent}-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest`}>{p.aka}</span>
                                             </div>
                                             <p className="text-slate-400 text-sm max-w-2xl">{p.desc}</p>

                                             <div className="space-y-2">
                                                  {p.layers.map((l) => (
                                                       <div key={l.name} className="flex items-start gap-3 rounded-xl border border-slate-800 px-4 py-3 bg-slate-900/40">
                                                            <span className={`shrink-0 font-black font-mono text-sm w-36 pt-0.5 ${l.color}`}>{l.name}</span>
                                                            <p className="text-slate-400 text-sm">{l.role}</p>
                                                       </div>
                                                  ))}
                                             </div>

                                             <div className="rounded-xl border border-slate-800 px-4 py-3 bg-slate-900/40">
                                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cuándo usarlo:</span>
                                                  <p className="text-slate-300 text-sm mt-1">{p.when}</p>
                                             </div>

                                             <TreeBlock label={`estructura — ${p.name.toLowerCase()}`} code={p.structure} />
                                        </div>
                                   ))}

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Comparativa de patrones</h2>
                                        </div>
                                        <div className="rounded-2xl border border-slate-800 overflow-hidden">
                                             <div className="grid grid-cols-4 bg-slate-900/80 border-b border-slate-800 px-4 py-2">
                                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Criterio</span>
                                                  <span className="text-sky-400/70 text-xs font-bold uppercase tracking-widest">Layered (MVC)</span>
                                                  <span className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest">Hexagonal</span>
                                                  <span className="text-violet-400/70 text-xs font-bold uppercase tracking-widest">CQRS</span>
                                             </div>
                                             {PATTERN_COMPARISON.map((row) => (
                                                  <div key={row.criteria} className="grid grid-cols-4 px-4 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                                                       <span className="text-slate-300 text-xs font-semibold">{row.criteria}</span>
                                                       <span className="text-sky-300 text-xs font-mono">{row.layered}</span>
                                                       <span className="text-emerald-300 text-xs font-mono">{row.hexagonal}</span>
                                                       <span className="text-violet-300 text-xs font-mono">{row.cqrs}</span>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                              </motion.div>
                         )}

                         {activeSection === "communication" && (
                              <motion.div key="communication" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                                   <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <div className="w-1 h-5 bg-sky-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Comunicación entre microservicios</h2>
                                             <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Síncrona vs Asíncrona</span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 max-w-2xl">En un sistema multi-organización los microservicios necesitan comunicarse. La elección entre comunicación síncrona y asíncrona define la resiliencia y acoplamiento del sistema.</p>
                                   </div>

                                   {COMM_PATTERNS.map((cp) => (
                                        <div key={cp.type} className="space-y-4">
                                             <div className="flex items-center gap-3">
                                                  <div className={`w-1 h-5 bg-${cp.accent}-500 rounded-full`} />
                                                  <span className="text-2xl">{cp.icon}</span>
                                                  <h3 className="text-white font-bold text-lg">Comunicación {cp.type}</h3>
                                             </div>
                                             <p className="text-slate-400 text-sm max-w-2xl">{cp.desc}</p>

                                             <div className="space-y-2">
                                                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Herramientas</p>
                                                  {cp.tools.map((t) => (
                                                       <div key={t.name} className={`flex items-center gap-3 rounded-xl border border-slate-800 px-4 py-3 bg-slate-900/40`}>
                                                            <span className={`text-sm font-bold ${t.color}`}>{t.name}</span>
                                                            <span className="text-slate-500 text-xs ml-auto text-right">{t.role}</span>
                                                       </div>
                                                  ))}
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                                                       <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Ventajas</p>
                                                       <ul className="space-y-1">
                                                            {cp.pros.map((p) => (
                                                                 <li key={p} className="text-slate-300 text-sm flex items-start gap-2">
                                                                      <span className="text-emerald-400 mt-0.5">✓</span>{p}
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                                                       <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">Desventajas</p>
                                                       <ul className="space-y-1">
                                                            {cp.cons.map((c) => (
                                                                 <li key={c} className="text-slate-300 text-sm flex items-start gap-2">
                                                                      <span className="text-red-400 mt-0.5">✗</span>{c}
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>

                                             <CodeBlock filename={`Ejemplo — comunicación ${cp.type.toLowerCase()}`} code={cp.snippet} />
                                        </div>
                                   ))}

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Cuándo usar cada tipo</h2>
                                        </div>
                                        <div className="space-y-2">
                                             {COMM_DECISION.map((d) => (
                                                  <div key={d.scenario} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 rounded-xl border border-slate-800 px-4 py-3 bg-slate-900/40 items-center">
                                                       <p className="text-slate-300 text-sm">{d.scenario}</p>
                                                       <span className={`text-xs font-bold px-3 py-1 rounded-full border ${d.color === "text-sky-400" ? "bg-sky-500/10 border-sky-500/20 text-sky-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}>{d.rec}</span>
                                                       <p className="text-slate-500 text-xs">{d.reason}</p>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-orange-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Kafka vs RabbitMQ</h2>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-4 max-w-2xl">Los dos brokers principales para comunicación asíncrona. La elección depende del caso de uso específico.</p>
                                        <div className="rounded-2xl border border-slate-800 overflow-hidden">
                                             <div className="grid grid-cols-3 bg-slate-900/80 border-b border-slate-800 px-4 py-2">
                                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Criterio</span>
                                                  <span className="text-amber-400/70 text-xs font-bold uppercase tracking-widest">Apache Kafka</span>
                                                  <span className="text-orange-400/70 text-xs font-bold uppercase tracking-widest">RabbitMQ</span>
                                             </div>
                                             {KAFKA_VS_RABBIT.map((row) => (
                                                  <div key={row.criteria} className="grid grid-cols-3 px-4 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                                                       <span className="text-slate-300 text-xs font-semibold">{row.criteria}</span>
                                                       <span className="text-amber-300 text-xs font-mono">{row.kafka}</span>
                                                       <span className="text-orange-300 text-xs font-mono">{row.rabbit}</span>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-orange-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Ejemplo — RabbitMQ (alternativa a Kafka)</h2>
                                        </div>
                                        <CodeBlock filename="UserEventPublisher.java · UserEventListener.java · RabbitConfig.java · application.yaml" code={RABBIT_SNIPPET} />
                                   </div>

                              </motion.div>
                         )}

                         {activeSection === "databases" && (
                              <motion.div key="databases" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                                   <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <div className="w-1 h-5 bg-violet-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Bases de datos para microservicios</h2>
                                             <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Database per Service</span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 max-w-2xl">Cada microservicio tiene su propia base de datos (<span className="text-violet-400 font-semibold">Database per Service pattern</span>). No se comparten bases entre servicios — la comunicación es por API o eventos.</p>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {DB_OPTIONS.map((db) => (
                                             <div key={db.name} className={`rounded-2xl border border-${db.accent}-500/20 bg-${db.accent}-500/5 p-5 space-y-3`}>
                                                  <div className="flex items-center gap-2">
                                                       <span className="text-lg">{db.icon}</span>
                                                       <h3 className={`text-${db.accent}-400 font-bold text-base`}>{db.name}</h3>
                                                       <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest ml-auto">{db.type}</span>
                                                  </div>

                                                  <div className="space-y-1.5 text-xs">
                                                       <div className="flex gap-2"><span className="text-slate-500 shrink-0 w-14">Driver:</span><span className="text-slate-300 font-mono">{db.driver}</span></div>
                                                       <div className="flex gap-2"><span className="text-slate-500 shrink-0 w-14">Entidad:</span><span className="text-slate-300 font-mono">{db.entity}</span></div>
                                                       <div className="flex gap-2"><span className="text-slate-500 shrink-0 w-14">Repo:</span><span className="text-slate-300 font-mono">{db.repo}</span></div>
                                                       <div className="flex gap-2"><span className="text-slate-500 shrink-0 w-14">YAML:</span><span className="text-slate-300 font-mono text-[10px]">{db.yaml}</span></div>
                                                  </div>

                                                  <div>
                                                       <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ventajas</p>
                                                       <ul className="space-y-0.5">
                                                            {db.pros.map((p) => <li key={p} className="text-slate-400 text-xs">✓ {p}</li>)}
                                                       </ul>
                                                  </div>
                                                  <div>
                                                       <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Desventajas</p>
                                                       <ul className="space-y-0.5">
                                                            {db.cons.map((c) => <li key={c} className="text-slate-400 text-xs">✗ {c}</li>)}
                                                       </ul>
                                                  </div>
                                                  <div className="rounded-lg border border-slate-800 px-3 py-2 bg-slate-900/40">
                                                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Ideal para</p>
                                                       <p className="text-slate-300 text-xs">{db.when}</p>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Estrategia por microservicio</h2>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-4 max-w-2xl">Ejemplo de asignación de BD para un sistema multi-organización típico del PRS.</p>
                                        <div className="space-y-2">
                                             {DB_STRATEGY.map((s) => (
                                                  <div key={s.service} className="flex items-center gap-4 rounded-xl border border-slate-800 px-4 py-3 bg-slate-900/40">
                                                       <span className={`shrink-0 font-black font-mono text-sm w-40 ${s.color}`}>{s.service}</span>
                                                       <span className={`text-xs font-bold px-3 py-1 rounded-full border ${s.color.includes("red") ? "bg-red-500/10 border-red-500/20" : "bg-green-500/10 border-green-500/20"}`}>{s.db}</span>
                                                       <span className="text-slate-500 text-xs ml-auto text-right">{s.reason}</span>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                              </motion.div>
                         )}

                         {activeSection === "security" && (
                              <motion.div key="security" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                                   <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <div className="w-1 h-5 bg-amber-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Seguridad — Autenticación y Autorización</h2>
                                             <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">OAuth 2.0 · JWT</span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 max-w-2xl">El sistema multi-organización necesita un proveedor de identidad central. Dos opciones principales: <span className="text-sky-400 font-semibold">Keycloak</span> (self-hosted) o <span className="text-amber-400 font-semibold">Firebase Auth</span> (cloud). Ambos emiten JWT que valida cada microservicio.</p>
                                   </div>

                                   {SECURITY_OPTIONS.map((opt) => (
                                        <div key={opt.name} className="space-y-4">
                                             <div className="flex items-center gap-3">
                                                  <div className={`w-1 h-5 bg-${opt.accent}-500 rounded-full`} />
                                                  <span className="text-xl">{opt.icon}</span>
                                                  <h3 className="text-white font-bold text-lg">{opt.name}</h3>
                                                  <span className={`bg-${opt.accent}-500/10 border border-${opt.accent}-500/20 text-${opt.accent}-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest`}>{opt.type}</span>
                                             </div>
                                             <p className="text-slate-400 text-sm max-w-2xl">{opt.desc}</p>

                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                  {opt.features.map((f) => (
                                                       <div key={f.name} className="flex flex-col gap-1 rounded-xl border border-slate-800 px-4 py-3 bg-slate-900/40">
                                                            <span className={`text-sm font-bold ${f.color}`}>{f.name}</span>
                                                            <span className="text-slate-500 text-xs">{f.detail}</span>
                                                       </div>
                                                  ))}
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                                                       <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Ventajas</p>
                                                       <ul className="space-y-1">
                                                            {opt.pros.map((p) => <li key={p} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>{p}</li>)}
                                                       </ul>
                                                  </div>
                                                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                                                       <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">Desventajas</p>
                                                       <ul className="space-y-1">
                                                            {opt.cons.map((c) => <li key={c} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span>{c}</li>)}
                                                       </ul>
                                                  </div>
                                             </div>

                                             <CodeBlock filename={`${opt.name} — configuración`} code={opt.snippet} />
                                        </div>
                                   ))}

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Comparativa Keycloak vs Firebase</h2>
                                        </div>
                                        <div className="rounded-2xl border border-slate-800 overflow-hidden">
                                             <div className="grid grid-cols-3 bg-slate-900/80 border-b border-slate-800 px-4 py-2">
                                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Criterio</span>
                                                  <span className="text-sky-400/70 text-xs font-bold uppercase tracking-widest">Keycloak</span>
                                                  <span className="text-amber-400/70 text-xs font-bold uppercase tracking-widest">Firebase Auth</span>
                                             </div>
                                             {SECURITY_COMPARISON.map((row) => (
                                                  <div key={row.criteria} className="grid grid-cols-3 px-4 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                                                       <span className="text-slate-300 text-xs font-semibold">{row.criteria}</span>
                                                       <span className="text-sky-300 text-xs font-mono">{row.keycloak}</span>
                                                       <span className="text-amber-300 text-xs font-mono">{row.firebase}</span>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-red-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">RBAC — Roles del sistema multi-organización</h2>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-4 max-w-2xl">Jerarquía de roles para un sistema de colegios con múltiples organizaciones. Cada rol tiene un alcance diferente.</p>
                                        <div className="space-y-2">
                                             {RBAC_ROLES.map((r) => (
                                                  <div key={r.role} className={`rounded-xl border px-4 py-3 ${r.bg}`}>
                                                       <div className="flex items-center gap-3 mb-1">
                                                            <span className={`font-black font-mono text-sm ${r.color}`}>{r.role}</span>
                                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-auto">{r.scope}</span>
                                                       </div>
                                                       <p className="text-slate-400 text-xs">{r.permissions}</p>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-violet-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Reglas de acceso por endpoint</h2>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-4 max-w-2xl">Cada endpoint del API se protege con <span className="text-violet-400 font-semibold">@PreAuthorize</span> o <span className="text-violet-400 font-semibold">SecurityWebFilterChain</span> según el rol mínimo requerido.</p>
                                        <div className="rounded-2xl border border-slate-800 overflow-hidden">
                                             <div className="grid grid-cols-[auto_1fr_auto_1fr] bg-slate-900/80 border-b border-slate-800 px-4 py-2 gap-3">
                                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Método</span>
                                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Path</span>
                                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Roles</span>
                                                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Nota</span>
                                             </div>
                                             {SECURITY_ENDPOINT_RULES.map((r) => (
                                                  <div key={r.method + r.path} className="grid grid-cols-[auto_1fr_auto_1fr] px-4 py-2.5 border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors gap-3">
                                                       <span className={`text-xs font-bold font-mono ${r.method === "GET" ? "text-emerald-400" : r.method === "POST" ? "text-sky-400" : r.method === "PUT" ? "text-amber-400" : "text-red-400"}`}>{r.method}</span>
                                                       <span className="text-slate-300 text-xs font-mono">{r.path}</span>
                                                       <span className="text-violet-300 text-xs font-bold">{r.roles}</span>
                                                       <span className="text-slate-500 text-xs">{r.note}</span>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                              </motion.div>
                         )}

                         {activeSection === "backend" && (
                              <motion.div key="backend" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                                   <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Estándar de paquetes — Backend</h2>
                                             <span className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Spring Boot · WebFlux · PostgreSQL</span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 max-w-2xl">Estructura enterprise para cada microservicio. Incluye <span className="text-teal-400 font-semibold">seguridad por roles (RBAC)</span>, <span className="text-amber-400 font-semibold">eventos Kafka/Rabbit</span>, <span className="text-sky-400 font-semibold">comunicación entre ms (WebClient)</span> y <span className="text-indigo-400 font-semibold">PostgreSQL R2DBC</span>. Se aplican los 3 patrones de diseño.</p>
                                   </div>

                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Ecosistema de microservicios — PRS</h2>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-4 max-w-2xl">Sistema multi-organización para colegios con 3 niveles (Inicial, Primaria, Secundaria). No es un CRUD simple — son múltiples microservicios comunicándose por API y eventos.</p>
                                        <div className="space-y-2">
                                             {PRS_ECOSYSTEM.map((ms) => (
                                                  <div key={ms.service} className="flex items-center gap-4 rounded-xl border border-slate-800 px-4 py-3 bg-slate-900/40">
                                                       <span className={`shrink-0 font-black font-mono text-sm w-44 ${ms.color}`}>{ms.service}</span>
                                                       <span className="text-slate-400 text-xs flex-1">{ms.desc}</span>
                                                       <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${ms.db === "—" ? "bg-slate-500/10 border-slate-500/20 text-slate-500" : ms.db === "MongoDB" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"}`}>{ms.db}</span>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   <div>
                                        <div className="flex items-center gap-3 mb-3">
                                             <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Paquetes + Estructura + Código — vg-ms-users (PostgreSQL)</h2>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-3 max-w-2xl">Selecciona el patrón de diseño para ver los paquetes, estructura y código del microservicio de usuarios con <span className="text-indigo-400 font-semibold">PostgreSQL R2DBC</span>, seguridad por roles y eventos RabbitMQ.</p>
                                        <div className="flex items-center gap-3 mb-6">
                                             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Patrón:</span>
                                             <div className="flex rounded-xl border border-slate-800 overflow-hidden">
                                                  <button onClick={() => setBePattern("layered")} className={`px-4 py-1.5 text-xs font-bold transition-all border-r border-slate-800 ${bePattern === "layered" ? "bg-sky-500/15 text-sky-300" : "text-slate-500 hover:text-slate-300"}`}>
                                                       MVC Layered
                                                  </button>
                                                  <button onClick={() => setBePattern("hexagonal")} className={`px-4 py-1.5 text-xs font-bold transition-all border-r border-slate-800 ${bePattern === "hexagonal" ? "bg-emerald-500/15 text-emerald-300" : "text-slate-500 hover:text-slate-300"}`}>
                                                       Hexagonal
                                                  </button>
                                                  <button onClick={() => setBePattern("cqrs")} className={`px-4 py-1.5 text-xs font-bold transition-all ${bePattern === "cqrs" ? "bg-violet-500/15 text-violet-300" : "text-slate-500 hover:text-slate-300"}`}>
                                                       CQRS
                                                  </button>
                                             </div>
                                        </div>
                                   </div>

                                   <AnimatePresence mode="wait">
                                        <motion.div key={bePattern} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-10">

                                             <div>
                                                  <div className="flex items-center gap-3 mb-4">
                                                       <div className="w-1 h-5 bg-teal-500 rounded-full" />
                                                       <h2 className="text-white font-bold text-lg">Paquetes Java — {bePattern === "layered" ? "Patrón MVC Layered" : bePattern === "hexagonal" ? "Arquitectura Hexagonal (Ports & Adapters)" : "Patrón CQRS"}</h2>
                                                  </div>
                                                  <div className="space-y-2">
                                                       {BE_PACKAGES[bePattern].map((pkg) => (
                                                            <div key={pkg.pkg} className={`flex gap-4 rounded-xl border px-4 py-3 ${pkg.bg}`}>
                                                                 <span className={`shrink-0 font-black font-mono text-sm ${bePattern === "hexagonal" ? "w-48" : bePattern === "cqrs" ? "w-40" : "w-28"} pt-0.5 ${pkg.accent}`}>{pkg.pkg}</span>
                                                                 <p className="text-slate-400 text-sm">{pkg.role}</p>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </div>

                                             <TreeBlock label={`vg-ms-users/ — ${bePattern === "layered" ? "MVC Layered" : bePattern === "hexagonal" ? "Hexagonal (Ports & Adapters)" : "CQRS"}`} code={BE_STRUCTURES[bePattern]} />
                                             <CodeBlock filename={bePattern === "layered" ? "User.java · SecurityConfig.java · UserServiceImpl.java · UserRest.java · application.yaml" : bePattern === "hexagonal" ? "User.java (domain) · ICreateUserUseCase · CreateUserUseCaseImpl · UserRest.java · UserEventPublisherImpl · GatewayHeadersFilter" : "CreateUserCommand.java · CreateUserHandler.java · UserEventProjector.java · UserRest.java"} code={BE_SNIPPETS[bePattern]} />

                                        </motion.div>
                                   </AnimatePresence>

                                   <div>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Stack base de cada microservicio</p>
                                        <div className="flex flex-wrap gap-2">
                                             {[
                                                  { name: "Java 21", color: "text-orange-400 bg-orange-500/10 border-orange-500/25" },
                                                  { name: "Spring WebFlux 3", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
                                                  { name: "PostgreSQL R2DBC", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25" },
                                                  { name: "Project Reactor", color: "text-teal-400 bg-teal-500/10 border-teal-500/25" },
                                                  { name: "Spring Security", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
                                                  { name: "RabbitMQ", color: "text-pink-400 bg-pink-500/10 border-pink-500/25" },
                                                  { name: "Resilience4j", color: "text-red-400 bg-red-500/10 border-red-500/25" },
                                                  { name: "Flyway", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25" },
                                                  { name: "Lombok", color: "text-violet-400 bg-violet-500/10 border-violet-500/25" },
                                                  { name: "Maven", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25" },
                                                  { name: "Docker", color: "text-sky-400 bg-sky-500/10 border-sky-500/25" },
                                             ].map((d) => (
                                                  <span key={d.name} className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border ${d.color}`}>{d.name}</span>
                                             ))}
                                        </div>
                                   </div>

                              </motion.div>
                         )}

                         {activeSection === "frontend" && (
                              <motion.div key="frontend" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                                   <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <div className="w-1 h-5 bg-rose-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Estándar de estructura — Frontend</h2>
                                             <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">Angular · React</span>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-3 max-w-2xl">El frontend del PRS se puede hacer con <span className="text-rose-400 font-semibold">Angular 17+</span> o <span className="text-sky-400 font-semibold">React 19</span> — el equipo decide. Ambos consumen la misma API REST reactiva.</p>
                                        <div className="flex items-center gap-3 mb-6">
                                             <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Framework:</span>
                                             <div className="flex rounded-xl border border-slate-800 overflow-hidden">
                                                  <button
                                                       onClick={() => setFeChoice("angular")}
                                                       className={`px-4 py-1.5 text-xs font-bold transition-all border-r border-slate-800 ${feChoice === "angular" ? "bg-rose-500/15 text-rose-300" : "text-slate-500 hover:text-slate-300"}`}
                                                  >
                                                       Angular 17+
                                                  </button>
                                                  <button
                                                       onClick={() => setFeChoice("react")}
                                                       className={`px-4 py-1.5 text-xs font-bold transition-all ${feChoice === "react" ? "bg-sky-500/15 text-sky-300" : "text-slate-500 hover:text-slate-300"}`}
                                                  >
                                                       React 19
                                                  </button>
                                             </div>
                                        </div>
                                   </div>

                                   <AnimatePresence mode="wait">
                                        <motion.div key={feChoice} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-10">
                                             <div>
                                                  <div className="flex items-center gap-3 mb-4">
                                                       <div className={`w-1 h-5 ${feChoice === "angular" ? "bg-rose-500" : "bg-sky-500"} rounded-full`} />
                                                       <h2 className="text-white font-bold text-lg">Estructura del proyecto</h2>
                                                  </div>
                                                  <TreeBlock label={feChoice === "angular" ? "vg-ms-users-fe/ (Angular)" : "vg-ms-users-fe/ (React)"} code={feChoice === "angular" ? FE_ANGULAR_STRUCTURE : FE_REACT_STRUCTURE} />
                                             </div>

                                             <div>
                                                  <div className="flex items-center gap-3 mb-4">
                                                       <div className={`w-1 h-5 ${feChoice === "angular" ? "bg-rose-500" : "bg-sky-500"} rounded-full`} />
                                                       <h2 className="text-white font-bold text-lg">Convención de nombres</h2>
                                                  </div>
                                                  <div className="space-y-2">
                                                       {(feChoice === "angular" ? FE_NAMING_ANGULAR : FE_NAMING_REACT).map((n) => (
                                                            <div key={n.what} className={`rounded-xl border px-4 py-3 ${n.bg}`}>
                                                                 <div className="flex items-center gap-3 mb-1">
                                                                      <span className={`text-sm font-bold ${n.color}`}>{n.what}</span>
                                                                      <span className="text-slate-500 text-xs font-mono">{n.rule}</span>
                                                                 </div>
                                                                 <p className="text-slate-400 text-xs font-mono">{n.example}</p>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </div>

                                             <div>
                                                  <div className="flex items-center gap-3 mb-4">
                                                       <div className={`w-1 h-5 ${feChoice === "angular" ? "bg-rose-500" : "bg-sky-500"} rounded-full`} />
                                                       <h2 className="text-white font-bold text-lg">Código ejemplo — consumir API + auth</h2>
                                                  </div>
                                                  <CodeBlock
                                                       filename={feChoice === "angular" ? "user.service.ts · token.interceptor.ts · app.config.ts" : "axiosConfig.js · userApi.js · useUsers.js"}
                                                       code={feChoice === "angular" ? FE_ANGULAR_SNIPPET : FE_REACT_SNIPPET}
                                                  />
                                             </div>

                                             <div>
                                                  <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Stack del frontend</p>
                                                  <div className="flex flex-wrap gap-2">
                                                       {(feChoice === "angular" ? [
                                                            { name: "Angular 17+", color: "text-rose-400 bg-rose-500/10 border-rose-500/25" },
                                                            { name: "TypeScript", color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
                                                            { name: "RxJS", color: "text-pink-400 bg-pink-500/10 border-pink-500/25" },
                                                            { name: "Bootstrap 5", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25" },
                                                            { name: "Angular CLI", color: "text-rose-400 bg-rose-500/10 border-rose-500/25" },
                                                       ] : [
                                                            { name: "React 19", color: "text-sky-400 bg-sky-500/10 border-sky-500/25" },
                                                            { name: "JavaScript ES6+", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25" },
                                                            { name: "Vite 7", color: "text-violet-400 bg-violet-500/10 border-violet-500/25" },
                                                            { name: "Tailwind CSS v4", color: "text-teal-400 bg-teal-500/10 border-teal-500/25" },
                                                            { name: "React Router DOM", color: "text-pink-400 bg-pink-500/10 border-pink-500/25" },
                                                            { name: "Axios", color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
                                                       ]).map((d) => (
                                                            <span key={d.name} className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border ${d.color}`}>{d.name}</span>
                                                       ))}
                                                  </div>
                                             </div>
                                        </motion.div>
                                   </AnimatePresence>

                              </motion.div>
                         )}

                         {activeSection === "deployment" && (
                              <motion.div key="deployment" custom={2} variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-10">

                                   {/* Orquestación vs Coreografía */}
                                   <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <div className="w-1 h-5 bg-orange-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Orquestación vs Coreografía</h2>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 max-w-2xl">Dos estrategias para coordinar la comunicación entre microservicios. El PRS usa <span className="text-orange-400 font-semibold">ambas</span>: orquestación para flujos críticos y coreografía para eventos reactivos.</p>
                                        <div className="grid md:grid-cols-2 gap-4">
                                             {DEPLOY_PATTERNS.map((dp) => (
                                                  <div key={dp.name} className={`rounded-2xl border border-${dp.accent}-500/20 bg-${dp.accent}-500/5 p-5 space-y-3`}>
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-2xl">{dp.icon}</span>
                                                            <h3 className={`text-${dp.accent}-400 font-bold text-base`}>{dp.name}</h3>
                                                       </div>
                                                       <p className="text-slate-400 text-sm leading-relaxed">{dp.desc}</p>
                                                       <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                                                            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">Ejemplo en PRS</p>
                                                            <p className="text-slate-300 text-xs font-mono">{dp.example}</p>
                                                       </div>
                                                       <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                 <p className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">Ventajas</p>
                                                                 {dp.pros.map((p) => (
                                                                      <p key={p} className="text-slate-400 text-xs flex items-start gap-1.5 mb-1"><span className="text-emerald-400 shrink-0">✓</span>{p}</p>
                                                                 ))}
                                                            </div>
                                                            <div>
                                                                 <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">Desventajas</p>
                                                                 {dp.cons.map((c) => (
                                                                      <p key={c} className="text-slate-400 text-xs flex items-start gap-1.5 mb-1"><span className="text-red-400 shrink-0">✗</span>{c}</p>
                                                                 ))}
                                                            </div>
                                                       </div>
                                                       <div>
                                                            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1.5">Herramientas</p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                 {dp.tools.map((t) => (
                                                                      <span key={t} className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border border-${dp.accent}-500/20 text-${dp.accent}-400 bg-${dp.accent}-500/10`}>{t}</span>
                                                                 ))}
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Tabla comparativa */}
                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-orange-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Comparativa detallada</h2>
                                        </div>
                                        <div className="overflow-x-auto rounded-2xl border border-slate-800">
                                             <table className="w-full text-left text-xs">
                                                  <thead>
                                                       <tr className="bg-slate-900/80 border-b border-slate-800">
                                                            <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">Criterio</th>
                                                            <th className="px-4 py-3 font-bold text-orange-400 uppercase tracking-wider">🎛 Orquestación</th>
                                                            <th className="px-4 py-3 font-bold text-pink-400 uppercase tracking-wider">💃 Coreografía</th>
                                                       </tr>
                                                  </thead>
                                                  <tbody>
                                                       {DEPLOY_COMPARISON.map((r, i) => (
                                                            <tr key={r.criteria} className={`border-b border-slate-800/60 ${i % 2 === 0 ? "bg-slate-900/30" : ""}`}>
                                                                 <td className="px-4 py-3 font-semibold text-slate-300">{r.criteria}</td>
                                                                 <td className="px-4 py-3 text-slate-400">{r.orchestration}</td>
                                                                 <td className="px-4 py-3 text-slate-400">{r.choreography}</td>
                                                            </tr>
                                                       ))}
                                                  </tbody>
                                             </table>
                                        </div>
                                   </div>

                                   {/* Herramientas de despliegue */}
                                   <div>
                                        <div className="flex items-center gap-3 mb-2">
                                             <div className="w-1 h-5 bg-orange-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Herramientas de despliegue</h2>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 max-w-2xl">Cómo levantar, escalar y mantener los microservicios del PRS en diferentes entornos.</p>
                                        <div className="space-y-4">
                                             {DEPLOY_TOOLS.map((tool) => (
                                                  <div key={tool.name} className={`rounded-2xl border border-${tool.accent}-500/20 bg-${tool.accent}-500/5 p-5 space-y-3`}>
                                                       <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{tool.icon}</span>
                                                            <div>
                                                                 <h3 className={`text-${tool.accent}-400 font-bold text-base`}>{tool.name}</h3>
                                                                 <p className="text-slate-500 text-[11px] uppercase tracking-widest font-bold">{tool.use}</p>
                                                            </div>
                                                       </div>
                                                       <p className="text-slate-400 text-sm leading-relaxed">{tool.desc}</p>
                                                       <div className="grid md:grid-cols-2 gap-4">
                                                            <div>
                                                                 <p className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">Ventajas</p>
                                                                 {tool.pros.map((p) => (
                                                                      <p key={p} className="text-slate-400 text-xs flex items-start gap-1.5 mb-1"><span className="text-emerald-400 shrink-0">✓</span>{p}</p>
                                                                 ))}
                                                            </div>
                                                            <div>
                                                                 <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">Limitaciones</p>
                                                                 {tool.cons.map((c) => (
                                                                      <p key={c} className="text-slate-400 text-xs flex items-start gap-1.5 mb-1"><span className="text-red-400 shrink-0">✗</span>{c}</p>
                                                                 ))}
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Docker Compose ejemplo */}
                                   <div>
                                        <div className="flex items-center gap-3 mb-4">
                                             <div className="w-1 h-5 bg-orange-500 rounded-full" />
                                             <h2 className="text-white font-bold text-lg">Docker Compose — entorno local PRS</h2>
                                        </div>
                                        <CodeBlock filename="docker-compose.yml" code={DOCKER_COMPOSE_SNIPPET} />
                                   </div>

                                   {/* Stack tags */}
                                   <div>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Stack de despliegue</p>
                                        <div className="flex flex-wrap gap-2">
                                             {[
                                                  { name: "Docker", color: "text-sky-400 bg-sky-500/10 border-sky-500/25" },
                                                  { name: "Docker Compose", color: "text-sky-400 bg-sky-500/10 border-sky-500/25" },
                                                  { name: "Kubernetes", color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
                                                  { name: "Docker Swarm", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
                                                  { name: "RabbitMQ", color: "text-orange-400 bg-orange-500/10 border-orange-500/25" },
                                                  { name: "Spring Cloud Gateway", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
                                                  { name: "Eureka", color: "text-green-400 bg-green-500/10 border-green-500/25" },
                                                  { name: "Config Server", color: "text-violet-400 bg-violet-500/10 border-violet-500/25" },
                                             ].map((d) => (
                                                  <span key={d.name} className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border ${d.color}`}>{d.name}</span>
                                             ))}
                                        </div>
                                   </div>

                              </motion.div>
                         )}

                    </AnimatePresence>
               </div>

          </div>
     </>);
}
