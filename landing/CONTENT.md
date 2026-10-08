# Nahui — sitio público de presentación · Contenido

**Owner:** `marketing` (mensaje, afirmaciones, CTA). **Estado:** borrador completo, **pendiente de aprobación de la Product Owner**. Nada de esto está publicado.
**Insumo obligatorio:** `landing/BRIEF.md` (definición de producto aprobada, 2026-10-08). Este documento no redefine público, idioma ni restricciones — los ejecuta.
**Registro de voz:** `brand/tone-of-voice.md` §"Speaking about Nahui to an investor or evaluator" (**Decision**, 2026-10-08) y `brand/brand-principles.md` principio 8. **Esta versión está revisada contra ambos** — ver §10 para la autoverificación, §10.3 para la auditoría de humildad actuada y §10.4 para la corrección de atribución. El BRIEF manda sobre *qué* se puede afirmar; ese registro manda sobre *cómo suena*.
**Para `ui-designer`:** el contenido es esto. Los IDs de string, el orden de secciones y el destino de cada CTA son normativos. El layout, la tipografía, el ritmo y el código son tuyos. No escribí HTML.

**Revisión 2026-10-08 (segunda pasada: registro de inversionista + cinco decisiones de la Product Owner).** La estructura no cambió. Lo que cambió está en §10.1.

**Revisión 2026-10-08 (tercera pasada: corrección de humildad actuada).** La Product Owner leyó la página construida y marcó un defecto real: *"una cosa es ser honesto y otra cosa decir no servimos para nada, esto no me gusta."* Es **failure mode 6** de `brand/tone-of-voice.md`: *"it makes Nahui's own posture the subject instead of the facts. Honest is not modest."* No se quitó ni se suavizó un solo hecho; cambió **quién es el sujeto de la frase**. Auditoría: **§10.3**.

**Revisión 2026-10-08 (cuarta pasada: una línea falsa, y la historia verdadera resultó mejor).** `status.body1` decía que el producto estaba probado *"en el teléfono de una vendedora"* y que *"se sostiene"* en producción. Las dos cosas estaban mal: la entrada fuente (`company/bitacora.md` 2026-09-21/23) dice que el recorrido se corrió *"on production, on her own account and device"* — de la Product Owner — y que una vendedora **intentó usarlo y no pudo**. La historia verdadera es más fuerte que la que la página contaba, y eso es el punto: un piloto que no produce fallas no está funcionando como piloto. `status.body1` reescrito, `status.blocked` agregado. Detalle y re-verificación de todo lo que dependía de esa entrada: **§10.4**.

**Revisión 2026-10-08 (quinta pasada: se cierran las tres últimas pendientes, dos relevadas y una verificada por mí).** Ya no queda nada abierto en este documento. (1) **El buzón `ihola@nahui.app` recibe correo** — probado en vivo el 2026-10-08 a las 06:56. (2) **La forma escrita del nombre es "Claudia Falcón"**, confirmada por ella con acento, y es la forma que eligió para esta página. (3) **El aviso de privacidad ya existe y es enlazable**: en lugar de dar por buena la mención de pasada, lo verifiqué yo — `https://www.nahui.app/aviso-de-privacidad.html` responde, se titula "Aviso de Privacidad — Nahui", dice actualizado el **8 de octubre de 2026**, y da **`ihola@nahui.app`** como contacto para derechos ARCO, aclarando además que la primera letra es una "i". Eso desbloquea `foot.privacy`, corrobora la dirección desde una segunda fuente independiente, y **corrige dos afirmaciones que este documento traía mal** (que el aviso vivía en `demo.nahui.app` y que no había copia accesible). §8.3, §10.2, §10.5.

**Nota de disciplina, escrita aquí porque explica el único patrón que vale conservar de hoy.** Esta página estuvo a punto de publicar tres defectos de la misma familia: una cifra inflada 50% (decía tres negocios; son dos), cinco pasajes por debajo del tamaño de su evidencia, y una afirmación que atribuía a una vendedora un recorrido que fue de la Product Owner. **Son la misma falla desde tres ángulos: una afirmación que no corresponde exactamente a su fuente** — y en los tres casos el error corrió en la dirección que hacía la tarea más fácil o la historia más bonita, que es la dirección que nadie revisa. De ahí la regla que gobierna §0: **cuando una afirmación cita una fuente, se lee la fuente, no la cita de la fuente.** La quinta pasada es la primera en que esa regla produjo algo bueno en lugar de atrapar algo malo: verificar el aviso en lugar de citarlo de oídas desbloqueó el último 🔴 de la página.

---

## 0. Cómo leer este documento

Cada string tiene **ID**, **español**, **inglés** y una **etiqueta de evidencia** (`evidence-tiering`):

- **Real** — observado, ocurrió, verificable en el repositorio o en una fuente citada. La inmensa mayoría de esta página.
- **Calculado** — derivado de algo Real (un conteo, una suma, una consecuencia lógica de una decisión registrada).
- **Proyectado** — intención a futuro. **Solo aparece en "Lo que sigue", y siempre etiquetado como tal en la página misma**, nunca en tiempo presente.

El español es la base (va en el HTML, per BRIEF §6); el inglés es una versión completa que se sostiene sola, no un resumen. **Cada par de columnas se escribió desde la misma lista de afirmaciones, no traduciendo una a la otra** — y la etiqueta de evidencia y la *fuerza* de la afirmación son idénticas en los dos idiomas.

**Las tres reglas que gobiernan cada línea de abajo, en orden:**

1. **La honestidad es el instrumento, no el límite.** Un inversionista en esta etapa no espera tracción; espera no ser engañado. Una afirmación inflada no se descuenta sola: descuenta todo lo demás (`brand-principles.md` #8).
2. **Honesto no es modesto.** Cada afirmación va del tamaño exacto de su evidencia — ni más grande ni más chica. Donde Nahui describe un límite, el sujeto de la frase es el estándar, la decisión o el hecho, nunca la postura de Nahui frente a él (`tone-of-voice.md`, failure mode 6).
3. **Y la condición previa de las dos anteriores: se lee la fuente, no la cita.** Una afirmación tiene que corresponder a lo que su fuente *dice*, no a lo que parece decir de memoria. Tres afirmaciones de esta página fallaron esa prueba en un día (§10.2, §10.4). La verificación es parte de escribir la línea, no un paso posterior.

**Regla de persona:** Nahui se describe, no se interpreta a sí misma. Tercera persona para el producto ("Nahui registra…"), primera del plural para los límites de lo que sabemos ("aprendimos", "todavía no lo sabemos"). El "nosotros" es de autoría y de incertidumbre, nunca de destino. Y la vendedora es el sujeto de sus propios verbos: "la vendedora registra", nunca "Nahui le permite registrar".

---

## 1. Decisiones de contenido que tomé, y por qué

1. **La página abre con el problema, no con el producto.** No hay tracción que presumir, así que lo más fuerte que tiene Nahui es que el problema es real y que salió de una persona real. Un titular de producto sin números detrás se lee hueco; un titular de problema con una entrevista detrás se lee verificable.
2. **Nahui se describe en tercera persona; quien la construye se nombra; nadie le habla de tú a la vendedora ni al lector.** La versión anterior le hablaba de tú a quien no iba a leer la página; eso no se recicla (BRIEF §2). Cae dentro del *About-surface carve-out* de `brand/storytelling.md` y del registro de inversionista de `brand/tone-of-voice.md` (los dos **Decision**).
3. **La sección "Cómo va" dice en voz alta lo que no tenemos.** `status.body3` se queda palabra por palabra. Lo que la hace fuerte no es la carencia: es el *"si los tuviéramos, estarían aquí"*, que es una afirmación sobre cómo se comporta esta página.
4. **La barra se publica como estándar, no como confesión.** `backlog.md` #1 (≥90% de ventas registradas, <3 s) aparece como **la barra que Nahui se fijó antes de construir, todavía sin cumplir y sin medir**. Esos hechos van juntos y ninguno se suaviza. Blinda además la página contra la prohibición de "en segundos".
5. **La página incluye un defecto real que una vendedora encontró, con causa y fecha** (`status.blocked`). No como disculpa: como evidencia de que el piloto está haciendo su trabajo. Razonamiento en §10.4.
6. **Registro de género en español:** opción 4 de `brand/tone-of-voice.md` (rodear la construcción: "quienes venden en bazares") más género natural para personas reales. Esa pregunta sigue **abierta** y es decisión de la Product Owner; esto es ejecución provisional. §8.6.
7. **El tagline va en la página, en inglés en los dos idiomas.** *"The path to what's next"*, y "esa siempre va en inglés". Tratado como el nombre, no como copy sujeto a paridad — la paridad obliga en cada afirmación; un tagline no es una afirmación. §4.1, §6.10, §8.7.
8. **No hay sección de tamaño de mercado.** Razonamiento en §7.1 — omisión deliberada.
9. **Dentro de la versión inglesa se quedan en español:** *Nahui*, *bazar/bazares* (glosado una vez) y las etiquetas de pantalla de la app (glosadas). El celular del hero se queda en español en los dos idiomas (BRIEF §6). En espejo: el tagline se queda en inglés dentro del español. §6.7.
10. **El número de negocios del piloto se dice: son dos.** **La cifra es dos, no tres** — la Product Owner tiene acceso a la base de producción y corrigió un conteo que yo inferí mal desde el repositorio. §8.8, §10.2.
11. **Donde la página habla de un límite, el sujeto es el estándar, la decisión o el hecho, no la postura de Nahui.** §10.3.
12. **La dirección de contacto de la página es la misma que ya aparece en un documento legal vivo.** `ihola@nahui.app` está publicada como canal ARCO en el Aviso de Privacidad de `www.nahui.app` (verificado 2026-10-08). No es un detalle administrativo: significa que la página y el aviso tienen que decir **la misma** dirección siempre, y que si alguna vez cambia, cambia en los dos el mismo día. §6.12, §8.1.

---

## 2. Identidad de la página

| ID | Español | English | Evidencia |
|---|---|---|---|
| `page.name` | *(nombre interno)* Página de presentación de Nahui | Nahui presentation page | — |
| `brand.tagline` | The path to what's next | The path to what's next | **Real** · tagline aprobado por la Product Owner el 2026-10-08, en inglés en los dos idiomas. Cierra la pregunta abierta #4 de `brand/CLAUDE.md` |
| `meta.title` | Nahui — Registro de ventas e inteligencia de negocio para bazares en México | Nahui — Sales registration and business intelligence for *bazares* in Mexico | **Real** · descriptor de `company/CLAUDE.md` |
| `meta.description` | Nahui es una app de registro de ventas e inteligencia de negocio para quienes venden en bazares en México. Está construida, corre en producción con dos negocios reales dados de alta y está en piloto. | Nahui is a sales-registration and business-intelligence app for people who sell at *bazares* in Mexico. It is built, it runs in production with two real businesses set up on it, and it is in pilot. | **Real** · cifra confirmada por la Product Owner (§10.2). *"Dados de alta" es deliberado y no se simplifica a "usando" — §4.5* |
| `meta.ogTitle` | Nahui | Nahui | — |
| `meta.ogDescription` | Construida y corriendo en producción con dos negocios reales dados de alta. En piloto, aprendiendo. | Built and running in production with two real businesses set up on it. In pilot, learning. | **Real** |
| `meta.url` | *(pendiente — §8.11: no es contenido, es DNS)* | *(same)* | — |
| `meta.locale` | `es-MX` / alternate `en` | | — |

**H1 de la página:** `Nahui` (la palabra sola, con el símbolo), con `brand.tagline` inmediatamente debajo como parte del lockup. El descriptor va en `hero.title`/`hero.lead`, no en el H1. **El símbolo se muestra; no se afirma qué significa** — las lecturas del símbolo son **Hypothesis** y `brand/visual-language.md` las prohíbe en cualquier superficie externa.

---

## 3. Mapa de secciones — orden y para qué sirve cada una

| # | Sección | ID raíz | Para qué sirve — la pregunta que contesta |
|---|---|---|---|
| 0 | Nav | `nav.*` | Dejar ver, de un golpe, que la página tiene una sección llamada "Cómo va". Eso ya es una señal. |
| 1 | Hero | `hero.*` | **"¿Qué es esto y en qué etapa está?"** Una frase de problema, una de producto, un estado honesto, y el producto real en pantalla. |
| 2 | El problema | `problem.*` | **"¿El problema es real o lo inventaron?"** De dónde salió, qué lo sostiene, y cuánta evidencia es, dicho con precisión. |
| 3 | Qué existe hoy | `today.*` | **"¿Hay producto o hay una presentación?"** Capacidades en tiempo presente, lo que queda fuera por decisión, y la barra que Nahui se fijó. |
| 4 | Lo que las vendedoras cambiaron | `changed.*` | **"¿Este equipo aprende de usuarios reales o de sí mismo?"** Tres casos fechados en que la retroalimentación de una persona real se volvió producto. |
| 5 | Cómo va | `status.*` | **"¿Puedo confiar en lo que me dicen?"** Lo que ya se sabe, la pregunta abierta, el defecto real que encontró el piloto, lo que no hay, y lo que sí. |
| 6 | Cómo está construido | `built.*` | **"¿Por qué este proyecto y no otro, y quién está detrás?"** Gobernanza auditable, y el repositorio es público: se verifica, no se cree. |
| 7 | Lo que sigue | `next.*` | **"¿A dónde va?"** Tres etiquetas, nada en tiempo presente que no exista. |
| 8 | Contacto | `cta.*` | **"¿Y ahora qué hago?"** Un camino claro. |
| 9 | Pie | `foot.*` | Cambio de idioma, aviso de privacidad, repositorio, procedencia. |

**Nota de orden, deliberada:** "Cómo va" (donde se dice que no hay números) va **antes** de "Cómo está construido" (lo más diferenciador). La página dice primero lo que un inversionista va a preguntar de todos modos y después muestra su fortaleza. Terminar con la gobernanza y el repositorio público deja al lector con algo que puede ir a revisar por su cuenta.

**El orden de secciones es idéntico en los dos idiomas.** `brand/tone-of-voice.md` lo vuelve parte de la afirmación — si una versión reordena o pesa distinto, uno de los dos lectores está recibiendo otra página.

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
| `lang.toEn` | English | *(en la versión inglesa:)* Español | — |
| `lang.aria` | Cambiar idioma | Change language | — |

### 4.1 Hero — "¿Qué es esto y en qué etapa está?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `brand.tagline` | *(en el lockup, debajo del nombre)* The path to what's next | The path to what's next | **Real** · §8.7 |
| `hero.badge` | En piloto · México | In pilot · Mexico | **Real** · BRIEF §4; `bitacora.md` 2026-09-21/23 (existen negocios de piloto en producción) |
| `hero.title` | Vender en un bazar no deja tiempo para anotar la venta. Nahui existe por eso. | Selling at a *bazar* leaves no time to write the sale down. That is why Nahui exists. | **Real** · tesis central validada en entrevista, `company/CLAUDE.md` |
| `hero.lead` | Nahui es una app de registro de ventas e inteligencia de negocio para quienes venden en bazares en México. Está construida y corriendo en producción, con dos negocios reales dados de alta. Está en piloto: lo que estamos aprendiendo ahora es qué hace falta para que entre de verdad en un día de bazar. | Nahui is a sales-registration and business-intelligence app for people who sell at *bazares* — the recurring, private pop-up markets where they sell. It is built, and it runs in production, with two real businesses set up on it. It is in pilot: what we are learning now is what it takes for Nahui to genuinely fit into a day at a *bazar*. | **Real** · cifra per §10.2 · lleva la **única glosa** de *bazar/bazares* de toda la página (§6.7) |
| `hero.captionPhone` | La app real, en español. Es lo que ve la vendedora. | The real app, in Spanish. This is what the merchant sees. | **Real** · BRIEF §6 |

CTAs del hero: `cta.contact` (primario) y `cta.product` (secundario) — definidos una sola vez en §5.

**Colocación del tagline.** En el lockup de identidad, pegado al nombre y al símbolo, **arriba de `hero.title`** y subordinado a él tipográficamente. La razón es de registro: esta página es un reporte de avance, y un tagline puesto como titular se leería como la promesa que la página deliberadamente no hace. Pegado al nombre funciona como lo que es. **Dos reglas duras:** no se traduce, y no se repite en el pie.

### 4.2 El problema — "¿El problema es real o lo inventaron?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `problem.title` | El problema, y de dónde salió | The problem, and where it came from | — |
| `problem.learned` | En un bazar la gente llega sin avisar. Si anotar una venta toma más de unos segundos, el siguiente cliente ya está esperando. | At a *bazar*, customers arrive without warning. If writing a sale down takes more than a few seconds, the next customer is already waiting. | **Real** · `company/CLAUDE.md` Core thesis, de la entrevista |
| `problem.learnedBy` | Lo que aprendimos en nuestra primera entrevista con una vendedora de bazar. | What we learned in our first interview with a *bazar* vendor. | **Real** |
| `problem.body1` | La venta sí se hace. El registro es el que se pierde. Al cerrar el día, lo que queda es una cuenta de memoria — y la memoria del día no sirve para decidir qué surtir el mes que entra. | The sale still happens. It's the record that gets lost. At the end of the day what's left is a mental tally — and a mental tally is no basis for deciding what to stock next month. | **Real** |
| `problem.body2` | Hay una consecuencia menos obvia, y es la que convierte esto en un problema de crecimiento: para no perder el control, una vendedora se limita sola. Mantiene el catálogo chico a propósito, porque es lo que puede llevar en la cabeza. El techo no es la demanda ni el capital: es cuánto cabe en la memoria de cualquiera. | There's a less obvious consequence, and it's the one that turns this into a growth problem: to stay in control, a merchant limits herself on purpose. She keeps her catalog deliberately small, because small is what she can hold in her head. The ceiling isn't demand and it isn't capital — it's how much anyone can keep in memory. | **Real** · `company/CLAUDE.md`; tiered as Supported Evidence en `company/market-validation.md` §1c |
| `problem.evidence` | De dónde sale esto, con precisión: una entrevista real con una vendedora de bazar, más observación de campo acompañándola a varios bazares. Es evidencia de primera mano y es poca — una vendedora no es un mercado. Decir exactamente cuánta hay es parte del argumento: si esto se generaliza es justo lo que el piloto tiene que contestar. | Where this comes from, stated precisely: one real interview with a *bazar* vendor, plus field observation accompanying her at several *bazares*. That is first-hand evidence and there is little of it — one merchant is not a market. Saying exactly how much there is is part of the argument: whether it generalizes is precisely what the pilot has to answer. | **Real** · `company/market-validation.md` §1a + Core thesis. H1 sigue siendo hipótesis abierta |

**Nota para `ui-designer` — importante, no cosmética.** `problem.learned` **no es una cita textual de la vendedora**. Es un aprendizaje parafraseado y atribuido como tal, que es la forma que `brand/storytelling.md` autoriza hoy (obtener sus palabras reales con su consentimiento es una pregunta **abierta** para la Product Owner). Por eso: **no lo maquetes con comillas tipográficas, ni con foto, ni con nombre, ni con nada que implique que una persona dijo esas palabras.**

**Nota de reseña anticipada — "más de unos segundos" no es una promesa de latencia.** Describe la restricción del puesto, no el desempeño de Nahui, y es la tesis central tal como está en `company/CLAUDE.md`. La página en ningún lugar afirma cuánto tarda Nahui — eso es lo que `today.bar` publica como estándar sin medir.

### 4.3 Qué existe hoy — "¿Hay producto o hay una presentación?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `today.title` | Qué existe hoy | What exists today | — |
| `today.lead` | Esto no es una maqueta ni un video. Es la app que corre en nahui.app, en producción, con dos negocios reales dados de alta. | This is not a mockup and not a video. It is the app running at nahui.app, in production, with two real businesses set up on it. | **Real** · negocios dados de alta confirmados en los datos de producción, `bitacora.md` 2026-09-21/23; cifra confirmada por la Product Owner (§10.2). *Celda corregida en la cuarta pasada: antes decía "cuenta y dispositivo reales", que daba a entender el dispositivo de una vendedora — §10.4* |
| `today.item1.title` | Inventario | Inventario (inventory) | **Real** |
| `today.item1.body` | Registrar la mercancía cuando llega, con precio y foto por producto. | Registering merchandise as it arrives, with a price and a photo per product. | **Real** · construido; `decision-log.md` D54 |
| `today.item2.title` | Eventos | Eventos (events) | **Real** |
| `today.item2.body` | Preparar un bazar: cuándo, dónde, y qué mercancía se lleva a ese evento. | Setting up a *bazar*: when, where, and which merchandise goes to that event. | **Real** · construido |
| `today.item3.title` | Venta con botones | Selling with buttons | **Real** |
| `today.item3.body` | Un toque por producto, sin escribir nada. | One tap per product, with nothing to type. | **Real** · construido |
| `today.item4.title` | Venta con código de barras | Selling by barcode | **Real** |
| `today.item4.body` | La cámara del celular lee el código que el producto ya trae de fábrica. Sin base de datos externa: solo los códigos que la vendedora misma dio de alta. | The phone camera reads the barcode the product already came with. No external database: only the codes the merchant registered herself. | **Real** · `decision-log.md` D65; construido |
| `today.item5.title` | Venta con etiquetas NFC | Selling with NFC tags | **Real** |
| `today.item5.body` | Una etiqueta por pieza. Acercarla al teléfono identifica exactamente qué se vendió. | One tag per item. Held to the phone, it identifies exactly which item sold. | **Real** · construido; `decision-log.md` D79 |
| `today.item6.title` | Resultados | Resultados (her results view) | **Real** |
| `today.item6.body` | Qué se vendió, en qué bazar le fue mejor, qué queda. | What sold, which *bazar* went better, what's left. | **Real** · construido |
| `today.item7.title` | Exportar | Exportar (export) | **Real** |
| `today.item7.body` | Las ventas de un rango de fechas, en un archivo que se abre en Excel. | Sales for a date range, in a file that opens in Excel. | **Real** · construido (`.xlsx`, corregido desde CSV el 2026-09-15 tras prueba en el teléfono de la Product Owner) |
| `today.item8.title` | Equipo | Equipo (team) | **Real** |
| `today.item8.body` | Invitar a alguien de confianza para que venda con su propio acceso, en el mismo evento o en otro al mismo tiempo. | A merchant can invite someone she trusts to sell with her own access — at the same event, or at another one at the same time. | **Real** · construido; `decision-log.md` D53, RFC 0007/0013. *Ver `status.blocked`: esta capacidad existe y el flujo para llegar a ella tuvo un defecto real que una vendedora encontró. Las dos cosas son verdad y la página dice las dos* |
| `today.notYet` | Dos cosas quedan fuera a propósito: cobrar pagos y recomendar a qué bazar ir. Lo primero es una decisión de alcance, tomada y escrita. Lo segundo necesita datos de muchas vendedoras, y mientras esos datos no existan no se construye: sería construir sobre nada. | Two things are deliberately out of scope: processing payments, and recommending which *bazar* to attend. The first is a scope decision, taken and written down. The second needs data from many merchants, and until that data exists it doesn't get built — it would be built on nothing. | **Real** · `company/CLAUDE.md` "Non-goals right now"; `backlog.md` #3 |
| `today.bar` | Nahui se fijó una barra antes de construir: que se registre al menos 9 de cada 10 ventas, y que registrar una tome menos de 3 segundos. Es un requisito de diseño, no un resultado medido, y hoy sigue sin cumplirse — medirla necesita uso sostenido en bazares reales, y el piloto todavía no ha generado ese uso. La barra se queda escrita tal cual, como la prioridad número uno del proyecto. Por eso esta página no promete segundos en ninguna parte: publica el estándar y lo deja a la vista. | Nahui set itself a bar before building anything: at least 9 out of every 10 sales recorded, and under 3 seconds to record one. It is a design requirement rather than a measured result, and today it is unmet — measuring it takes sustained use at real *bazares*, and the pilot has not produced that use yet. The bar stands exactly as written, as the project's top priority. That is why this page promises no seconds anywhere: it publishes the standard instead. | **Real** · `company/backlog.md` #1, verbatim: ">=90% of sales registered, <3 sec per registration", explícitamente sin cumplir; `architecture-principles.md` #2. **Y la razón de que no se haya medido está documentada:** `bitacora.md` 2026-09-21/23 — la barra *"cannot be measured at all while the merchants who would generate that evidence can't get in"*, que es lo que `status.blocked` cuenta |

**`today.bar` sustituye cualquier tentación de decir "en segundos", y sigue haciendo ese trabajo.** No existe una sola medición de latencia en el repositorio; se buscó a propósito.

**Por qué esta línea está escrita así (tercera pasada).** El hecho de abajo es bueno y la versión anterior lo enterraba: **Nahui escribió una barra medible antes de construir nada.** Casi ningún producto hace eso; la mayoría no escribe barra alguna, precisamente para no tener que decir nunca que no la alcanzó. Eso es disciplina y se estaba narrando como confesión ("la parte incómoda"). Los cuatro hechos están intactos: la barra existe y es explícita, es requisito de diseño y no medición, **no está cumplida hoy**, y medirla requiere uso sostenido que el piloto todavía no tiene. **Para `ui-designer`: esta tarjeta no se maqueta como advertencia.** Sin fondo de alerta, sin icono de error — es la última tarjeta de la sección y es parte del argumento.

**No apilar bloques de límite.** `today.notYet` y `today.bar` son consecutivos. Ya no se leen como dos avisos encadenados en el texto (una es decisión de alcance, la otra un estándar), pero el layout puede recrear el problema: **no les des el mismo tratamiento visual ni los pongas uno debajo del otro con el mismo fondo muted.**

**Nota de registro para los títulos.** `today.item1/2/6/7/8.title` son **etiquetas de pantalla de la app**: se quedan en español en la versión inglesa, con glosa entre paréntesis. Los tres modos de venta (`item3/4/5`) **no** son etiquetas de pantalla y sí van en inglés. La distinción es deliberada.

### 4.4 Lo que las vendedoras cambiaron — "¿este equipo aprende de usuarios reales?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `changed.title` | Lo que las vendedoras ya cambiaron del producto | What merchants have already changed in the product | — |
| `changed.lead` | Tres veces, algo que dijo una vendedora real se volvió una decisión de producto fechada, con su razón escrita, y se construyó. No es una encuesta: es el producto cambiando porque alguien lo usó. | Three times, something a real merchant said became a dated product decision with its reasoning written down, and then got built. This isn't a survey result: it's the product changing because someone used it. | **Real** · los tres casos están abajo, cada uno con fecha y entrada propia en el registro de decisiones |
| `changed.item1.title` | Una foto por producto | A photo per product | **Real** |
| `changed.item1.body` | Dos de las primeras personas que la probaron lo pidieron, por separado, el 5 de septiembre de 2026. Esa semana se volvió decisión de dominio. Está construida. | Two of the earliest people who tried it asked for this, independently of each other, on 5 September 2026. That same week it became a domain decision. It is built. | **Real** · `decision-log.md` D54, verbatim: "2 of the earliest respondents independently asking for a photo per catalog item, 2026-09-05" |
| `changed.item2.title` | Leer el código de barras | Reading the barcode | **Real** |
| `changed.item2.body` | Una persona que vende juguetes — mercancía que ya trae código impreso de fábrica — pidió que Nahui lo leyera. Se decidió el 13 de septiembre de 2026, con un límite puesto desde el principio: sin base de datos externa, porque para mercancía de bazar la cobertura no es confiable y el nombre que devolvería no sería el suyo. Está construido. | Someone who sells toys — merchandise that already carries a manufacturer barcode — asked that Nahui read the code. Decided on 13 September 2026, with a limit set upfront: no external lookup database, because coverage is unreliable for *bazar* merchandise and the name it would return wouldn't be hers. It is built. | **Real** · `decision-log.md` D65 (fecha y razonamiento de alcance, verbatim) |
| `changed.item3.title` | Nos buscó ella | She reached out to us | **Real** |
| `changed.item3.body` | El 3 de septiembre de 2026 una vendedora buscó a Nahui por su cuenta, después de probarla. Nadie le escribió. Le servía, y necesitaba algo que no teníamos: que varias personas pudieran vender en el mismo puesto a la vez, cada una con su propio acceso. Eso ya está en el producto. Otras partes de lo que pidió siguen sin construirse. | On 3 September 2026 a merchant contacted Nahui on her own, after trying it. Nobody messaged her first. It was useful to her, and she needed something we didn't have: several people selling at the same stand at once, each with their own access. That part is now in the product. Other parts of what she asked for are still not built. | **Real** · `company/backlog.md` §Product Discovery, verbatim: "Source: unsolicited real-merchant feedback (2026-09-03). A prospective merchant contacted the Product Owner directly after trying Nahui"; construido vía `product-decisions.md` Q24/Q25 |
| `changed.note` | Las tres están en el registro público de decisiones del proyecto, con fecha y con la razón escrita. No hay que creérnoslo: se puede leer. | All three are in the project's public decision log, dated, with the reasoning written out. Nobody has to take our word for it — the log can be read. | **Real** · repositorio público. **Sujeto a §8.2** |

**Nota de privacidad, vinculante (BRIEF §5).** Ninguno de estos tres párrafos nombra a la vendedora, su negocio, su surtido, su zona, su edad ni los bazares donde vende. "Una vendedora", "una persona que vende juguetes", "dos de las primeras personas que la probaron" es todo lo que se dice, y la única cosa específica es la fecha. **Esto aplica igual a `status.blocked`**: ahí tampoco se dice quién era, ni qué vende, ni dónde. Una futura revisión no debe "fortalecer" ninguna de las dos secciones agregando detalle de persona.

### 4.5 Cómo va — "¿puedo confiar en lo que me dicen?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `status.title` | Cómo va | How it's going | — |
| `status.lead` | En piloto, aprendiendo. | In pilot, learning. | **Real** · BRIEF §4 |
| `status.body1` | Lo que ya sabemos: el producto corre en producción y se recorrió de punta a punta en un teléfono real, contra el backend real — no en un servidor de desarrollo. Ese recorrido encontró tres defectos que ninguna revisión de código había visto; el más instructivo era invisible en el código y evidente en un solo toque en la pantalla. | What we already know: the product runs in production, and it was walked end to end on a real phone against the real backend — not on a development server. That walkthrough turned up three defects no code review had caught; the most instructive one was invisible in the source and obvious on a single tap. | **Real** · `bitacora.md` 2026-09-21/23, verbatim: el recorrido se corrió *"on production, on her own account and device"* (de la Product Owner) y *"found three defects no code review had caught"*; `decision-log.md` D80. **Reescrito en la cuarta pasada — §10.4** |
| `status.body2` | Lo que no sabemos todavía, y es la pregunta real: la adopción. Que una app funcione y que entre en la rutina de alguien que ya tiene su forma de trabajar son dos cosas distintas, y la segunda no se resuelve construyendo mejor. Para eso existe el piloto. | What we don't know yet, and it is the real question: adoption. An app working and an app becoming part of the routine of someone who already has her own way of working are two different things, and the second one isn't solved by building better. That is what the pilot is for. | **Real** · `bitacora.md` 2026-09-21/23 ("the first honest adoption read Nahui has had, and it is not a technical one: the product was up the whole time") |
| `status.blocked` | Y el piloto ya está dando respuestas, empezando por la más útil: una vendedora intentó usar Nahui y no pudo. Quería invitar a alguien de confianza a vender con ella, y el flujo exigía el correo exacto de esa persona — un requisito que no estaba documentado en ninguna parte y que nadie le había dicho. El sitio y el servicio respondían normal; la falla estaba en el flujo. Quedó rastreada hasta su causa, con fecha, en la bitácora pública del proyecto (21-23 de septiembre de 2026). Un piloto que no produce fallas no está funcionando como piloto: esto es la clase de cosa que solo aparece cuando alguien de verdad lo intenta. | And the pilot is already producing answers, starting with the most useful kind: a merchant tried to use Nahui and couldn't. She wanted to invite someone she trusts to sell alongside her, and the flow required that person's exact email address — a requirement documented nowhere, and one nobody had told her about. The site and the service were both responding normally; the failure was in the flow. It was traced to its cause, dated, in the project's public log (21-23 September 2026). A pilot that produces no failures isn't working as a pilot: this is the kind of thing that only surfaces when someone actually tries. | **Real** · `bitacora.md` 2026-09-21/23, verbatim: *"a seller had tried to use the app that day and couldn't… the site returned 200… not an outage… The invite flow requires an exact email match, and nobody had told the owner that."* **§10.4.** *No dice que esté arreglado, porque la fuente no lo dice: dice rastreado* |
| `status.body3` | Para que quede claro de una vez: Nahui no tiene ingresos, no tiene números de crecimiento y no tiene una cifra de adopción que presentar. Si los tuviéramos, estarían en esta página. | To be plain about it: Nahui has no revenue, no growth numbers, and no adoption figure to show. If we had them, they would be on this page. | **Real** · no existen en el repositorio |
| `status.body4` | Lo que sí hay: un piloto chico con dos negocios reales, un problema que salió de una persona y no de una suposición, y un ciclo que ya demostró cerrar — una vendedora dice algo, se vuelve una decisión fechada, se construye. | What there is: a small pilot with two real businesses, a problem that came from a person rather than an assumption, and a loop that has already demonstrably closed — a merchant says something, it becomes a dated decision, it gets built. | **Real** · el ciclo se sostiene en los tres casos de §4.4 (D54, D65, `backlog.md` §Product Discovery), **no** en la entrada 2026-09-21/23 — re-verificado en la cuarta pasada (§10.4) |

**`status.body3` quedó palabra por palabra en las cuatro revisiones.** `brand-guardian` lo revisó como una de las tres líneas más expuestas y no pidió cambiarlo; la Product Owner lo señaló como la línea más fuerte de la página. Pasa la prueba de humildad actuada, que es distinta de pasar la de honestidad: el sujeto de la segunda frase no es la carencia, es el comportamiento de esta página — *"si los tuviéramos, estarían aquí."*

**Orden y maquetación de esta sección, vinculante (`ui-designer`).** Cinco bloques, en este orden: `body1` → `body2` → `blocked` → `body3` + `body4` **juntos, en el mismo bloque, en ese orden**. Tres reglas:
1. **`status.blocked` se maqueta como un caso, no como un descargo.** Tiene fecha, causa y fuente verificable: trátalo como la evidencia que es. Sin fondo de alerta, sin icono de error, sin tipografía más chica que el resto.
2. **`body3` nunca cierra la sección y nunca queda solo en una tarjeta.** `body4` va inmediatamente después, siempre.
3. **`blocked` y `body3` no comparten tratamiento visual.** Una es un defecto encontrado y rastreado; la otra, la ausencia de cifras. Apilarlas con el mismo estilo las vuelve "dos malas noticias", que es el defecto que la tercera pasada corrigió.

**Lo que esta sección deliberadamente NO dice** (BRIEF §4, el "honesto difícil"): no hace un recuento negocio por negocio del estado de adopción de las dos vendedoras del piloto. Sí dice, con fecha y causa, el defecto concreto que trancó a una de ellas (`status.blocked`) — porque eso es evidencia de que el piloto funciona, no una métrica de adopción. Lo que sigue fuera es el detalle por persona, que no le sirve al lector y sí expone a las vendedoras.

**Y la distinción que se mantiene: en ningún lugar de la página se dice que las vendedoras del piloto *estén usando* Nahui hoy.** Se dice que hay **dos negocios reales dados de alta en producción**, que es lo que es verdad. Esa distinción es intencional en `meta.description`, `meta.ogDescription`, `hero.lead` y `today.lead`, **y es la razón de que la corrección del 2026-10-08 fuera una línea y no una reescritura**: si la página hubiera dicho "dos vendedoras usando Nahui", habría sido falsa en cuatro lugares en lugar de uno. **Por favor no se "simplifique" a "usando" en una revisión de estilo, en ninguno de los dos idiomas.** `status.blocked` ahora hace esa distinción explícita para el lector, en lugar de solo cuidadosa.

*Corregido 2026-10-08: esta nota antes decía "dos de tres vendedoras del piloto", citando `BRIEF.md` §4. El piloto son **dos** negocios. `BRIEF.md` §4 todavía trae la cifra vieja; está fuera de la propiedad de `marketing` y queda reportado para ruteo (§10.2).*

### 4.6 Cómo está construido — "¿por qué este proyecto y no otro, y quién está detrás?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `built.title` | Cómo está construido | How it's built | — |
| `built.lead` | Nahui la construye Claudia Falcón, desde México, con un equipo de agentes de IA con roles separados — producto, arquitectura, UX, revisión, marca. Ella decide qué se construye, en qué orden y qué se descarta; los agentes proponen, construyen y se revisan entre sí. Lo interesante no es la herramienta: es que el método deja rastro. | Nahui is built by Claudia Falcón, in Mexico, with a team of AI agents in separate roles — product, architecture, UX, review, brand. She decides what gets built, in what order, and what gets dropped; the agents propose, build, and review each other's work. The interesting part isn't the tooling: it's that the method leaves a trail. | **Real** · `company/CLAUDE.md` §How we operate; `.claude/agents/`. **Nombre y forma escrita confirmados por la Product Owner el 2026-10-08** — "Claudia Falcón", con acento, es la forma que ella eligió para esta página (su nombre legal completo es más largo). Coincide además con el handle `claudiafalcon` y con el autor de los commits, así que un evaluador que da clic ve el mismo nombre. §8.13 |
| `built.item1.title` | Registro de decisiones | Decision log | **Real** |
| `built.item1.body` | Cada decisión de producto queda escrita, fechada y con su razón — incluyendo las que después se revocaron, que no se borran. Hoy son más de 80. | Every product decision is written down, dated, and reasoned — including the ones later reversed, which are never deleted. There are more than 80 of them today. | **Calculado** · 84 entradas contadas en `product/00-foundation/decision-log.md` al 2026-10-08 (§10.2) |
| `built.item2.title` | RFCs | RFCs | **Real** |
| `built.item2.body` | Un cambio al modelo del negocio no se hace y luego se documenta. Se propone por escrito, se discute y se acepta antes de tocar nada. | A change to the product's model of the business doesn't get made and then documented. It gets proposed in writing, argued, and accepted before anything is touched. | **Real** · `product/99-rfc/` (18 RFCs numerados, §10.2) |
| `built.item3.title` | Revisión por especialistas | Specialist review | **Real** |
| `built.item3.body` | Cada entrega pasa por revisión de UX, por revisión de consistencia contra la base del producto, y por un recorrido completo de la app hecho por un agente que actúa como una vendedora que la ve por primera vez. Ese agente es un agente, no una vendedora real: corre antes de que una persona real vea algo, precisamente para no gastarle su tiempo en errores que podíamos encontrar nosotros. | Every deliverable goes through a UX review, a consistency review against the product foundation, and a full walkthrough of the app by an agent acting as a merchant seeing it for the first time. That agent is an agent, not a real merchant: it runs *before* any real person sees anything, precisely so we don't spend her time on problems we could have caught ourselves. | **Real** · `.claude/agents/merchant-user-tester.md`; `company/CLAUDE.md` §Experience Validation. *Y `status.blocked` dice honestamente dónde esta capa no alcanzó: el requisito del correo exacto solo apareció cuando una persona real lo intentó* |
| `built.item4.title` | Bitácora | Bitácora (the project log) | **Real** |
| `built.item4.body` | La historia del proyecto en un solo lugar: qué pasó, por qué importó y dónde está el detalle completo. Incluye los defectos y las correcciones, no solo los avances. | The project's history in one place: what happened, why it mattered, and where the full detail lives. Defects and corrections included, not just progress. | **Real** · `company/bitacora.md` — la entrada 2026-09-21/23, fuente de `status.blocked`, es un ejemplo literal de esto |
| `built.item5.title` | Todo esto es auditable | All of this is auditable | **Real** |
| `built.item5.body` | El repositorio es público. El registro de decisiones, los RFCs, los hallazgos de las revisiones y la bitácora están ahí, con su historia de cambios. Lo que esta página afirma sobre el método se puede verificar sin pedirnos permiso. | The repository is public. The decision log, the RFCs, the review findings and the project log are all in it, with their edit history. What this page claims about the method can be verified without asking us for access. | **Real** · `github.com/claudiafalcon/nahui`, confirmado público el 2026-10-08. **Enlace aprobado, condicionado — §8.2** |
| `built.lab` | Hay un segundo objetivo declarado, además del comercial: que Nahui sea también un laboratorio real de ingeniería de IA — memoria de largo plazo, colaboración entre agentes, orquestación, gobernanza. Está escrito como directiva de la empresa, con su propio cuaderno de decisiones, y con una regla explícita: nunca meter IA en una función donde no le dé valor a la vendedora. | There's a second stated objective alongside the commercial one: that Nahui also be a real laboratory for AI engineering — long-term memory, multi-agent collaboration, orchestration, governance. It is written down as a company directive, with its own decision notebook, and with an explicit rule attached: never force AI into a feature where it gives the merchant no value. | **Real** · `company/CLAUDE.md` §Secondary strategic objective; `company/ai-lab-decisions.md`; `architecture-principles.md` #8 |
| `built.repoLink` | Ver el repositorio | View the repository | — · §8.2 |

**Sobre nombrar a la Product Owner.** Decisión suya (2026-10-08), emparejada con el enlace al repositorio: el enlace ya expone el nombre, así que nombrarla es consistencia, no exposición nueva. La única restricción de `brand-guardian` para este caso es de registro: **factual, nunca un mito de fundadora.** Por eso `built.lead` dice lo que ella hace y nada sobre su camino o su motivación. Una línea alcanza. **La forma escrita ya no es una inferencia: la confirmó ella.** Vale decirlo porque fue una inferencia desde metadatos del repositorio durante dos pasadas, y esa clase de inferencia es exactamente la que produjo el error de la cifra del piloto (§10.2).

**Sobre la persona gramatical.** `built.lead` nombra a una persona porque ya hay a quién nombrar. El "nosotros" de autoría e incertidumbre sigue vivo donde le corresponde — `problem.learnedBy` y `status.body1/2/3` — que es lo que la regla protege: autoría e incertidumbre, nunca destino. Por la misma regla, "no sabemos todavía" nunca se escribe como "Nahui no sabe".

### 4.7 Lo que sigue — "¿a dónde va?"

Aplica el *roadmap-honesty pattern* de `brand/storytelling.md` (**Decision**): nada sin construir en tiempo presente, y cada cosa con su etiqueta. **Guardarraíl:** una etiqueta se corrige el día que la realidad cambia, en cualquier dirección. **Y para superficies bilingües:** las etiquetas son parte de la afirmación — un ítem etiquetado como futuro en un idioma y presente en el otro es el defecto más grave que esta página puede publicar.

| ID | Español | English | Evidencia |
|---|---|---|---|
| `next.title` | Lo que sigue | What's next | — |
| `next.lead` | Tres etiquetas, sin medias tintas. | Three labels, no hedging. | — |
| `next.tag.built` | Ya construido | Built | — |
| `next.tag.progress` | En camino | In progress | — |
| `next.tag.hold` | Detenido a propósito | Deliberately on hold | — |
| `next.item1.title` | Registro de ventas | Sale registration | **Real** |
| `next.item1.body` | Construido y en producción. Su barra — 9 de cada 10 ventas, menos de 3 segundos — es el estándar con el que se mide, y es la prioridad número uno del proyecto hasta que se cumpla. | Built and in production. Its bar — 9 out of 10 sales, under 3 seconds — is the standard it gets measured against, and it stays the project's top priority until it is met. | **Real** · `backlog.md` #1 · etiqueta `next.tag.built` |
| `next.item2.title` | Clientes frecuentes | Frequent customers | **Proyectado** |
| `next.item2.body` | Distinguir a quien compra poquito pero en cada bazar de quien compra mucho pero una vez al año. Hoy una vendedora no tiene con qué saberlo: sus clientas la siguen por redes, no por nombre. Está diseñado y especificado; su construcción va después del registro de ventas, no antes. | Telling apart the customer who buys a little at every *bazar* from the one who buys a lot once a year. Today a merchant has nothing to tell them apart with: her customers follow her on social media, not by name. It is designed and specified; building it comes after sale registration, not before. | **Real** para el problema y el estado de diseño; **Proyectado** para la capacidad · `backlog.md` #2 · etiqueta `next.tag.progress` |
| `next.item3.title` | A qué bazar conviene ir | Which *bazar* is worth attending | **Proyectado** |
| `next.item3.body` | Hoy esa decisión se toma sin datos: sin afluencia, sin clima, y con costos de entrada que van de un par de miles a varios miles de pesos por evento, según el bazar. Resolverlo necesita datos de muchas vendedoras, y Nahui todavía no los tiene. Por eso está detenido a propósito: se construiría sobre nada. | Today that decision gets made with no data: no footfall, no weather, and entry costs running from a couple of thousand to several thousand pesos per event, depending on the *bazar*. Solving it needs data from many merchants, and Nahui doesn't have that yet. So it is deliberately on hold — it would be built on nothing. | **Real** para la fricción y el rango de costos (`market-validation.md` §1d, observación informal de primera mano); **Proyectado** para la capacidad · `backlog.md` #3 · etiqueta `next.tag.hold` |

**Sobre el rango de costos — corregido 2026-10-08.** Esta línea antes decía "de unos cientos a varios miles de pesos": **el extremo bajo no tenía fuente.** "De un par de miles a varios miles" sí corresponde a lo observado. El error era hacia abajo y es el mismo defecto: una cifra que nadie midió. En la página **no** van las cifras exactas ni los nombres de los recintos (BRIEF §5). *También corregido: esta nota antes repetía las dos cifras exactas, lo que anulaba el propósito de no publicarlas en un repositorio público que esta página enlaza.*

**Nota de registro:** dice "esa decisión se toma sin datos", no "se decide a ciegas" — lo que falta es el dato, no la vista de la vendedora, que es la diferencia exacta que `brand/tone-of-voice.md` marca entre una carencia de herramienta (permitida) y un juicio sobre la persona (prohibido). Misma regla en `next.item2.body`. Y el cierre dice "detenido a propósito", recogiendo su propia etiqueta, en lugar de sonar a omisión.

**Lo que explícitamente NO va:** "De la foto a tu inventario". No está en `backlog.md`, no es una decisión de Nahui, y la versión anterior de la página la anunciaba como comprometida (BRIEF §4). No va en ningún encuadre.

### 4.8 Contacto — "¿y ahora qué?"

| ID | Español | English | Evidencia |
|---|---|---|---|
| `cta.title` | Para quien evalúa proyectos en esta etapa | For anyone evaluating projects at this stage | — |
| `cta.lead` | Nahui está en piloto y en una etapa en la que platicar sirve más que presentar. Quien evalúe proyectos así, o tenga interés en lo que estamos aprendiendo del piloto, puede escribirnos a ihola@nahui.app. | Nahui is in pilot, at a stage where a conversation is worth more than a pitch. Anyone who evaluates projects at this stage, or who is interested in what we are learning from the pilot, can write to us at ihola@nahui.app. | **Real** · dirección confirmada por la Product Owner el 2026-10-08, **y verificada en vivo: el buzón recibe correo** (prueba del 2026-10-08, 06:56). Es además el canal ARCO publicado en el Aviso de Privacidad de `www.nahui.app`. §8.1 |
| `cta.contact` | Escribir a ihola@nahui.app | Write to ihola@nahui.app | — · `mailto:ihola@nahui.app` · 🟢 §8.1 |
| `cta.product` | Ver la app | Open the app | — |
| `cta.productNote` | Es la app real, en producción. Pide una cuenta para entrar: no es un demo. | This is the real app, in production. It asks for a sign-in: it isn't a demo. | **Real** · `www.nahui.app`; `demo.nahui.app` no se enlaza (BRIEF §6, D61) |
| `cta.repo` | Leer cómo se construyó | Read how it was built | — · §8.2 |

**Nota de registro, vinculante: en español esta página no le habla de tú al lector, ni en los CTAs.** El "tú" acompañante es de la vendedora, y prestarlo para convencer a un tercero gasta su relación en una decisión que no es suya. Por eso los CTAs van en infinitivo y `cta.title`/`cta.lead` son impersonales. La carve-out de CTAs sigue en pie — nombrar una función que el visitante elige está bien; pedirle prestado el registro familiar de la vendedora es lo que queda fuera.

**La dirección se escribe completa, con la "i" inicial visible, en los dos idiomas.** El Aviso de Privacidad vivo hace la misma aclaración ("la primera letra es una i"), porque `ihola@` se lee como un typo de `hola@`. En esta página la aclaración no hace falta — la dirección aparece escrita, no narrada — pero **no se abrevie a "escríbenos" sin la dirección a la vista**: el string es el destino y el destino es el string.

### 4.9 Pie

| ID | Español | English | Evidencia |
|---|---|---|---|
| `foot.made` | © 2026 Nahui · Hecho en México | © 2026 Nahui · Made in Mexico | **Real** |
| `foot.stage` | Proyecto en piloto. Esta página se actualiza cuando cambia el estado, no cuando conviene. | A project in pilot. This page gets updated when the status changes, not when it is convenient. | **Real** — y es una promesa operativa: si se publica, alguien tiene que mantenerla. **Ya se cumplió dos veces antes de publicarse:** `status.body1` se corrigió el día que se supo que su atribución estaba mal, y esta celda de §8.3 se corrigió el día que verifiqué que el aviso sí existe (§10.4, §10.5) |
| `foot.privacy` | Aviso de privacidad | Privacy notice (in Spanish) | **Real** · `https://www.nahui.app/aviso-de-privacidad.html` — verificado vivo el 2026-10-08: título "Aviso de Privacidad — Nahui", actualizado el 8 de octubre de 2026. 🟢 **Desbloqueado, §8.3** |
| `foot.repo` | Repositorio público | Public repository | — · §8.2 |

**Sobre "(in Spanish)" en `foot.privacy`:** es la única asimetría declarada entre los dos idiomas, y es un hecho, no una afirmación más débil — el aviso solo existe en español. Declararlo es más honesto que ofrecer un enlace que el lector inglés no espera. Si alguna vez existe una versión inglesa, esta glosa se borra el mismo día.

**El tagline no se repite en el pie.** Va una sola vez, en el lockup del hero.

---

## 5. CTAs — qué hace cada uno y a dónde apunta

**Ya no hay ningún CTA bloqueado.** Los cuatro destinos están verificados y fechados.

| CTA | Dónde aparece | Qué hace | Destino | Estado |
|---|---|---|---|---|
| **Primario — `cta.contact`** | Hero y contacto (mismo string, mismo destino) | Abre el correo del lector con el destinatario puesto | `mailto:ihola@nahui.app` | 🟢 **Resuelto y verificado.** Dirección confirmada por la Product Owner y **probada en vivo el 2026-10-08 a las 06:56: el buzón recibe correo.** Sin condiciones, sin marcador de pendiente. Nótese la **i** inicial (`ihola@`, no `hola@`): `marketing-operating-environment.md` §1 proponía la segunda, la real es la primera, y el Aviso de Privacidad vivo lo aclara igual |
| **Secundario — `cta.product`** | Hero y contacto | Abre la app real en una pestaña nueva | `https://www.nahui.app` | 🟢 Verificado vivo el 2026-10-08. **Siempre con `cta.productNote`**, para que nadie llegue esperando un demo |
| **Terciario — `cta.repo` / `foot.repo` / `built.repoLink`** | "Cómo está construido" y pie | Abre el repositorio público | `https://github.com/claudiafalcon/nahui` | 🟢 **Aprobado, condicionado.** Público, 465 commits. Condición de la Product Owner: **no se publica hasta que la pasada de privacidad esté aterrizada** — estado exacto en §8.2 |
| **Pie — `foot.privacy`** | Pie | Abre el aviso de privacidad | `https://www.nahui.app/aviso-de-privacidad.html` | 🟢 **Desbloqueado el 2026-10-08.** Verificado por mí en esta pasada: existe, se titula "Aviso de Privacidad — Nahui", actualizado el 8 de octubre de 2026, y da `ihola@nahui.app` como contacto ARCO. **Vive en `www.nahui.app`, no en `demo.nahui.app`**, así que no choca con ninguna prohibición del BRIEF §6. §8.3, §10.5 |
| *(No incluido)* Facebook | — | — | `facebook.com/NahuiApp` | ⛔ **No lo incluí.** No pude verificar que la Página exista públicamente. Enlazar una Página que no existe, en una página para inversionistas, es el tipo de detalle que descuenta todo lo demás. §8.4 |

**Prohibiciones duras de enlace (BRIEF §6):** ningún enlace apunta a `demo.nahui.app` (build retirado, D61, truena en `/invite/`). No se toca DNS: ni raíz, ni `www`, ni `demo`, ni `loyalty` — hay vendedoras reales en producción detrás de esos dominios. *Nota: enlazar una página que ya está servida en `www.nahui.app` no es tocar DNS. `foot.privacy` no toca nada.*

---

## 6. Notas de implementación para `ui-designer` (contenido, no layout)

1. **El español va en el HTML.** Las 2 versiones existen como contenido real; el script solo intercambia. La página tiene que leerse completa sin JavaScript, en español (BRIEF §6).
2. **El inglés es una versión completa, no un resumen.** Misma sección, mismo peso, mismo orden, misma etiqueta de evidencia, misma fuerza. **Ninguna de las dos matiza donde la otra afirma, ninguna se disculpa donde la otra declara, y ninguna cifra ni atribución cambia entre idiomas.** Única excepción: el texto dentro del celular del hero.
3. **El celular del hero muestra el producto real.** No un render inventado, no números falsos (BRIEF §6). Y vinculante por privacidad: **el surtido en pantalla usa el mapa de sustitución aprobado el 2026-08-10 — Bolsas, Accesorios, Playeras, Gorras — y el nombre de negocio sustituto, Luna Mercado; nunca los reales.** Si la captura trae datos reales, no se "difumina": se vuelve a generar. *Confirmado 2026-10-08: los sustitutos ya están aplicados en todo el repositorio y los valores reales ya no están registrados en ninguna parte del árbol de trabajo (commit `826393f`), así que cualquier captura generada desde el prototipo actual ya es segura — pero la regla se queda escrita, porque una captura vieja no se actualizó sola.*
4. **Jerarquía si hay que recortar para el 15 de octubre.** Mínimo publicable y honesto: Hero + El problema + Qué existe hoy + Cómo va + pie. **"Cómo va" no se recorta**, y dentro de ella **`status.blocked` no se recorta antes que `body3`/`body4`** — es lo que vuelve la sección evidencia en lugar de postura. Recortable: "Cómo está construido", "Lo que sigue", "Lo que las vendedoras cambiaron", en ese orden. *Si se recorta "Cómo está construido", el nombre de la Product Owner se mueve al pie — no desaparece, porque el repositorio sigue enlazado.*
5. **Nada numérico decorativo.** Las únicas cifras son las de §10.2, todas con fuente verificada.
6. **`problem.learned` no se maqueta como testimonio.** Ver §4.2.
7. **Tres cosas se quedan en español dentro del inglés:** *Nahui*; *bazar/bazares*, nunca "bazaar", glosado una sola vez en `hero.lead`; y las etiquetas de pantalla (Inventario, Eventos, Resultados, Exportar, Equipo, Bitácora), glosadas la primera vez. Las descripciones de capacidad que no son etiquetas de pantalla sí van en inglés.
8. **Ningún "tú" al lector en español, en ningún string.** Grepeable: `tu `, `tus `, `te `, `ti`, `tuyo`, `registras`, `escríbenos`, `pruébala`; en inglés `your`, `you`. Si aparece en el HTML final es un defecto de clase Blocker.
9. **Cada versión se redactó en su propio idioma desde la misma lista de hechos.** Si hay que cambiar una afirmación, se cambia en las dos columnas en la misma pasada.
10. **El tagline va en inglés en las dos versiones**, una sola vez, en el lockup del hero, subordinado al titular. No se traduce, no se repite en el pie, no se pone al peso de un titular.
11. **El layout no puede reintroducir la humildad actuada que el texto corrigió (§10.3).** **(a)** `today.bar` no se maqueta como advertencia. **(b)** `today.notYet` y `today.bar` no comparten tratamiento visual ni se apilan como dos bloques muted. **(c)** `status.body3` y `status.body4` van juntos, en ese orden, en el mismo bloque; `body3` nunca cierra la sección. **(d)** `status.blocked` se maqueta como caso con fecha y causa, no como descargo, y no comparte estilo con `body3`. Ver §4.5.
12. **La dirección de contacto tiene que coincidir, carácter por carácter, con la del Aviso de Privacidad vivo.** `ihola@nahui.app` está publicada ahí como canal ARCO (verificado 2026-10-08). Si alguna vez cambia, cambia en los dos el mismo día — una página que ofrece un correo distinto al de su propio aviso legal es un defecto de confianza, no un detalle. Y el `mailto:` se escribe completo: sin alias, sin formulario intermedio, sin redirección.

---

## 7. Omisiones deliberadas — qué NO va en la página

### 7.1 Tamaño de mercado / TAM — omitido a propósito

Busqué una cifra citable para el segmento real de Nahui (vendedoras itinerantes de bazar privado en México) y **no existe una**. Lo que hay son cifras de informalidad del INEGI: ~33 millones de personas en informalidad laboral a diciembre de 2025 (54.6% de la población ocupada), 12.4 millones ocupadas en comercio en general, 16.8 millones en empleo informal. Las tres describen poblaciones **órdenes de magnitud más grandes y estructuralmente distintas**, y ninguna se puede recortar honestamente hasta el segmento de Nahui.

Poner "33 millones" sería un TAM inflado por sustitución: la clase de afirmación que, al descubrirse, descuenta todo lo demás. Hay una segunda razón, de registro: el vocabulario con que se citan esas cifras ("informalidad", "no bancarizados", "sin acceso a") describe a una población como una carencia, y `brand/tone-of-voice.md` lo prohíbe en cualquier superficie externa — una sección de mercado así sería el relato de rescate vestido de oportunidad. **Recomendación:** sin sección de mercado hasta que haya una estimación propia, construida y mostrada, etiquetada **Calculado**, con el método a la vista. Puedo prepararla si la Product Owner la quiere.

### 7.2 Lo demás que queda fuera, y por qué

| No va | Razón |
|---|---|
| "En segundos" / cualquier promesa de velocidad | No existe una sola medición de latencia en el repositorio. `today.bar` publica el estándar en su lugar |
| "Probamos cada paso con vendedoras reales" | La prueba por paso la corre `merchant-user-tester`, un agente que por definición corre **antes** de que una vendedora real vea algo. `built.item3.body` lo dice tal cual |
| Ingresos, crecimiento, tracción, usuarios activos | No existen. `status.body3` lo declara |
| **"El producto se sostiene / aguanta / funciona bien para las vendedoras"** | La fuente dice lo contrario para una de ellas: intentó usarlo y no pudo (`status.blocked`). Lo que sí se puede afirmar es que corre en producción y que un recorrido completo en un teléfono real lo ejercitó — `status.body1`. §10.4 |
| **Atribuir a una vendedora un recorrido, una prueba o un dispositivo que fue de la Product Owner** | Pasó. La entrada 2026-09-21/23 dice *"on her own account and device"*. Si una afirmación depende de quién hizo algo, se lee la fuente completa |
| "De la foto a tu inventario" | No es un elemento del roadmap de Nahui (BRIEF §4) |
| Nombre, negocio, surtido, zona, edad o bazares de la vendedora del piloto; nombres de recintos; cifras exactas de costo de evento | BRIEF §5. Aplica también a `status.blocked` y **a este archivo**, que vive en el repositorio que la página enlaza |
| Cualquier cita atribuida a una vendedora real | Nadie ha dado su consentimiento. `brand/storytelling.md` lo tiene como pregunta **abierta** |
| Precios, planes, tiers | El modelo de negocio es direccional (`company/CLAUDE.md`); `business-decisions.md` Q11 sigue abierta |
| Headcount, biografías, mito de fundadora | La Product Owner **sí** va nombrada (§8.13), en una línea factual. Lo demás no: no hay más personas que nombrar, y un arco de origen está fuera de registro |
| Logos de clientes, testimonios, reseñas | No existen |
| Atributos y promesa de marca de `company/brand/brand-guide.md` | Afirmaciones sobre cómo alguien percibe a Nahui — **Hypothesis**, no publicables en superficie externa (`brand/CLAUDE.md`, 2026-10-08) |
| Lecturas del símbolo ("una brújula", "brazos abiertos", "memorable") | **Hypothesis**; `brand/visual-language.md` lo extendió a cualquier superficie externa. El símbolo se muestra; no se interpreta |
| Comparaciones con competidores | No hay análisis competitivo verificado en el repositorio |
| **Autodesprecio, disculpas por ser temprano, encuadres tipo "la parte incómoda"** | `brand/tone-of-voice.md` failure mode 6: tan off-brand como el pitch inflado, y falla por la misma razón — vuelve la postura de Nahui el sujeto en lugar de los hechos. Los límites se dicen completos; no se dramatizan. §10.3 |

---

## 8. Decisiones de la Product Owner — todas tomadas y todas verificadas al 2026-10-08

**La numeración no se reacomoda.** **No queda ninguna decisión de contenido abierta y ninguna verificación pendiente.** Lo único que no depende de este documento es la URL propia de la página (§8.11), que es DNS.

**🟢 Resueltas**

1. **Dirección de contacto — RESUELTA Y VERIFICADA.** `ihola@nahui.app` (con la **i** inicial). Sustituye la propuesta `hola@nahui.app` de `marketing-operating-environment.md` §1, que era un plan. **El buzón recibe correo: probado en vivo el 2026-10-08 a las 06:56.** Mi bandera anterior ("no publicar una dirección que no recibe") queda satisfecha y retirada — la dirección va sin condiciones ni marcador de pendiente. **Dos cosas que esto además resuelve:** la dirección ya está publicada como canal ARCO en el Aviso de Privacidad vivo de `www.nahui.app`, así que la página queda consistente con un documento legal en lugar de adelantarse a él; y la aclaración de la "i" que ese aviso hace confirma que el riesgo de leerla como typo es real y conocido (§4.8, §6.12).
2. **Enlace al repositorio — APROBADO, CONDICIONADO.** Público, 465 commits. **Condición: la pasada de privacidad aterriza primero.** Estado: ✅ `company/market-validation.md` hecha. ✅ "Ana" es pseudónimo, confirmado — no era exposición. ✅ `company/CLAUDE.md` corregido por quien lo posee. ✅ **El nombre real del negocio de la vendedora del piloto ya no está en el árbol de trabajo**: aparecía 24 veces en 7 archivos y se sustituyó por **Luna Mercado** en todo el repositorio (commit `826393f`), incluida la entrada de `bitacora.md` que registraba la decisión de no publicarlo republicándolo junto con el mapeo completo. ⚠️ **Pendientes de ruteo:** `.claude/agents/merchant-user-tester.md` (surtido + zona + rango de edad en una sola frase), `company/jobs-to-be-done.md`, `product/00-foundation/decision-log.md` D33 (nombres de recinto y cifras exactas), `company/bitacora.md` (cifras), `landing/BRIEF.md` §4 (cifra vieja del piloto) y §5. **No se publica el enlace hasta que estén.**
3. **Aviso de privacidad — RESUELTO, y con dos correcciones a lo que este documento traía mal.** Destino: `https://www.nahui.app/aviso-de-privacidad.html`. **Lo verifiqué en esta pasada en lugar de darlo por bueno de oídas:** existe, se titula "Aviso de Privacidad — Nahui", dice actualizado el **8 de octubre de 2026**, y da `ihola@nahui.app` como contacto para derechos ARCO. *Corregido forward: este punto decía antes (a) que el aviso "vivía en `demo.nahui.app`, que no se enlaza" y (b) que "no hay copia en el repositorio" y por tanto no había destino publicable. Las dos afirmaciones estaban equivocadas — el aviso está servido en `www.nahui.app`, que es el dominio de la app real, y enlazarlo no toca DNS ni roza ninguna prohibición del BRIEF §6.* Era el último 🔴 de la página.
4. **¿Facebook?** No pude verificar que la Página exista públicamente. Si existe y está presentable, se agrega como CTA terciario; si no, recomiendo omitirla.
5. **¿Se dice que busca inversión?** `cta.lead` es honestamente ambiguo. Variante explícita si la quiere: *"Nahui está en piloto y abierta a conversaciones de inversión temprana. Quien quiera tenerla, puede escribirnos a ihola@nahui.app."* / *"Nahui is in pilot and open to early-stage investment conversations. Anyone who'd like to have one can write to us at ihola@nahui.app."*
6. **Registro de género en español.** Opción 4 provisional. La regla que se adopte **se aplica a la vez a superficies internas y externas**. Mientras siga abierta no es hallazgo de revisión.
7. **Tagline — RESUELTO Y EN LA PÁGINA.** *"The path to what's next"*, en inglés en los dos idiomas. Cierra la pregunta abierta #4 de `brand/CLAUDE.md`. **`brand/CLAUDE.md` y `brand/visual-language.md` todavía lo registran como abierto; son de `brand-guardian` — reportado para ruteo.**
8. **Número de negocios — RESUELTO: son DOS.** *"y si que haya numero de negocios y son 2 no 3."* Idéntico en los dos idiomas, en cinco strings. Mi borrador decía tres y estaba mal (§10.2).
14. **Registro: honesto, no modesto — RESUELTO (tercera pasada).** *"una cosa es ser honesto y otra cosa decir no servimos para nada."* Aplicado sin quitar un hecho (§10.3). Gobierna cualquier revisión futura tanto como la regla de honestidad: **las dos obligan a la vez y no están en tensión.**
15. **Atribución y el defecto del piloto en la página — RESUELTO (cuarta pasada).** El recorrido del 2026-09-21/23 fue **de la Product Owner**, en su cuenta y su dispositivo, y *"sí lo ha intentado usar pero no ha podido, por ejemplo enviar invitación y cosas así."* `status.body1` reescrito; `status.blocked` agregado. §10.4.

**🔵 Para el registro**

9. **`brand-guardian` ya entregó.** `brand/tone-of-voice.md` §"Speaking about Nahui to an investor or evaluator" y `brand-principles.md` #8 (commit `6670749`). Las tres líneas que marqué como más expuestas (`hero.title`, `status.body3`, `built.lead`) sobrevivieron. Autoverificación: §10.
10. **Consulta a `knowledge-mentor` — recomendada.** *"¿cómo trata la literatura de innovation accounting / Lean Startup la presentación de avance ante evaluadores externos cuando no hay métricas de tracción — qué se reporta en lugar de crecimiento, y cómo se evita que la honestidad se lea como falta de avance?"* La tercera y la cuarta pasada la volvieron más pertinente: la segunda mitad de esa pregunta es el defecto que la Product Owner encontró, y `status.blocked` es un intento de contestarla por razonamiento propio. Vale tener la teoría antes de la siguiente revisión de §3 y §4.5.
11. **La URL propia de esta página no está resuelta** y no se puede tocar DNS antes del 15 de octubre (BRIEF §7). `meta.url` y `og:url` dependen de eso. **Es la única cosa de esta página que sigue abierta, y no es contenido.**
12. **Errores de cita en el BRIEF, para corregir donde corresponda.** §7 cita `company/business-decisions.md` Q26 para un hecho que está en `product/02-ux/product-decisions.md` Q26 (y es sobre otra cosa); el hecho está bien respaldado en `bitacora.md` 2026-09-21/23. §4 trae la cifra vieja del piloto ("dos de tres vendedoras"). Misma ruta de corrección.
13. **La Product Owner va nombrada — RESUELTO Y CONFIRMADO.** Escrito en `built.lead`, factual, una línea. **La forma escrita es "Claudia Falcón", con acento, confirmada por ella el 2026-10-08** — su nombre legal completo es más largo y esta es la forma que eligió para la página. Coincide con el handle `claudiafalcon` y con el autor de los commits, así que un evaluador que da clic en el repositorio ve el mismo nombre. **Mi bandera anterior queda retirada:** durante dos pasadas esto fue una inferencia desde metadatos del repositorio, y lo marqué como tal precisamente porque esa clase de inferencia produjo el error de la cifra del piloto. Ahora es un dato confirmado por la persona.

---

## 9. Checklist de verdad de producto — para `reviewer` y para quien apruebe

- [ ] Ninguna capacidad descrita en tiempo presente está sin construir. Las tres de "Lo que sigue" llevan etiqueta, **en los dos idiomas**.
- [ ] No aparece "en segundos" ni ninguna promesa de velocidad. `today.bar` publica la barra y dice que no está cumplida ni medida.
- [ ] **Los cuatro hechos de `today.bar` siguen ahí.** La tercera pasada cambió el sujeto, no los hechos (§10.3).
- [ ] **Cada cifra tiene fuente verificada en §10.2.** El piloto son **dos** negocios, idéntico en los dos idiomas.
- [ ] **Ninguna afirmación atribuye a una vendedora algo que hizo la Product Owner, ni al revés** (§10.4). `status.body1` dice "en un teléfono real", no "de una vendedora".
- [ ] **Nada en la página dice que el producto "se sostiene" o "funciona" para las vendedoras del piloto.** `status.blocked` dice lo que de verdad pasó.
- [ ] `status.blocked` no afirma que el defecto esté arreglado — la fuente dice rastreado, no resuelto.
- [ ] No se afirma prueba por paso con vendedoras reales. `built.item3.body` dice que ese agente es un agente.
- [ ] No hay ingresos, crecimiento, tracción ni cifra de adopción. `status.body3` lo niega, con `body4` inmediatamente después.
- [ ] **Ningún pasaje vuelve la postura de Nahui el sujeto de la frase** — ni inflándola ni disculpándola (failure modes 5 y 6). §10.3.
- [ ] No aparece "De la foto a tu inventario", en ningún encuadre.
- [ ] La vendedora del piloto no es identificable: sin surtido, sin zona, sin edad, sin recintos, sin cifras exactas, sin nombre de negocio real — **ni en los strings, ni en `status.blocked`, ni en las notas de este archivo, ni en la captura del hero** (§6.3).
- [ ] Ninguna palabra se le atribuye a una vendedora real.
- [ ] **Los cuatro enlaces tienen destino verificado y fechado** (§5): `mailto:` probado en vivo, app viva, repositorio público, aviso de privacidad vivo. Ninguno apunta a `demo.nahui.app`.
- [ ] **La dirección de contacto es idéntica a la del Aviso de Privacidad vivo**, carácter por carácter, con la "i" inicial (§6.12).
- [ ] En ninguna parte se dice que las vendedoras del piloto *estén usando* Nahui hoy, solo que hay dos negocios reales dados de alta en producción.
- [ ] Ningún término técnico del dominio (`Session`, `SaleItem`, `Customer`, `subscriptionTier`, `OWNER`, `SELLER`) aparece en la copia, en ninguno de los dos idiomas — incluido `status.blocked`, que dice "invitar a alguien de confianza a vender con ella".
- [ ] Las dos versiones están completas y con la misma fuerza. Excepciones declaradas: el celular del hero y el tagline.
- [ ] Ninguna afirmación tier **Hypothesis** de `/brand/` aparece en la página.
- [ ] La Product Owner aparece en una línea factual, sin arco de origen, con su nombre en la forma que ella confirmó (§8.13).
- [ ] El layout no reintroduce lo que el texto corrigió: §6.11 (a)-(d).

---

## 10. Autoverificación contra el registro de inversionista (2026-10-08)

`brand/tone-of-voice.md` §"Speaking about Nahui to an investor or evaluator" define los defectos de clase **Blocker** en esta superficie. **No encontré un archivo de reporte independiente de `brand-guardian` en `brand/`** — los cinco documentos de `/brand/` más `brand/CLAUDE.md` es todo lo que existe, y el registro quedó dentro de `tone-of-voice.md`, `character-bible.md`, `storytelling.md` y `brand-principles.md` (commit `6670749`). Las siete comprobaciones las derivé de esos documentos; si existe una lista canónica en otra parte, hay que correrla contra esta tabla.

| # | Comprobación de clase Blocker | Resultado |
|---|---|---|
| 1 | **Nahui no habla en primera persona; ninguna calidez de acompañante dirigida al lector.** | ✅ Nahui es sujeto descrito en tercera persona. El "nosotros" aparece solo en autoría/aprendizaje (`problem.learnedBy`) y en incertidumbre (`status.body1/2/3`). Sin "nosotros" de destino. El tagline es un nombre, no una promesa en primera persona. |
| 2 | **Ninguna segunda persona, en ningún idioma.** | ✅ Corregidos seis casos en la segunda pasada (cuatro en español, dos en inglés). Grep final: cero `tu/tus/te/ti/registras` al lector, cero `your/you`. `status.blocked` se escribió ya sin segunda persona. |
| 3 | **La vendedora es el sujeto de sus propios verbos; ningún *permitir/empoderar/habilitar* / *enable/empower/unlock/allow*.** | ✅ Ninguno de esos verbos. `status.blocked` lo refuerza en el caso más fácil de arruinar: **"una vendedora intentó usar Nahui y no pudo"**, **"quería invitar a alguien"** — ella es el sujeto de los dos verbos; el defecto es del flujo. No dice "Nahui no le permitió invitar". |
| 4 | **Ninguna descripción por carencia.** | ✅ Sin "informalidad", "no bancarizados", "sin acceso a", "underserved", "unbanked". Las faltas descritas son de **herramienta** ("no tiene con qué saberlo", "esa decisión se toma sin datos") y en `status.blocked` de **documentación nuestra** ("un requisito que no estaba documentado en ninguna parte"), no de la vendedora. |
| 5 | **Paridad: mismas afirmaciones, orden, etiquetas, fuerza — y mismas cifras y atribuciones.** | ✅ Revisado fila por fila en las cinco pasadas. `status.body1` y `status.blocked` se escribieron en los dos idiomas en el mismo movimiento — **y la atribución es idéntica: ninguna versión dice "una vendedora" donde la otra dice "un teléfono real"**. Excepción declarada única: el tagline, en inglés en las dos versiones por decisión de la Product Owner. |
| 6 | **Honestidad de roadmap y afirmaciones del tamaño de su evidencia, en las dos direcciones.** | ✅ Nada sin construir en tiempo presente. Correcciones en las dos direcciones: hacia abajo (cifra del piloto, rango de costos, dos detalles sin fuente, la atribución del recorrido, "se sostiene", y dos afirmaciones de este documento sobre el aviso de privacidad) y hacia arriba (cinco pasajes por debajo de su evidencia, §10.3). |
| 7 | **Ni registro de pitch ni humildad actuada; ninguna afirmación tier Hypothesis de `/brand/`.** | ✅ Sin verbos de categoría, superlativos, mercado-como-argumento, impulso fabricado ni vocabulario de deck. En el otro polo: fuera "la parte incómoda", fuera el apilamiento de bloques de no-todavía. **`status.blocked` es la prueba más dura de este check, porque un defecto contado mal se vuelve disculpa:** su sujeto es el piloto haciendo su trabajo, cierra en una afirmación sobre método, y no pide perdón. Ninguna afirmación Hypothesis de marca. |

### 10.1 Qué cambió en la segunda pasada

1. `built.lead` nombra a Claudia Falcón; el "nosotros" de autoría e incertidumbre se conserva donde corresponde. 2. Segunda persona eliminada, seis casos. 3. CTAs en infinitivo e impersonales. 4. `ihola@nahui.app` escrita. 5. Enlace al repositorio escrito, condicionado. 6. Tagline agregado. 7. Cifra del piloto escrita y corregida a dos. 8. *bazar/bazares* y las etiquetas de pantalla se quedan en español dentro del inglés. 9. Paridad revisada fila por fila, cinco igualaciones de fuerza. 10. Dos reescrituras por riesgo de carencia. 11. `changed.item1/2.body` corregidos contra la fuente. 12. Rango de costos corregido. 13. §8 cerrada. 14. Sin tocar: apertura por el problema, orden de secciones, `today.bar` en lugar de promesa de velocidad, `status.body3` palabra por palabra.

### 10.2 Verificación de cifras y destinos — cada dato de la página, contra su fuente

| Dato | Fuente | Verificación |
|---|---|---|
| **Dos negocios reales dados de alta** | Product Owner, 2026-10-08, con acceso a la base de producción | Declarada por ella textualmente. **No es contable desde el repositorio** — por eso el error. Si cambia, cambia en los cinco strings a la vez |
| **Más de 80 decisiones** | `decision-log.md` | Contadas: **84** entradas (`^## D`). "Más de 80" es conservador para que no envejezca hacia abajo |
| **18 RFCs** | `product/99-rfc/` | Contados: 0001-0018 más `README.md` |
| **9 de cada 10 · menos de 3 segundos** | `backlog.md` #1 | Literal: ">=90% of sales registered, <3 sec per registration", explícitamente sin cumplir |
| **5 de septiembre de 2026 · dos personas** | D54 | Literal: "2 of the earliest respondents… 2026-09-05". Decía "del piloto"; D54 dice "earliest respondents". Corregido |
| **13 de septiembre de 2026** | D65 | Literal: "Product Owner decision, 2026-09-13 — a prospective client sells toys…". D65 **no** dice que probara Nahui. Corregido |
| **3 de septiembre de 2026** | `backlog.md` §Product Discovery | Literal: "unsolicited real-merchant feedback (2026-09-03)… after trying Nahui" |
| **Tres veces** (`changed.lead`) | Los tres ítems de §4.4 | Suma de los tres casos, cada uno con fecha y entrada propia |
| **21-23 de septiembre de 2026** (`status.blocked`) | `bitacora.md` 2026-09-21/23 | Entrada leída completa. **El rango se publica como rango porque la entrada es un rango** — no se elige un día para que suene más preciso |
| **Tres defectos** (`status.body1`) | `bitacora.md` 2026-09-21/23 + D80 | Literal: "The walkthrough found three defects no code review had caught" |
| **Un par de miles a varios miles de pesos** | `market-validation.md` §1d | Corregido: el extremo bajo decía "unos cientos" y nada lo sostiene. Cifras exactas no se publican (BRIEF §5) |
| **465 commits · repositorio público** | `gh repo view`, Main, 2026-10-08 | Atribuida a quien la corrió. No aparece como cifra en la copia |
| **`ihola@nahui.app` recibe correo** | Prueba en vivo de la Product Owner, 2026-10-08 06:56 | Mensaje enviado y recibido, con confirmación de entrega. Corroborado de forma independiente: el Aviso de Privacidad vivo publica esa misma dirección como canal ARCO |
| **`www.nahui.app/aviso-de-privacidad.html` existe** | Verificación propia (`WebFetch`), 2026-10-08 | Responde; título "Aviso de Privacidad — Nahui"; actualizado 8 de octubre de 2026; da `ihola@nahui.app` para ARCO y aclara la "i" inicial. **Esta es la única verificación de esta pasada que hice yo en lugar de recibirla** — y desbloqueó el último 🔴 |
| **"Claudia Falcón", con acento** | Product Owner, confirmación directa, 2026-10-08 | Confirmada por ella como la forma que eligió para la página (su nombre legal es más largo). Durante dos pasadas fue una inferencia desde el handle y el autor de los commits, marcada como tal. Ya no lo es |

**De dónde salió el "tres" negocios.** Mi borrador citaba `bitacora.md` 2026-09-21/23 ("two of three pilot merchants") y `landing/BRIEF.md` §4 dice lo mismo. Conté desde ahí en lugar de preguntar. `bitacora.md` ya quedó corregido con su propia nota; **`BRIEF.md` §4 sigue con la cifra vieja y está fuera de mi propiedad** — reportado para ruteo. La lección: **una cifra sobre el negocio (negocios, usuarios, ingresos) no se cuenta desde artefactos del repositorio; se pide a quien tiene la fuente.** Las cifras sobre el *método* (decisiones, RFCs, commits) sí son contables, y así se verificaron. **Y las de infraestructura (un buzón, una URL) se prueban, no se citan** — que es lo que faltaba hasta la quinta pasada.

### 10.3 Auditoría de humildad actuada — failure mode 6 (tercera pasada)

`brand/tone-of-voice.md`: *"Performed humility — the over-correction… it makes Nahui's own posture the subject instead of the facts. **Honest is not modest.**"* Ese documento pone *"Somos los primeros en…"* y *"no somos nada todavía"* como **igualmente** descalibrados, en direcciones opuestas. La página se había corrido al segundo polo.

**Cambiados (6):** `today.bar` (fuera "la parte incómoda" y cuatro negaciones consecutivas; ahora el sujeto es la barra que Nahui se fijó, con los cuatro hechos intactos). `today.notYet` (de "Lo que todavía no" a "quedan fuera a propósito"; y deja de apilarse con `today.bar`). `next.item1.body` (recitaba por tercera vez el mismo faltante; ahora "hasta que se cumpla"). `next.item3.body` ("no se está construyendo" → "detenido a propósito", recogiendo su propia etiqueta). `problem.evidence` (reencuadrado, con "decir exactamente cuánta hay es parte del argumento"; **"es poca — una vendedora no es un mercado" se queda literal**). `status.body2` ("Para eso existe el piloto").

**Dejados a propósito (4):** `status.body3` (intacto; el riesgo era de posición, resuelto con §6.11c). El contraste de `status.body1` con el servidor de desarrollo (fortalece). `problem.evidence`'s "es poca" (calibración correcta sobre la evidencia). `cta.lead`'s "platicar sirve más que presentar".

**Lo que esta auditoría no hizo:** no quitó ni suavizó un hecho, no cambió una etiqueta de evidencia, no tocó una cifra, no movió el orden de las secciones. **La prueba, grepeable:** ¿quién es el sujeto de esta frase — un hecho, un estándar y una decisión, o la postura de Nahui frente a ellos?

### 10.4 Corrección de atribución, y el defecto que entró a la página (cuarta pasada)

**Lo que estaba mal.** `status.body1` decía: *"el producto funciona y se sostiene en producción. Eso está probado en el campo, **en el teléfono de una vendedora**"* — etiquetado **Real**, citando `bitacora.md` 2026-09-21/23. **Leí la entrada completa en lugar de confiar en la cita, y dice otra cosa:** el recorrido se corrió *"on production, **on her own account and device**"* — de la **Product Owner** — y *"a seller had tried to use the app that day and couldn't."* La Product Owner lo dijo igual de claro: *"sí lo ha intentado usar pero no ha podido, por ejemplo enviar invitación y cosas así."*

**1. `status.body1` reescrito a lo que la fuente sí aguanta** — y resultó más fuerte: el producto corre en producción, **se recorrió de punta a punta en un teléfono real contra el backend real**, y ese recorrido **encontró tres defectos que ninguna revisión de código había visto**, el más instructivo invisible en el código y evidente en un toque. No necesita decir de quién era el teléfono para valer, y dice algo verificable sobre el método en lugar de una impresión.

**2. `status.blocked` agregado, y el encuadre fue decisión mía.** El hecho pertenece a la página: es evidencia de que el piloto está haciendo su trabajo. **Va en `status.*`, entre la pregunta abierta y lo que sí hay** — no en "Qué existe hoy", donde se leería como advertencia de producto, ni en "Lo que las vendedoras cambiaron", donde implicaría un ciclo cerrado que **la fuente no respalda: dice rastreado, no resuelto.** Cuatro propiedades deliberadas: el sujeto es el piloto y la vendedora, no el tropiezo; la falta es nuestra y está nombrada (un requisito sin documentar); se distingue del servicio caído, que es lo que un lector asumiría; y cierra en una afirmación sobre método, no en una disculpa.

**3. Re-verificación de todo lo demás que dependía de esa entrada:**
- **`status.body4` (el ciclo cerrado): no afectado, verificado leyendo las fuentes.** Se sostiene en D54, D65 y `backlog.md` §Product Discovery, ninguno de los cuales es esa entrada.
- **`today.lead`: claim intacto, celda corregida** (decía "cuenta y dispositivo reales", que insinuaba el dispositivo de una vendedora).
- **`hero.badge`: no afectado.** La entrada confirma que existen negocios de piloto.
- **`status.body2`: no afectado.** Su cita es literal y sigue siendo correcta.
- **`today.bar`: reforzado.** La misma entrada explica *por qué* la barra no se ha medido — *"cannot be measured at all while the merchants who would generate that evidence can't get in"* — ahora citado en su celda. `status.blocked` es la versión legible de esa frase.
- **`built.item3.body` y `built.item4.body`: reforzados.** La capa de agentes no encontró el requisito del correo exacto, y la bitácora pública contiene esa entrada.

**4. Dos prohibiciones nuevas en §7.2:** no se afirma que el producto "se sostiene/aguanta/funciona bien" para las vendedoras del piloto, y no se atribuye a una vendedora un recorrido, una prueba o un dispositivo que fue de la Product Owner.

### 10.5 Las tres últimas pendientes, cerradas (quinta pasada)

**Dos me llegaron relevadas y una la verifiqué yo.** Vale distinguirlo, porque la diferencia es el punto.

| Pendiente | Cómo se cerró | Qué cambió en el archivo |
|---|---|---|
| ¿El buzón `ihola@nahui.app` recibe correo? | **Prueba en vivo de la Product Owner**, 2026-10-08 06:56, con confirmación de entrega | §8.1 pasa a "resuelta y verificada", §5 queda 🟢 sin condiciones, se retira mi bandera, y `cta.lead` cita la verificación. Mi puerta original ("no publicar una dirección que no recibe") era correcta y ya está satisfecha |
| ¿Cuál es la forma escrita del nombre? | **Confirmación directa de la Product Owner**: "Claudia Falcón", con acento, la forma que eligió para la página | §8.13 y la celda de `built.lead` pasan de inferencia marcada a dato confirmado. Se deja escrito que durante dos pasadas fue inferencia y por qué se marcó como tal |
| ¿A dónde apunta `foot.privacy`? | **Verificación propia** (`WebFetch`), porque la mención me llegó de pasada y este documento traía dos afirmaciones contrarias | §8.3 pasa de 🔴 a resuelto con URL, `foot.privacy` gana destino y etiqueta **Real**, §5 queda sin ningún CTA bloqueado, y se corrigen forward las dos afirmaciones falsas: que el aviso vivía en `demo.nahui.app` y que no había copia accesible |

**Por qué la tercera importa más de lo que parece.** Llegó como un dato lateral dentro de otra confirmación — "la dirección ya está publicada como canal ARCO en el aviso de `www.nahui.app`". Ese dato implicaba, sin decirlo, que **el último bloqueo de esta página ya no existía**, y que dos afirmaciones de este documento sobre el aviso estaban equivocadas. Si lo hubiera citado de oídas, habría publicado un enlace sin verificar o lo habría dejado bloqueado por error. Lo fetché: existe, se titula así, está actualizado el 8 de octubre, y da esa dirección aclarando la "i". **Es la primera vez en el día que la regla de §0 ("se lee la fuente, no la cita") produjo algo bueno en lugar de atrapar algo malo**, y por eso queda escrita como regla y no como anécdota.

**Y un hallazgo de consistencia que salió de ahí, ahora vinculante (§6.12):** la página ofrece la misma dirección que un documento legal vivo. Eso obliga a que coincidan carácter por carácter, hoy y cada vez que una de las dos cambie. Una página de empresa que ofrece un correo distinto al de su propio aviso de privacidad es un defecto de confianza, no un detalle administrativo — y en una superficie cuyo argumento entero es que se puede verificar lo que dice, sería el peor lugar para tenerlo.
