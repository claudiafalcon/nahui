# Nahui — sitio público de presentación · Contenido

**Owner:** `marketing` (mensaje, afirmaciones, CTA). **Estado:** borrador completo, **pendiente de aprobación de la Product Owner**. Nada de esto está publicado.
**Insumo obligatorio:** `landing/BRIEF.md` (definición de producto aprobada, 2026-10-08). Este documento no redefine público, idioma ni restricciones — los ejecuta.
**Pendiente de integrar:** la guía de registro de voz de inversionista que `brand-guardian` está produciendo en paralelo. Esta versión se escribió sin ella; espero revisar cuando llegue.
**Para `ui-designer`:** el contenido es esto. Los IDs de string, el orden de secciones y el destino de cada CTA son normativos. El layout, la tipografía, el ritmo y el código son tuyos. No escribí HTML.

---

## 0. Cómo leer este documento

Cada string tiene **ID**, **español**, **inglés** y una **etiqueta de evidencia** (`evidence-tiering`):

- **Real** — observado, ocurrió, verificable en el repositorio o en una fuente citada. La inmensa mayoría de esta página.
- **Calculado** — derivado de algo Real (un conteo, una suma, una consecuencia lógica de una decisión registrada).
- **Proyectado** — intención a futuro. **Solo aparece en la sección "Lo que sigue", y siempre etiquetado como tal en la página misma**, nunca en tiempo presente.

El español es la base (va en el HTML, per BRIEF §6); el inglés es una versión completa que se sostiene sola, no un resumen. Donde la traducción se separa deliberadamente de la literalidad, lo digo.

**Regla que gobierna cada línea de abajo:** un inversionista en esta etapa no espera tracción; espera no ser engañado. Una afirmación inflada no se descuenta sola — descuenta todo lo demás. La honestidad aquí es el instrumento persuasivo, no el límite.

---

## 1. Decisiones de contenido que tomé, y por qué

1. **La página abre con el problema, no con el producto.** No hay tracción que presumir, así que lo más fuerte que tiene Nahui es que el problema es real y que salió de una persona real. Un titular de producto sin números detrás se lee hueco; un titular de problema con una entrevista detrás se lee verificable.
2. **Nahui habla de sí misma en tercera/primera persona de empresa ("Nahui es…", "lo que estamos aprendiendo…"), nunca de tú a la vendedora.** La versión anterior le hablaba a quien no iba a leer la página; eso no se recicla (BRIEF §2). Esto cae dentro del *About-surface carve-out* de `brand/storytelling.md` (**Decision**): la página de la empresa es la única superficie donde la empresa legítimamente habla de sí misma — y sigue aplicando en pleno la regla de que la experiencia en la frase es de la vendedora, no de Nahui.
3. **La sección "Cómo va" dice en voz alta lo que no tenemos.** "Nahui no tiene ingresos, no tiene números de crecimiento y no tiene una cifra de adopción que presentar. Si los tuviéramos, estarían aquí." Es la línea más persuasiva de la página precisamente porque nadie la escribe.
4. **La barra incumplida se declara, no se esconde.** `backlog.md` #1 (≥90% de ventas registradas, <3 s) aparece en la página como **requisito de diseño sin cumplir y sin medir**. Esto además blinda la página contra la prohibición de "en segundos": convierte la ausencia de medición en una declaración de estándar.
5. **Registro de género en español:** esta página aplica la **opción 4** de `brand/tone-of-voice.md` §"Gendered register in Spanish copy" (rodear la construcción: "quienes venden en bazares") y **género natural donde se habla de una persona real** (la vendedora entrevistada, las vendedoras del piloto, que son mujeres). Esa pregunta sigue **abierta** y es decisión de la Product Owner; esto es una ejecución provisional, no una resolución. Ver §8.6.
6. **No uso el tagline "The path to what's next".** Su estatus está **abierto** (`brand/CLAUDE.md`, pregunta 4). No lo pongo en una superficie pública mientras esté abierto. Ver §8.7.
7. **No hay sección de tamaño de mercado.** Razonamiento completo en §7.1 — es una omisión deliberada, no un olvido.

---

## 2. Identidad de la página

| ID | Español | English | Evidencia |
|---|---|---|---|
| `page.name` | *(nombre interno de la superficie)* Página de presentación de Nahui | Nahui presentation page | — |
| `meta.title` | Nahui — Registro de ventas e inteligencia de negocio para bazares en México | Nahui — Sales registration and business intelligence for bazaars in Mexico | **Real** · descriptor textual de `company/CLAUDE.md` ("Sales registration + business intelligence app for itinerant vendors (bazares) in Mexico") |
| `meta.description` | Nahui es una app de registro de ventas e inteligencia de negocio para quienes venden en bazares en México. Está construida, corre en producción con negocios reales y está en piloto. | Nahui is a sales-registration and business-intelligence app for people who sell at bazaars in Mexico. It is built, it runs in production with real businesses, and it is in pilot. | **Real** |
| `meta.ogTitle` | Nahui | Nahui | — |
| `meta.ogDescription` | Construida y corriendo en producción con negocios reales. En piloto, aprendiendo. | Built and running in production with real businesses. In pilot, learning. | **Real** |
| `meta.url` | *(pendiente — ver §8.11: la URL propia de esta página no está resuelta en el BRIEF y no se puede tocar DNS antes del 15 de octubre)* | *(same)* | — |
| `meta.locale` | `es-MX` / alternate `en` | | — |

**H1 de la página:** `Nahui` (la palabra sola, con el símbolo). El descriptor va en `hero.title`/`hero.lead`, no en el H1.

---

## 3. Mapa de secciones — orden y para qué sirve cada una

El orden responde a las preguntas de un inversionista en el orden en que se las hace:

| # | Sección | ID raíz | Para qué sirve — la pregunta que contesta |
|---|---|---|---|
| 0 | Nav | `nav.*` | Dejar ver, de un golpe, que la página tiene una sección llamada "Cómo va". Eso ya es una señal. |
| 1 | Hero | `hero.*` | **"¿Qué es esto y en qué etapa está?"** Una frase de problema, una de producto, un estado honesto, y el producto real en pantalla. |
| 2 | El problema | `problem.*` | **"¿El problema es real o lo inventaron?"** De dónde salió, qué lo sostiene, y cuánta evidencia es (poca, dicho así). |
| 3 | Qué existe hoy | `today.*` | **"¿Hay producto o hay una presentación?"** Capacidades en tiempo presente, lo que no existe, y la barra de calidad sin cumplir. |
| 4 | Lo que las vendedoras cambiaron | `changed.*` | **"¿Este equipo aprende de usuarios reales o de sí mismo?"** Tres casos fechados en que la retroalimentación de una persona real se volvió producto. La señal más fuerte que tiene Nahui. |
| 5 | Cómo va | `status.*` | **"¿Puedo confiar en lo que me dicen?"** En piloto, aprendiendo. La adopción es la pregunta abierta. Lo que no tenemos, dicho sin rodeos. |
| 6 | Cómo está construido | `built.*` | **"¿Por qué este proyecto y no otro?"** Gobernanza auditable de un equipo de agentes de IA — y el repositorio es público, así que se verifica, no se cree. |
| 7 | Lo que sigue | `next.*` | **"¿A dónde va?"** Patrón de honestidad de roadmap: tres etiquetas, nada en tiempo presente que no exista. |
| 8 | Contacto | `cta.*` | **"¿Y ahora qué hago?"** Un camino claro. |
| 9 | Pie | `foot.*` | Cambio de idioma, aviso de privacidad, repositorio, procedencia. |

**Nota de orden, deliberada:** "Cómo va" (donde se admite que no hay números) va **antes** de "Cómo está construido" (lo más diferenciador). La página admite su debilidad y luego muestra su fortaleza, no al revés. Terminar con la gobernanza y el repositorio público deja al lector con algo que puede ir a revisar él mismo.

---

## 4. Los strings

### 4.0 Navegación y cambio de idioma

| ID | Español | English | Evidencia |
|---|---|---|---|
| `nav.problem` | El problema | The problem | — |
| `nav.today` | Qué existe hoy | What exists today | — |
| `nav.status` | Cómo va | How it's going | — |
| `nav.built` | Cómo está construido | How it's built | — |
| `nav.next` | Lo que sigue | What's next | — |
| `nav.contact` | Contacto | Contact | — |
| `lang.toEn` | English | *(el botón en la versión inglesa dice:)* Español | — |
| `lang.aria` | Cambiar idioma | Change language | — |

### 4.1 Hero — "¿Qué es esto y en qué etapa está?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `hero.badge` | En piloto · México | In pilot · Mexico | **Real** · `bitacora.md` 2026-09-21/23; BRIEF §4 |
| `hero.title` | Vender en un bazar no deja tiempo para anotar la venta. Nahui existe por eso. | Selling at a bazaar leaves no time to write the sale down. That is why Nahui exists. | **Real** · tesis central validada en entrevista, `company/CLAUDE.md` |
| `hero.lead` | Nahui es una app de registro de ventas e inteligencia de negocio para quienes venden en bazares en México. Está construida y corriendo en producción con negocios reales. Está en piloto: lo que estamos aprendiendo ahora es qué hace falta para que entre de verdad en un día de bazar. | Nahui is a sales-registration and business-intelligence app for people who sell at bazaars in Mexico. It is built, and it runs in production with real businesses. It is in pilot: what we are learning now is what it takes for Nahui to genuinely fit into a bazaar day. | **Real** |
| `hero.captionPhone` | La app real, en español. Es lo que ve la vendedora. | The real app, in Spanish — this is what the merchant sees. | **Real** · BRIEF §6 (el celular del hero se queda en español en ambos idiomas) |

CTAs del hero: `cta.contact` (primario) y `cta.product` (secundario) — definidos una sola vez en §5, reutilizados aquí.

### 4.2 El problema — "¿El problema es real o lo inventaron?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `problem.title` | El problema, y de dónde salió | The problem, and where it came from | — |
| `problem.learned` | En un bazar la gente llega sin avisar. Si anotar una venta toma más de unos segundos, el siguiente cliente ya está esperando. | At a bazaar, customers arrive without warning. If writing a sale down takes more than a few seconds, the next customer is already waiting. | **Real** · `company/CLAUDE.md` Core thesis, de la entrevista |
| `problem.learnedBy` | Lo que aprendimos en nuestra primera entrevista con una vendedora de bazar. | What we learned in our first interview with a bazaar vendor. | **Real** |
| `problem.body1` | La venta sí se hace. El registro es el que se pierde. Al cerrar el día, lo que queda es una cuenta de memoria — y la memoria del día no sirve para decidir qué surtir el mes que entra. | The sale still happens. It's the record that gets lost. At the end of the day what's left is a mental tally — and a mental tally is no basis for deciding what to stock next month. | **Real** |
| `problem.body2` | Hay una consecuencia menos obvia, y es la que convierte esto en un problema de crecimiento: para no perder el control, una vendedora se limita sola. Mantiene el catálogo chico a propósito, porque es lo que puede llevar en la cabeza. El techo no es la demanda ni el capital: es cuánto puede recordar. | There's a less obvious consequence, and it's the one that turns this into a growth problem: to stay in control, a merchant limits herself. She keeps her catalogue deliberately small, because small is what she can hold in her head. The ceiling isn't demand and it isn't capital — it's how much she can remember. | **Real** · `company/CLAUDE.md` ("she caps her own catalog size to keep mental control, which caps growth"); tiered as Supported Evidence in `company/market-validation.md` §1c |
| `problem.evidence` | Qué tan firme es esto, dicho con precisión: una entrevista real con una vendedora, más observación de campo acompañándola a varios bazares. Es evidencia de primera mano, y es poca — una vendedora no es un mercado. Saber si esto se generaliza es parte de lo que el piloto tiene que contestar, no algo que ya demos por contestado. | How solid is this, stated precisely: one real interview with a bazaar vendor, plus field observation accompanying her at several bazaars. That's first-hand evidence, and it's thin — one merchant is not a market. Whether this generalises is part of what the pilot has to answer, not something we treat as already answered. | **Real** · `company/market-validation.md` §1a (observación de campo) + Core thesis (entrevista). H1 sigue siendo hipótesis abierta en `market-validation.md` §1 |

**Nota para `ui-designer` — importante, no cosmética.** `problem.learned` **no es una cita textual de la vendedora**. Es un aprendizaje parafraseado y atribuido como tal, que es exactamente la forma que `brand/storytelling.md` autoriza hoy (§"The About-surface carve-out": la copia actual *parafrasea* a Ana, y obtener sus palabras reales con su consentimiento es una pregunta **abierta** para la Product Owner). Por eso: **no lo maquetes con comillas tipográficas, ni con foto, ni con nombre, ni con nada que implique que una persona dijo esas palabras.** Un *pull statement* atribuido al aprendizaje sí; un testimonio no.

### 4.3 Qué existe hoy — "¿Hay producto o hay una presentación?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `today.title` | Qué existe hoy | What exists today | — |
| `today.lead` | Esto no es una maqueta ni un video. Es la app que corre en nahui.app, en producción, con negocios reales dados de alta. | This is not a mockup and not a video. It's the app running at nahui.app, in production, with real businesses set up on it. | **Real** · `bitacora.md` 2026-09-21/23 (recorrido en producción, cuenta y dispositivo reales); BRIEF §4 |
| `today.item1.title` | Inventario | Inventory | **Real** |
| `today.item1.body` | Registrar la mercancía cuando llega, con precio y foto por producto. | Register merchandise as it arrives, with a price and a photo per product. | **Real** · construido, `02c-high-fidelity-prototype/README.md`; `decision-log.md` D54 |
| `today.item2.title` | Eventos | Events | **Real** |
| `today.item2.body` | Preparar un bazar: cuándo, dónde, y qué mercancía se lleva a ese evento. | Set up a bazaar: when, where, and which merchandise is going to that event. | **Real** · construido (Eventos + asignación de mercancía por evento) |
| `today.item3.title` | Venta con botones | Selling with buttons | **Real** |
| `today.item3.body` | Un toque por producto, sin escribir nada. | One tap per product, with nothing to type. | **Real** · construido |
| `today.item4.title` | Venta con código de barras | Selling by barcode | **Real** |
| `today.item4.body` | La cámara del celular lee el código que el producto ya trae de fábrica. Sin base de datos externa: solo los códigos que la vendedora misma dio de alta. | The phone camera reads the barcode the product already came with. No external database: only the codes the merchant registered herself. | **Real** · `decision-log.md` D65 (incluye el límite explícito de alcance); construido |
| `today.item5.title` | Venta con etiquetas NFC | Selling with NFC tags | **Real** |
| `today.item5.body` | Una etiqueta por pieza. Acercarla al teléfono identifica exactamente qué se vendió. | One tag per item. Holding it to the phone identifies exactly which item sold. | **Real** · construido; `decision-log.md` D79 |
| `today.item6.title` | Resultados | Results | **Real** |
| `today.item6.body` | Qué se vendió, en qué bazar le fue mejor, qué queda. | What sold, which bazaar went better, what's left. | **Real** · construido |
| `today.item7.title` | Exportar | Export | **Real** |
| `today.item7.body` | Las ventas de un rango de fechas, en un archivo que se abre en Excel. | Sales for a date range, in a file that opens in Excel. | **Real** · construido (`.xlsx`, corregido desde CSV el 2026-09-15 tras prueba en el teléfono de la Product Owner) |
| `today.item8.title` | Equipo | Team | **Real** |
| `today.item8.body` | Invitar a alguien de confianza a vender con su propio acceso, en el mismo evento o en otro a la vez. | Invite someone you trust to sell with their own access — at the same event, or at another one at the same time. | **Real** · construido; `decision-log.md` D53, RFC 0007/0013 |
| `today.notYet` | Lo que todavía no: Nahui no cobra pagos y no recomienda a qué bazar ir. Lo primero es una decisión deliberada de alcance. Lo segundo necesita datos de muchas vendedoras que hoy no existen, así que no se construye. | What it doesn't do yet: Nahui doesn't process payments, and it doesn't recommend which bazaar to attend. The first is a deliberate scope decision. The second needs data from many merchants that doesn't exist yet, so it isn't being built. | **Real** · `company/CLAUDE.md` "Non-goals right now"; `backlog.md` #3 |
| `today.bar` | Y la parte incómoda, porque es la que importa: el registro de ventas tiene una barra escrita desde el principio — que se registre al menos 9 de cada 10 ventas, y que registrar una tome menos de 3 segundos. Es un requisito de diseño, no un resultado medido, y hoy sigue sin cumplirse. Medirlo necesita uso real sostenido, que es exactamente lo que el piloto todavía no tiene. | And the uncomfortable part, because it's the one that matters: sale registration has had a bar written against it from the start — at least 9 out of every 10 sales recorded, and under 3 seconds to record one. That's a design requirement, not a measured result, and today it is still unmet. Measuring it needs sustained real usage, which is exactly what the pilot doesn't have yet. | **Real** · `company/backlog.md` #1 (barra explícitamente sin cumplir); `architecture-principles.md` #2 (los <3 s son requisito de diseño) |

**`today.bar` es la línea que sustituye cualquier tentación de decir "en segundos".** No existe una sola medición de latencia en el repositorio; se buscó a propósito. Si alguien en una revisión posterior propone recuperar una promesa de velocidad, esta línea es la respuesta y es mejor para el lector que la promesa.

### 4.4 Lo que las vendedoras cambiaron — "¿este equipo aprende de usuarios reales?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `changed.title` | Lo que las vendedoras ya cambiaron del producto | What merchants have already changed in the product | — |
| `changed.lead` | Tres veces, algo que dijo una vendedora real se volvió una decisión de producto fechada, con su razón escrita, y se construyó. No es una encuesta: es el producto cambiando porque alguien lo usó. | Three times, something a real merchant said became a dated product decision with its reasoning written down, and then got built. This isn't a survey result: it's the product changing because someone used it. | **Real** |
| `changed.item1.title` | Una foto por producto | A photo per product | **Real** |
| `changed.item1.body` | Dos personas del piloto la pidieron, por separado, el 5 de septiembre de 2026. Esa semana se volvió decisión de dominio. Está construida. | Two people in the pilot asked for it, independently of each other, on 5 September 2026. That same week it became a domain decision. It's built. | **Real** · `decision-log.md` D54 ("2 of the earliest respondents independently asking for a photo per catalog item, 2026-09-05") |
| `changed.item2.title` | Leer el código de barras | Reading the barcode | **Real** |
| `changed.item2.body` | Un cliente potencial vende juguetes que ya traen código impreso de fábrica, y pidió que Nahui lo leyera. Se decidió el 13 de septiembre de 2026, con un límite puesto desde el principio: sin base de datos externa, porque para mercancía de bazar la cobertura no es confiable y el nombre que devolvería no sería el suyo. Está construido. | A prospective customer sells toys that already carry a manufacturer barcode, and asked Nahui to read it. Decided on 13 September 2026, with a limit set upfront: no external lookup database, because coverage is unreliable for bazaar-market goods and the name it would return wouldn't be hers. It's built. | **Real** · `decision-log.md` D65, incluyendo el razonamiento del alcance |
| `changed.item3.title` | Nos buscó ella | She reached out to us | **Real** |
| `changed.item3.body` | El 3 de septiembre de 2026 una vendedora buscó a Nahui por su cuenta, después de probarla. Nadie le escribió. Le servía, y necesitaba algo que no teníamos: que varias personas pudieran vender en el mismo puesto a la vez, cada una con su propio acceso. Eso ya está en el producto. Otras partes de lo que pidió siguen sin construirse. | On 3 September 2026 a merchant contacted Nahui on her own, after trying it. Nobody messaged her first. It was useful to her, and she needed something we didn't have: several people selling at the same stand at once, each with their own access. That part is now in the product. Other parts of what she asked for are still not built. | **Real** · `company/backlog.md` §Product Discovery ("Source: unsolicited real-merchant feedback (2026-09-03). A prospective merchant contacted the Product Owner directly after trying Nahui"); construido vía `product-decisions.md` Q24/Q25 |
| `changed.note` | Las tres están en el registro público de decisiones del proyecto, con fecha y con la razón escrita. No hay que creérnoslo: se puede leer. | All three are in the project's public decision log, dated, with the reasoning written out. You don't have to take our word for it — you can read it. | **Real** · repositorio público, `github.com/claudiafalcon/nahui` (verificado público, 2026-10-08) |

**Nota de privacidad, vinculante (BRIEF §5).** Ninguno de estos tres párrafos nombra a la vendedora, su negocio, su surtido, su zona, su edad ni los bazares donde vende. "Una vendedora", "un cliente potencial", "dos personas del piloto" es todo lo que se dice de ellas, y la única cosa específica es la fecha. Una futura revisión no debe "fortalecer" esta sección agregando detalle de persona: su surtido exacto más su zona la vuelven identificable en su comunidad aunque no se diga su nombre. El único detalle de mercancía que aparece ("juguetes") viene de un cliente **potencial**, no de la vendedora del piloto, y es lo que hace comprensible la decisión del código de barras — si la Product Owner prefiere quitarlo también, el párrafo funciona diciendo "un cliente potencial vende mercancía que ya trae código de fábrica".

### 4.5 Cómo va — "¿puedo confiar en lo que me dicen?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `status.title` | Cómo va | How it's going | — |
| `status.lead` | En piloto, aprendiendo. | In pilot, learning. | **Real** · BRIEF §4 |
| `status.body1` | Lo que ya sabemos: el producto funciona y se sostiene en producción. Eso está probado en el campo, en el teléfono de una vendedora, no en una laptop de desarrollo. | What we already know: the product works, and it holds up in production. That's been checked in the field, on a merchant's own phone, not on a developer's laptop. | **Real** · `bitacora.md` 2026-09-21/23 (recorrido en producción, cuenta y dispositivo reales) |
| `status.body2` | Lo que no sabemos todavía, y es la pregunta real: la adopción. Que una app funcione y que entre en la rutina de alguien que ya tiene su forma de trabajar son dos cosas distintas, y la segunda no se resuelve construyendo mejor. Esa es la que estamos aprendiendo ahora. | What we don't know yet, and it's the real question: adoption. An app working and an app becoming part of the routine of someone who already has a way of working are two different things, and the second one isn't solved by building better. That's the one we're learning now. | **Real** · `bitacora.md` 2026-09-21/23 ("the first honest adoption read Nahui has had, and it is not a technical one: the product was up the whole time") |
| `status.body3` | Para que quede claro de una vez: Nahui no tiene ingresos, no tiene números de crecimiento y no tiene una cifra de adopción que presentar. Si los tuviéramos, estarían en esta página. | To be plain about it: Nahui has no revenue, no growth numbers, and no adoption figure to show. If we had them, they would be on this page. | **Real** · no existen en el repositorio |
| `status.body4` | Lo que sí hay es un piloto chico con negocios reales, un problema que salió de una persona y no de una suposición, y un ciclo que ya demostró cerrar: una vendedora dice algo, se vuelve una decisión fechada, se construye. | What there is: a small pilot with real businesses, a problem that came from a person rather than an assumption, and a loop that has already demonstrably closed — a merchant says something, it becomes a dated decision, it gets built. | **Real** |

**Lo que esta sección deliberadamente NO dice** (BRIEF §4, el "honesto difícil"): no detalla que dos de tres vendedoras del piloto estaban trancadas o enfriadas mientras el producto funcionaba. "En piloto, aprendiendo" es verdad y alcanza para una landing. Lo que sí hice fue asegurarme de que **nada en la página lo contradiga**: `status.body2` nombra la adopción como la pregunta abierta, `status.body3` niega explícitamente tener una cifra de adopción, y en ningún lugar de la página se dice que las vendedoras del piloto *estén usando* Nahui hoy — se dice que hay negocios reales **dados de alta en producción**, que es lo que es verdad. Esa distinción es intencional en `today.lead` y en `hero.lead`; por favor no se "simplifique" a "vendedoras usando Nahui" en una revisión de estilo.

### 4.6 Cómo está construido — "¿por qué este proyecto y no otro?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `built.title` | Cómo está construido | How it's built | — |
| `built.lead` | Nahui la construye un equipo de agentes de IA con roles separados — producto, arquitectura, UX, revisión, marca — coordinados por una Product Owner que es quien decide. Lo interesante no es la herramienta: es que el método deja rastro. | Nahui is built by a team of AI agents with separate roles — product, architecture, UX, review, brand — coordinated by a Product Owner who is the one who decides. The interesting part isn't the tooling: it's that the method leaves a trail. | **Real** · `company/CLAUDE.md` §How we operate; `.claude/agents/` |
| `built.item1.title` | Registro de decisiones | Decision log | **Real** |
| `built.item1.body` | Cada decisión de producto queda escrita, fechada y con su razón — incluyendo las que después se revocaron, que no se borran. Hoy son más de 80. | Every product decision is written down, dated, and reasoned — including the ones later reversed, which are never deleted. There are more than 80 of them today. | **Calculado** · conteo directo de 84 entradas en `product/00-foundation/decision-log.md` al 2026-10-08. Se dice "más de 80" a propósito, para que la cifra no envejezca hacia abajo |
| `built.item2.title` | RFCs | RFCs | **Real** |
| `built.item2.body` | Un cambio al modelo del negocio no se hace y luego se documenta. Se propone por escrito, se discute y se acepta antes de tocar nada. | A change to the business model of the product doesn't get made and then documented. It gets proposed in writing, argued, and accepted before anything is touched. | **Real** · `product/99-rfc/` (18 RFCs al 2026-10-08); regla en `global-principles.md` |
| `built.item3.title` | Revisión por especialistas | Specialist review | **Real** |
| `built.item3.body` | Cada entrega pasa por revisión de UX, por revisión de consistencia contra la base del producto, y por un recorrido completo de la app hecho por un agente que actúa como una vendedora que la ve por primera vez. Ese agente es un agente, no una vendedora real: corre antes de que una persona real vea algo, precisamente para no gastarle su tiempo en errores que podíamos encontrar nosotros. | Every deliverable goes through a UX review, a consistency review against the product foundation, and a full walkthrough of the app by an agent acting as a merchant seeing it for the first time. That agent is an agent, not a real merchant: it runs *before* any real person sees anything, precisely so we don't spend her time on problems we could have caught ourselves. | **Real** · `.claude/agents/merchant-user-tester.md`; `company/CLAUDE.md` §Experience Validation |
| `built.item4.title` | Bitácora | Project log | **Real** |
| `built.item4.body` | La historia del proyecto en un solo lugar: qué pasó, por qué importó y dónde está el detalle completo. | The project's history in one place: what happened, why it mattered, and where the full detail lives. | **Real** · `company/bitacora.md` |
| `built.item5.title` | Todo esto es auditable | All of this is auditable | **Real** |
| `built.item5.body` | El repositorio es público. El registro de decisiones, los RFCs, los hallazgos de las revisiones y la bitácora están ahí, con su historia de cambios. Lo que esta página afirma sobre el método se puede verificar sin pedirnos permiso. | The repository is public. The decision log, the RFCs, the review findings and the project log are all in it, with their edit history. What this page claims about the method can be verified without asking us for access. | **Real** · `github.com/claudiafalcon/nahui`, confirmado público el 2026-10-08. **Sujeto a §8.2** |
| `built.lab` | Hay un segundo objetivo declarado, además del comercial: que Nahui sea también un laboratorio real de ingeniería de IA — memoria de largo plazo, colaboración entre agentes, orquestación, gobernanza. Está escrito como directiva de la empresa, con su propio cuaderno de decisiones, y con una regla explícita: nunca meter IA en una función donde no le dé valor a la vendedora. | There's a second stated objective alongside the commercial one: that Nahui also be a real laboratory for AI engineering — long-term memory, multi-agent collaboration, orchestration, governance. It's written down as a company directive, with its own decision notebook, and with an explicit rule attached: never force AI into a feature where it gives the merchant no value. | **Real** · `company/CLAUDE.md` §Secondary strategic objective; `company/ai-lab-decisions.md`; `architecture-principles.md` #8 |
| `built.repoLink` | Ver el repositorio | View the repository | — |

### 4.7 Lo que sigue — "¿a dónde va?"

Esta sección aplica el *roadmap-honesty pattern* de `brand/storytelling.md` (**Decision**): nada sin construir se describe en tiempo presente, y cada cosa lleva su etiqueta. **Guardarraíl que hereda:** una etiqueta se corrige el día que la realidad cambia, en cualquier dirección. Una etiqueta vieja convierte el patrón en lo contrario de lo que es.

| ID | Español | English | Evidencia |
|---|---|---|---|
| `next.title` | Lo que sigue | What's next | — |
| `next.lead` | Tres etiquetas, sin medias tintas. | Three labels, no hedging. | — |
| `next.tag.built` | Ya construido | Built | — |
| `next.tag.progress` | En camino | In progress | — |
| `next.tag.hold` | Detenido a propósito | Deliberately on hold | — |
| `next.item1.title` | Registro de ventas | Sale registration | **Real** |
| `next.item1.body` | Construido y en producción. Su barra de calidad — 9 de cada 10 ventas, menos de 3 segundos — sigue sin cumplirse, y sigue siendo la prioridad número uno del proyecto. | Built and in production. Its quality bar — 9 out of 10 sales, under 3 seconds — is still unmet, and it remains the project's top priority. | **Real** · `backlog.md` #1 · etiqueta `next.tag.built` |
| `next.item2.title` | Clientes frecuentes | Frequent customers | **Proyectado** |
| `next.item2.body` | Distinguir a quien compra poquito pero en cada bazar de quien compra mucho pero una vez al año. Hoy una vendedora no tiene forma de saberlo: sus clientas la siguen por redes, no por nombre. Está diseñado y especificado; su construcción va después del registro de ventas, no antes. | Telling apart the customer who buys a little at every bazaar from the one who buys a lot once a year. Today a merchant has no way to know: her customers follow her on social media, not by name. It's designed and specified; building it comes after sale registration, not before. | **Real** para el problema (`company/CLAUDE.md`, tercera fricción validada) y para el estado de diseño; **Proyectado** para la capacidad · `backlog.md` #2 · etiqueta `next.tag.progress` |
| `next.item3.title` | A qué bazar conviene ir | Which bazaar is worth attending | **Proyectado** |
| `next.item3.body` | Elegir bazar hoy se decide a ciegas: sin datos de afluencia, sin clima, y con costos de entrada que van de unos cientos a varios miles de pesos por evento. Resolverlo necesita datos de muchas vendedoras, y Nahui todavía no los tiene. Por eso no se está construyendo: se construiría sobre nada. | Choosing a bazaar is a blind decision today: no footfall data, no weather, and entry costs that range from a few hundred to several thousand pesos per event. Solving it needs data from many merchants, and Nahui doesn't have that yet. So it isn't being built — it would be built on nothing. | **Real** para la fricción y para el rango de costos (`market-validation.md` §1d, observación de primera mano, informal); **Proyectado** para la capacidad · `backlog.md` #3 · etiqueta `next.tag.hold` |

**Sobre el rango de costos en `next.item3.body`:** la fuente dice $7,000 y $2,500 por evento (`market-validation.md` §1d). En la página **no** van las cifras exactas ni los nombres de los bazares — esos tres nombres de recinto más el surtido la vuelven identificable (BRIEF §5). "De unos cientos a varios miles de pesos" es verdad, útil para el lector, y no apunta a nadie. Si la Product Owner prefiere quitar el rango por completo, la frase se sostiene sin él.

**Lo que explícitamente NO va en esta sección:** "De la foto a tu inventario". No está en `backlog.md`, no es una decisión de Nahui, y la versión anterior de la página la anunciaba como comprometida (BRIEF §4). Grepeé el repositorio completo: solo existe en ese archivo. No va en esta página en ningún encuadre, ni como "En camino", ni como idea, ni como ejemplo.

### 4.8 Contacto — "¿y ahora qué?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `cta.title` | Si esto te interesa | If this interests you | — |
| `cta.lead` | Nahui está en piloto y en una etapa en la que platicar sirve más que presentar. Si evalúas proyectos en esta etapa, o si te interesa lo que estamos aprendiendo del piloto, escríbenos. | Nahui is in pilot, at a stage where a conversation is worth more than a pitch. If you evaluate projects at this stage, or you're interested in what we're learning from the pilot, get in touch. | **Real** · ver §8.5 (variante alterna si la Product Owner quiere declarar que está buscando inversión) |
| `cta.contact` | Escríbenos | Get in touch | — · **destino pendiente, §8.1** |
| `cta.product` | Ver la app | Open the app | — |
| `cta.productNote` | Es la app real, en producción. Te va a pedir una cuenta para entrar: no es un demo. | This is the real app, in production. It will ask you to sign in — it isn't a demo. | **Real** · `www.nahui.app` sirve la app real; `demo.nahui.app` sirve un build retirado y no se enlaza (BRIEF §6, `decision-log.md` D61) |
| `cta.repo` | Leer cómo se construyó | Read how it was built | — · §8.2 |

### 4.9 Pie

| ID | Español | English | Evidencia |
|---|---|---|---|
| `foot.made` | © 2026 Nahui · Hecho en México | © 2026 Nahui · Made in Mexico | **Real** |
| `foot.stage` | Proyecto en piloto. Esta página se actualiza cuando cambia el estado, no cuando conviene. | A project in pilot. This page gets updated when the status changes, not when it's convenient. | **Real** — y es una promesa operativa: si se publica, alguien tiene que mantenerla. Ver §8.8 |
| `foot.privacy` | Aviso de privacidad | Privacy notice (in Spanish) | — · **destino pendiente, §8.3** |
| `foot.repo` | Repositorio público | Public repository | — · §8.2 |

---

## 5. CTAs — qué hace cada uno y a dónde apunta

| CTA | Dónde aparece | Qué hace | Destino | Estado |
|---|---|---|---|---|
| **Primario — `cta.contact`** "Escríbenos" / "Get in touch" | Hero y sección de contacto (mismo string, mismo destino, no dos CTAs distintos) | Abre el correo del lector con el destinatario puesto | `mailto:` — **dirección sin resolver** | 🔴 **Bloqueado.** `company/marketing-operating-environment.md` §1 propone `hola@nahui.app`, pero el buzón **no está dado de alta**: requiere Google Workspace configurado contra el dominio, que es un paso real pendiente. **No se publica una dirección que no reciba correo.** Ver §8.1 |
| **Secundario — `cta.product`** "Ver la app" / "Open the app" | Hero y sección de contacto | Abre la app real en una pestaña nueva | `https://www.nahui.app` | 🟢 Verificado vivo el 2026-10-08 (responde, título "Nahui — Hoy"). **Siempre acompañado de `cta.productNote`**, para que nadie llegue esperando un demo y se sienta engañado |
| **Terciario — `cta.repo` / `foot.repo` / `built.repoLink`** | Sección "Cómo está construido" y pie | Abre el repositorio público | `https://github.com/claudiafalcon/nahui` | 🟡 Verificado público el 2026-10-08 (465 commits, etiqueta "Public"). **Requiere decisión de la Product Owner antes de enlazarse** — ver §8.2, hay una consideración de privacidad real |
| **Pie — `foot.privacy`** | Pie | Abre el aviso de privacidad | **sin resolver** | 🔴 **Bloqueado.** El aviso de la versión anterior vivía en `demo.nahui.app/aviso-de-privacidad.html`, y `demo.nahui.app` no se enlaza (BRIEF §6). No hay copia en el repositorio. Ver §8.3 |
| *(No incluido)* Facebook | — | — | `facebook.com/NahuiApp` | ⛔ **No lo incluí.** No pude verificar que la Página exista públicamente: Facebook devuelve a una petición no autenticada solo un cascarón con el título. `company/facebook-page-setup.md` es un plan de alta, no un registro de que esté creada. Enlazar una Página que no existe, en una página para inversionistas, es exactamente el tipo de detalle que descuenta todo lo demás. Ver §8.4 |

**Prohibiciones duras de enlace, heredadas del BRIEF §6:**
- Ningún enlace, en ningún idioma, en ningún lugar de la página, apunta a `demo.nahui.app` — sirve un build retirado (D61) y truena en `/invite/`.
- No se toca DNS: ni raíz, ni `www`, ni `demo`, ni `loyalty`. Hay vendedoras reales en producción detrás de esos dominios.

---

## 6. Notas de implementación para `ui-designer` (contenido, no layout)

1. **El español va en el HTML.** Las 2 versiones existen como contenido real; el script solo intercambia. La página tiene que leerse completa sin JavaScript, en español. Esto es una restricción de contenido, no solo técnica: la versión anterior mostraba cero palabras sin JS (BRIEF §6).
2. **El inglés es una versión completa, no un resumen.** Es la única versión que la evaluadora va a leer. Si una sección existe en español, existe en inglés con el mismo peso. No hay strings que existan solo en español, con una excepción deliberada: el texto **dentro** del celular del hero, que se queda en español en ambos idiomas, con `hero.captionPhone` explicándolo.
3. **El celular del hero muestra el producto real.** No un render inventado, no números falsos (BRIEF §6). Y, vinculante por privacidad: **el surtido que se vea en pantalla usa el mapa de sustitución aprobado por la Product Owner el 2026-08-10 — Bolsas, Accesorios, Playeras, Gorras — nunca el surtido real de la vendedora del piloto.** Ese mapa se decidió para una superficie *menos* pública que esta; aquí aplica con más fuerza. Si la captura que usas trae datos reales, no se "difumina": se vuelve a generar con el surtido sustituto.
4. **Jerarquía de secciones, si hay que recortar para el 15 de octubre.** Si la versión completa no alcanza, el mínimo publicable que sigue siendo honesto y que sigue sirviendo al entregable del curso es: Hero + El problema + Qué existe hoy + Cómo va + pie. En ese orden. **"Cómo va" no se recorta** — una página sin ella deja de ser esta página. Lo recortable es "Cómo está construido", "Lo que sigue" y "Lo que las vendedoras cambiaron", en ese orden de último a primero.
5. **Nada numérico decorativo.** Sin contadores, sin barras de progreso, sin "99%", sin métricas inventadas de relleno. Las únicas cifras de la página son: "más de 80" decisiones, "9 de cada 10 / 3 segundos" (la barra incumplida), tres fechas de 2026, y el rango de costos de evento. Todas tienen fuente en §4.
6. **`problem.learned` no se maqueta como testimonio.** Ver la nota al pie de §4.2.

---

## 7. Omisiones deliberadas — qué NO va en la página, para que nadie lo agregue después

### 7.1 Tamaño de mercado / TAM — omitido a propósito

Busqué una cifra citable para el segmento real de Nahui (vendedoras itinerantes de bazar privado en México) y **no existe una**. Lo que sí hay son cifras de informalidad del INEGI: ~33 millones de personas en informalidad laboral a diciembre de 2025 (54.6% de la población ocupada), 12.4 millones de personas ocupadas en comercio en general, 16.8 millones en empleo informal en la economía informal. Las tres describen poblaciones **órdenes de magnitud más grandes y estructuralmente distintas** del segmento de Nahui, y ninguna se puede recortar honestamente hasta él.

Poner "33 millones" en una página de Nahui sería un TAM inflado por sustitución: exactamente la clase de afirmación que, al descubrirse, descuenta todo lo demás que dice la página. Un inversionista que conozca el dato va a reconocer el movimiento. **Recomendación:** sin sección de mercado hasta que haya una estimación propia, construida y mostrada (p. ej., número de bazares privados recurrentes identificables en Edomex/CDMX × vendedoras por bazar), que se presentaría etiquetada **Calculado**, con el método a la vista. Es un trabajo de investigación real, no un párrafo; puedo prepararlo si la Product Owner lo quiere.

### 7.2 Lo demás que queda fuera, y por qué

| No va | Razón |
|---|---|
| "En segundos" / cualquier promesa de velocidad | No existe una sola medición de latencia en el repositorio. `today.bar` dice la verdad en su lugar, y es mejor copia |
| "Probamos cada paso con vendedoras reales" | La prueba por paso la corre `merchant-user-tester`, un agente de IA que por definición corre **antes** de que una vendedora real vea algo. `built.item3.body` lo dice tal cual |
| Ingresos, crecimiento, tracción, número de usuarios activos | No existen. `status.body3` lo declara |
| "De la foto a tu inventario" | No es un elemento del roadmap de Nahui (BRIEF §4) |
| Nombre, negocio, surtido, zona, edad o bazares de la vendedora del piloto; nombres de recintos; las cifras exactas de costo de evento | BRIEF §5. Su surtido exacto más su zona la identifican en su comunidad |
| Cualquier cita atribuida a una vendedora real | Nadie ha dado su consentimiento para ser citada. `brand/storytelling.md` lo tiene como pregunta **abierta** para la Product Owner |
| Precios, planes, tiers (gratis/pago) | El modelo de negocio es direccional y no final (`company/CLAUDE.md`); `business-decisions.md` Q11 (ciclo de cobro) sigue abierta. Una página pública con precios los vuelve un compromiso |
| Equipo, fundadores, headcount, biografías | Nada de eso está definido en el repositorio, y "equipo" implicaría personas que no están. `built.lead` dice lo que es verdad: agentes de IA con roles separados y una Product Owner que decide |
| Logos de clientes, testimonios, reseñas | No existen, y solicitarlos a esta altura sería prematuro (`facebook-page-setup.md` ya razonó esto para reseñas) |
| El tagline "The path to what's next" | Su estatus está **abierto** (`brand/CLAUDE.md`). Ver §8.7 |
| Comparaciones con competidores | No hay análisis competitivo verificado en el repositorio. Una comparación sin fuente es una afirmación sobre un tercero |

---

## 8. Decisiones que necesito de la Product Owner

Ordenadas por si bloquean la publicación.

**🔴 Bloquean**

1. **Dirección de contacto para el CTA primario.** `hola@nahui.app` está *propuesto* en `marketing-operating-environment.md`, no dado de alta — requiere Google Workspace contra el dominio. Opciones: (a) dar de alta el buzón y usarlo; (b) usar su correo personal en el `mailto:` (es una decisión suya, no mía: publicar su dirección personal es exponerla); (c) publicar la primera versión **sin CTA de contacto**, con "Ver la app" como único camino, y agregar el contacto cuando el buzón exista. Recomiendo (a); (c) es aceptable para el 15 de octubre y no miente.
2. **¿Se enlaza el repositorio público?** Mi recomendación es **sí**: es lo único en la página que convierte la afirmación de gobernanza en algo verificable en lugar de afirmado, y ya es público de todos modos. **Pero hay una consideración real:** el repositorio contiene el nombre del negocio de dos vendedoras del piloto (`company/bitacora.md`, entrada 2026-09-21/23), el surtido real de la vendedora del piloto, su edad, nombres de recintos y cifras de costo de evento (`company/market-validation.md` §1a/§1d, §1c). Enlazarlo desde una URL entregada públicamente aumenta el tránsito hacia ese material. Tres caminos: (a) enlazar tal cual; (b) enlazar después de una pasada de limpieza de datos identificables en esos archivos — trabajo acotado, puedo listar los lugares exactos; (c) no enlazar, y describir el método sin ofrecer verificación, que debilita bastante la sección. Recomiendo (b).
3. **Destino del aviso de privacidad.** El de la versión anterior vivía en `demo.nahui.app`, que no se enlaza. No hay copia en el repositorio. Si la página recoge cualquier dato (incluso un `mailto:`) conviene que exista. Opciones: hospedarlo junto a esta página, o quitar el enlace del pie en la primera versión. No publico un enlace muerto.

**🟡 Afectan el contenido, no bloquean**

4. **¿Se incluye Facebook?** No pude verificar que `facebook.com/NahuiApp` exista públicamente (Facebook no sirve contenido a una petición no autenticada). Si la Página existe y está presentable, se puede agregar como CTA terciario; si no existe o está vacía, recomiendo omitirla — una Página vacía enlazada desde una página para inversionistas resta.
5. **¿Nahui está buscando inversión, y lo dice?** `cta.lead` como está escrito es honestamente ambiguo ("si evalúas proyectos en esta etapa"). Variante explícita, si la quiere: *"Nahui está en piloto y abierta a conversaciones de inversión temprana. Si eso es lo tuyo, escríbenos."* / *"Nahui is in pilot and open to early-stage investment conversations. If that's your thing, get in touch."* No la puse por default porque es una afirmación sobre su intención, no mía.
6. **Registro de género en español (pregunta abierta de `brand/tone-of-voice.md`).** Esta página aplica provisionalmente la opción 4 (rodear la construcción: "quienes venden en bazares") más género natural para personas reales. Si usted elige otra de las cuatro opciones, reescribo. La nota de ese documento aplica: **la regla que se adopte se aplica a la vez a las superficies internas y externas**, no solo aquí.
7. **Tagline.** No usé "The path to what's next" porque su estatus está abierto. Si sigue siendo el tagline, dígame y lo coloco (lugar natural: junto al nombre en el hero, o en el pie).
8. **¿Se dice cuántos negocios hay en el piloto?** Hoy escribí "negocios reales" sin número. El número verificable es **tres** (`bitacora.md` 2026-09-21/23). Mi recomendación: **decir "tres"**. Para un inversionista, un número chico y honesto se lee mucho mejor que un plural vago, que se lee como algo escondido. El costo es una obligación de mantenimiento: la cifra tiene que corregirse cuando cambie, igual que las etiquetas del roadmap. Si lo aprueba, la línea queda: *"Está construida y corriendo en producción con tres negocios reales."* / *"It's built and running in production with three real businesses."*

**🔵 Para el registro, no requieren acción inmediata**

9. **`brand-guardian` sigue pendiente.** Esta versión se escribió sin su guía de registro de inversionista. Las líneas más expuestas a su revisión, en orden: `hero.title` (un titular que empieza por el problema), `status.body3` (la declaración de lo que no tenemos — es el movimiento de voz más fuerte de la página), y `built.lead` (Nahui hablando de su propia construcción, dentro del *About-surface carve-out*). Espero su guía y reviso.
10. **Consulta a `knowledge-mentor` que no pedí, y por qué.** Hay una pregunta donde teoría establecida fortalecería la pieza: *"¿cómo trata la literatura de innovation accounting / Lean Startup la presentación de avance ante evaluadores externos cuando no hay métricas de tracción — qué se reporta en lugar de crecimiento, y cómo se evita que la honestidad se lea como falta de avance?"*. Es relevante para el orden de las secciones 5 y 6 y para el encuadre de `status.*`. No la pedí porque usted me pidió mi borrador más fuerte ahora y el diseño de las secciones es defendible sin ella; si quiere que la haga antes de aprobar, pídala y reviso §3 y §4.5 con lo que regrese.
11. **La URL propia de esta página no está resuelta** en el BRIEF, y no se puede tocar DNS antes del 15 de octubre (BRIEF §7). `meta.url` y `og:url` dependen de eso. Es infraestructura, no contenido, pero el string lo necesita.
12. **Error de cita menor en el BRIEF, para corregirlo donde corresponda.** BRIEF §7 cita `company/business-decisions.md` Q26 para el hecho de "hay vendedoras reales en producción detrás de esos dominios". Esa Q26 no existe en ese archivo; la Q26 que existe es `product/02-ux/product-decisions.md` Q26 y es sobre vinculación de cuentas. El hecho en sí está bien respaldado en otro lado (`company/bitacora.md`, 2026-09-21/23), así que la restricción se sostiene — solo la referencia está mal.

---

## 9. Checklist de verdad de producto — para `reviewer` y para quien apruebe

Cada casilla se puede verificar contra el repositorio sin confiar en mí:

- [ ] Ninguna capacidad descrita en tiempo presente está sin construir. Las tres de "Lo que sigue" llevan etiqueta explícita.
- [ ] No aparece "en segundos" ni ninguna promesa de velocidad. La barra incumplida se declara (`today.bar`).
- [ ] No se afirma prueba por paso con vendedoras reales. `built.item3.body` dice explícitamente que ese agente es un agente.
- [ ] No hay ingresos, crecimiento, tracción ni cifra de adopción. `status.body3` niega tenerlos.
- [ ] No aparece "De la foto a tu inventario", en ningún encuadre.
- [ ] La vendedora del piloto no es identificable: sin nombre, sin negocio, sin surtido, sin zona, sin edad, sin recintos, sin cifras exactas de costo.
- [ ] Ninguna palabra se le atribuye a una vendedora real. `problem.learned` es un aprendizaje parafraseado y atribuido como tal.
- [ ] Ningún enlace apunta a `demo.nahui.app`.
- [ ] Nada contradice "en piloto, aprendiendo": en ninguna parte se dice que las vendedoras del piloto *estén usando* Nahui hoy, solo que hay negocios reales dados de alta en producción.
- [ ] Ningún término técnico del dominio (`Session`, `SaleItem`, `Customer`, `subscriptionTier`, `OWNER`, `SELLER`) aparece en la copia, en ninguno de los dos idiomas.
- [ ] Las dos versiones de idioma están completas. Ninguna sección existe en un idioma y no en el otro, salvo el texto dentro del celular del hero, que es deliberado y está explicado en la página.
- [ ] Sin cifras decorativas. Las únicas de la página tienen fuente en §4.
