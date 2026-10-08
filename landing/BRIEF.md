# Nahui — sitio público de presentación · Brief

**Estado:** definición de producto aprobada por la Product Owner, 2026-10-08. Nada construido todavía.
**Dueños:** `marketing` (mensaje, afirmaciones, CTA) · `brand-guardian` (voz y registro) · `ui-designer` (layout, craft, código) · `ux-critic` y `reviewer` (revisión) · Product Owner (aprobación final).
**Permiso de escritura:** `company/infrastructure-decisions.md` ID019.

Este documento existe porque la primera versión de esta página se construyó sin él. Cuatro revisiones independientes encontraron 2 Blockers, 5 Major y 12 Minor, y la causa raíz de buena parte de ellos fue la misma: nadie había definido quién lee la página. Esta vez se define antes de escribir una palabra.

## 1. Para qué es

Presentar Nahui públicamente: qué es, qué problema resuelve y **cómo va**. Es la URL que Nahui da cuando alguien pregunta "¿y esto qué es?".

## 2. Para quién — un solo público, dos idiomas

**Inversionistas y evaluadores.** Gente que mira Nahui desde fuera y juzga si es una empresa real resolviendo un problema real.

La evaluadora inmediata es la profesora/el profesor del curso ISOM5240 de la Product Owner, que necesita el nombre de la empresa y su URL como parte de un entregable académico. Ese lector encaja en el mismo perfil: evalúa, no compra.

**La vendedora NO es el público de esta página.** Decisión explícita de la Product Owner, 2026-10-08. Esto tiene una consecuencia directa y es el error que hay que no repetir: la versión anterior le hablaba de tú a la vendedora en español ("Registras lo que llevas", "ves cómo le fue a tu negocio", "Tú sigues atendiendo"). Era buena prosa — `brand-guardian` la llamó la mejor prosa de cara a vendedoras producida fuera de `product/02-ux/` — pero escrita para quien no iba a leerla. **No se recicla ese registro.**

Nahui habla aquí **de sí misma**, no a la merchant. Sigue siendo Nahui: honesta, concreta, sin aires. No es una fintech, no es una presentación genérica de arranque.

## 3. Idiomas — requisito duro

Español e inglés, **ambas versiones completas y capaces de sostenerse solas**. El inglés no es un resumen del español. Es la única versión que la evaluadora va a leer, así que no puede faltarle nada.

Mismo público en los dos idiomas, mismo registro. No son dos textos distintos, es el mismo contenido en dos idiomas.

`global-principles.md`'s "never translate the UI" **no aplica aquí y no se reabre**: esa regla protege el producto que usa Ana. Esto es una página que presenta a la empresa. Son superficies distintas.

## 4. La honestidad es el argumento, no el límite

Instrucción textual de la Product Owner: *"es orientada a inversionistas pero recuerda que somos honestos."*

Para un proyecto en piloto temprano, la versión honesta convence más. Un inversionista no espera tracción a esta altura; espera que no le mientan. Y una afirmación inflada no se descuenta cuando se descubre: se descuenta todo lo demás que dice la página.

**Verdad y además fuerte** (todo verificable en el repositorio):
- Hay negocios de vendedoras reales en producción, no una maqueta.
- El problema salió de una entrevista real con una vendedora, no de una suposición.
- El producto está construido y funcionando: inventario, eventos, venta con botones, venta con NFC, reportes, exportación.
- Retroalimentación de vendedoras reales que **cambió el producto**: dos personas del piloto por DM pidieron foto por artículo, por separado, y eso se volvió decisión de dominio (D54). Un cliente real pidió lectura de código de barras y se construyó (D65). Una vendedora buscó a la Product Owner sin que nadie le escribiera, después de probarla.
- Nahui está construida por agentes de IA con gobernanza auditable: registro de decisiones, RFCs, revisión por especialistas, bitácora.

**No se puede decir:**
- Nada de "en segundos". **No existe una sola medición de latencia en todo el repositorio**, se buscó a propósito. La barra de `backlog.md` #1 (≥90% de ventas registradas, <3 s) sigue sin cumplirse.
- "Probamos cada paso con vendedoras reales." La capa de prueba por paso es `merchant-user-tester`, una persona simulada por IA que por su propia definición corre *antes* de que una vendedora real vea nada.
- Ingresos, números de tracción, crecimiento. No existen.
- Funciones no construidas en tiempo presente. En particular **"De la foto a tu inventario" NO va en esta página**: es el proyecto de curso de la Product Owner, no está en `backlog.md` ni en ninguna decisión de Nahui, y la versión anterior lo anunciaba como comprometido.

**Lo honesto difícil, para que nadie lo contradiga sin querer:** la adopción es la pregunta abierta real. El 2026-09-21/23 se encontró que dos de tres vendedoras del piloto estaban trancadas o enfriadas mientras el producto funcionaba perfectamente. Eso no se detalla en una landing, pero "en piloto, aprendiendo" es verdad y alcanza. Prometer adopción no lo sería.

## 5. Privacidad de la vendedora del piloto

La Product Owner ya decidió esto una vez, el 2026-08-10, para una superficie **menos** pública: mandó quitar del prototipo demo el surtido real de la vendedora del piloto, con la razón registrada de que *"no debería sentir que su negocio real se volvió el demo público de Nahui"*. Mapa de sustitución aprobado: Pijama → Bolsas, Sudadera/Maxy → Accesorios, Calcetines → Playeras, Bufandas → Gorras.

Esa decisión **gobierna aquí también**, y con más razón: una URL entregada públicamente está más expuesta que aquel prototipo. No se describe a la vendedora con precisión suficiente para identificarla (su surtido exacto más su zona la vuelven identificable en su comunidad, aunque no se diga su nombre). No se le atribuyen palabras que no dijo o no aprobó.

## 6. Restricciones técnicas, aprendidas de la versión anterior

- **La página tiene que leerse sin JavaScript.** La anterior inyectaba sus 59 piezas de texto por script: sin JS mostraba precios y números sueltos, cero palabras. El contenido en español va en el HTML; el script solo intercambia.
- **Ningún enlace apunta a `demo.nahui.app`.** Sirve un build retirado (D61) y truena en `/invite/`. La app real vive en `www.nahui.app`.
- **Nada de números inventados ni capturas falsas.** Si se muestra el producto, es el producto.
- El celular del hero se queda **en español en las dos versiones**: se le muestra el producto real a quien lo evalúa.
- Contraste AA de verdad contra la superficie donde se renderiza, áreas táctiles de 48px, y `company/brand/brand-guide.md` como fuente de los tokens.

## 7. Qué tiene que existir para el 15 de octubre

El entregable del curso solo necesita una línea: nombre de la empresa y su URL, accesible. Una versión mínima aprobada alcanza si la completa se tarda. **Sin tocar DNS**: ni raíz, ni `www`, ni `demo`, ni `loyalty` — hay vendedoras reales en producción detrás de esos dominios (ver `company/bitacora.md`, 2026-09-21/23).

## 8. Lo que la versión anterior enseñó

Se archivó completa en `/Users/boofalcon/nahui-archivo-landing-v0/`. No se borró. Sus revisiones siguen siendo el mejor insumo que tiene esta página, y están en el historial de la sesión del 2026-10-07.
