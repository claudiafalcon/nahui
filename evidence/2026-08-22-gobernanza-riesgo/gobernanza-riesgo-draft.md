# Gobernanza y Riesgo — Nahui (Borrador)

**Curso:** TI-4041 · Sesión 6, Gobernanza y riesgo. **Alcance:** el "Taller" de la sesión — matriz de riesgos (5 riesgos, ubicados por probabilidad e impacto) y bloqueos (cuáles dependen de una autoridad externa, y cómo se traducen a su lenguaje) — precedido de una autoevaluación honesta del marco de "Gobernanza mínima" contra el sistema de gobernanza que Nahui ya opera hoy, no uno hipotético.

**Estado: BORRADOR PROVISIONAL, sin revisión de la Product Owner.** Misma disciplina de niveles de evidencia que `market-validation.md` y el borrador de la Sesión 5: **Real** (dato confirmado, ya ocurrido), **Proyectado** (estimación razonada, no confirmada), **Calculado** (resultado de una fórmula). Nada aquí es una Decisión de Negocio final — eso corresponde a `company/business-decisions.md`.

---

## 1. Gobernanza mínima — autoevaluación contra el sistema real de Nahui

El material del curso define gobernanza como "el sistema de reglas del juego: quién decide qué, con qué criterios, cómo se prioriza, cómo se controla el riesgo y cómo se mide el valor" — y da cuatro señales de alerta cuando falta. A diferencia de un proyecto hipotético, Nahui ya opera un sistema de gobernanza real, documentado en `company/CLAUDE.md`, y se puede evaluar honestamente contra las cuatro columnas del marco.

| Pilar | Señal débil (del curso) | Estado real en Nahui hoy |
|---|---|---|
| **Hipótesis** | Nadie la dice en una frase | **Fuerte.** La tesis central está escrita en una sola frase en `company/CLAUDE.md` ("Núcleo de tesis") y en `company/jobs-to-be-done.md` — no es una intuición flotante, es texto versionado que cualquier persona (o agente) del proyecto puede citar textualmente. |
| **Evidencia** | Se define tras el resultado | **Fuerte, con un ejemplo concreto reciente.** El piloto Concierge/DM diseñado esta misma semana (`company/merchant-validation-concierge-pilot.md` §7) define, antes de tener una sola conversación real, exactamente qué evidencia confirmaría o rechazaría cada una de cinco hipótesis candidatas — incluyendo una hipótesis nula, para que el marco no pueda forzar una conclusión de producto por diseño. Esto es lo opuesto a definir la evidencia después del resultado. |
| **Cadencia** | La revisión se mueve cada semana | **Débil — brecha real, no maquillada.** No existe una fecha fija de revisión (semanal, quincenal) para el backlog ni para las Decisiones de negocio abiertas. `company/CLAUDE.md` describe una re-priorización "cuando la entrega está lo suficientemente tranquila" — una cadencia basada en disponibilidad, no en calendario. Es la brecha de gobernanza más honesta que se puede señalar hoy. |
| **Autoridad** | Se decide en el pasillo | **Fuerte en diseño, con un ejemplo vivo esta semana.** `company/CLAUDE.md` define explícitamente qué tipo de decisión (Arquitectura / Producto / Negocio) le corresponde a quién, y ningún agente especializado puede decidir fuera de su propio carril. Ejemplo real, no hipotético: esta misma semana, el agente `ui-designer` **rechazó** una autorización de escritura fuera de su alcance declarado, aun cuando la instrucción venía dentro de un mensaje de tarea — exigió que el permiso existiera de forma persistida en su propio archivo de configuración, no como una afirmación dentro de la conversación (`company/infrastructure-decisions.md`, entrada ID016). Es exactamente el patrón que el curso advierte evitar ("se decide en el pasillo"), prevenido por diseño. |

**Punto honesto que vale la pena nombrar:** hoy, toda la autoridad que el curso divide entre Financiero/Legal/TI/Compras/otras áreas está, en la práctica, concentrada en una sola persona (la Product Owner) — Nahui todavía no tiene una organización separada por función. El sistema de agentes de IA sí separa el *razonamiento* (qué tipo de decisión es esta, quién debería resolverla) incluso cuando la *autoridad humana final* sigue concentrada en una sola persona. Esa distinción — separación de razonamiento sin separación de autoridad humana — es en sí misma un riesgo de gobernanza a esta etapa, no solo una limitación de tamaño de equipo. Se retoma como Riesgo D, abajo.

---

## 2. Los tres riesgos que crecen con un proyecto digital — lectura honesta para Nahui

Antes de la matriz, una lectura directa de las tres categorías que el curso nombra explícitamente, aplicadas a Nahui específicamente (no genéricamente):

- **Sesgo algorítmico:** Nahui no tiene hoy ningún modelo de aprendizaje automático en producción — es un sistema de reglas de dominio, no un modelo entrenado sobre datos históricos. El riesgo real no es de hoy, es de una capacidad **todavía no construida**: la Aspiración recién documentada en `brand/character-bible.md` ("Un Nahui genuinamente proactivo") de que Nahui algún día haga recomendaciones activas (ej. "compra 70% de este producto para la temporada alta"). Si esa capacidad se construye sin datos suficientes por comerciante, el riesgo de sesgo es real — generalizar de un comerciante con dos bazares de historial es estructuralmente distinto de un sesgo de discriminación tipo Amazon, pero es la misma familia de problema: el modelo (o la heurística) repite o extrapola mal un patrón limitado. Ver Riesgo E, abajo.
- **Datos y privacidad:** Este es el riesgo más inmediato y real de los tres para Nahui, no uno especulativo. El mismo dato que le da valor al producto (volumen de venta real, identidad de clientes frecuentes vía el Customer aggregate y los Loyalty Participation Records, `decision-log.md` D34/D35) es exactamente el dato que expone tanto la operación del negocio de la comerciante como la identidad de sus propios clientes. Ver Riesgo B, abajo.
- **Dependencia:** Doble, no simple. (1) Dependencia de proveedor: el paquete Supabase + Vercel de un solo proveedor (`business-decisions.md` Q15). (2) Dependencia de persona/herramienta: el modelo de dominio completo de Nahui vive, hoy, en documentos gobernados por una sola Product Owner operando junto con un sistema de agentes de IA (Claude Code) — si esa herramienta específica deja de estar disponible o cambia sustancialmente, el *proceso de gobernanza mismo*, no solo el producto, queda afectado. Ver Riesgos A y D, abajo.

---

## 3. Matriz de riesgos

Cinco riesgos reales de Nahui, ubicados por probabilidad e impacto — mismo formato que el ejemplo SAiFE del curso.

```
                    IMPACTO
              BAJO           ALTO
        ┌──────────────┬──────────────┐
   ALTO │              │   A  C       │
        │              │              │
PROBABI-├──────────────┼──────────────┤
 LIDAD  │              │      B       │
        │      E       │   D          │
   BAJO │              │              │
        └──────────────┴──────────────┘
```

| | Riesgo | Qué revela | Probabilidad | Impacto | Tipo de dato |
|---|---|---|---|---|---|
| **A** | Dependencia de un solo proveedor de infraestructura (Supabase + Vercel) | Sin implementación real todavía, pero es la arquitectura ya elegida (`business-decisions.md` Q15) — el riesgo empieza a existir en cuanto haya un solo comerciante piloto en producción. | Alta | Alta | Real (decisión ya tomada) / Proyectado (impacto, sin incidente todavía) |
| **B** | Datos sensibles del comerciante y del cliente expuestos | El mismo dato que da valor al negocio (ventas reales, identidad de Clientes Frecuentes) es el que más expone si hay una fuga — crece directamente con la adopción que el proyecto busca. | Baja hoy (cero datos reales en producción) | Alta | Real (no hay datos en producción) / Proyectado (impacto, si los hubiera) |
| **C** | Adopción real no confirmada — el embudo de validación no está resuelto | La campaña de Meta recién cerrada generó alcance real (19,268 personas, $530 MXN gastados, $0.81 MXN por clic) pero prácticamente cero interacción confirmada de comerciantes reales con el demo — la causa todavía no está confirmada, es exactamente lo que el piloto Concierge/DM (recién diseñado) busca diagnosticar. | Alta (ya está ocurriendo, evidenciado esta misma semana) | Alta (si continúa, invalida la premisa completa de validación) | Real (números de campaña) |
| **D** | Modelo de precios todavía no decidido | `company/CLAUDE.md` fija principios de precio (sin comisión, precio fijo o estacional) pero no existe una cifra decidida en `business-decisions.md` — sin ella no se puede cerrar un caso de negocio real. | Media (brecha conocida, sin urgencia de crisis) | Media-Alta (bloquea la monetización por completo) | Real (la ausencia de la decisión está documentada) |
| **E** | Sesgo en las futuras recomendaciones proactivas de Nahui (ver §2) | Todavía no construido — es una Aspiración, no una capacidad real — pero nombrarlo ahora es exactamente lo que el marco de gobernanza pide: la propia `character-bible.md` ya nombra la condición de evidencia que tendría que cumplirse (datos reales por comerciante, nunca una cifra genérica con confianza no ganada) antes de que esto se construya. | Baja (Aspiración, sin construir) | Alta (si ocurre, viola directamente un Decision ya adoptado sobre quién es Nahui) | Proyectado |

---

## 4. Bloqueos — quién los levanta y cómo se traducen

Siguiendo el formato del ejemplo SAiFE. No todos los riesgos de la matriz dependen de una autoridad externa de la misma forma — nombrar esa diferencia es parte del análisis, no un vacío en la tabla.

| Bloqueo | Quién lo levanta | Pregunta clave del área | Cómo se traduce y mitiga |
|---|---|---|---|
| **(B) Los datos del comerciante/cliente podrían exponerse o usarse sin consentimiento claro** | Legal y cumplimiento | ¿Qué pasa si esto termina en litigio? | Aviso de privacidad explícito para cada comerciante piloto antes de recolectar cualquier dato de sus clientes (Ley Federal de Protección de Datos Personales en Posesión de los Particulares, México) — confirmado con asesoría legal real, no resuelto por el equipo del MVP. El piloto Concierge/DM ya incluye una divulgación honesta al inicio de cada conversación (`merchant-validation-concierge-pilot.md` §6.1) como primer paso, no como sustituto de esto. |
| **(A) La arquitectura de un solo proveedor podría fallar, subir de precio, o descontinuar una función necesaria** | TI y seguridad | ¿Qué se rompe cuando esto entre a producción? | Exportación periódica de los datos fuera de Supabase (respaldo real, no solo confianza en el proveedor) antes de comprometerse más allá de la escala piloto (3 comerciantes) — mismo principio de portabilidad de datos que protege contra el riesgo B. |
| **(D) Sin una cifra de precio decidida, no hay caso de negocio que cerrar** | Finanzas y personas | ¿De qué partida sale y a quién le cambia el trabajo? | Ya nombrado como Decisión de Negocio pendiente en `business-decisions.md`. Propuesto (no ejecutado): que `marketing` investigue precios comparables de herramientas SaaS para pequeños comerciantes en México, como punto de referencia para anclar una primera cifra — la decisión final sigue siendo de la Product Owner. |
| **(C) La adopción real no está confirmada** | *(No es un bloqueo de autoridad externa — punto honesto, no una omisión)* | — | A diferencia de B, A y D, este riesgo no lo resuelve Legal, TI ni Finanzas — es un riesgo de validación de producto que le corresponde resolver al propio equipo. La respuesta ya está en marcha: el piloto Concierge/DM fue diseñado exactamente para diagnosticar la causa real antes de invertir más presupuesto de adquisición sobre una hipótesis sin confirmar. |
| **(E) Sesgo en recomendaciones futuras** | *(Sin bloqueo activo — riesgo de gobernanza anticipado, no uno que resolver hoy)* | — | Todavía no hay nada que construir ni que bloquear. Si esta capacidad llega a construirse, el bloqueo futuro más probable sería Legal (si la recomendación tiene implicación financiera real sobre el comerciante) y TI (verificación de que el dato por comerciante es suficiente antes de generar cualquier cifra con confianza). Nombrado ahora para que la condición de evidencia ya quede escrita antes de que exista presión de negocio para saltársela. |

---

## 5. Lo que sigue pendiente de tu revisión

Nada de lo anterior es final — mismo criterio que el borrador de la Sesión 5.

1. **Confirmar o corregir la ubicación de cada riesgo en la matriz** — las posiciones (Alta/Baja, Alto/Bajo) son un juicio razonado sobre evidencia real, no una medición formal.
2. **Riesgo D (precio):** decidir si se activa la investigación de precios comparables ofrecida, o si se prioriza distinto.
3. **La brecha de Cadencia (§1):** ¿vale la pena fijar una fecha de revisión real (ej. cada dos semanas) para las Decisiones de Negocio abiertas, en vez de una cadencia basada solo en disponibilidad?
4. **Riesgo C:** el piloto Concierge/DM que responde a este riesgo sigue esperando tu aprobación explícita (`merchant-validation-concierge-pilot.md` §3) — no se ha lanzado nada.
