# Nahui, Documento Ejecutivo, Demo Day

**Curso:** TI-4041, Transformación Digital en la Empresa. **Autora:** Claudia Falcón. **Estado: BORRADOR, sin revisión final.** Integra el trabajo de las Sesiones 1 a 7 en una sola propuesta, con la misma disciplina de evidencia que he usado desde la Sesión 1: **Real** (dato confirmado), **Proyectado** (estimación razonada, no confirmada), **Calculado** (resultado de una fórmula). Nada aquí se presenta como más cierto de lo que realmente es.

---

## 1. El problema

El comercio informal en México no es un caso marginal, aportó **25.4% del PIB en 2024**, y los micronegocios (changarros, puestos, autoempleo) siguieron abriéndose a un ritmo de **3.3% más en 2025** (INEGI; El Financiero, jul. 2026). Nahui ataca la ineficiencia más urgente dentro de ese segmento, validada con Ana, vendedora independiente de ropa en bazares del Estado de México, y confirmada con una fuente independiente además de su propio testimonio.

**La ineficiencia:** el flujo de clientes en un bazar es completamente impredecible. Cuando alguien está frente al puesto listo para comprar, cualquier proceso de registro que tome más de unos segundos compite directamente con atender a la siguiente persona, y siempre gana la siguiente venta. El resultado no es solo una venta sin anotar, es un techo real de crecimiento. Ana limita su catálogo deliberadamente a tres líneas de producto (pijamas, sudaderas/maxys, calcetines) porque sabe que con más variedad "ya perdería el control", palabras textuales de la entrevista original de Sesión 1. No tengo una cifra exacta de ventas perdidas de parte de Ana, ella no me la dio, y lo digo así de honesto desde el diagnóstico original. Sí tengo evidencia de industria: negocios que llevan el control de memoria o en notas sueltas terminan con desabasto de lo que más se vende y exceso de lo que no se mueve, perdiendo dinero sin darse cuenta (Clip, blog especializado en pagos y ventas).

**A quién afecta:** vendedoras itinerantes de bazares (renta privada) y tianguis (permiso municipal) en general. Ana es el caso concreto y verificable, no el límite del problema.

---

## 2. La solución

Nahui es una app de registro de ventas y business intelligence, pensada para que la tecnología desaparezca justo en el momento donde antes fallaba. El flujo, desde donde lo vive Ana: llega el cliente, ella cierra la venta en su celular en segundos, sin perder de vista al siguiente cliente que puede llegar en cualquier momento.

**Lo que puede hacer hoy que antes no podía:** registrar una venta real en el momento exacto en que ocurre, sin que el registro le cueste la siguiente venta. Es el job funcional que la libreta, la memoria, y las terminales de pago (que solo registran cuando hay tarjeta, no efectivo) no le resuelven hoy. Prototipo funcional real en `product/02c-high-fidelity-prototype/`.

**Cómo se construyó, y por qué eso también es parte de "cómo funciona":** Nahui no la construí sola con ayuda de un asistente de IA. La construye un equipo real de agentes de IA especializados, cada uno con autoridad propia sobre su área (diseño de producto, revisión de marca, arquitectura, marketing, validación), coordinados bajo un marco explícito de quién decide qué. No es una metáfora de gestión de proyecto, es literalmente cómo se tomó cada decisión de este documento.

---

## 3. Validación

**Qué esperaba, y el umbral fijado antes de probar:** el backlog del producto define desde el principio, antes de cualquier prueba con usuarios, la barra de éxito exacta: **90% o más de las ventas registradas, en menos de 3 segundos por registro** (`company/backlog.md` #1). No es un umbral inventado después del resultado, es la definición original del éxito del MVP.

**Qué pasó:** Ana usó el producto real y le encantó, evidencia cualitativa real, de primera mano, no una intuición mía. Pero tengo que ser igual de honesta con lo que no funcionó: una campaña de Meta que acabo de cerrar generó alcance real y barato ($530 MXN gastados, 19,268 personas de alcance, $0.81 MXN por clic, el costo de atraer atención no es el problema) pero prácticamente **cero comerciantes reales, fuera de Ana y de mi propio equipo, llegaron a probar el demo.** La causa exacta todavía no está confirmada, y decirlo así, sin inventar una causa que suene bien, es parte de la validación, no una falla en reportarla.

**Qué decidí:** no escalar el gasto publicitario sobre una causa que no he confirmado. En vez de eso, diseñé un piloto pequeño y controlado (Concierge/DM, MXN $200, tope de 20 conversaciones, ventana de 2 días) con un marco de evidencia definido antes de la primera conversación: cinco hipótesis candidatas de por qué no están entrando, incluida una hipótesis nula, para que el marco no me pueda forzar a una conclusión de producto por diseño. Es una decisión de iterar en cómo aprendo, no de escalar ni de descartar el canal, exactamente lo que la evidencia real (mucho alcance, cero conversión confirmada) sostiene, ni más ni menos.

**Límite honesto:** toda la validación de experiencia de uso real hasta hoy viene de una sola persona, observada de cerca por mí y mi equipo. Es evidencia real, pero de un solo caso, no de una comunidad. Prefiero decirlo así que maquillarlo.

---

## 4. Viabilidad

**Dimensión de captura de valor:** Operaciones, el registro reduce fricción operativa directa en el momento de la venta. La dimensión de Ecosistema (efecto de red entre bazares) es la fase futura, no la de hoy (ver Sección 7).

**Métrica de Innovation Accounting, Nivel 1:** % de ventas registradas en menos de 3 segundos, el mismo umbral fijado en el backlog, ahora como métrica viva de dashboard, no solo como meta.

**Viabilidad técnica, las cuatro preguntas:**
- **Datos:** el modelo de dominio ya está congelado (`Sale`, `SaleItem`, `Session`, `Event`, `Product`, `Business`). Nada nuevo que inventar, solo persistirlo en una base real.
- **Infraestructura:** React + TypeScript (PWA) en Vercel. Backend en Supabase (Postgres + Auth + Storage + Edge Functions), paquete de un solo proveedor que elegí el 2026-08-12 sobre un stack por componente, priorizando menos proveedores a esta escala piloto.
- **Integraciones:** autenticación por teléfono más código OTP vía Supabase Auth, ya decidido. Lectura NFC bajo investigación activa. Web NFC cubre Android/Chrome pero no iOS Safari, y el requisito real de negocio, que Ana nunca necesite comprar un lector aparte, todavía no tiene solución confirmada.
- **Capacidades humanas:** una persona con dominio de React/TypeScript y del modelo de dominio para construir. Para operar a esta escala piloto, ningún operador de infraestructura adicional, la arquitectura es completamente gestionada.

**Business Case:**

| Concepto | Cifra | Tipo de dato |
|---|---|---|
| Inversión inicial de un solo pago (dominio, correo, NFC de prueba) | aprox. $626 MXN | Real, ya pagado |
| Herramienta de desarrollo (Claude Code Max) | $100 USD/mes (aprox. $1,850 MXN/mes) | Real, recurrente. Migré del plan gratuito cuando su alcance se quedó corto |
| Operación mensual (Supabase + Vercel) | aprox. $830 MXN/mes | Proyectado, cotización de mercado agosto 2026 |
| Costo por venta | aprox. $3.90 MXN por venta | Calculado, sobre un supuesto de volumen (3 comerciantes, 180 ventas/mes aprox.) que todavía no valido con datos reales |

**Retorno esperado:** honestamente, todavía no lo puedo calcular de forma defendible. No existe una cifra de precio decidida (`company/business-decisions.md`), solo principios (sin comisión por transacción, precio fijo o estacional). Prefiero nombrarlo como brecha abierta que inventar un número para llenar la tabla.

---

## 5. Gobernanza

**Quién decide, quién aprueba, quién puede frenarlo:** cada decisión se clasifica explícitamente como Arquitectura, Producto o Negocio, y se rutea a quien le corresponde resolverla. Nunca invento una respuesta para llenar un vacío. Esto no es solo diseño en papel, esta misma semana el agente `ui-designer` rechazó una instrucción que le daba permiso para escribir fuera de su alcance declarado, aun viniendo dentro de un mensaje de tarea, porque no podía verificarla como una autorización real. Exigió que el permiso existiera de forma persistida en su propia configuración. Es exactamente el patrón de gobernanza que busco (autoridad real, no "se decide en el pasillo") funcionando en un caso real, no hipotético.

**Cada cuándo se revisa:** honestamente, no tengo todavía una cadencia fija. Las decisiones de negocio abiertas las reviso "cuando hay espacio", no en una fecha calendarizada. Es la brecha de gobernanza más real que puedo nombrar hoy, no una que prefiera esconder.

**Los cinco riesgos que pueden detener el proyecto:**

| | Riesgo | Probabilidad | Impacto |
|---|---|---|---|
| A | Dependencia de un solo proveedor de infraestructura (Supabase + Vercel) | Alta | Alta |
| B | Datos sensibles de comerciantes y clientes expuestos | Baja hoy (cero datos reales en producción) | Alta |
| C | Adopción real no confirmada, el embudo de validación no está resuelto | Alta (ya está ocurriendo) | Alta |
| D | Modelo de precios todavía no decidido | Media | Media a Alta |
| E | Sesgo en futuras recomendaciones proactivas (visión de largo plazo, aún no construida) | Baja (aún no existe) | Alta |

**Bloqueos, quién los levanta y cómo se traducen:**

| Bloqueo | Quién lo levanta | Cómo se traduce |
|---|---|---|
| (B) Exposición de datos de comerciante/cliente | Legal y cumplimiento | Aviso de privacidad explícito antes de recolectar cualquier dato de clientes (Ley Federal de Protección de Datos Personales), confirmado con asesoría legal real. |
| (A) Falla o cambio de condiciones del proveedor único | TI y seguridad | Exportación periódica de datos fuera de Supabase antes de comprometerme más allá de la escala piloto. |
| (D) Sin precio decidido, no hay caso de negocio que cerrar | Finanzas | Investigación de precios comparables de SaaS para pequeños comerciantes en México, para anclar una primera cifra. |
| (C) Adopción no confirmada | No es un bloqueo externo | Me corresponde a mí resolverlo, no a otra área. El piloto Concierge/DM ya es la respuesta en marcha. |

---

## 6. Plan de despliegue

**A quién le cambia el trabajo, respuesta honesta, no forzada al formato de una organización con personal ya establecido:** Nahui no se despliega dentro de una empresa con empleados existentes que puedan ver su puesto amenazado. El cambio real de trabajo es el mío, de operar sola a dirigir un equipo de agentes de IA especializados, cada uno con autoridad real y no solo instrucciones. Para Ana y futuras comerciantes piloto, el trabajo no se reemplaza, cambia en que el registro deja de competir con atender al cliente.

**A quién podría ver esto como amenaza:** Ana ya me dijo, en otra conversación, que no quiere que la metan a plataformas tipo Amazon o Mercado Pago por las comisiones que cobran. La respuesta honesta no es una promesa vacía, es una decisión de diseño que ya tomé: Nahui explícitamente no cobra comisión por transacción, justo para no replicar ese modelo de intermediario.

**Capacitación:** una pantalla de bienvenida honesta (ya construida, `demo-mode.md`) que le dice a la comerciante piloto qué es real y qué no antes de que toque nada. No un manual largo, una orientación de menos de 15 segundos.

**Primeros hitos:**

| Hito | Responsable | Fecha |
|---|---|---|
| Piloto Concierge/DM, diagnosticar causa real de no adopción | Claudia Falcón, Fundadora / Product Owner | Próximas 2 semanas |
| Decisión de precio (Business Decision) | Claudia Falcón, Fundadora / Product Owner | Antes de la siguiente ola de adquisición |
| Resolución de la solución técnica NFC | Agente `architect` + `knowledge-mentor`, ya despachado | En curso |
| Cadencia fija de revisión de decisiones abiertas | Claudia Falcón, Fundadora / Product Owner | Por definir, brecha abierta hoy |

---

## 7. Qué cambió desde S1

El "sueño sin límites" de mi entrega de Sesión 1 ya describía, casi palabra por palabra, la visión que sigo teniendo hoy: "si el histórico de bazares no fuera solo de Ana sino compartido entre todas las vendedoras que usan la app, un agente podría recomendarle a cada una a qué bazar ir según cercanía, ticket promedio y tipo de público." No cambió la visión, cambió la madurez con la que la sostengo. Ese párrafo vivía sin calificar, como un sueño sin evaluar. Hoy vive como una Aspiración documentada en el character bible del producto, conectada a un principio real que ya adopté: Nahui se gana el derecho de aconsejar observando primero, nunca lo asume desde el inicio.

**Lo que sí resultó falso, y tuve que corregir con evidencia real:**

- **Creí que el problema de Ana sería no conocer a su cliente.** Me equivoqué feo, y ya lo dije así desde la Sesión 1: ella los conoce perfecto, sus clientes leales la siguen solos por Instagram y WhatsApp. El problema real nunca fue conocimiento, fue no poder capturarlo en el momento.
- **Creí que el reto más difícil sería técnico**, construir el motor de recomendaciones, el machine learning del sueño de largo plazo. Resultó que el reto real, el que hay que resolver primero, es mucho más simple de describir y mucho más difícil de lograr: que la primera vendedora real, fuera de Ana y de mí misma probando, cruce la puerta. La campaña de esta semana lo confirmó de la forma más honesta posible, con datos, no con intuición.
- **Creí, al construir el primer video de campaña, que el problema era calidad de producción.** La investigación de evidencia real sobre publicidad de formato corto mostró que el problema era estructural, empezaba con el producto en vez de con el problema de la vendedora, y ni siquiera esa corrección resuelve el problema más grande: no sabía, y todavía no sé con certeza, por qué la gente no entra al demo.
- **Creí que la confianza entre los agentes de IA que construyen este proyecto podía resolverse con una instrucción clara en el momento.** Resultó que no. Un agente rechazó correctamente una autorización que sonaba legítima solo porque venía dentro de una conversación, no de su propia configuración persistida. Tuve que aprender que la gobernanza real no se puede improvisar, ni siquiera con buenas intenciones de mi parte.

Nada de esto se sintió cómodo mientras pasaba. Pero es exactamente lo que me deja algo real que presentar hoy, en vez de una historia bonita que no hubiera sobrevivido una pregunta difícil del panel.
