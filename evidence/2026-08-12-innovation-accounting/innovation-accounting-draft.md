# Innovation Accounting — Nahui (Borrador)

**Curso:** TI-4041 · Sesión 5, Viabilidad técnica y financiera. **Alcance:** Nivel 1 (Dashboard) y Nivel 2 (Business Case) únicamente — el material del curso excluye explícitamente Nivel 3 (NPV) de esta sesión, así que no se incluye aquí.

**Estado: BORRADOR PROVISIONAL, sin revisión de la Product Owner.** Todo lo que sigue combina datos ya validados en el repositorio (`company/CLAUDE.md`, `company/jobs-to-be-done.md`, `company/market-validation.md`, `company/backlog.md`) con estimaciones de mercado obtenidas hoy y con decisiones temporales tomadas para poder avanzar, siguiendo la misma disciplina de niveles de evidencia que ya usa `market-validation.md`: **Real** (dato confirmado, ya ocurrido), **Proyectado** (estimación razonada, no confirmada), **Calculado** (resultado de una fórmula sobre datos de las dos categorías anteriores). Nada aquí debe leerse como una Decisión de Negocio final — eso corresponde a `company/business-decisions.md`, no a este documento.

---

## Nivel 1 — Dashboard

Nahui está en una etapa anterior a la del ejemplo de SAiFE: el prototipo (Figma, Medium-Fidelity) ya está validado con Ana a nivel de experiencia, pero **todavía no existe una implementación real en producción, así que no hay datos de uso reales que reportar todavía.** Lo que sigue es el dashboard propuesto — qué se debe empezar a medir en cuanto exista una versión real en manos de comerciantes piloto — no un reporte de datos ya observados.

| Métrica | Qué revela | Fuente en el repositorio |
|---|---|---|
| % de ventas registradas en menos de 3 segundos | ¿El registro es realmente más rápido que el método actual (libreta, memoria)? Esta es literalmente la barra de éxito ya definida para el MVP. | `company/backlog.md` #1: "Success bar: >=90% of sales registered, <3 sec per registration" |
| Tiempo promedio de registro por venta | Lo mismo, en su forma continua — permite ver tendencia, no solo pasa/no-pasa. | Igual que arriba |
| % de sesiones de venta sin ninguna venta perdida (registro fallido o abandonado) | ¿La app realmente protege el registro cuando llega el siguiente cliente sin avisar — el job funcional exacto que Nahui existe para resolver? | `company/jobs-to-be-done.md` #1, el Job funcional central |
| Ventas registradas por comerciante por bazar | ¿Hay adopción sostenida durante un día real de venta, no solo una prueba única? | Mismo patrón que la métrica de SAiFE "Inspecciones por inspector por semana" |
| Tasa de retención bazar a bazar (¿el comerciante vuelve a usar Nahui en su siguiente bazar, o regresa a su método anterior?) | La métrica que de verdad distingue adopción real de una prueba de un solo uso — el mismo "motor pegajoso" que se usa en Nivel 2. | Análogo directo al "Ejemplo: Conciliación de información" del material del curso |
| % de comerciantes Paid-tier que activan un evento de venta con QR visible en el recibo | Señal de adopción de Frequent Customers (Clientes Frecuentes) — capacidad automática en Paid, sin activación manual (`decision-log.md` D40). | `company/backlog.md` #2, Stage 2 |
| Costo por venta registrada | ¿Cuánto cuesta operar Nahui, por transacción real? Alimenta directamente el Business Case (Nivel 2). | Ver Viabilidad Financiera, abajo — no calculable todavía sin datos reales |

**Nota importante, no es un detalle menor:** cinco de estas siete métricas dependen de datos que solo existen una vez que la app real (no el prototipo Figma) esté en manos de comerciantes reales. Esto no es una laguna del dashboard — es honesto reflejo de en qué etapa está el proyecto hoy. El paso que lo desbloquea es la implementación real descrita en Viabilidad Técnica, abajo.

---

## Nivel 2 — Business Case

Siguiendo el formato del curso (hipótesis de valor, hipótesis de crecimiento, motor de crecimiento, comportamiento real no proxies de actitud):

- **Hipótesis de valor:** Ana está encantada — no solo satisfecha — específicamente porque el registro de una venta le toma menos de 3 segundos y nunca pierde el registro aunque llegue otro cliente sin avisar. *(Fuente: `company/jobs-to-be-done.md` #1, el Job funcional validado con dos fuentes independientes — la entrevista con Ana y una observación de campo separada.)*
- **Hipótesis de crecimiento:** que otros comerciantes con la misma fricción (no solo Ana) adopten Nahui al verlo funcionar en un bazar, o que Ana misma amplíe su catálogo una vez que deje de autolimitarlo por control mental — el mismo efecto secundario "vio el resultado en una junta" del ejemplo de Conciliación, aplicado a un contexto de bazar.
- **Motor de crecimiento — motor pegajoso (el que aplica hoy con la evidencia que tenemos):** que la tasa de retención bazar-a-bazar (comerciantes que siguen usando Nahui en su siguiente evento) supere la tasa de abandono (comerciantes que lo probaron una vez y volvieron a su libreta o memoria). Este es el motor correcto para esta etapa, no el motor viral ni el pagado — no hay todavía ningún mecanismo de referido diseñado, y el modelo de precios (ver abajo) sigue sin decidirse.
- **Comportamiento real a medir, no proxies de actitud:** ventas efectivamente registradas por sesión, no una encuesta de satisfacción; regreso real al siguiente bazar, no una intención declarada de seguir usando la app.

**Hipótesis del Job aún no promovida a hallazgo validado — importante para no sobre-vender el caso:** `company/jobs-to-be-done.md` mantiene explícitamente como *Hipótesis Abierta*, no como hecho, que el job de registro esté genuinamente *sin resolver* (unserved) por cualquier alternativa existente, no solo mal resuelto. El Business Case de abajo asume que la fricción es real (evidencia fuerte) pero no asume que no exista ninguna alternativa competitiva — esa es una pregunta todavía abierta, pendiente de más investigación con comerciantes.

---

## 2a — Viabilidad Técnica

*(Provisional — construida por el agente `architect` de este proyecto, grounded en `product/00-foundation/domain-model.md`/`architecture-principles.md`, pendiente de revisión de la Product Owner. Ningún componente aquí representa una Decisión de Arquitectura final.)*

| | |
|---|---|
| **Datos** | Todo lo que ya define el modelo de dominio congelado: `Sale`, `SaleItem`, `Session`, `Event`, `Product`, `Business` — nada nuevo que inventar, solo persistirlo en una base de datos real en vez de un prototipo estático. |
| **Infraestructura tecnológica** | Frontend: React + TypeScript, empaquetado como PWA, alojado en Vercel. Backend/base de datos: **Supabase (Postgres + Auth + Storage + Edge Functions) — paquete de un solo proveedor, elegido por la Product Owner el 2026-08-12** (`company/business-decisions.md` Q15) sobre el stack por componente original (Render + Neon + Clerk + R2 por separado). **Punto abierto, no resuelto aquí:** el backend original se describía como un servicio Node.js/TypeScript propio en Render, organizado en los módulos del modelo de dominio (`identity`/`inventory`/`selling`/`intelligence`); falta que `architect` confirme cómo esa misma organización modular se traduce a Supabase Edge Functions (funciones serverless) en vez de un servicio Node de larga duración — no es solo un cambio de proveedor, podría ser un cambio de modelo de ejecución. |
| **Integraciones** | Autenticación de comerciantes: **teléfono + código OTP por SMS/WhatsApp, decidido por la Product Owner el 2026-08-12** (`company/business-decisions.md` Q14), vía Supabase Auth (que soporta OTP por teléfono de forma nativa). Lectura NFC: **bajo investigación conjunta `architect`+`knowledge-mentor`, dispatched 2026-08-12** (`company/business-decisions.md` Q16) — el requisito real de negocio es que Ana nunca necesite comprar un lector aparte, solo su propio teléfono; Web NFC (`NDEFReader`) cubre Android/Chrome pero no iOS Safari, y la investigación busca la mejor solución real que cumpla esa restricción, no solo elegir entre las opciones ya conocidas. |
| **Capacidades humanas** | Para construirlo: una persona con dominio de React/TypeScript y del modelo de dominio ya congelado de Nahui (tiempo propio del equipo actual, sin costo adicional en efectivo). Para operarlo a esta escala piloto: ninguna persona operativa adicional — la arquitectura elegida (servicios gestionados, sin servidores propios) no requiere un administrador de infraestructura dedicado. |

**Brecha real en la Fundación — parcialmente resuelta:** no existe todavía ningún concepto de autenticación/login en `domain-model.md` ni en `onboarding.md` — el prototipo nunca necesitó uno porque siempre fue una demo sin cuentas reales. La Product Owner ya decidió el enfoque (teléfono + OTP, arriba), pero `architect` todavía no ha diseñado cómo ese concepto encaja en las agregaciones existentes (`Business`, `Session`) — sigue siendo trabajo de arquitectura pendiente, no completado por esta decisión direccional.

---

## 2b — Viabilidad Financiera

### Inversión inicial (MVP real, más allá del prototipo Figma)

| Concepto | Cifra | Tipo de dato |
|---|---|---|
| Dominio `nahui.app` (registro) | $188 MXN | Real — ya pagado |
| Correo (GoDaddy) | $263.88 MXN | Real — ya pagado |
| Tarjeta NFC de prueba (1 unidad, envío al día siguiente) | $174.50 MXN | Real — ya pagado, precio de urgencia, **no representativo del costo unitario a escala** (ver abajo) |
| Suscripción Claude Code Max (herramienta de desarrollo del equipo) | $100 USD/mes (~$1,850 MXN/mes) | Real — confirmado por la Product Owner 2026-08-12 (`company/business-decisions.md` Q15). Es un costo recurrente mensual, no una inversión única — no se suma a la línea de abajo, que es solo inversión inicial de un solo pago. |
| Desarrollo (tiempo propio del equipo) | $0 USD en efectivo | Real, mismo criterio que el ejemplo de SAiFE ("tiempo propio, sin costo en efectivo") |
| **Total inversión inicial de un solo pago** | **≈$626 MXN** | Calculado, suma de las líneas de pago único arriba (dominio + correo + tarjeta NFC de prueba) |

### Costo de operación mensual (Proyectado — ningún comerciante real está usando la versión en la nube todavía)

**Decisión de la Product Owner, 2026-08-12 (`company/business-decisions.md` Q15): el paquete de un solo proveedor (Supabase + Vercel) es el elegido**, aceptando la prima de ~$50 MXN/mes sobre el stack por componente a cambio de menos proveedores que operar a esta escala piloto (3 comerciantes). El stack por componente queda documentado abajo como la alternativa considerada, no como el plan.

| Concepto | Cifra (USD) | Cifra aprox. (MXN, ~18.5/USD) | Tipo de dato |
|---|---|---|---|
| **Supabase Pro** (Postgres + Auth + Storage + Edge Functions) | **$25/mes** | **~$460 MXN** | Real — cotización de mercado, agosto 2026 |
| **Vercel Pro** (frontend) | **$20/mes** | **~$370 MXN** | Real — cotización de mercado |
| **Total, paquete elegido** | **~$45/mes** | **~$830 MXN/mes** | Calculado |

*Alternativa considerada, no elegida — stack por componente:*

| Concepto | Cifra (USD) | Cifra aprox. (MXN, ~18.5/USD) | Tipo de dato |
|---|---|---|---|
| Vercel Pro (frontend) | $20/mes | ~$370 MXN | Proyectado — cotización de mercado, agosto 2026 |
| Render Starter (backend) | $7/mes | ~$130 MXN | Proyectado — cotización de mercado |
| Neon Launch (base de datos, escala a cero) | ~$5-15/mes según uso real | ~$90-280 MXN | Proyectado — modelo por consumo, sin piso mínimo desde dic. 2025 |
| Clerk (autenticación) | $0/mes hasta 50,000 usuarios retenidos | $0 | Proyectado — nivel gratuito muy por encima de la escala piloto |
| Cloudflare R2 (logos de negocio) | $0/mes hasta 10 GB | $0 | Proyectado — nivel gratuito suficiente a esta escala |
| Resend (correo transaccional, recuperación de contraseña) | $0/mes hasta 3,000 correos | $0 | Proyectado — nivel gratuito suficiente a esta escala |
| **Total, stack por componente** | **~$32-42/mes** | **~$590-780 MXN/mes** | Calculado |

**Tarjetas NFC a escala (distinto del precio de urgencia de arriba):** entre $0.08 y $0.15 USD por unidad (~$1.50-2.80 MXN) en pedidos de 500-1,000+ piezas en AliExpress/Alibaba — no es una cotización confirmada con un proveedor específico, es un rango observado en el mercado hoy. Proyectado, no Real.

### Costo por venta (Calculado — bajo un supuesto de volumen todavía sin validar)

**Esto es honestamente el punto más débil del modelo hoy, y hay que decirlo así en vez de disfrazarlo.** El ejemplo de SAiFE divide un costo de operación real entre un volumen de inspecciones ya ocurridas (48/año, dato Real). Nahui no tiene ese dato — cero comerciantes están usando una versión real en producción todavía. Cualquier "costo por venta" en este momento es una simulación con un supuesto de volumen, no un hecho:

- Supuesto de volumen (Proyectado, no validado): 3 comerciantes piloto, cada uno vendiendo en ~2 bazares/mes, ~30 ventas/bazar → ~180 ventas/mes.
- Costo por venta = $700 MXN/mes (punto medio del rango de arriba) ÷ 180 ventas ≈ **$3.90 MXN por venta** (Calculado, sobre un supuesto sin validar).

Este número solo sirve para tener una referencia de orden de magnitud hoy — se vuelve real y confiable en cuanto exista una implementación real con comerciantes piloto reales generando el dato que le falta a este cálculo.

### Modelo de negocio — no decidido, explícitamente fuera de alcance de este borrador

`company/CLAUDE.md` ya establece principios de precios (sin comisión por transacción, precio fijo o estacional en vez de mensual si el uso no es constante mes a mes) pero **no existe todavía una cifra de precio decidida** en `company/business-decisions.md`. Sin esa cifra no se puede construir la tabla de "Modelo 1 / Modelo 2" que sí tiene el ejemplo de SAiFE — sería inventar un ingreso que nadie ha decidido. Esto queda nombrado como una Decisión de Negocio pendiente, no resuelto aquí.

---

## Resumen de lo que sigue pendiente de tu revisión (nada de esto es final)

**Resueltas 2026-08-12** (`company/business-decisions.md` Q14/Q15) — ya no bloquean este borrador:

1. ~~Confirmar el costo real de la suscripción Claude Code Max~~ — **$100 USD/mes, confirmado.**
2. ~~Decidir el concepto de autenticación/login~~ — **teléfono + OTP por SMS/WhatsApp, decidido.** (El diseño de arquitectura del concepto en sí sigue pendiente de `architect`.)
3. ~~Elegir entre el stack por componente y el paquete de un solo proveedor~~ — **Supabase + Vercel, elegido.**

**Aún abiertas:**

4. **Confirmar la mejor solución técnica real para que Ana lea tags NFC usando solo su propio teléfono, sin comprar un lector aparte.** Ya no es una simple confirmación Android-vs-iOS — es una investigación conjunta `architect`+`knowledge-mentor`, dispatched 2026-08-12 (`company/business-decisions.md` Q16), buscando la mejor opción real, no solo eligiendo entre las ya conocidas.
5. Decidir una cifra de precio (o confirmar que sigue sin decidirse) para poder completar el modelo de negocio. `company/CLAUDE.md` ya fija el formato (precio fijo o estacional, no mensual) — falta la cifra. Ofrecido: que `marketing` investigue precios comparables de herramientas SaaS para pequeños comerciantes en México, como punto de referencia, si eso ayuda a anclar una cifra inicial.
6. Diseño de arquitectura del concepto de autenticación (teléfono + OTP) dentro de `domain-model.md` — la decisión direccional ya está tomada, pero `architect` todavía no ha definido cómo encaja en `Business`/`Session`.
7. Confirmar cómo la organización modular del backend original (`identity`/`inventory`/`selling`/`intelligence` como servicio Node en Render) se traduce a Supabase Edge Functions, ahora que ese es el proveedor elegido — no es solo un cambio de proveedor, podría ser un cambio de modelo de ejecución.
