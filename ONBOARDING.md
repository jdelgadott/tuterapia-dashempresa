# Bienvenido al Dash de Empresas de Tu Terapia

Esta guía es para Flor, Isma y Nico. La idea es que en una tarde puedan empezar a construir con Claude, sin ser desarrolladores — igual que arrancó Juan.

---

## Qué estamos construyendo

Son **dos productos que trabajan juntos**:

| | Qué es | Quién lo usa | Dónde vive |
|---|---|---|---|
| **Dash Empresas** | El dashboard que ve la empresa cliente: sesiones, adherencia, talleres, inversión, consultoría | Nuestros clientes B2B | tuterapia-empresas.com |
| **Panel Admin** | Donde nosotros cargamos los datos que el Dash muestra | El equipo de Tu Terapia | tuterapia-admin.vercel.app |

Regla mental simple: **el Admin es donde se carga, el Dash es donde se muestra.** Si un número está mal en el Dash, casi siempre se arregla en el Admin, no en el código.

Los dos comparten la misma base de datos (Supabase) y los dos están hechos de la misma forma: React, con **todo el código en un solo archivo** (`src/App.jsx`). No es la forma más elegante, pero hace que sea muy fácil pedirle cambios a Claude.

---

## Antes de empezar: los 4 accesos

Pedíselos a Juan. Son cuatro cosas distintas y no se dan juntas:

1. **GitHub** — donde vive el código. Te va a llegar una invitación por mail a los dos repos.
2. **Supabase** — la base de datos. Solo si vas a mirar datos reales.
3. **Vercel** — donde se publica. Solo si vas a necesitar ver por qué algo no subió.
4. **Las claves** (`.env`) — Juan te las pasa por un canal privado. **Nunca las mandes por mail ni WhatsApp, ni las pegues en un chat.**

Para empezar a mirar y proponer cambios alcanza con la 1.

---

## Cómo arrancar (elegí un camino)

### Camino A — En el navegador (recomendado para empezar)

No instalás nada.

1. Creá tu cuenta de GitHub con tu mail de Tu Terapia y aceptá la invitación que te llegó.
2. Entrá a **claude.ai/code** con tu cuenta de Tu Terapia.
3. Conectá tu GitHub y elegí el repo (`tuterapia-dashempresa` o `tuterapia-admin`).
4. Listo, ya podés pedirle cambios a Claude.

### Camino B — En tu Mac

Si vas a trabajar seguido, tener el proyecto local es más cómodo. Abrí la Terminal y corré estos comandos de a uno:

```bash
xcode-select --install
```

```bash
brew install node gh
```

```bash
gh auth login
```

```bash
git clone https://github.com/jdelgadott/tuterapia-dashempresa.git && cd tuterapia-dashempresa && npm install
```

Para ver el proyecto corriendo en tu compu:

```bash
npm run dev
```

Y abrís http://localhost:5173 en el navegador.

---

## Cómo trabajamos

**Nunca trabajes directo sobre `main`.** Esa rama es la que está publicada: lo que se sube ahí aparece en el sitio real del cliente en dos minutos. Trabajá en una rama propia y Juan revisa antes de publicar.

Pedíselo a Claude con estas palabras: *"creá una rama para este cambio"*. No necesitás saber los comandos.

El ciclo es: **rama → cambio → le avisás a Juan → él revisa y publica.**

---

## Cinco reglas que nos costaron caro aprender

1. **La base de datos es producción.** No hay copia de prueba. Antes de crear, borrar o modificar datos en Supabase, preguntá. Si le pedís algo a Claude que toque datos, que te lo explique primero.

2. **Push no es lo mismo que publicado.** Ya nos pasó que el código subió a GitHub pero Vercel no lo publicó, y estuvimos horas pensando que el cambio no funcionaba. Después de subir un cambio, **verificá en el sitio real** que esté.

3. **El idioma de la interfaz es español rioplatense, con voseo.** "Podés", "tenés", "ingresá". Nunca "puedes" ni "ingresa".

4. **Hay mucho código parecido entre sí.** El Admin tiene bloques casi idénticos repetidos en varias pestañas. Una vez un cambio "buscar y reemplazar" pisó ocho lugares y dejó siete pantallas en blanco. Si Claude te propone un cambio que toca varios lugares a la vez, pedile que te muestre exactamente dónde.

5. **Si algo deja de funcionar de golpe en los dos paneles a la vez**, lo más probable es que la base esté pausada, no que se haya roto el código. Avisá y se reactiva.

---

## Dónde está el contexto

Cada repo tiene un archivo **`CLAUDE.md`** en la raíz. Ahí está explicado el proyecto entero: los tipos de plan, cómo funciona el pricing, las tablas de la base, las reglas de negocio, los bugs históricos.

**No hace falta que lo leas.** Claude lo lee solo cada vez que abrís el proyecto. Por eso Claude ya sabe de qué estamos hablando desde el primer mensaje.

Si durante el trabajo descubrís algo que no está escrito ahí y que el próximo debería saber, pedile a Claude que lo agregue al `CLAUDE.md`.

---

## Tres cosas para hacer el primer día

1. Abrí el proyecto y preguntale a Claude: *"explicame qué hace este proyecto y cómo está organizado"*.
2. Buscá algo chico que te moleste — un texto, un color, un título mal puesto — y pedile que lo cambie en una rama.
3. Mostrale el resultado a Juan.

No arranques por algo grande. El objetivo del primer día es que el circuito completo te funcione, no que el cambio sea importante.

---

## Si te trabás

Trabarse es parte del proceso, no es señal de que esto no sea para vos. Juan se trabó muchas veces construyendo esto.

Dos cosas que ayudan de verdad:

- **Contale a Claude qué esperabas y qué pasó**, con el mensaje de error pegado tal cual. No hace falta que entiendas el error.
- **Si algo se rompió y no sabés cómo volver atrás**, decile: *"quiero descartar todos mis cambios y volver a como estaba"*. Siempre se puede volver.
