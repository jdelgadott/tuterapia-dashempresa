# Tu Terapia — Dashboard B2B para Empresas

## Qué es este proyecto
Dashboard de bienestar que Tu Terapia (marketplace de psicología, Uruguay/Argentina) ofrece a sus empresas cliente B2B. Cada empresa ve métricas de uso del beneficio de terapia: sesiones, adherencia, talleres, motivos de consulta, inversión y consultoría estratégica.

- **Producción:** https://tuterapia-empresas.com (Vercel, autodeploy desde `main`)
- **Repo:** jdelgadott/tuterapia-dashempresa
- **Todo el código vive en `src/App.jsx`** (single-file app, ~1700 líneas)
- **Proyecto hermano:** tuterapia-admin (panel interno para cargar los datos que este dash muestra)

> Si recién llegás al proyecto: leé primero `ONBOARDING.md`. Este archivo es la referencia técnica; aquel explica cómo trabajamos.

## Stack
- React + Vite
- Supabase (proyecto `cdzvjueschflpkxlozby`, región São Paulo): PostgreSQL + Auth + Storage
- Recharts para gráficas
- Vercel para deploy, Resend para mails transaccionales (sender: noreply@tuterapia-empresas.com)
- Edge Functions en Supabase: `invite-user`, `delete-user`, `solicitar-consultoria`, `encuesta-respuesta`

## Flujo de trabajo
- `npm run dev` para local (puerto 5173)
- Deploy: commit + push a `main` → Vercel autodeploya en 1-2 min
- El favicon está en `/public/logocuadrado.jpg`

## Tres cosas que muerden y conviene saber antes de empezar

1. **Push ≠ deployado.** Vercel tuvo un incidente (jul 2026) que dejó builds sin publicar pese a que el push salió bien. Después de pushear, **verificá el bundle de producción** (grep de algún string nuevo en el JS servido). Nunca asumir.
2. **El proyecto de Supabase es Free tier y se pausa solo por inactividad** (~7 días). Ya pasó dos veces (jul y sep 2026). Síntoma: los DOS paneles dejan de aceptar logins a la vez y el error dice "email o contraseña incorrectos". No es el código — hay que restaurar el proyecto desde el dashboard de Supabase. El upgrade a Pro está pendiente.
3. **La base es producción y no hay ambiente de prueba.** Antes de crear, borrar o modificar datos en Supabase, preguntar.

## Datos: 100% Supabase (sin fallbacks)
El componente carga datos de Supabase al montar. Los fallbacks hardcodeados (objeto `COMPANIES`) fueron eliminados en jul 2026 — tablas vacías muestran estados vacíos explícitos. Mientras `dbCompany` no cargó se muestra "Cargando datos...".

**RLS está habilitado en todas las tablas:** usuarios de empresa solo leen filas de su `company_id` (vía `company_users` + helper `my_company_ids()`); admins del panel (tabla `admin_users`, helper `is_admin()`) tienen acceso total. La única escritura del dashboard es el RPC `solicitar_consultoria()`.

### Conteo de personas: SIEMPRE `total_historico`, nunca la suma de `nuevos`
Regla confirmada con datos reales (sep 2026). Toda métrica de personas/pacientes — home "personas acompañadas", Adherencia "Total de pacientes", Consultoría, títulos de módulo — sale de `totHistorico` (el `total_historico` del último mes cargado).

**Por qué:** la columna `nuevos` del reporte de plataforma no son personas únicas — cuenta de nuevo a quien reingresa tras un tiempo. En ANII la suma daba 50 contra 19 reales; en Qubika SUBreportaba (32 vs 55) porque la empresa tenía pacientes previos al período cargado. `nuevos` sigue siendo válido como serie mensual (ritmo de incorporación, sparkline, gráfica "Nuevos pacientes por mes"), nunca como total.

### Tipos de plan (multi-empresa)
`companies.plan_kind`: `cuponera_fija | fee_fijo | a_demanda` (son **tres**) + `coverage_pct` (0-1), `monthly_plan` (cuponera), `monthly_fee` (fee fijo), `monthly_cap` (a demanda, opcional), `renewal`. **Los talleres NO son un plan** — son acciones complementarias a cualquier convenio.

### Pricing y ROI
- Precios de lista TT (constantes en App.jsx): online $1.600, presencial $1.850, promedio $1.725 (IVA 10% incl). Descuentos a demanda: cobertura 50% → 5% OFF sobre la parte de la empresa; 100% → 10% OFF.
- `session_cost_online`/`session_cost_presencial`: lo que paga la EMPRESA por sesión en a demanda (ya con descuento; se cargan manualmente en el admin, que sugiere el valor calculado). `session_price_ref` queda SOLO para cuponera (costo único blended). Fee fijo no tiene costo por sesión — se muestra el costo efectivo (fee ÷ sesiones del mes).
- `companySessionCost` (derivado): a demanda = promedio de online/presencial cargados (los datos de sesiones no distinguen modalidad); cuponera = blended. Estimación de inversión = sesiones × companySessionCost (fee: fee plano); la facturación real siempre pisa la estimación.
- Co-pago a demanda <100%: aporte del colaborador por sesión = su % a precio de lista (sin descuento) — derivado como `companySessionCost×(1−cov)/(cov×0.95)`. Se muestra "inversión conjunta empresa+colaboradores".
- `user_session_limit`/`user_monthly_limit`: límites por colaborador (informativos, en Plan activo; aplican a todos los planes).
- **Talleres con costo:** `workshops.cost` (UYU, lo que se carga) + `workshops.cost_usd` (referencia, se factura en USD y se pasa a pesos a mano para no distorsionar históricos). Suma a la inversión total de Consultoría, con un bloque comparativo individual (sesiones) vs colectivo (talleres).
- Consultoría TT (regla de Juan: **el retorno se muestra con impacto medido, NUNCA con el descuento**): "Inversión e impacto" (banner + alcance: personas acompañadas, % primera vez, instancias colectivas, inversión + chart) → "Retorno medido" (mejoras semestrales de la encuesta + 3 indicadores de negocio, con framing de costos y cita OMS $1→$4) → "Bienestar medido" (Índice TT + 6 dimensiones con brechas equipo/líderes) → "La mirada de los líderes" → "La voz del equipo" → Encuesta. El ahorro vs lista vive en Gestión → Plan activo.
- Cuponera muestra canjeadas + realizadas; a demanda y fee fijo muestran SOLO canjeadas tituladas "Sesiones" (regla de negocio — helpers `usesRealizadas`/`sesOf`/`totSes`/`sesWord`; **toda métrica nueva de sesiones usa `sesOf`**, nunca `m.realizadas` directo).
- Utilización del plan y línea de referencia solo en cuponera (o tope de a-demanda); el Índice Tu Terapia repondera sin el 30% de utilización fuera de cuponera (70/20/10).

### Gráficas
- **Solo los últimos 12 meses** en todas las series.
- **Ejes verticales siempre enteros**, vía el helper `intAxis(values, {minTop:5, line})`: techo mínimo 5 y paso adaptativo (1/2/5/10/20/50/100). Nació porque con 1 paciente nuevo el eje mostraba 0,25 / 0,50 / 0,75. Cualquier eje de conteo nuevo debe usarlo.
- **Récords en dorado** (`RECORD_GOLD` `#D9A441`), en dos niveles: el récord vigente con borde pleno (2.5px), los que ya fueron récord en su momento con dorado fino y tenue (1.5px, opacidad 0.4). Helper `recordMonths()` + `goldStroke()`.
- `maxBarSize` 44 para que con pocos meses las barras no queden gigantes.

### Visibilidad de secciones por empresa
`companies.visible_modules` (jsonb): `{módulo: [subpestañas visibles]}`, null = todo visible. Se configura desde el panel admin (módulos y subpestañas). El dashboard filtra nav, subnav y cards del home con `moduleVisible()`/`visibleSubs()`; se combina con `user_permissions` (capa por usuario). Soporta el formato legacy (array de ids de módulo).

### Accesos y login
- **Multi-empresa:** `company_users` tiene UNIQUE(company_id, email) — un mismo mail puede acceder a varios dashes (caso Farmashop, con dos planes distintos = dos filas en `companies`). El login trae todas las filas del mail; con más de una aparece un **selector de empresa en el header** (`switchUserCompany` recarga permisos al cambiar).
- **Vista admin:** los usuarios de `admin_users` se loguean en este dash con su propia cuenta y ven el dash de cualquier empresa tal como lo ve el cliente (respetando `visible_modules`; los permisos por usuario no aplican). El botón de solicitar consultoría se oculta en vista admin. **Hoy el equipo entra por acá** — `company_users` está vacío, ninguna empresa cliente tiene usuarios propios todavía.
- Pantalla de crear contraseña: detecta `type=recovery` / `type=invite` en el hash de la URL.

### Equipo TT y referentes
`admin_users` es la fuente ÚNICA: un miembro del equipo = admin del panel = posible referente de empresas. Se gestiona desde el admin → **Equipo TT** (CRUD, foto a `contenido/equipo/`, invitación automática). El dash lo lee con la política `team_read` y cae a las fotos históricas en base64 (`FOTO_FALLBACK` por email) si el miembro no subió una. El array `TT_TEAM` quedó **solo como fallback** si la tabla no carga — no agregar gente ahí.

`accountManager` se resuelve matcheando `companies.referente_email` contra el equipo, **case-insensitive**. (Un typo en un mail hizo que Genexus mostrara a la persona equivocada durante semanas; por eso en el admin el referente es un select y no texto libre.)

### Tablas Supabase relevantes
- `companies` — nombre, plan_kind y campos de plan, referente, `visible_modules`, `encuesta_abierta`, headcounts
- `sessions_data` — por mes: canjeadas, realizadas, nuevos, activos, total_historico, primera_vez, c1-c5, partial, month (texto "Ago"), year. Unique(company_id, month, year)
- `billing` — period (texto "Ago 2025"), amount, status (pagado/pendiente), invoice
- `workshops` — date (texto, formato MIXTO), title, speaker, ratings, cost, cost_usd
- `consultation_reasons` — reason, count, percentage, period
- `milestones`, `recommendations`, `content`, `nps_data`, `informes`, `encuestas_archivos`, `header_texts`, `roi_by_quarter`, `page_views`, `seguimiento_beneficio`, `encuesta_respuestas`
- `company_users` + `user_permissions` — acceso por empresa y visibilidad por módulo
- `admin_users` — equipo TT: quién entra al panel admin y quién puede ser referente

### Formatos de fecha (fuente de bugs frecuente)
- `sessions_data.month`: abreviado ("Ago", "Sep")
- `workshops.date` y `billing.period`: texto libre, mezcla nombre completo y abreviado
- Los sorts en App.jsx manejan ambos formatos (diccionarios full+abbr). Mantener esa lógica al tocar fechas.

## Módulos del dash (v27)
- **Home:** KPIs con sparklines, hitos timeline, referente TT
- **Colaboradores:** Sesiones · Adherencia (pacientes, promedios por activos, primera vez en terapia, activos por mes)
- **Cultura:** Talleres (cards con ratings) · Contenido
- **Estrategia:** Bienestar del equipo (NPS, motivos, recomendaciones TT, seguimiento intraplataforma, impacto de acciones colectivas) · Consultoría TT
- **Gestión:** facturación, plan, equipo (módulo restringible por permisos)

### Encuesta web Índice TT
Vista PÚBLICA sin login en `#encuesta/<company_uuid>`, estilo typeform mobile-first (22 preguntas, 6 dimensiones, escala 1-10, anónima, auto-avance). Las preguntas viven en `ENCUESTA_DIMS` — si cambian, actualizar también `ENCUESTA_DIM_MAP` en el admin y el RPC. Envío vía Edge Function `encuesta-respuesta` (verify_jwt off, valida respuestas + empresa, inserta con secret key).

**Segmentación líder/colaborador:** dos links por empresa — `#encuesta/<id>` (22 preguntas) y `#encuesta/<id>/lider` (30: + bloque q23-q30 de gestión, en `ENCUESTA_LIDER_DIMS`; el orden q23-q30 está acoplado al RPC). El rol lo determina el LINK, no la auto-declaración (control de falseo por distribución).

**Controles de integridad:** ventana de aplicación (`companies.encuesta_abierta`, toggle en admin → Encuestas; **arrancan cerradas**), guardia por dispositivo (localStorage por empresa+semestre), control por conteo (`headcount_total`/`headcount_leaders`, el admin alerta si n supera lo esperado).

**Resultados:** aplicación SEMESTRAL; se auto-cargan vía RPC `encuesta_promedios()` (SECURITY DEFINER, solo agregados, **n>=3 por segmento** por privacidad), una fila por (empresa, semestre, rol). El dash calcula el general ponderado por n, muestra brechas equipo/líderes por dimensión ("miradas alineadas" <0.5, "brecha leve" <1.5, "brecha importante") y la sección "La mirada de los líderes". Lo manual de `roi_by_quarter` (mapeado Q→S) pisa lo automático (`mergedRoiByQ`). Comentarios: TT los cura en el admin (`comment_approved`) → los aprobados salen en "La voz del equipo" vía RPC `encuesta_comentarios()`. **La empresa nunca ve respuestas individuales.**

**OJO — son DOS encuestas distintas:**
1. La encuesta web de 6 dimensiones (Consultoría, "Bienestar medido"): a TODA la empresa, semestral, por link.
2. "Seguimiento de personas que usan el beneficio" (Bienestar del equipo): encuesta INTRAPLATAFORMA de TT a usuarios activos, trimestral, cargada A MANO desde el admin → tabla `seguimiento_beneficio`. **Nunca alimentar esta sección con datos de la encuesta web.**

## Clientes (al 30 oct 2026)
Nueve empresas con datos reales cargados:

| Empresa | Plan | Meses | Pacientes |
|---|---|---|---|
| ANII | fee fijo | 37 | 19 |
| Genexus Consulting | fee fijo | 27 | 28 |
| Greycon | fee fijo | 26 | 4 |
| Nodum | fee fijo | 26 | 26 |
| Uruware | fee fijo | 26 | 8 |
| Kaizen | a demanda | 19 | 19 |
| Quanam | a demanda | 16 | 13 |
| Qubika | a demanda | 7 | 55 |
| Farmashop | a demanda (100%) | — | sin datos aún |

- **No hay ninguna empresa con cuponera fija hoy** (TCS era la única y dejó de ser cliente en sep 2026; se eliminó por completo). El código de cuponera sigue vivo y hay que mantenerlo.
- **BigCheese es data de prueba del equipo** — su `total_historico` va 10 → 5 → 25 → 3333 → 2 → 0. Nunca usarla para validar métricas.
- Solo Kaizen tiene motivos de consulta cargados. `billing` y `workshops` están vacías: las secciones de facturación y talleres muestran estados vacíos.

## Convenciones
- **Idioma de la UI: español rioplatense con voseo.** "Podés", "tenés", "ingresá". Nunca "puedes".
- **Marca Tu Terapia Empresas 2026** (`const P` en App.jsx): primary `#307070`, light `#5a7968`, lighter `#e6efee`, bg `#fefaf5`, accent/marino `#283d6b`, accentBg `#e9eefb`, border `#e7e1d4`, text/dark `#264534`, textMuted `#5a7968`, celeste/purple `#8da7e6`. Dorado de récords `#D9A441`.
- Tipografías: Bricolage Grotesque para títulos (`F_HEAD`), DM Sans para texto.
- Header alto solo con logo; heros de frase centrados.
- Estilos inline, no hay CSS framework.
- **El admin todavía usa la paleta vieja** (`#1A5C4A`) — el rebrand se aplicó al dash, el admin quedó pendiente.

## Pendientes conocidos
- Upgrade a Supabase Pro (el riesgo de pausa por inactividad sigue vivo).
- Activar "Leaked password protection" en Supabase Auth.
- Consolidar políticas RLS (`multiple_permissive_policies` en ~18 tablas) — pendiente a propósito hasta poder probar con sesiones reales de cada rol.
- Limpiar la data de prueba de BigCheese.
- Validación de las 30 preguntas de la encuesta por los psicólogos.
- Costos reales y usuarios de Farmashop (primer caso real de co-pago).
