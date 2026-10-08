# Nahui — sitio público de presentación · Contenido

**Owner:** `marketing` (mensaje, afirmaciones, CTA). **Estado:** borrador completo, **pendiente de aprobación de la Product Owner**. Nada de esto está publicado.
**Insumo obligatorio:** `landing/BRIEF.md` (definición de producto aprobada, 2026-10-08). Este documento no redefine público, idioma ni restricciones — los ejecuta.
**Registro de voz:** `brand/tone-of-voice.md` §"Speaking about Nahui to an investor or evaluator" (**Decision**, 2026-10-08) y `brand/brand-principles.md` principio 8. **Esta versión ya está revisada contra ambos** — ver §10 para la autoverificación línea por línea. El BRIEF manda sobre *qué* se puede afirmar; ese registro manda sobre *cómo suena*.
**Para `ui-designer`:** el contenido es esto. Los IDs de string, el orden de secciones y el destino de cada CTA son normativos. El layout, la tipografía, el ritmo y el código son tuyos. No escribí HTML.

**Revisión 2026-10-08 (segunda pasada: registro de inversionista + cinco decisiones de la Product Owner).** La estructura no cambió: sigue abriendo con el problema, "Cómo va" sigue antes de "Cómo está construido", la barra incumplida sigue sustituyendo cualquier promesa de velocidad, y `status.body3` quedó intacto. Lo que cambió está listado en §10.1. **Todas las decisiones de contenido de esta página están tomadas** (§8): público e idiomas, encuadre de honestidad, dirección de contacto, enlace al repositorio, tagline, número de negocios en el piloto, y el nombre de la Product Owner en la página. Lo único que queda abierto son dos verificaciones que pido explícitamente, no decisiones: que el buzón `ihola@nahui.app` reciba correo, y la forma escrita del nombre.

**Nota de disciplina, escrita aquí porque casi se publica un error:** la primera cifra que esta página iba a publicar sobre sí misma estaba inflada 50% (decía tres negocios en el piloto; son dos). En una página cuyo argumento entero es que Nahui no exagera, esa habría sido la afirmación más fácil de desmentir. Por eso **§10.2 ahora verifica cada cifra de la página contra su fuente, una por una**, y por eso dos afirmaciones más se corrigieron en esta misma pasada al volver a derivarlas (el rango de costos de evento y un detalle que nadie había observado). Ninguna cifra entra a esta página por inferencia desde un artefacto del repositorio: entra con fuente verificable o no entra.

---

## 0. Cómo leer este documento

Cada string tiene **ID**, **español**, **inglés** y una **etiqueta de evidencia** (`evidence-tiering`):

- **Real** — observado, ocurrió, verificable en el repositorio o en una fuente citada. La inmensa mayoría de esta página.
- **Calculado** — derivado de algo Real (un conteo, una suma, una consecuencia lógica de una decisión registrada).
- **Proyectado** — intención a futuro. **Solo aparece en la sección "Lo que sigue", y siempre etiquetado como tal en la página misma**, nunca en tiempo presente.

El español es la base (va en el HTML, per BRIEF §6); el inglés es una versión completa que se sostiene sola, no un resumen. **Cada par de columnas se escribió desde la misma lista de afirmaciones, no traduciendo una a la otra** — y la etiqueta de evidencia y la *fuerza* de la afirmación son idénticas en los dos idiomas. Donde una de las dos versiones se separa deliberadamente de la literalidad, lo digo.

**Regla que gobierna cada línea de abajo:** un inversionista en esta etapa no espera tracción; espera no ser engañado. Una afirmación inflada no se descuenta sola — descuenta todo lo demás. La honestidad aquí es el instrumento persuasivo, no el límite (`brand/brand-principles.md` principio 8).

**Segunda regla, de registro:** en esta página Nahui se describe, no se interpreta a sí misma. Tercera persona para el producto ("Nahui registra…"), primera persona del plural para los límites de lo que sabemos ("aprendimos", "todavía no lo sabemos"). El "nosotros" es de autoría y de incertidumbre, nunca de destino. Y la vendedora es el sujeto de sus propios verbos: "la vendedora registra", nunca "Nahui le permite registrar".

---

## 1. Decisiones de contenido que tomé, y por qué

1. **La página abre con el problema, no con el producto.** No hay tracción que presumir, así que lo más fuerte que tiene Nahui es que el problema es real y que salió de una persona real. Un titular de producto sin números detrás se lee hueco; un titular de problema con una entrevista detrás se lee verificable.
2. **Nahui se describe en tercera persona; quien la construye se nombra; nadie le habla de tú a la vendedora ni al lector.** La versión anterior le hablaba de tú a quien no iba a leer la página; eso no se recicla (BRIEF §2). Esto cae dentro del *About-surface carve-out* de `brand/storytelling.md` (**Decision**) y del registro de inversionista de `brand/tone-of-voice.md` (**Decision**): la página de la empresa es la única superficie donde la empresa legítimamente habla de sí misma — y sigue aplicando en pleno la regla de que la experiencia en la frase es de la vendedora, no de Nahui.
3. **La sección "Cómo va" dice en voz alta lo que no tenemos.** "Nahui no tiene ingresos, no tiene números de crecimiento y no tiene una cifra de adopción que presentar. Si los tuviéramos, estarían aquí." Es la línea más persuasiva de la página precisamente porque nadie la escribe.
4. **La barra incumplida se declara, no se esconde.** `backlog.md` #1 (≥90% de ventas registradas, <3 s) aparece en la página como **requisito de diseño sin cumplir y sin medir**. Esto además blinda la página contra la prohibición de "en segundos": convierte la ausencia de medición en una declaración de estándar.
5. **Registro de género en español:** esta página aplica la **opción 4** de `brand/tone-of-voice.md` §"Gendered register in Spanish copy" (rodear la construcción: "quienes venden en bazares") y **género natural donde se habla de una persona real** (la vendedora entrevistada, las vendedoras del piloto, la Product Owner). Esa pregunta sigue **abierta** y es decisión de la Product Owner; esto es una ejecución provisional, no una resolución, y `brand/tone-of-voice.md` dice explícitamente que no es un hallazgo de revisión mientras siga abierta. Ver §8.6.
6. **El tagline va en la página, en inglés en los dos idiomas.** Aprobado por la Product Owner el 2026-10-08: *"The path to what's next"*, y "esa siempre va en inglés". Va tratado como el nombre: un elemento de marca que conserva su forma en los dos idiomas, igual que *Nahui* y *bazares*, no como copy sujeto a la regla de paridad entre idiomas — **la paridad sigue obligando en cada afirmación; un tagline no es una afirmación.** Colocación y tratamiento tipográfico en §4.1 y §6.10. Ver §8.7.
7. **No hay sección de tamaño de mercado.** Razonamiento completo en §7.1 — es una omisión deliberada, no un olvido.
8. **Dentro de la versión inglesa se quedan en español tres cosas:** *Nahui*, *bazar/bazares* (glosado una sola vez, en `hero.lead`) y las etiquetas que la app muestra en pantalla (Inventario, Eventos, Resultados, Exportar, Equipo, Bitácora), glosadas entre paréntesis. El celular del hero se queda en español en los dos idiomas (BRIEF §6); traducir sus pantallas en el texto inglés contradiría "never translate the UI" por la puerta de atrás. Y en espejo: el tagline se queda en inglés dentro de la versión española. Ver §6.7.
9. **El número de negocios del piloto se dice: son dos.** Decisión de la Product Owner, 2026-10-08, sobre mi recomendación de decir la cifra en lugar de un plural vago. **La cifra es dos, no tres** — la Product Owner tiene acceso a la base de producción y corrigió un conteo que yo había inferido mal desde el repositorio. Ver §8.8 y, sobre lo que esa corrección implica para toda cifra de esta página, §10.2.

---

## 2. Identidad de la página

| ID | Español | English | Evidencia |
|---|---|---|---|
| `page.name` | *(nombre interno de la superficie)* Página de presentación de Nahui | Nahui presentation page | — |
| `brand.tagline` | The path to what's next | The path to what's next | **Real** · tagline aprobado por la Product Owner el 2026-10-08, en inglés en los dos idiomas. Cierra la pregunta abierta #4 de `brand/CLAUDE.md` |
| `meta.title` | Nahui — Registro de ventas e inteligencia de negocio para bazares en México | Nahui — Sales registration and business intelligence for *bazares* in Mexico | **Real** · descriptor textual de `company/CLAUDE.md` ("Sales registration + business intelligence app for itinerant vendors (bazares) in Mexico") |
| `meta.description` | Nahui es una app de registro de ventas e inteligencia de negocio para quienes venden en bazares en México. Está construida, corre en producción con dos negocios reales y está en piloto. | Nahui is a sales-registration and business-intelligence app for people who sell at *bazares* in Mexico. It is built, it runs in production with two real businesses, and it is in pilot. | **Real** · la cifra, confirmada por la Product Owner el 2026-10-08 (§10.2) |
| `meta.ogTitle` | Nahui | Nahui | — |
| `meta.ogDescription` | Construida y corriendo en producción con dos negocios reales. En piloto, aprendiendo. | Built and running in production with two real businesses. In pilot, learning. | **Real** |
| `meta.url` | *(pendiente — ver §8.11: la URL propia de esta página no está resuelta en el BRIEF y no se puede tocar DNS antes del 15 de octubre)* | *(same)* | — |
| `meta.locale` | `es-MX` / alternate `en` | | — |

**H1 de la página:** `Nahui` (la palabra sola, con el símbolo), con `brand.tagline` inmediatamente debajo como parte del lockup. El descriptor va en `hero.title`/`hero.lead`, no en el H1. **El símbolo se muestra; no se afirma qué significa** — las lecturas del símbolo ("una brújula", "una persona con los brazos abiertos", "memorable") son **Hypothesis** y `brand/visual-language.md` las prohíbe en cualquier superficie externa, no solo frente a vendedoras.

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
| 6 | Cómo está construido | `built.*` | **"¿Por qué este proyecto y no otro, y quién está detrás?"** Gobernanza auditable de un equipo de agentes de IA coordinado por una persona con nombre — y el repositorio es público, así que se verifica, no se cree. |
| 7 | Lo que sigue | `next.*` | **"¿A dónde va?"** Patrón de honestidad de roadmap: tres etiquetas, nada en tiempo presente que no exista. |
| 8 | Contacto | `cta.*` | **"¿Y ahora qué hago?"** Un camino claro. |
| 9 | Pie | `foot.*` | Cambio de idioma, aviso de privacidad, repositorio, procedencia. |

**Nota de orden, deliberada:** "Cómo va" (donde se admite que no hay números) va **antes** de "Cómo está construido" (lo más diferenciador). La página admite su debilidad y luego muestra su fortaleza, no al revés. Terminar con la gobernanza y el repositorio público deja al lector con algo que puede ir a revisar por su cuenta.

**El orden de secciones es idéntico en los dos idiomas.** No es una preferencia editorial: `brand/tone-of-voice.md` lo vuelve parte de la afirmación — si una versión reordena o pesa distinto, uno de los dos lectores está recibiendo otra página.

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
| `brand.tagline` | *(en el lockup, debajo del nombre)* The path to what's next | The path to what's next | **Real** · §8.7 |
| `hero.badge` | En piloto · México | In pilot · Mexico | **Real** · `bitacora.md` 2026-09-21/23; BRIEF §4 |
| `hero.title` | Vender en un bazar no deja tiempo para anotar la venta. Nahui existe por eso. | Selling at a *bazar* leaves no time to write the sale down. That is why Nahui exists. | **Real** · tesis central validada en entrevista, `company/CLAUDE.md` |
| `hero.lead` | Nahui es una app de registro de ventas e inteligencia de negocio para quienes venden en bazares en México. Está construida y corriendo en producción con dos negocios reales. Está en piloto: lo que estamos aprendiendo ahora es qué hace falta para que entre de verdad en un día de bazar. | Nahui is a sales-registration and business-intelligence app for people who sell at *bazares* — the recurring, private pop-up markets where they sell. It is built, and it runs in production with two real businesses. It is in pilot: what we are learning now is what it takes for Nahui to genuinely fit into a day at a *bazar*. | **Real** · la cifra per §10.2 · `hero.lead` inglés lleva la **única glosa** de *bazar/bazares* de toda la página (§6.7) |
| `hero.captionPhone` | La app real, en español. Es lo que ve la vendedora. | The real app, in Spanish. This is what the merchant sees. | **Real** · BRIEF §6 (el celular del hero se queda en español en ambos idiomas) |

CTAs del hero: `cta.contact` (primario) y `cta.product` (secundario) — definidos una sola vez en §5, reutilizados aquí.

**Colocación del tagline, y por qué ahí.** Va en el lockup de identidad, pegado al nombre y al símbolo, **arriba de `hero.title`** y claramente subordinado a él: tipográficamente más chico que el titular, no al mismo peso. La razón es de registro, no de estética — esta página es un reporte de avance, y un tagline puesto como titular sobre copy que luego no promete nada se leería como la promesa que la página deliberadamente no hace. Pegado al nombre funciona como lo que es: parte de cómo se llama Nahui. **Dos reglas duras para `ui-designer`:** no se traduce al español, y no se repite en el pie — una vez, en el lockup, es suficiente.

### 4.2 El problema — "¿El problema es real o lo inventaron?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `problem.title` | El problema, y de dónde salió | The problem, and where it came from | — |
| `problem.learned` | En un bazar la gente llega sin avisar. Si anotar una venta toma más de unos segundos, el siguiente cliente ya está esperando. | At a *bazar*, customers arrive without warning. If writing a sale down takes more than a few seconds, the next customer is already waiting. | **Real** · `company/CLAUDE.md` Core thesis, de la entrevista |
| `problem.learnedBy` | Lo que aprendimos en nuestra primera entrevista con una vendedora de bazar. | What we learned in our first interview with a *bazar* vendor. | **Real** |
| `problem.body1` | La venta sí se hace. El registro es el que se pierde. Al cerrar el día, lo que queda es una cuenta de memoria — y la memoria del día no sirve para decidir qué surtir el mes que entra. | The sale still happens. It's the record that gets lost. At the end of the day what's left is a mental tally — and a mental tally is no basis for deciding what to stock next month. | **Real** |
| `problem.body2` | Hay una consecuencia menos obvia, y es la que convierte esto en un problema de crecimiento: para no perder el control, una vendedora se limita sola. Mantiene el catálogo chico a propósito, porque es lo que puede llevar en la cabeza. El techo no es la demanda ni el capital: es cuánto cabe en la memoria de cualquiera. | There's a less obvious consequence, and it's the one that turns this into a growth problem: to stay in control, a merchant limits herself on purpose. She keeps her catalog deliberately small, because small is what she can hold in her head. The ceiling isn't demand and it isn't capital — it's how much anyone can keep in memory. | **Real** · `company/CLAUDE.md` ("she caps her own catalog size to keep mental control, which caps growth"); tiered as Supported Evidence in `company/market-validation.md` §1c |
| `problem.evidence` | Qué tan firme es esto, dicho con precisión: una entrevista real con una vendedora, más observación de campo acompañándola a varios bazares. Es evidencia de primera mano, y es poca — una vendedora no es un mercado. Saber si esto se generaliza es parte de lo que el piloto tiene que contestar, no algo que ya demos por contestado. | How solid is this, stated precisely: one real interview with a *bazar* vendor, plus field observation accompanying her at several *bazares*. That is first-hand evidence, and it is thin — one merchant is not a market. Whether it generalizes is part of what the pilot has to answer, not something we treat as already answered. | **Real** · `company/market-validation.md` §1a (observación de campo) + Core thesis (entrevista). H1 sigue siendo hipótesis abierta en `market-validation.md` §1 |

**Nota para `ui-designer` — importante, no cosmética.** `problem.learned` **no es una cita textual de la vendedora**. Es un aprendizaje parafraseado y atribuido como tal, que es exactamente la forma que `brand/storytelling.md` autoriza hoy (§"The About-surface carve-out": la copia actual *parafrasea* a Ana, y obtener sus palabras reales con su consentimiento es una pregunta **abierta** para la Product Owner). Por eso: **no lo maquetes con comillas tipográficas, ni con foto, ni con nombre, ni con nada que implique que una persona dijo esas palabras.** Un *pull statement* atribuido al aprendizaje sí; un testimonio no.

**Nota de reseña anticipada — "más de unos segundos" / "more than a few seconds" en `problem.learned` no es una promesa de latencia.** Describe la restricción del puesto (de dónde viene el problema), no el desempeño de Nahui, y es la tesis central tal como está registrada en `company/CLAUDE.md`. La página en ningún lugar afirma cuánto tarda Nahui — eso es precisamente lo que `today.bar` declara sin medir. Si una revisión posterior quiere tocar esta línea, la pregunta correcta es si el sujeto de la frase es el bazar o el producto: aquí es el bazar.

### 4.3 Qué existe hoy — "¿Hay producto o hay una presentación?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `today.title` | Qué existe hoy | What exists today | — |
| `today.lead` | Esto no es una maqueta ni un video. Es la app que corre en nahui.app, en producción, con dos negocios reales dados de alta. | This is not a mockup and not a video. It is the app running at nahui.app, in production, with two real businesses set up on it. | **Real** · `bitacora.md` 2026-09-21/23 (recorrido en producción, cuenta y dispositivo reales); cifra per §10.2 |
| `today.item1.title` | Inventario | Inventario (inventory) | **Real** |
| `today.item1.body` | Registrar la mercancía cuando llega, con precio y foto por producto. | Registering merchandise as it arrives, with a price and a photo per product. | **Real** · construido, `02c-high-fidelity-prototype/README.md`; `decision-log.md` D54 |
| `today.item2.title` | Eventos | Eventos (events) | **Real** |
| `today.item2.body` | Preparar un bazar: cuándo, dónde, y qué mercancía se lleva a ese evento. | Setting up a *bazar*: when, where, and which merchandise goes to that event. | **Real** · construido (Eventos + asignación de mercancía por evento) |
| `today.item3.title` | Venta con botones | Selling with buttons | **Real** |
| `today.item3.body` | Un toque por producto, sin escribir nada. | One tap per product, with nothing to type. | **Real** · construido |
| `today.item4.title` | Venta con código de barras | Selling by barcode | **Real** |
| `today.item4.body` | La cámara del celular lee el código que el producto ya trae de fábrica. Sin base de datos externa: solo los códigos que la vendedora misma dio de alta. | The phone camera reads the barcode the product already came with. No external database: only the codes the merchant registered herself. | **Real** · `decision-log.md` D65 (incluye el límite explícito de alcance); construido |
| `today.item5.title` | Venta con etiquetas NFC | Selling with NFC tags | **Real** |
| `today.item5.body` | Una etiqueta por pieza. Acercarla al teléfono identifica exactamente qué se vendió. | One tag per item. Held to the phone, it identifies exactly which item sold. | **Real** · construido; `decision-log.md` D79 |
| `today.item6.title` | Resultados | Resultados (her results view) | **Real** |
| `today.item6.body` | Qué se vendió, en qué bazar le fue mejor, qué queda. | What sold, which *bazar* went better, what's left. | **Real** · construido |
| `today.item7.title` | Exportar | Exportar (export) | **Real** |
| `today.item7.body` | Las ventas de un rango de fechas, en un archivo que se abre en Excel. | Sales for a date range, in a file that opens in Excel. | **Real** · construido (`.xlsx`, corregido desde CSV el 2026-09-15 tras prueba en el teléfono de la Product Owner) |
| `today.item8.title` | Equipo | Equipo (team) | **Real** |
| `today.item8.body` | Invitar a alguien de confianza para que venda con su propio acceso, en el mismo evento o en otro al mismo tiempo. | A merchant can invite someone she trusts to sell with her own access — at the same event, or at another one at the same time. | **Real** · construido; `decision-log.md` D53, RFC 0007/0013 |
| `today.notYet` | Lo que todavía no: Nahui no cobra pagos y no recomienda a qué bazar ir. Lo primero es una decisión deliberada de alcance. Lo segundo necesita datos de muchas vendedoras que hoy no existen, así que no se construye. | What it doesn't do yet: Nahui doesn't process payments, and it doesn't recommend which *bazar* to attend. The first is a deliberate scope decision. The second needs data from many merchants that doesn't exist yet, so it isn't being built. | **Real** · `company/CLAUDE.md` "Non-goals right now"; `backlog.md` #3 |
| `today.bar` | Y la parte incómoda, porque es la que importa: el registro de ventas tiene una barra escrita desde el principio — que se registre al menos 9 de cada 10 ventas, y que registrar una tome menos de 3 segundos. Es un requisito de diseño, no un resultado medido, y hoy sigue sin cumplirse. Medirlo necesita uso real sostenido, que es exactamente lo que el piloto todavía no tiene. | And the uncomfortable part, because it is the one that matters: sale registration has had a bar written against it from the start — at least 9 out of every 10 sales recorded, and under 3 seconds to record one. That is a design requirement, not a measured result, and today it is still unmet. Measuring it needs sustained real usage, which is exactly what the pilot doesn't have yet. | **Real** · `company/backlog.md` #1, verbatim: ">=90% of sales registered, <3 sec per registration", explícitamente sin cumplir; `architecture-principles.md` #2 (los <3 s son requisito de diseño) |

**`today.bar` es la línea que sustituye cualquier tentación de decir "en segundos".** No existe una sola medición de latencia en el repositorio; se buscó a propósito. Si alguien en una revisión posterior propone recuperar una promesa de velocidad, esta línea es la respuesta y es mejor para el lector que la promesa.

**Nota de registro para los títulos de esta sección.** `today.item1/2/6/7/8.title` son **etiquetas que la app muestra en pantalla**, no descripciones: se quedan en español en la versión inglesa, con una glosa entre paréntesis, per `brand/tone-of-voice.md` ("Where the English names something on screen, keep her word and gloss it"). Los tres modos de venta (`item3/4/5`) **no** son etiquetas de pantalla — son descripciones de capacidad — así que esos sí van en inglés en la versión inglesa. La distinción es deliberada; no la uniformes en una pasada de estilo.

### 4.4 Lo que las vendedoras cambiaron — "¿este equipo aprende de usuarios reales?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `changed.title` | Lo que las vendedoras ya cambiaron del producto | What merchants have already changed in the product | — |
| `changed.lead` | Tres veces, algo que dijo una vendedora real se volvió una decisión de producto fechada, con su razón escrita, y se construyó. No es una encuesta: es el producto cambiando porque alguien lo usó. | Three times, something a real merchant said became a dated product decision with its reasoning written down, and then got built. This isn't a survey result: it's the product changing because someone used it. | **Real** · los tres casos están listados abajo, cada uno con fecha y con su entrada en el registro de decisiones |
| `changed.item1.title` | Una foto por producto | A photo per product | **Real** |
| `changed.item1.body` | Dos de las primeras personas que la probaron lo pidieron, por separado, el 5 de septiembre de 2026. Esa semana se volvió decisión de dominio. Está construida. | Two of the earliest people who tried it asked for this, independently of each other, on 5 September 2026. That same week it became a domain decision. It is built. | **Real** · `decision-log.md` D54, verbatim: "2 of the earliest respondents independently asking for a photo per catalog item, 2026-09-05". *Corregido 2026-10-08: antes decía "dos personas del piloto", que infería que ambas eran del piloto; D54 dice "earliest respondents"* |
| `changed.item2.title` | Leer el código de barras | Reading the barcode | **Real** |
| `changed.item2.body` | Una persona que vende juguetes — mercancía que ya trae código impreso de fábrica — pidió que Nahui lo leyera. Se decidió el 13 de septiembre de 2026, con un límite puesto desde el principio: sin base de datos externa, porque para mercancía de bazar la cobertura no es confiable y el nombre que devolvería no sería el suyo. Está construido. | Someone who sells toys — merchandise that already carries a manufacturer barcode — asked that Nahui read the code. Decided on 13 September 2026, with a limit set upfront: no external lookup database, because coverage is unreliable for *bazar* merchandise and the name it would return wouldn't be hers. It is built. | **Real** · `decision-log.md` D65 (fecha y razonamiento de alcance, verbatim). *Corregido 2026-10-08: antes decía que esta persona "probó Nahui y pidió"; D65 no dice que la haya probado, solo que lo pidió* |
| `changed.item3.title` | Nos buscó ella | She reached out to us | **Real** |
| `changed.item3.body` | El 3 de septiembre de 2026 una vendedora buscó a Nahui por su cuenta, después de probarla. Nadie le escribió. Le servía, y necesitaba algo que no teníamos: que varias personas pudieran vender en el mismo puesto a la vez, cada una con su propio acceso. Eso ya está en el producto. Otras partes de lo que pidió siguen sin construirse. | On 3 September 2026 a merchant contacted Nahui on her own, after trying it. Nobody messaged her first. It was useful to her, and she needed something we didn't have: several people selling at the same stand at once, each with their own access. That part is now in the product. Other parts of what she asked for are still not built. | **Real** · `company/backlog.md` §Product Discovery, verbatim: "Source: unsolicited real-merchant feedback (2026-09-03). A prospective merchant contacted the Product Owner directly after trying Nahui"; construido vía `product-decisions.md` Q24/Q25 |
| `changed.note` | Las tres están en el registro público de decisiones del proyecto, con fecha y con la razón escrita. No hay que creérnoslo: se puede leer. | All three are in the project's public decision log, dated, with the reasoning written out. Nobody has to take our word for it — the log can be read. | **Real** · repositorio público, `github.com/claudiafalcon/nahui`. **Sujeto a §8.2** |

**Nota de privacidad, vinculante (BRIEF §5).** Ninguno de estos tres párrafos nombra a la vendedora, su negocio, su surtido, su zona, su edad ni los bazares donde vende. "Una vendedora", "una persona que vende juguetes", "dos de las primeras personas que la probaron" es todo lo que se dice de ellas, y la única cosa específica es la fecha. Una futura revisión no debe "fortalecer" esta sección agregando detalle de persona: su surtido exacto más su zona la vuelven identificable en su comunidad aunque no se diga su nombre. El único detalle de mercancía que aparece ("juguetes") viene de una persona distinta a la vendedora del piloto, y es lo que hace comprensible la decisión del código de barras — si la Product Owner prefiere quitarlo también, el párrafo funciona diciendo "alguien que vende mercancía que ya trae código de fábrica".

### 4.5 Cómo va — "¿puedo confiar en lo que me dicen?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `status.title` | Cómo va | How it's going | — |
| `status.lead` | En piloto, aprendiendo. | In pilot, learning. | **Real** · BRIEF §4 |
| `status.body1` | Lo que ya sabemos: el producto funciona y se sostiene en producción. Eso está probado en el campo, en el teléfono de una vendedora, no en una laptop de desarrollo. | What we already know: the product works, and it holds up in production. That has been checked in the field, on a merchant's own phone, not on a developer's laptop. | **Real** · `bitacora.md` 2026-09-21/23 (recorrido en producción, cuenta y dispositivo reales) |
| `status.body2` | Lo que no sabemos todavía, y es la pregunta real: la adopción. Que una app funcione y que entre en la rutina de alguien que ya tiene su forma de trabajar son dos cosas distintas, y la segunda no se resuelve construyendo mejor. Esa es la que estamos aprendiendo ahora. | What we don't know yet, and it is the real question: adoption. An app working and an app becoming part of the routine of someone who already has her own way of working are two different things, and the second one isn't solved by building better. That is the one we are learning now. | **Real** · `bitacora.md` 2026-09-21/23 ("the first honest adoption read Nahui has had, and it is not a technical one: the product was up the whole time") |
| `status.body3` | Para que quede claro de una vez: Nahui no tiene ingresos, no tiene números de crecimiento y no tiene una cifra de adopción que presentar. Si los tuviéramos, estarían en esta página. | To be plain about it: Nahui has no revenue, no growth numbers, and no adoption figure to show. If we had them, they would be on this page. | **Real** · no existen en el repositorio |
| `status.body4` | Lo que sí hay es un piloto chico con dos negocios reales, un problema que salió de una persona y no de una suposición, y un ciclo que ya demostró cerrar: una vendedora dice algo, se vuelve una decisión fechada, se construye. | What there is: a small pilot with two real businesses, a problem that came from a person rather than an assumption, and a loop that has already demonstrably closed — a merchant says something, it becomes a dated decision, it gets built. | **Real** · cifra per §10.2 |

**`status.body3` quedó palabra por palabra como estaba.** `brand-guardian` lo revisó como una de las tres líneas más expuestas de la página y no pidió cambiarlo. Es la aplicación literal de la "regla de números" del registro de inversionista: una cifra solo aparece si se puede contar desde una fuente verificable, y donde no hay cifra se dice que no hay.

**Lo que esta sección deliberadamente NO dice** (BRIEF §4, el "honesto difícil"): no detalla negocio por negocio el estado de adopción de las vendedoras del piloto — que al 2026-09-21/23 estaban trancadas o enfriadas mientras el producto funcionaba. "En piloto, aprendiendo" es verdad y alcanza para esta página. Lo que sí hice fue asegurarme de que **nada en la página lo contradiga**: `status.body2` nombra la adopción como la pregunta abierta, `status.body3` niega explícitamente tener una cifra de adopción, y en ningún lugar de la página se dice que las vendedoras del piloto *estén usando* Nahui hoy — se dice que hay dos negocios reales **dados de alta en producción**, que es lo que es verdad. Esa distinción es intencional en `today.lead` y en `hero.lead`, **y está igual de intencional en los dos idiomas**; por favor no se "simplifique" a "vendedoras usando Nahui" en una revisión de estilo, en ninguno de los dos.

*Corregido 2026-10-08: esta nota antes decía "dos de tres vendedoras del piloto", citando `BRIEF.md` §4. La Product Owner confirmó que el piloto son **dos** negocios, no tres, así que "dos de tres" no puede ser correcto y no se repite aquí. `BRIEF.md` §4 todavía trae la cifra vieja; está fuera de la propiedad de `marketing` y queda reportado para ruteo (§10.2).*

### 4.6 Cómo está construido — "¿por qué este proyecto y no otro, y quién está detrás?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `built.title` | Cómo está construido | How it's built | — |
| `built.lead` | Nahui la construye Claudia Falcón, desde México, con un equipo de agentes de IA con roles separados — producto, arquitectura, UX, revisión, marca. Ella decide qué se construye, en qué orden y qué se descarta; los agentes proponen, construyen y se revisan entre sí. Lo interesante no es la herramienta: es que el método deja rastro. | Nahui is built by Claudia Falcón, in Mexico, with a team of AI agents in separate roles — product, architecture, UX, review, brand. She decides what gets built, in what order, and what gets dropped; the agents propose, build, and review each other's work. The interesting part isn't the tooling: it's that the method leaves a trail. | **Real** · `company/CLAUDE.md` §How we operate; `.claude/agents/`. Nombre en la página aprobado por la Product Owner el 2026-10-08, junto con el enlace al repositorio; **forma escrita pendiente de su confirmación, ver §8.13** |
| `built.item1.title` | Registro de decisiones | Decision log | **Real** |
| `built.item1.body` | Cada decisión de producto queda escrita, fechada y con su razón — incluyendo las que después se revocaron, que no se borran. Hoy son más de 80. | Every product decision is written down, dated, and reasoned — including the ones later reversed, which are never deleted. There are more than 80 of them today. | **Calculado** · 84 entradas contadas directamente en `product/00-foundation/decision-log.md` al 2026-10-08 (§10.2). Se dice "más de 80" a propósito, para que la cifra no envejezca hacia abajo |
| `built.item2.title` | RFCs | RFCs | **Real** |
| `built.item2.body` | Un cambio al modelo del negocio no se hace y luego se documenta. Se propone por escrito, se discute y se acepta antes de tocar nada. | A change to the product's model of the business doesn't get made and then documented. It gets proposed in writing, argued, and accepted before anything is touched. | **Real** · `product/99-rfc/` (18 RFCs numerados al 2026-10-08, §10.2); regla en `global-principles.md` |
| `built.item3.title` | Revisión por especialistas | Specialist review | **Real** |
| `built.item3.body` | Cada entrega pasa por revisión de UX, por revisión de consistencia contra la base del producto, y por un recorrido completo de la app hecho por un agente que actúa como una vendedora que la ve por primera vez. Ese agente es un agente, no una vendedora real: corre antes de que una persona real vea algo, precisamente para no gastarle su tiempo en errores que podíamos encontrar nosotros. | Every deliverable goes through a UX review, a consistency review against the product foundation, and a full walkthrough of the app by an agent acting as a merchant seeing it for the first time. That agent is an agent, not a real merchant: it runs *before* any real person sees anything, precisely so we don't spend her time on problems we could have caught ourselves. | **Real** · `.claude/agents/merchant-user-tester.md`; `company/CLAUDE.md` §Experience Validation |
| `built.item4.title` | Bitácora | Bitácora (the project log) | **Real** |
| `built.item4.body` | La historia del proyecto en un solo lugar: qué pasó, por qué importó y dónde está el detalle completo. | The project's history in one place: what happened, why it mattered, and where the full detail lives. | **Real** · `company/bitacora.md` |
| `built.item5.title` | Todo esto es auditable | All of this is auditable | **Real** |
| `built.item5.body` | El repositorio es público. El registro de decisiones, los RFCs, los hallazgos de las revisiones y la bitácora están ahí, con su historia de cambios. Lo que esta página afirma sobre el método se puede verificar sin pedirnos permiso. | The repository is public. The decision log, the RFCs, the review findings and the project log are all in it, with their edit history. What this page claims about the method can be verified without asking us for access. | **Real** · `github.com/claudiafalcon/nahui`, confirmado público el 2026-10-08. **Enlace aprobado por la Product Owner el 2026-10-08, condicionado — ver §8.2** |
| `built.lab` | Hay un segundo objetivo declarado, además del comercial: que Nahui sea también un laboratorio real de ingeniería de IA — memoria de largo plazo, colaboración entre agentes, orquestación, gobernanza. Está escrito como directiva de la empresa, con su propio cuaderno de decisiones, y con una regla explícita: nunca meter IA en una función donde no le dé valor a la vendedora. | There's a second stated objective alongside the commercial one: that Nahui also be a real laboratory for AI engineering — long-term memory, multi-agent collaboration, orchestration, governance. It is written down as a company directive, with its own decision notebook, and with an explicit rule attached: never force AI into a feature where it gives the merchant no value. | **Real** · `company/CLAUDE.md` §Secondary strategic objective; `company/ai-lab-decisions.md`; `architecture-principles.md` #8 |
| `built.repoLink` | Ver el repositorio | View the repository | — · §8.2 |

**Sobre nombrar a la Product Owner, y cómo quedó escrito.** La decisión es suya (2026-10-08) y va emparejada con el enlace al repositorio: el enlace ya expone el nombre (`github.com/claudiafalcon/nahui`), así que una página que lo evita mientras enlaza ese repositorio no es privada, nada más es inconsistente, y un evaluador que da clic lo nota. La única restricción que `brand-guardian` puso para este caso es de registro: **factual, nunca un mito de fundadora** — qué construyó, qué decide, por qué. Por eso `built.lead` dice lo que ella hace (decide qué se construye, en qué orden y qué se descarta) y nada sobre su camino, su motivación ni su historia. Una línea alcanza: no hay sección de fundadora, no hay foto, no hay biografía.

**Sobre la persona gramatical en esta sección.** `built.lead` pasó de "la construimos" a nombrarla, porque ya hay a quién nombrar y el registro pide que, si se la nombra, sea factual. El "nosotros" de autoría e incertidumbre sigue vivo donde le corresponde — `problem.learnedBy` ("lo que aprendimos") y `status.body1/2/3` ("lo que ya sabemos", "lo que no sabemos todavía") — que es exactamente lo que la regla protege: el "nosotros" es de autoría y de incertidumbre, nunca de destino. Por la misma regla, "no sabemos todavía" nunca se escribe como "Nahui no sabe": eso arrastraría el personaje acompañante a una superficie que no es suya.

### 4.7 Lo que sigue — "¿a dónde va?"

Esta sección aplica el *roadmap-honesty pattern* de `brand/storytelling.md` (**Decision**): nada sin construir se describe en tiempo presente, y cada cosa lleva su etiqueta. **Guardarraíl que hereda:** una etiqueta se corrige el día que la realidad cambia, en cualquier dirección. Una etiqueta vieja convierte el patrón en lo contrario de lo que es. **Y, añadido 2026-10-08 para superficies bilingües:** las etiquetas son parte de la afirmación, no decoración — cada ítem lleva su equivalente en los dos idiomas, y un ítem etiquetado como futuro en un idioma y presente en el otro es el defecto más grave que esta página puede publicar.

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
| `next.item2.body` | Distinguir a quien compra poquito pero en cada bazar de quien compra mucho pero una vez al año. Hoy una vendedora no tiene con qué saberlo: sus clientas la siguen por redes, no por nombre. Está diseñado y especificado; su construcción va después del registro de ventas, no antes. | Telling apart the customer who buys a little at every *bazar* from the one who buys a lot once a year. Today a merchant has nothing to tell them apart with: her customers follow her on social media, not by name. It is designed and specified; building it comes after sale registration, not before. | **Real** para el problema (`company/CLAUDE.md`, tercera fricción validada) y para el estado de diseño; **Proyectado** para la capacidad · `backlog.md` #2 · etiqueta `next.tag.progress` |
| `next.item3.title` | A qué bazar conviene ir | Which *bazar* is worth attending | **Proyectado** |
| `next.item3.body` | Hoy esa decisión se toma sin datos: sin afluencia, sin clima, y con costos de entrada que van de un par de miles a varios miles de pesos por evento, según el bazar. Resolverlo necesita datos de muchas vendedoras, y Nahui todavía no los tiene. Por eso no se está construyendo: se construiría sobre nada. | Today that decision gets made with no data: no footfall, no weather, and entry costs running from a couple of thousand to several thousand pesos per event, depending on the *bazar*. Solving it needs data from many merchants, and Nahui doesn't have that yet. So it isn't being built — it would be built on nothing. | **Real** para la fricción y para el rango de costos (`market-validation.md` §1d, observación de primera mano, informal); **Proyectado** para la capacidad · `backlog.md` #3 · etiqueta `next.tag.hold` |

**Sobre el rango de costos en `next.item3.body` — corregido 2026-10-08, y vale explicar por qué.** La fuente son las cifras por evento registradas en `company/market-validation.md` §1d. Esta línea antes decía "de unos cientos a varios miles de pesos": **el extremo bajo no tenía fuente** — ninguna observación registra un evento de unos cientos de pesos. "De un par de miles a varios miles" sí corresponde a lo observado. El error era hacia abajo, no hacia arriba, y aun así es el mismo defecto: una cifra que nadie midió. En la página **no** van las cifras exactas ni los nombres de los recintos — nombre de recinto más surtido vuelven identificable a la vendedora del piloto (BRIEF §5). *Corregido también 2026-10-08: esta nota antes repetía las dos cifras exactas aquí mismo. Como este archivo vive en un repositorio público que esta misma página va a enlazar, repetirlas aquí anulaba el propósito de no publicarlas — ahora se apunta a la fuente en lugar de reproducirlas.* Si la Product Owner prefiere quitar el rango por completo, la frase se sostiene sin él.

**Nota de registro sobre `next.item3.body`:** dice "esa decisión se toma sin datos", no "se decide a ciegas". Lo que falta es el dato, no la vista de la vendedora — la diferencia es exactamente la que `brand/tone-of-voice.md` marca entre una carencia de herramienta (permitida, es un hecho sobre la herramienta) y un juicio sobre la persona (prohibido). Misma regla en `next.item2.body`: "no tiene con qué saberlo" describe la falta de herramienta, no una falta de ella.

**Lo que explícitamente NO va en esta sección:** "De la foto a tu inventario". No está en `backlog.md`, no es una decisión de Nahui, y la versión anterior de la página la anunciaba como comprometida (BRIEF §4). Grepeé el repositorio completo: solo existe en ese archivo. No va en esta página en ningún encuadre, ni como "En camino", ni como idea, ni como ejemplo. `brand/storytelling.md` lo confirma por escrito desde el 2026-10-08.

### 4.8 Contacto — "¿y ahora qué?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `cta.title` | Para quien evalúa proyectos en esta etapa | For anyone evaluating projects at this stage | — |
| `cta.lead` | Nahui está en piloto y en una etapa en la que platicar sirve más que presentar. Quien evalúe proyectos así, o tenga interés en lo que estamos aprendiendo del piloto, puede escribirnos a ihola@nahui.app. | Nahui is in pilot, at a stage where a conversation is worth more than a pitch. Anyone who evaluates projects at this stage, or who is interested in what we are learning from the pilot, can write to us at ihola@nahui.app. | **Real** · dirección confirmada por la Product Owner el 2026-10-08 · ver §8.5 (variante alterna si quiere declarar que está buscando inversión) y §8.1 (bandera de entrega de correo) |
| `cta.contact` | Escribir a ihola@nahui.app | Write to ihola@nahui.app | — · `mailto:ihola@nahui.app` · §8.1 |
| `cta.product` | Ver la app | Open the app | — |
| `cta.productNote` | Es la app real, en producción. Pide una cuenta para entrar: no es un demo. | This is the real app, in production. It asks for a sign-in: it isn't a demo. | **Real** · `www.nahui.app` sirve la app real; `demo.nahui.app` sirve un build retirado y no se enlaza (BRIEF §6, `decision-log.md` D61) |
| `cta.repo` | Leer cómo se construyó | Read how it was built | — · §8.2 |

**Nota de registro, vinculante para `ui-designer`: en español esta página no le habla de tú al lector, ni en los CTAs.** `brand/tone-of-voice.md` lo dice en esos términos: el "tú" acompañante es de la vendedora, y prestarlo para convencer a un tercero gasta su relación en una decisión que no es suya. Por eso los CTAs van en infinitivo ("Escribir a…", "Ver la app", "Leer cómo se construyó") y no en imperativo íntimo ("Escríbenos", "Pruébala"), y por eso `cta.title`/`cta.lead` son impersonales ("para quien evalúa…") y no "si esto te interesa". No es timidez: la carve-out de CTAs sigue en pie — nombrar una función que el visitante elige está bien; pedirle prestado el registro familiar de la vendedora para hacerlo es lo que queda fuera.

### 4.9 Pie

| ID | Español | English | Evidencia |
|---|---|---|---|
| `foot.made` | © 2026 Nahui · Hecho en México | © 2026 Nahui · Made in Mexico | **Real** |
| `foot.stage` | Proyecto en piloto. Esta página se actualiza cuando cambia el estado, no cuando conviene. | A project in pilot. This page gets updated when the status changes, not when it is convenient. | **Real** — y es una promesa operativa: si se publica, alguien tiene que mantenerla. Ver §8.8 |
| `foot.privacy` | Aviso de privacidad | Privacy notice (in Spanish) | — · **destino pendiente, §8.3** |
| `foot.repo` | Repositorio público | Public repository | — · §8.2 |

**Sobre "(in Spanish)" en `foot.privacy`:** es la única asimetría declarada entre los dos idiomas, y es un hecho, no una afirmación más débil — el aviso solo existe en español. Declararlo es más honesto que ofrecer un enlace que el lector inglés no espera. Si alguna vez existe una versión inglesa del aviso, esta glosa se borra el mismo día.

**El tagline no se repite en el pie.** Va una sola vez, en el lockup del hero (§4.1). Repetirlo abajo lo convertiría en eslogan.

---

## 5. CTAs — qué hace cada uno y a dónde apunta

| CTA | Dónde aparece | Qué hace | Destino | Estado |
|---|---|---|---|---|
| **Primario — `cta.contact`** "Escribir a ihola@nahui.app" / "Write to ihola@nahui.app" | Hero y sección de contacto (mismo string, mismo destino, no dos CTAs distintos) | Abre el correo del lector con el destinatario puesto | `mailto:ihola@nahui.app` | 🟢 **Desbloqueado.** Dirección confirmada por la Product Owner el 2026-10-08 (nótese la **i** inicial: `ihola@`, no `hola@` — `company/marketing-operating-environment.md` §1 proponía la segunda; la real es la primera). **Bandera, no bloqueo:** no verifiqué que el buzón reciba correo, y no puedo hacerlo sin enviarle un mensaje, que sería ejecución. Conviene una prueba de entrega antes de publicar. Ver §8.1 |
| **Secundario — `cta.product`** "Ver la app" / "Open the app" | Hero y sección de contacto | Abre la app real en una pestaña nueva | `https://www.nahui.app` | 🟢 Verificado vivo el 2026-10-08 (responde, título "Nahui — Hoy"). **Siempre acompañado de `cta.productNote`**, para que nadie llegue esperando un demo y se sienta engañado |
| **Terciario — `cta.repo` / `foot.repo` / `built.repoLink`** | Sección "Cómo está construido" y pie | Abre el repositorio público | `https://github.com/claudiafalcon/nahui` | 🟢 **Aprobado el 2026-10-08, condicionado.** Verificado público (465 commits, etiqueta "Public" — verificación de Main vía `gh repo view`). La condición de la Product Owner: **no se publica hasta que la pasada de privacidad esté aterrizada.** Estado exacto en §8.2 |
| **Pie — `foot.privacy`** | Pie | Abre el aviso de privacidad | **sin resolver** | 🔴 **Bloqueado.** El aviso de la versión anterior vivía en `demo.nahui.app/aviso-de-privacidad.html`, y `demo.nahui.app` no se enlaza (BRIEF §6). No hay copia en el repositorio. Ver §8.3 |
| *(No incluido)* Facebook | — | — | `facebook.com/NahuiApp` | ⛔ **No lo incluí.** No pude verificar que la Página exista públicamente: Facebook devuelve a una petición no autenticada solo un cascarón con el título. `company/facebook-page-setup.md` es un plan de alta, no un registro de que esté creada. Enlazar una Página que no existe, en una página para inversionistas, es exactamente el tipo de detalle que descuenta todo lo demás. Ver §8.4 |

**Prohibiciones duras de enlace, heredadas del BRIEF §6:**
- Ningún enlace, en ningún idioma, en ningún lugar de la página, apunta a `demo.nahui.app` — sirve un build retirado (D61) y truena en `/invite/`.
- No se toca DNS: ni raíz, ni `www`, ni `demo`, ni `loyalty`. Hay vendedoras reales en producción detrás de esos dominios.

---

## 6. Notas de implementación para `ui-designer` (contenido, no layout)

1. **El español va en el HTML.** Las 2 versiones existen como contenido real; el script solo intercambia. La página tiene que leerse completa sin JavaScript, en español. Esto es una restricción de contenido, no solo técnica: la versión anterior mostraba cero palabras sin JS (BRIEF §6).
2. **El inglés es una versión completa, no un resumen.** Es la única versión que la evaluadora va a leer. Si una sección existe en español, existe en inglés con el mismo peso, en el mismo orden, con la misma etiqueta de evidencia y con la misma fuerza de afirmación. **Ninguna de las dos matiza donde la otra afirma, y ninguna cifra cambia entre idiomas.** No hay strings que existan solo en español, con una excepción deliberada: el texto **dentro** del celular del hero, que se queda en español en ambos idiomas, con `hero.captionPhone` explicándolo.
3. **El celular del hero muestra el producto real.** No un render inventado, no números falsos (BRIEF §6). Y, vinculante por privacidad: **el surtido que se vea en pantalla usa el mapa de sustitución aprobado por la Product Owner el 2026-08-10 — Bolsas, Accesorios, Playeras, Gorras — nunca el surtido real de la vendedora del piloto.** Ese mapa se decidió para una superficie *menos* pública que esta; aquí aplica con más fuerza. Si la captura que usas trae datos reales, no se "difumina": se vuelve a generar con el surtido sustituto.
4. **Jerarquía de secciones, si hay que recortar para el 15 de octubre.** Si la versión completa no alcanza, el mínimo publicable que sigue siendo honesto y que sigue sirviendo al entregable del curso es: Hero + El problema + Qué existe hoy + Cómo va + pie. En ese orden. **"Cómo va" no se recorta** — una página sin ella deja de ser esta página. Lo recortable es "Cómo está construido", "Lo que sigue" y "Lo que las vendedoras cambiaron", en ese orden de último a primero. **Si se recorta una sección, se recorta en los dos idiomas** — recortarla en uno solo es exactamente el defecto bilingüe que §4.7 llama el más grave. *Excepción: si se recorta "Cómo está construido", el nombre de la Product Owner (`built.lead`) se mueve al pie — no desaparece, porque el enlace al repositorio sigue enlazado y la página quedaría inconsistente (§4.6).*
5. **Nada numérico decorativo.** Sin contadores, sin barras de progreso, sin "99%", sin métricas inventadas de relleno. Las únicas cifras de la página son las de §10.2, todas con fuente verificada: "más de 80" decisiones, "9 de cada 10 / 3 segundos" (la barra incumplida), "dos negocios", tres fechas de 2026, y el rango de costos de evento.
6. **`problem.learned` no se maqueta como testimonio.** Ver la nota al pie de §4.2.
7. **Tres cosas se quedan en español dentro de la versión inglesa**, per `brand/tone-of-voice.md` §"Spanish and English":
   - *Nahui*, siempre.
   - *bazar* / *bazares*, nunca "bazaar" — la palabra inglesa nombra otra cosa para un lector no mexicano. Se glosa **una sola vez**, en `hero.lead` ("the recurring, private pop-up markets where they sell"), y de ahí en adelante va sola y en cursivas.
   - Las etiquetas que la app muestra en pantalla (Inventario, Eventos, Resultados, Exportar, Equipo, Bitácora), con glosa entre paréntesis la primera vez que aparecen. Las descripciones de capacidad que **no** son etiquetas de pantalla (los tres modos de venta) sí van en inglés.
8. **Ningún "tú" al lector en español, en ningún string, incluidos los CTAs.** Es grepeable: buscar `tu `, `tus `, `te `, `ti`, `tuyo`, `registras`, `escríbenos`, `pruébala`, y en inglés `your`, `you`. Si aparece alguno en el HTML final, es un defecto de clase Blocker, no una preferencia de estilo — ver §10.
9. **El inglés no se escribe con sintaxis de español, y el español no se escribe con sintaxis de deck en inglés.** Cada versión se redactó en su propio idioma desde la misma lista de afirmaciones. Si en una revisión posterior hay que cambiar una afirmación, se cambia en las dos columnas en la misma pasada, nunca en una sola.
10. **El tagline (`brand.tagline`) va en inglés en las dos versiones, una sola vez, en el lockup del hero, subordinado tipográficamente al titular.** No se traduce, no se repite en el pie, no se pone al peso de un titular. Es parte del nombre, no una promesa (§4.1).

---

## 7. Omisiones deliberadas — qué NO va en la página, para que nadie lo agregue después

### 7.1 Tamaño de mercado / TAM — omitido a propósito

Busqué una cifra citable para el segmento real de Nahui (vendedoras itinerantes de bazar privado en México) y **no existe una**. Lo que sí hay son cifras de informalidad del INEGI: ~33 millones de personas en informalidad laboral a diciembre de 2025 (54.6% de la población ocupada), 12.4 millones de personas ocupadas en comercio en general, 16.8 millones en empleo informal en la economía informal. Las tres describen poblaciones **órdenes de magnitud más grandes y estructuralmente distintas** del segmento de Nahui, y ninguna se puede recortar honestamente hasta él.

Poner "33 millones" en una página de Nahui sería un TAM inflado por sustitución: exactamente la clase de afirmación que, al descubrirse, descuenta todo lo demás que dice la página. Un inversionista que conozca el dato va a reconocer el movimiento. Hay además una segunda razón, de registro y no de exactitud: el vocabulario con el que se citan esas cifras ("informalidad", "no bancarizados", "sin acceso a") describe a una población como una carencia, y `brand/tone-of-voice.md` lo prohíbe explícitamente en cualquier superficie externa — una sección de mercado construida así sería el relato de rescate vestido de oportunidad. **Recomendación:** sin sección de mercado hasta que haya una estimación propia, construida y mostrada (p. ej., número de bazares privados recurrentes identificables en Edomex/CDMX × vendedoras por bazar), que se presentaría etiquetada **Calculado**, con el método a la vista, y descrita por el trabajo de la gente y no por lo que le falta. Es un trabajo de investigación real, no un párrafo; puedo prepararlo si la Product Owner lo quiere.

### 7.2 Lo demás que queda fuera, y por qué

| No va | Razón |
|---|---|
| "En segundos" / cualquier promesa de velocidad | No existe una sola medición de latencia en el repositorio. `today.bar` dice la verdad en su lugar, y es mejor copia |
| "Probamos cada paso con vendedoras reales" | La prueba por paso la corre `merchant-user-tester`, un agente de IA que por definición corre **antes** de que una vendedora real vea algo. `built.item3.body` lo dice tal cual. `brand/storytelling.md` lo corrigió por escrito el 2026-10-08 |
| Ingresos, crecimiento, tracción, número de usuarios activos | No existen. `status.body3` lo declara |
| "De la foto a tu inventario" | No es un elemento del roadmap de Nahui (BRIEF §4) |
| Nombre, negocio, surtido, zona, edad o bazares de la vendedora del piloto; nombres de recintos; las cifras exactas de costo de evento | BRIEF §5. Su surtido exacto más su zona la identifican en su comunidad. **Esto también aplica a este archivo**, no solo a la página: vive en el repositorio que la página va a enlazar (§4.7) |
| Cualquier cita atribuida a una vendedora real | Nadie ha dado su consentimiento para ser citada. `brand/storytelling.md` lo tiene como pregunta **abierta** para la Product Owner |
| Precios, planes, tiers (gratis/pago) | El modelo de negocio es direccional y no final (`company/CLAUDE.md`); `business-decisions.md` Q11 (ciclo de cobro) sigue abierta. Una página pública con precios los vuelve un compromiso |
| Headcount, biografías, "equipo" de personas, mito de fundadora | La Product Owner **sí** va nombrada (decisión 2026-10-08, §8.13), en una línea factual: qué construye y qué decide. Lo que no va es todo lo demás — no hay más personas que nombrar, y un arco de origen está explícitamente fuera de registro (`brand/tone-of-voice.md`) |
| Logos de clientes, testimonios, reseñas | No existen, y solicitarlos a esta altura sería prematuro (`facebook-page-setup.md` ya razonó esto para reseñas) |
| Los atributos y la promesa de marca de `company/brand/brand-guide.md` ("Human · Intelligent · Trustworthy · Simple · Connected…") | Son afirmaciones sobre cómo alguien percibe a Nahui — **Hypothesis** en el mejor de los casos, y `brand/CLAUDE.md` las marcó el 2026-10-08 como no publicables en una superficie externa como lo que Nahui *es* para nadie. Sirven de dirección interna; no son copy |
| Las lecturas del símbolo ("una brújula", "una persona con los brazos abiertos", "memorable") | **Hypothesis**, y `brand/visual-language.md` extendió su prohibición a cualquier superficie externa el 2026-10-08. El símbolo se muestra; no se interpreta |
| Comparaciones con competidores | No hay análisis competitivo verificado en el repositorio. Una comparación sin fuente es una afirmación sobre un tercero |

*Nota: el tagline salió de esta tabla el 2026-10-08. Estuvo fuera mientras su estatus estaba abierto; la Product Owner lo aprobó y ahora está en §4.1.*

---

## 8. Decisiones de la Product Owner — todas tomadas al 2026-10-08

**La numeración no se reacomoda**: los puntos resueltos se marcan como resueltos y se quedan en su lugar, para que una referencia anterior siga encontrando lo que buscaba. **No queda ninguna decisión de contenido abierta.** Lo que queda son dos verificaciones que pido explícitamente (§8.1 y §8.13) y un bloqueo de infraestructura (§8.3).

**🟢 Resueltas**

1. **Dirección de contacto — RESUELTA.** `ihola@nahui.app` (con la **i** inicial), confirmada por la Product Owner el 2026-10-08. Escrita en `cta.contact` y `cta.lead`; sustituye la propuesta `hola@nahui.app` de `company/marketing-operating-environment.md` §1, que era un plan, no la dirección real. **Bandera que dejo levantada, sin retener la dirección:** no verifiqué que el buzón reciba correo — comprobarlo exige enviarle un mensaje, y eso es ejecución, no investigación. Recomiendo una prueba de entrega antes de publicar, porque un `mailto:` que no llega es peor que no tener CTA de contacto.
2. **Enlace al repositorio — APROBADO, CONDICIONADO.** `https://github.com/claudiafalcon/nahui` (público, 465 commits, verificado por Main vía `gh repo view`). Es lo único en la página que convierte la afirmación de gobernanza en algo verificable en lugar de afirmado. **La condición: la pasada de privacidad aterriza primero.** Estado al 2026-10-08:
   - ✅ **`company/market-validation.md` — hecha.** Es el archivo que me corresponde y el que más exposición tenía: edad exacta generalizada al rango que la propia resolución del 2026-08-05 manda, nombres de recinto generalizados, surtido real generalizado, y un ejemplo de guion de entrevista reescrito — todo con nota fechada, sin borrar ningún hallazgo. Las cifras de costo por evento y el detalle de personal contratado se quedaron, con la razón escrita: son la evidencia de §1d.
   - ✅ **El nombre "Ana" no era exposición.** La Product Owner confirmó el 2026-10-08 que es un pseudónimo de la persona; el nombre real no aparece en ninguna parte, por diseño. Eso reduce la combinación identificable y fue motivo para *no* generalizar más de lo necesario.
   - ⚠️ **Fuera de mi propiedad, pendiente de ruteo:** `company/CLAUDE.md` (surtido real + zona), `company/jobs-to-be-done.md` y `product/00-foundation/decision-log.md` D33 (nombres de recinto y cifras exactas), más `BRIEF.md` §4 (cifra vieja del piloto). Lista completa en mi reporte a Main. **No se publica el enlace hasta que esos estén ruteados.**
3. **Destino del aviso de privacidad — SIGUE ABIERTA (infraestructura, no contenido).** El de la versión anterior vivía en `demo.nahui.app`, que no se enlaza. No hay copia en el repositorio. Si la página recoge cualquier dato (incluso un `mailto:`) conviene que exista. Opciones: hospedarlo junto a esta página, o quitar el enlace del pie en la primera versión. No publico un enlace muerto.
4. **¿Se incluye Facebook?** No pude verificar que `facebook.com/NahuiApp` exista públicamente (Facebook no sirve contenido a una petición no autenticada). Si la Página existe y está presentable, se puede agregar como CTA terciario; si no existe o está vacía, recomiendo omitirla — una Página vacía enlazada desde una página para inversionistas resta.
5. **¿Nahui está buscando inversión, y lo dice?** `cta.lead` como está escrito es honestamente ambiguo ("quien evalúe proyectos así"). Variante explícita, si la quiere: *"Nahui está en piloto y abierta a conversaciones de inversión temprana. Quien quiera tenerla, puede escribirnos a ihola@nahui.app."* / *"Nahui is in pilot and open to early-stage investment conversations. Anyone who'd like to have one can write to us at ihola@nahui.app."* No la puse por default porque es una afirmación sobre su intención, no mía.
6. **Registro de género en español (pregunta abierta de `brand/tone-of-voice.md`).** Esta página aplica provisionalmente la opción 4 (rodear la construcción) más género natural para personas reales. Si elige otra de las cuatro opciones, reescribo. La nota de ese documento aplica: **la regla que se adopte se aplica a la vez a las superficies internas y externas.** Mientras siga abierta, ninguna revisión de marca puede levantarlo como hallazgo.
7. **Tagline — RESUELTO Y EN LA PÁGINA.** *"The path to what's next"*, aprobado por la Product Owner el 2026-10-08, **en inglés en los dos idiomas** ("esa siempre va en inglés"). Colocado en el lockup del hero, subordinado al titular, una sola vez (§4.1, §6.10). Tratado como elemento de marca, no como copy: la regla de paridad entre idiomas sigue obligando en cada afirmación, y un tagline no es una afirmación. Esto cierra la pregunta abierta #4 de `brand/CLAUDE.md` — que `brand-guardian` había dejado explícitamente sin resolver y que pedía su decisión *antes* de que alguien lo usara. **`brand/CLAUDE.md` y `brand/visual-language.md` todavía lo registran como abierto; son de `brand-guardian`, no míos — reportado para ruteo.**
8. **Número de negocios en el piloto — RESUELTO: son DOS.** La Product Owner aceptó mi recomendación de decir la cifra en lugar de un plural vago, y corrigió la cifra: *"y si que haya numero de negocios y son 2 no 3."* Escrita, idéntica en los dos idiomas, en `meta.description`, `meta.ogDescription`, `hero.lead`, `today.lead` y `status.body4`. **Mi borrador anterior decía tres y estaba mal** — ver §10.2 para de dónde salió ese error, qué otras cifras volví a derivar por eso, y las dos correcciones más que encontré al hacerlo. La obligación de mantenimiento se queda: la cifra se corrige cuando cambie, igual que las etiquetas del roadmap.

**🔵 Para el registro**

9. **`brand-guardian` ya entregó — esta versión está revisada contra su registro.** La guía se persistió en `brand/tone-of-voice.md` §"Speaking about Nahui to an investor or evaluator" y `brand/brand-principles.md` principio 8 (commit `6670749`). Las tres líneas que marqué como más expuestas (`hero.title`, `status.body3`, `built.lead`) sobrevivieron: no pidió quitar ninguna. `built.lead` cambió de persona dos veces en esta pasada (de "la construye un equipo" a "la construimos", y de ahí a nombrar a Claudia Falcón cuando la Product Owner aprobó aparecer); la afirmación es la misma. Autoverificación contra las siete comprobaciones de clase Blocker: §10.
10. **Consulta a `knowledge-mentor` que no pedí, y por qué.** Hay una pregunta donde teoría establecida fortalecería la pieza: *"¿cómo trata la literatura de innovation accounting / Lean Startup la presentación de avance ante evaluadores externos cuando no hay métricas de tracción — qué se reporta en lugar de crecimiento, y cómo se evita que la honestidad se lea como falta de avance?"*. Es relevante para el orden de las secciones 5 y 6 y para el encuadre de `status.*`. No la pedí porque se me pidió mi borrador más fuerte y el diseño es defendible sin ella; si la quiere antes de aprobar, la pido y reviso §3 y §4.5. Nota: `brand/tone-of-voice.md` tiene como **Hypothesis** explícita que un registro honesto convenza *mejor* que un registro de pitch — la regla obliga igual, pero esa consulta es lo que podría darle evidencia.
11. **La URL propia de esta página no está resuelta** en el BRIEF, y no se puede tocar DNS antes del 15 de octubre (BRIEF §7). `meta.url` y `og:url` dependen de eso. Es infraestructura, no contenido, pero el string lo necesita.
12. **Error de cita menor en el BRIEF, para corregirlo donde corresponda.** BRIEF §7 cita `company/business-decisions.md` Q26 para "hay vendedoras reales en producción detrás de esos dominios". Esa Q26 no existe en ese archivo; la que existe es `product/02-ux/product-decisions.md` Q26 y es sobre vinculación de cuentas. El hecho está bien respaldado en otro lado (`company/bitacora.md`, 2026-09-21/23) — solo la referencia está mal. **Añadido 2026-10-08:** BRIEF §4 también trae la cifra vieja del piloto ("dos de tres vendedoras"); misma ruta de corrección.
13. **La Product Owner va nombrada en la página — RESUELTO, con una verificación que pido.** Aprobado el 2026-10-08, emparejado con el enlace al repositorio: el enlace ya expone el nombre, así que nombrarla es consistencia, no exposición nueva. Escrito en `built.lead`, factual y en una línea, sin mito de fundadora (§4.6). **Lo que pido verificar, y lo pido en lugar de darlo por hecho: la forma escrita del nombre.** Uso **Claudia Falcón**, que es la forma públicamente consistente (coincide con el handle `claudiafalcon` y con el autor de los commits del repositorio), pero eso es una inferencia desde metadatos del repositorio — exactamente la clase de inferencia que produjo el error de la cifra del piloto. Que lo confirme ella antes de publicar: acentuación, apellidos, y si quiere aparecer con un rol escrito ("Product Owner") o sin él.

---

## 9. Checklist de verdad de producto — para `reviewer` y para quien apruebe

Cada casilla se puede verificar contra el repositorio o contra una fuente citada, sin confiar en mí:

- [ ] Ninguna capacidad descrita en tiempo presente está sin construir. Las tres de "Lo que sigue" llevan etiqueta explícita, **en los dos idiomas**.
- [ ] No aparece "en segundos" ni ninguna promesa de velocidad. La barra incumplida se declara (`today.bar`). La mención de "unos segundos" en `problem.learned` describe la restricción del bazar, no el desempeño de Nahui (ver la nota en §4.2).
- [ ] **Cada cifra de la página tiene fuente verificada en §10.2, y ninguna entró por inferencia.** En particular: el piloto son **dos** negocios, idéntico en los dos idiomas.
- [ ] No se afirma prueba por paso con vendedoras reales. `built.item3.body` dice explícitamente que ese agente es un agente.
- [ ] No hay ingresos, crecimiento, tracción ni cifra de adopción. `status.body3` niega tenerlos.
- [ ] No aparece "De la foto a tu inventario", en ningún encuadre.
- [ ] La vendedora del piloto no es identificable: sin surtido, sin zona, sin edad, sin recintos, sin cifras exactas de costo — **ni en los strings ni en las notas de este archivo**. ("Ana" es pseudónimo, confirmado 2026-10-08; no es exposición.)
- [ ] Ninguna palabra se le atribuye a una vendedora real. `problem.learned` es un aprendizaje parafraseado y atribuido como tal.
- [ ] Ningún enlace apunta a `demo.nahui.app`.
- [ ] Nada contradice "en piloto, aprendiendo": en ninguna parte se dice que las vendedoras del piloto *estén usando* Nahui hoy, solo que hay dos negocios reales dados de alta en producción.
- [ ] Ningún término técnico del dominio (`Session`, `SaleItem`, `Customer`, `subscriptionTier`, `OWNER`, `SELLER`) aparece en la copia, en ninguno de los dos idiomas.
- [ ] Las dos versiones de idioma están completas. Ninguna sección existe en un idioma y no en el otro, salvo el texto dentro del celular del hero (deliberado y explicado) y el tagline, que va en inglés en ambas por decisión de la Product Owner.
- [ ] Ninguna afirmación de tier **Hypothesis** de `/brand/` aparece en la página (atributos de marca, promesa de marca, lecturas del símbolo, ocelote).
- [ ] La Product Owner aparece en una línea factual, sin arco de origen, y su nombre está confirmado por ella (§8.13).

---

## 10. Autoverificación contra el registro de inversionista (2026-10-08)

`brand/tone-of-voice.md` §"Speaking about Nahui to an investor or evaluator" define los defectos que son de clase **Blocker** en esta superficie. **No encontré un archivo de reporte independiente de `brand-guardian` en `brand/`** — los cinco documentos de `/brand/` más `brand/CLAUDE.md` es todo lo que existe ahí, y el registro quedó persistido dentro de `tone-of-voice.md`, `character-bible.md`, `storytelling.md` y `brand-principles.md` (commit `6670749`). Así que las siete comprobaciones de abajo las derivé de esos documentos. Si existe una lista canónica de siete en otra parte, hay que correrla contra esta tabla; lo digo en lugar de suponer que la mía es la misma.

| # | Comprobación de clase Blocker | Resultado |
|---|---|---|
| 1 | **Nahui no habla en primera persona, y no hay calidez de acompañante dirigida al lector.** | ✅ Ningún string tiene a Nahui como hablante. Nahui es sujeto descrito en tercera persona (`Nahui existe por eso`, `Nahui no cobra pagos`, `Nahui no tiene ingresos`). El "nosotros" aparece solo en autoría/aprendizaje (`problem.learnedBy`: "aprendimos") y en incertidumbre (`status.body1/2/3`). No hay "nosotros" de destino: ni "estamos transformando", ni "vamos a", ni misión. El tagline no introduce uno: es un nombre, no una promesa en primera persona. |
| 2 | **Ninguna segunda persona, en ningún idioma.** | ✅ **Corregido en esta pasada — había seis.** En español: `cta.title` "Si esto te interesa" → "Para quien evalúa proyectos en esta etapa"; `cta.lead` "si evalúas… te interesa… escríbenos" → impersonal + infinitivo; `cta.contact` "Escríbenos" → "Escribir a ihola@nahui.app"; `cta.productNote` "**Te** va a pedir una cuenta" → "Pide una cuenta". En inglés: `today.item8.body` "someone **you** trust" → "someone she trusts"; `changed.note` "**You** don't have to take our word for it… **you** can read it" → "Nobody has to take our word for it — the log can be read". Grep final sobre los strings: cero `tu/tus/te/ti/registras` dirigidos al lector, cero `your/you`. |
| 3 | **La vendedora es el sujeto de sus propios verbos; ningún *permitir / empoderar / habilitar / ayudar a* / *enable / empower / unlock / allow*.** | ✅ Ninguno de esos verbos aparece en ningún string, en ningún idioma. Donde la frase podía invertirse, el sujeto es ella: "la vendedora misma dio de alta" los códigos; "una vendedora se limita sola"; "Mantiene el catálogo chico a propósito"; "una vendedora buscó a Nahui por su cuenta"; "dos de las primeras personas que la probaron lo pidieron"; "Una persona que vende juguetes… pidió". `today.item8.body` se reescribió para que la dueña sea quien invita, no Nahui quien la faculta. Las capacidades de §4.3 están en infinitivo/gerundio, que nombra la función sin poner a nadie en posición de objeto. |
| 4 | **Ninguna descripción por carencia.** | ✅ No aparece "informalidad", "no bancarizados", "sin acceso a", "rezago digital", "sin herramientas", "underserved", "unbanked", "informal economy". Las dos frases que describen una falta describen una **herramienta**, no a la persona, que es el límite exacto del registro: "no tiene con qué saberlo" (`next.item2`) y "esa decisión se toma sin datos" (`next.item3`, reescrito desde "se decide a ciegas"). §7.1 explica por escrito por qué no hay sección de mercado, con el argumento de registro además del de exactitud. |
| 5 | **Paridad entre idiomas: mismas afirmaciones, mismo orden, mismas etiquetas, misma fuerza — y las mismas cifras.** | ✅ Revisado fila por fila. **La cifra del piloto ("dos" / "two") es idéntica en las cinco filas donde aparece**, que es la comprobación que esta pasada estuvo más cerca de fallar. Cinco ajustes de fuerza: `problem.evidence` inglés pesaba menos por contracciones, igualado; `status.body2` inglés traía un posesivo que el español no tiene, igualado; `problem.body2` igualó el cierre; `today.item1.body` pasó a gerundio para que las ocho capacidades compartan forma gramatical sin sonar a instrucción al lector; `changed.item1/2.body` se corrigieron en los dos idiomas a la vez. **Excepción declarada y única:** el tagline va en inglés en las dos versiones, por decisión de la Product Owner — es un elemento de marca, no una afirmación, igual que *Nahui* y *bazares* no se traducen al inglés. |
| 6 | **Honestidad de roadmap y afirmaciones del tamaño de su evidencia.** | ✅ Nada sin construir en tiempo presente; las tres cosas de "Lo que sigue" llevan etiqueta en los dos idiomas. Ninguna afirmación de latencia. **Y, en esta pasada, tres cifras/afirmaciones corregidas hacia la evidencia: la cifra del piloto (tres → dos), el extremo bajo del rango de costos ("unos cientos" no tenía fuente → "un par de miles"), y dos detalles que ninguna fuente sostenía** (que la persona del código de barras "probó" Nahui, y que las dos personas que pidieron la foto fueran "del piloto"). Fuente de cada cifra en §10.2. |
| 7 | **Ni registro de pitch ni humildad actuada; ninguna afirmación tier Hypothesis de `/brand/`.** | ✅ Sin verbos de categoría ni superlativos ("revolucionar", "transformar", "disrupt", "the leading", "the first" — ninguno aparece), sin tamaño de mercado como argumento, sin impulso fabricado, sin vocabulario de deck, sin números redondos sin fuente. En el otro extremo: ningún "apenas un proyectito", ninguna disculpa por ser temprano. El nombre de la Product Owner entra como hecho (qué construye, qué decide), no como mito. Y ninguna afirmación Hypothesis de marca: sin atributos de marca, sin promesa de marca, sin lecturas del símbolo, sin ocelote. **El tagline sí está, y no es Hypothesis-en-superficie-externa: su estatus dejó de estar abierto cuando la Product Owner lo adoptó explícitamente el 2026-10-08**, que es precisamente la condición que `brand-guardian` puso. |

### 10.1 Qué cambió en esta pasada, en una lista

1. **Persona.** `built.lead` ahora nombra a Claudia Falcón de forma factual; el "nosotros" de autoría e incertidumbre se conserva en `problem.learnedBy` y `status.*` (§4.6).
2. **Segunda persona eliminada**, cuatro casos en español y dos en inglés (fila 2 de §10).
3. **CTAs en infinitivo e impersonales**, con la nota vinculante en §4.8.
4. **Dirección de contacto escrita:** `ihola@nahui.app`, con la prueba de entrega como bandera, no como retención.
5. **Enlace al repositorio escrito**, con la condición de la Product Owner anotada y su estado exacto en §8.2.
6. **Tagline agregado:** "The path to what's next", en inglés en los dos idiomas, en el lockup del hero (§4.1).
7. **Cifra del piloto escrita y corregida: dos**, idéntica en los dos idiomas, en cinco strings.
8. **Palabras que se quedan en español dentro del inglés:** *bazar/bazares* (glosado una vez) y las etiquetas de pantalla de la app, con glosa. Esto cambió casi todas las filas de la columna inglesa, que antes decía "bazaar" y traducía los nombres de las pestañas.
9. **Paridad entre idiomas revisada fila por fila**, con cinco igualaciones de fuerza.
10. **Dos reescrituras por riesgo de carencia:** "se decide a ciegas" → "se toma sin datos"; "no tiene forma de saberlo" → "no tiene con qué saberlo".
11. **`changed.item1/2.body` corregidos contra la fuente**, quitando dos detalles que ninguna fuente sostenía.
12. **Rango de costos corregido** a lo que la fuente aguanta, y las cifras exactas sacadas de las notas de este archivo.
13. **Omisiones nuevas en §7.2:** atributos/promesa de marca y lecturas del símbolo. El tagline salió de esa tabla.
14. **§8 cerrada:** no queda ninguna decisión de contenido abierta; quedan dos verificaciones que pido y un bloqueo de infraestructura.
15. **Lo que no cambié, a propósito:** la apertura por el problema, "Cómo va" antes de "Cómo está construido", `today.bar` en lugar de cualquier promesa de velocidad, y `status.body3` palabra por palabra.

### 10.2 Verificación de cifras — cada número de la página, contra su fuente

Existe porque la primera cifra que esta página iba a publicar sobre sí misma estaba inflada 50%. Cada renglón dice qué se afirma, de dónde sale y **cómo se verificó en esta pasada**, no de dónde se infirió.

| Cifra en la página | Fuente | Verificación |
|---|---|---|
| **Dos negocios reales en producción** | Product Owner, 2026-10-08, con acceso a la base de producción | Declarada por ella textualmente. **No es contable desde el repositorio** — por eso el error. Si vuelve a cambiar, cambia aquí y en los cinco strings a la vez |
| **Más de 80 decisiones** | `product/00-foundation/decision-log.md` | Contadas en esta pasada: **84** entradas (`^## D` en ese archivo). "Más de 80" es deliberadamente conservador para que no envejezca hacia abajo |
| **18 RFCs** | `product/99-rfc/` | Contados en esta pasada: 18 archivos numerados, 0001-0018, más `README.md` |
| **9 de cada 10 ventas · menos de 3 segundos** | `company/backlog.md` #1 | Leído literal en esta pasada: ">=90% of sales registered, <3 sec per registration", y la barra está explícitamente sin cumplir |
| **5 de septiembre de 2026 · dos personas** | `decision-log.md` D54 | Leído literal: "2 of the earliest respondents independently asking for a photo per catalog item, 2026-09-05". La copia decía "del piloto"; D54 dice "earliest respondents". Corregido |
| **13 de septiembre de 2026** | `decision-log.md` D65 | Leído literal: "Product Owner decision, 2026-09-13 — a prospective client sells toys carrying pre-existing manufacturer barcodes". D65 **no** dice que esa persona probara Nahui. Corregido |
| **3 de septiembre de 2026** | `company/backlog.md` §Product Discovery | Leído literal: "Source: unsolicited real-merchant feedback (2026-09-03). A prospective merchant contacted the Product Owner directly after trying Nahui" |
| **Tres veces** (`changed.lead`) | Los tres ítems de §4.4 | Es la suma de los tres casos listados, cada uno con fecha y entrada propia. Verificable contando la sección |
| **Un par de miles a varios miles de pesos por evento** | `company/market-validation.md` §1d | Corregido en esta pasada: el extremo bajo decía "unos cientos" y ninguna observación lo sostiene. Las cifras exactas no se publican (BRIEF §5) |
| **465 commits · repositorio público** | `gh repo view`, verificación de Main, 2026-10-08 | Atribuida a quien la corrió. No aparece como cifra en la copia: solo sostiene la afirmación de que el repositorio es público y auditable |

**De dónde salió el "tres", para que no siga propagándose.** Mi borrador citaba `company/bitacora.md`, entrada 2026-09-21/23, que decía "two of three pilot merchants"; `landing/BRIEF.md` §4 — documento aprobado por la Product Owner — dice lo mismo ("dos de tres vendedoras del piloto"). Conté desde ahí en lugar de preguntar. `bitacora.md` ya quedó corregido el 2026-10-08 con su propia nota; **`BRIEF.md` §4 sigue con la cifra vieja y está fuera de mi propiedad** — reportado para ruteo. La lección operativa, escrita aquí porque este archivo es donde se van a escribir las siguientes cifras: **una cifra sobre el negocio (negocios, usuarios, ingresos) no se cuenta desde artefactos del repositorio; se pide a quien tiene la fuente.** Las cifras sobre el *método* (decisiones, RFCs, commits) sí son contables desde el repositorio, y así se verificaron arriba.
