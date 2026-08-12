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
| **Infraestructura tecnológica** | Frontend: React + TypeScript, empaquetado como PWA, alojado en Vercel. Backend: un solo servicio Node.js/TypeScript organizado en los mismos módulos que ya define el modelo de dominio (`identity`/`inventory`/`selling`/`intelligence`), alojado en Render. Base de datos: PostgreSQL gestionado en Neon (escala a cero — encaja con el uso real esperado, concentrado en días de bazar, no continuo). El límite al escalar: ninguno relevante a esta etapa piloto — la arquitectura elegida específicamente evita comprometerse a infraestructura de "siempre encendida" antes de tener uso real que lo justifique. |
| **Integraciones** | Autenticación de comerciantes (Clerk o Supabase Auth). Lectura NFC vía Web NFC API del navegador (`NDEFReader`) — **advertencia real, no resuelta:** esto solo funciona en Chrome/Android, no en iOS Safari. Si el hardware NFC de la Product Owner apunta a un flujo iOS, esta decisión cambia (app nativa o lector externo USB/Bluetooth) — pendiente de confirmación, no asumido aquí. |
| **Capacidades humanas** | Para construirlo: una persona con dominio de React/TypeScript/Node y del modelo de dominio ya congelado de Nahui (tiempo propio del equipo actual, sin costo adicional en efectivo). Para operarlo a esta escala piloto: ninguna persona operativa adicional — la arquitectura elegida (servicios gestionados, sin servidores propios) no requiere un administrador de infraestructura dedicado. |

**Brecha real en la Fundación, nombrada explícitamente, no inventada para llenar el hueco:** no existe todavía ningún concepto de autenticación/login en `domain-model.md` ni en `onboarding.md` — el prototipo nunca necesitó uno porque siempre fue una demo sin cuentas reales. Antes de construir el backend real, esto necesita una Decisión de Producto/Arquitectura propia (cómo entra Ana a su cuenta al día siguiente), no debe inventarse dentro de este documento.

---

## 2b — Viabilidad Financiera

### Inversión inicial (MVP real, más allá del prototipo Figma)

| Concepto | Cifra | Tipo de dato |
|---|---|---|
| Dominio `nahui.app` (registro) | $188 MXN | Real — ya pagado |
| Correo (GoDaddy) | $263.88 MXN | Real — ya pagado |
| Tarjeta NFC de prueba (1 unidad, envío al día siguiente) | $174.50 MXN | Real — ya pagado, precio de urgencia, **no representativo del costo unitario a escala** (ver abajo) |
| Suscripción Claude Code Max (herramienta de desarrollo del equipo) | Dato pendiente | Real — ya se está pagando, falta que la Product Owner confirme el monto exacto |
| Desarrollo (tiempo propio del equipo) | $0 USD en efectivo | Real, mismo criterio que el ejemplo de SAiFE ("tiempo propio, sin costo en efectivo") |
| **Total inversión inicial confirmada hasta hoy** | **≈$626 MXN** (sin la suscripción de Claude Code, pendiente) | Calculado, suma de las líneas "Real" de arriba |

### Costo de operación mensual (Proyectado — ningún comerciante real está usando la versión en la nube todavía)

| Concepto | Cifra (USD) | Cifra aprox. (MXN, ~18.5/USD) | Tipo de dato |
|---|---|---|---|
| Vercel Pro (frontend) | $20/mes | ~$370 MXN | Proyectado — cotización de mercado, agosto 2026 |
| Render Starter (backend) | $7/mes | ~$130 MXN | Proyectado — cotización de mercado |
| Neon Launch (base de datos, escala a cero) | ~$5-15/mes según uso real | ~$90-280 MXN | Proyectado — modelo por consumo, sin piso mínimo desde dic. 2025 |
| Clerk (autenticación) | $0/mes hasta 50,000 usuarios retenidos | $0 | Proyectado — nivel gratuito muy por encima de la escala piloto |
| Cloudflare R2 (logos de negocio) | $0/mes hasta 10 GB | $0 | Proyectado — nivel gratuito suficiente a esta escala |
| Resend (correo transaccional, recuperación de contraseña) | $0/mes hasta 3,000 correos | $0 | Proyectado — nivel gratuito suficiente a esta escala |
| **Total, stack por componente** | **~$32-42/mes** | **~$590-780 MXN/mes** | Calculado |
| *Alternativa de un solo proveedor: Supabase Pro ($25/mes) + Vercel Pro ($20/mes)* | *~$45/mes* | *~$830 MXN/mes* | Proyectado — comparación, no elegida todavía |

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

1. Confirmar el costo real de la suscripción Claude Code Max para completar la tabla de inversión inicial.
2. Confirmar si el hardware NFC ya adquirido apunta a Android/Chrome (Web NFC funciona) o a iOS (necesitaría una decisión de arquitectura distinta).
3. Decidir el concepto de autenticación/login — brecha real en la Fundación, nombrada, no inventada.
4. Decidir una cifra de precio (o confirmar que sigue sin decidirse) para poder completar el modelo de negocio.
5. Elegir entre el stack por componente (~$590-780 MXN/mes) y la alternativa de un solo proveedor Supabase+Vercel (~$830 MXN/mes) — la diferencia es simplicidad operativa contra costo, no hay una respuesta obviamente correcta a esta escala.
