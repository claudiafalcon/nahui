# Guion — Pitch Demo Day

Guion completo para las 11 diapositivas de `Nahui - Pitch Demo Day v2.pptx`. Escrito para hablarse, no para leerse, frases cortas, pausas naturales entre ideas. A un ritmo de presentación con energía (~150 palabras por minuto) esto ronda los 15 minutos. Practícalo una vez en voz alta y ajusta el paso donde sientas que se alarga o se atropella, el tiempo exacto depende de tu propio ritmo, no solo del conteo de palabras.

Marcado por diapositiva para que sea fácil seguirlo mientras avanzas la presentación.

---

## 1. Portada — ~0:00

Buenas tardes. Me llamo Claudia y esto es Nahui.

Nahui es una aplicación de registro de ventas e inteligencia de negocio para vendedoras y vendedores ambulantes en México, pensada para quien vende en bazares. La estoy construyendo junto con Ana, que vende ropa en bazares privados en el Estado de México, y que ha sido mi piloto real desde el primer día.

La promesa es simple, y se las voy a demostrar, no solo a contar: registrar una venta en menos de 3 segundos, sin perder el control del negocio. Vamos a ver qué tan real es esto hoy, qué aprendimos de una campaña real, y qué tan lejos estamos todavía. Con evidencia, no con intenciones.

## 2. El problema — ~1:00

Empecemos por el problema, porque si no entienden el problema, nada de lo que sigue va a tener sentido.

En un bazar, el flujo de clientes es impredecible. Puede no llegar nadie durante quince minutos, y de repente llegan tres personas al mismo tiempo. Si registrar una venta le toma a Ana más de unos segundos, ese tiempo no lo saca de la nada, lo saca de atender al siguiente cliente. Y en ese momento, casi siempre gana el cliente que está enfrente, no el registro.

Esa fricción se repite en cualquier vendedora que atiende de pie, sin caja registradora, sin un momento muerto entre un cliente y el siguiente. Por eso Ana, durante años, limitó su propio catálogo, menos productos son más fáciles de llevar en la cabeza. Y eso, sin que ella lo haya elegido así, limitó cuánto podía crecer su negocio.

Y quiero ser clara en algo desde ahora, porque empezamos aquí, pero no es hasta donde queremos llegar. Resolver el registro rápido no es el objetivo final, es el punto de partida. Lo que realmente queremos es que Ana tome decisiones informadas sobre su propio negocio. Y para tomar decisiones informadas se necesitan datos, datos que no existen si ella no registra su día a día. Esto no es solamente sacarle la cuenta, para eso ya existen calculadoras. Es que, con el tiempo, cada venta registrada se convierta en inteligencia real sobre su negocio. Ese es el objetivo de Nahui, no solo velocidad, inteligencia para el comercio informal.

## 3. Así se ve hoy, y en menos de 3 segundos — ~3:00

Esto que están viendo no es un mockup, no es una idea en Figma. Es el prototipo real, funcionando, código en producción, probado en persona con Ana.

Aquí está el estado inicial: venta rápida, con las categorías que ella misma definió, playeras y blusas. Nada de esto es una simulación para efectos de la presentación, es exactamente lo que Ana ve cuando abre la aplicación un día cualquiera.

Y así se registra una venta. Un toque por producto. El total se arma solo, en el momento exacto de la venta, sin que Ana tenga que hacer cuentas, sin que tenga que pausar para anotar nada en un cuaderno.

Eso que parece un detalle pequeño es la base de todo lo demás. No es una app con muchas funciones todavía, es una app que primero resuelve exactamente la fricción que ya identificamos, porque sin resolver esto, no hay datos que registrar, y sin datos, no hay inteligencia que construir después.

## 4. Y queda guardada — ~4:20

Y aquí queda guardada, para siempre. Recibo digital, venta finalizada, total confirmado.

Nunca más se pierde el registro de una venta, aunque llegue el siguiente cliente sin avisar, que es exactamente lo que pasa todo el tiempo en un bazar real. Este es el cierre del ciclo que empezó en el problema: menos tiempo registrando, cero ventas perdidas por no tener dónde anotarlas.

Y aquí es donde empieza lo que de verdad importa. Esa venta que acaba de quedar guardada no es solamente un recibo, es un dato. Uno solo no dice mucho, pero cien ventas registradas ya empiezan a mostrarle a Ana patrones que hoy no puede ver, qué le vende más, qué días le va mejor, qué tan seguido regresa cada clienta. Sin ese registro, nada de eso existe. Por eso el registro rápido no es el producto, es lo que hace posible el producto.

## 5. La campaña real — ~5:30

Ahora la diapositiva más difícil de todas. Y también la más útil, porque aquí es donde dejamos de hablar de lo que creemos y empezamos a hablar de lo que medimos.

Corrimos una campaña real de Meta, del 17 al 20 de agosto, tres días. Gastamos 569 pesos con 24 centavos, y obtuvimos 731 visitas a la página de destino, a 78 centavos cada una, con un alcance de casi 20 mil personas. Para ponerlo en perspectiva de negocio: conseguir atención barata, en este mercado, no es el problema. El alcance funciona.

Pero Vercel, la plataforma donde corre el demo, nos confirmó algo distinto. De esos 583 visitantes reales que sí llegaron al sitio, solamente 2 dispararon algún evento del recorrido completo, registro, verificación, cuestionario. Eso es 0.34 por ciento.

Y aquí quiero ser precisa con algo, porque importa cómo se cuenta esta historia: no lo descubrimos el primer día de campaña. La instrumentación para medir esto, los eventos que nos permiten ver hasta dónde llega alguien, se terminó de construir a la mitad del camino, no antes de lanzar la campaña. De esos 583, solamente 227 llegaron ya con el recorrido completo midiéndose. Y ni siquiera con eso, la aguja se movió. El alcance no es el problema. La adopción real, todavía no la tenemos resuelta, y la causa exacta, sinceramente, todavía no está confirmada.

## 6. Viabilidad — ~7:15

Ahora quiero hablarles de algo muy concreto: cuánto cuesta esto en realidad, y qué tan lista está la base técnica.

El modelo de dominio ya está congelado, ventas, productos, sesiones, eventos, negocio, no hay nada nuevo que inventar, solo persistirlo en una base real. La infraestructura ya está decidida: React y TypeScript en Vercel, con Supabase de backend, un solo proveedor en vez de varios, justo para esta escala de piloto. El NFC, que era mi mayor duda técnica, también quedó resuelto: en Android funciona directo dentro de la misma aplicación, y en iOS lo resolví con un shell nativo delgado, solo para esa función, no una segunda app completa. Lo que le importa a Ana, nunca tener que comprar un lector aparte, queda cubierto en los dos casos.

Y los números que sí duelen un poco: hasta hoy he invertido, en un solo pago, unos 626 pesos. La herramienta con la que construyo junto a mi equipo de agentes cuesta 100 dólares al mes, cerca de 1,850 pesos, gasto real y recurrente. Operar esto en producción me costaría alrededor de 830 pesos al mes, todavía una cotización, no un gasto real. Y el costo por venta registrada, calculado sobre un supuesto de tres comerciantes y 180 ventas al mes, ronda los 3.90 pesos, un número que no he validado con datos reales todavía, y se los digo así, sin maquillarlo. Lo que no les puedo dar hoy es un retorno esperado, porque no tengo un precio decidido, solo principios: sin comisión por transacción, precio fijo o estacional.

## 7. Gobernanza — ~8:45

Y ahora la pregunta que cualquier panel debería hacerme: qué puede detener esto.

Tengo cinco riesgos identificados, y se los doy tal como los clasifiqué, sin suavizarlos. Depender de un solo proveedor de infraestructura, Supabase y Vercel, probabilidad alta, impacto alto. Exponer datos sensibles de comerciantes o de sus clientes, hoy la probabilidad es baja porque no hay datos reales en producción, pero el impacto sigue siendo alto. Que la adopción real no se confirme, y este es el que ya está pasando, alta probabilidad, alto impacto. No tener todavía un modelo de precios decidido, media a alta. Y, mirando más adelante, sesgo en las recomendaciones que Nahui algún día haga de forma proactiva, hoy es baja probabilidad porque esa función ni siquiera existe todavía, pero el impacto sería alto.

Cada uno de estos ya tiene quién lo levanta y cómo se traduce en acción, no se quedan solo en la tabla. La exposición de datos la resuelve un aviso de privacidad explícito antes de recolectar cualquier dato, con asesoría legal real. La dependencia de un solo proveedor se resuelve exportando los datos periódicamente antes de comprometerme más allá del piloto. El precio sin decidir se resuelve investigando precios comparables de otras herramientas para pequeños comerciantes en México. Y la adopción no confirmada, ese no es un bloqueo externo que alguien más tenga que levantar, me toca resolverlo a mí, y el piloto Concierge que les mencioné es justo esa respuesta, ya en marcha.

## 8. Equipo — ~10:15

Ahora quiero explicarles algo que probablemente no esperaban ver en un demo day de este tipo, y es cómo se construye esto por dentro.

Nahui no la construyo yo sola, línea por línea de código. La construye un equipo de agentes de inteligencia artificial especializados, no una sola inteligencia artificial generalista a la que le pido todo. Y esto no es un detalle técnico sin importancia para ustedes como audiencia de negocio, es exactamente el tipo de decisión de gobernanza que cualquier empresa que use inteligencia artificial en serio va a tener que tomar tarde o temprano.

Cada agente tiene una sola función, y su propio límite de autoridad. El que revisa la calidad de la experiencia no es el mismo que construye. El que verifica que todo sea consistente con las reglas del negocio no es el mismo que diseña. Y el más importante de todos, para mí, es uno que no tiene acceso a ningún archivo del proyecto, solamente puede navegar el producto terminado, exactamente como lo haría una vendedora real que nunca lo ha visto antes. Eso existe a propósito, para que nadie, ni siquiera yo, pueda hacer trampa y decir que algo funciona sin probarlo de verdad.

Hay un coordinador, que en este proyecto llamamos Main, que organiza todo esto y lo deja registrado. Pero ese coordinador nunca decide en lugar de los demás. Es, literalmente, control de calidad con roles separados, aplicado a construir software con inteligencia artificial.

## 9. El ciclo de validación — ~11:45

Y esto conecta directo con la siguiente idea, que es la más importante de toda la presentación si tuviera que elegir una sola.

Nada en Nahui se da por cerrado sin comprobarlo contra el producto real. Se diseña, se revisa, se construye, y ahí es donde entra lo que de verdad importa: un hallazgo real. No una suposición de que algo va a funcionar, un hallazgo real, sacado de una prueba con Ana o de una campaña de verdad como la que les acabo de mostrar.

Ese hallazgo dispara una corrección. Y la corrección se vuelve a validar contra el producto real antes de darse por cerrada otra vez. No es un proceso lineal de una sola pasada, es un ciclo que se repite. Nunca se confía sin comprobar, ni en el código, ni en los números de una campaña, ni en mí misma cuando doy por hecho que algo va a funcionar.

## 10. Trayectoria — ~12:50

Esta línea de tiempo no es una lista de entregables que planeé desde el principio. Cada punto existe porque resolvió un problema real que apareció en el camino, no porque estuviera en un plan original.

Y aquí quiero ser clara sobre algo, porque creo que es tan importante como cualquier número que les haya mostrado. Yo no soy experta en sistemas agénticos de inteligencia artificial. No sé, con precisión técnica, cómo optimizar el consumo de tokens, ni tengo certeza absoluta de si darle instrucciones en inglés o en español a los agentes hace una diferencia real hoy en día.

Varias decisiones técnicas del camino tampoco las tomé sola. Cambié de herramienta de diseño por recomendación directa de la maestra. Mis compañeros me dijeron que escribirle en inglés a los agentes era mejor para el consumo de tokens y la precisión, algo que yo misma todavía no he comprobado a fondo. Y usar un equipo de agentes especializados, en lugar de una sola inteligencia artificial generalista, fue algo que la maestra mencionó como mejor práctica. Entender cómo funciona eso realmente, por dentro, lo aprendí después, trabajando con mi propio equipo, equivocándome, corrigiendo, y volviendo a intentar.

## 11. Cierre — ~14:00

Esto es Nahui hoy. Un prototipo real, funcionando, probado con una persona real. Una campaña real, que nos enseñó que conseguir atención no es el problema, la adopción sí lo es, y que esa lección la aprendimos a mitad de camino, no de entrada. Y un equipo de agentes que revisa, corrige, y vuelve a comprobar cada cosa antes de darla por buena.

Todavía no lo tenemos todo resuelto. Y está bien decirlo así, con esas palabras exactas, en lugar de maquillarlo. Ahí les dejo el demo y el repositorio, ambos están en el documento que les compartí. Gracias.
