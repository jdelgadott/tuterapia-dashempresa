import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from "recharts";

const LOGO_TT = "data:image/jpeg;base64,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";

const P = {
  primary:"#1A5C4A", light:"#267A62", lighter:"#EAF4F0", bg:"#EDF5F1",
  accent:"#2a6aaa", accentBg:"#e8f2fc",
  border:"#DDE8E4", text:"#18211E", textMuted:"#607870", white:"#FFFFFF",
  green:"#267A62", greenLight:"#A8D4C6", gray50:"#F0F4F2",
  red:"#B03030", redBg:"#FAEAEA",
  purple:"#c6b2da", purpleBg:"#F5F0FA",
};
const fmt = (n) => new Intl.NumberFormat("es-UY").format(Math.round(n));

function monthsDiff(startStr){
  const map={Enero:0,Febrero:1,Marzo:2,Abril:3,Mayo:4,Junio:5,Julio:6,Agosto:7,Septiembre:8,Octubre:9,Noviembre:10,Diciembre:11};
  const [mon,yr]=startStr.split(" ");
  const d=new Date(parseInt(yr),map[mon]||6,1);
  const now=new Date(2026,4,1);
  return Math.max(0,(now.getFullYear()-d.getFullYear())*12+now.getMonth()-d.getMonth());
}

const FLOR_PHOTO = "data:image/png;base64,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";
const NACHO_PHOTO = "data:image/jpeg;base64,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";
const ISMA_PHOTO = "data:image/jpeg;base64,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";

const COMPANIES = {
  tcs:{
    name:"TCS", industry:"Tecnología",
    planType:"Cuponera Fija", planCoverage:"100%", monthlyPlan:300,
    startDate:"Julio 2025", sessionPriceRef:1600, coveragePct:1.0,
    accountManager:{name:"Florencia Iroldi",role:"Customer Success Manager",email:"firoldi@tuterapia.com.uy",phone:"093399250",whatsapp:"59893399250",calendar:"https://calendar.google.com/calendar/r/eventnew?add=firoldi@tuterapia.com.uy&text=Reunión+con+Tu+Terapia&details=Reunión+de+seguimiento+del+beneficio+de+salud+mental",initials:"FI"},
    plan:{type:"Cuponera Fija",sessionsMonth:300,priceRef:1600,start:"Jul 2025",renewal:"Jul 2026",status:"activo"},
    monthlyData:[
      {month:"Jul 25",canjeadas:4,  realizadas:1,  nuevos:0, c1:4,  c2:0, c3:0, c4:0,  c5:0,  partial:true},
      {month:"Ago 25",canjeadas:306,realizadas:232,nuevos:66,c1:144,c2:12,c3:11,c4:6,  c5:13},
      {month:"Sep 25",canjeadas:276,realizadas:263,nuevos:15,c1:131,c2:9, c3:3, c4:12, c5:14},
      {month:"Oct 25",canjeadas:310,realizadas:301,nuevos:14,c1:120,c2:8, c3:4, c4:13, c5:22},
      {month:"Nov 25",canjeadas:300,realizadas:290,nuevos:9, c1:134,c2:5, c3:4, c4:16, c5:16},
      {month:"Dic 25",canjeadas:299,realizadas:274,nuevos:6, c1:150,c2:1, c3:9, c4:10, c5:16},
      {month:"Ene 26",canjeadas:306,realizadas:280,nuevos:15,c1:149,c2:2, c3:7, c4:13, c5:16},
      {month:"Feb 26",canjeadas:324,realizadas:307,nuevos:11,c1:146,c2:0, c3:3, c4:16, c5:21},
      {month:"Mar 26",canjeadas:347,realizadas:296,nuevos:8, c1:171,c2:2, c3:4, c4:15, c5:20},
      {month:"Abr 26",canjeadas:340,realizadas:260,nuevos:3, c1:141,c2:4, c3:5, c4:14, c5:24},
      {month:"May 26",canjeadas:266,realizadas:69, nuevos:5, c1:110,c2:3, c3:3, c4:14, c5:17,partial:true},
    ],
    wellbeingByQ:[
      {q:"Q3 2025",score:null},{q:"Q4 2025",score:null},{q:"Q1 2026",score:null},{q:"Q2 2026",score:null},
    ],
    roiByQ:[
      {q:"Q3 2025",saludMental:null,clima:null,liderazgo:null,engagement:null,asistencia:null,productividad:null},
      {q:"Q4 2025",saludMental:null,clima:null,liderazgo:null,engagement:null,asistencia:null,productividad:null},
      {q:"Q1 2026",saludMental:null,clima:null,liderazgo:null,engagement:null,asistencia:null,productividad:null},
      {q:"Q2 2026",saludMental:null,clima:null,liderazgo:null,engagement:null,asistencia:null,productividad:null},
    ],
    nps:null, npsDate:null, consultationReasons:[], firstTimePct:null, firstTimeCount:null,
    workshops:[
      {title:"Activación del beneficio",date:"Ago 2025",speaker:"Juan I. Delgado",initials:"JD",type:"Activación",lang:"Español",rating:4.8},
      {title:"Activación del beneficio",date:"Ago 2025",speaker:"Nico, CEO",initials:"NC",type:"Activación",lang:"Inglés",rating:4.7},
      {title:"Concientización en salud mental",date:"Sep 2025",speaker:"Equipo Tu Terapia",initials:"TT",type:"Concientización",rating:4.6},
      {title:"Mindfulness en el trabajo",date:"Oct 2025",speaker:"Equipo Tu Terapia",initials:"TT",type:"Mindfulness",rating:4.9},
      {title:"Liderazgo consciente",date:"Nov 2025",speaker:"Equipo Tu Terapia",initials:"TT",type:"Liderazgo",rating:4.7},
      {title:"Liderazgo para equipos",date:"Feb 2026",speaker:"Equipo Tu Terapia",initials:"TT",type:"Liderazgo",rating:4.8},
      {title:"Salud mental y perspectiva de género",date:"Mar 2026",speaker:"Caro Barros · Carina Roveta",initials:"CB",type:"8M",rating:4.9},
    ],
    workshopsRecommended:[
      {title:"Gestión del estrés y resiliencia",desc:"Para equipos en contextos de alta demanda operativa",month:"Jun 2026"},
      {title:"Comunicación no violenta",desc:"Mejora el clima y los vínculos entre áreas",month:"Jul 2026"},
      {title:"Productividad sostenible",desc:"Foco y energía sin burnout",month:"Ago 2026"},
    ],
    collectiveImpact:[
      {event:"Activación del beneficio (×2)",date:"Ago 2025",type:"Activación",newPatients:66,note:"Mayor incorporación mensual registrada — 66 nuevos pacientes en el mismo período."},
      {event:"Concientización en salud mental",date:"Sep 2025",type:"Taller",newPatients:15,note:"Sostenimiento del flujo de nuevos pacientes tras la activación inicial."},
      {event:"Mindfulness en el trabajo",date:"Oct 2025",type:"Taller",newPatients:14,note:"Segundo mes consecutivo con alta incorporación, correlacionado con el taller de bienestar."},
      {event:"Liderazgo para equipos",date:"Feb 2026",type:"Taller",newPatients:11,note:"Repunte de nuevos pacientes tras el taller de liderazgo, el mayor desde Oct 2025."},
    ],
    surveys:[
      {title:"Encuesta de Indice Tu Terapia",desc:"22 preguntas - 6 dimensiones - ~10 min - aplicar a todo el equipo o por sector",isMain:true,dims:["Bienestar y salud mental","Clima y comunicación","Liderazgo efectivo","Engagement y compromiso","Ausentismo percibido","Productividad sostenible"]},
    ],
    workshopTarget:5,
    content:[
      {title:"Kit de activacion del beneficio Tu Terapia",type:"Campana",date:"Ago 2025",downloaded:true,rating:5,sent:true},
      {title:"Material 8M - Salud mental y perspectiva de genero",type:"Campana",date:"Mar 2026",downloaded:true,rating:4,sent:true},
      {title:"Guia para lideres: como hablar de salud mental",type:"Guia",date:"Sep 2025",downloaded:true,rating:4,sent:false},
      {title:"Protocolo de acompanamiento en crisis",type:"Protocolo",date:"Nov 2025",downloaded:false,rating:null,sent:false},
      {title:"Protocolo de derivacion a psicologia",type:"Protocolo",date:"Ene 2026",downloaded:false,rating:null,sent:false},
    ],
    reports:[
      {title:"Informe de uso Q3 2025",date:"Oct 2025",downloadable:true},
      {title:"Informe de uso Q4 2025",date:"Ene 2026",downloadable:true},
      {title:"Informe de uso Q1 2026",date:"Abr 2026",downloadable:true,isNew:true},
    ],
    recommendations:[
      {action:"Campaña de reconexión con el beneficio",reason:"Se detecta descenso en la frecuencia de consultas relacionadas con estrés laboral en el último trimestre, lo que puede indicar subregistro o barrera de acceso más que mejora real del bienestar.",urgency:"alta",date:"May 2026"},
      {action:"Atención al aumento de consultas por vínculos interpersonales",reason:"Los datos de la plataforma muestran crecimiento sostenido en motivos de consulta relacionados con dinámica de equipo y comunicación — señal temprana de tensión organizacional.",urgency:"media",date:"May 2026"},
      {action:"Profundizar el abordaje de bienestar en mandos medios",reason:"El perfil de uso indica que los líderes intermedios tienen menor frecuencia de consulta que el promedio del equipo, a pesar de ser el grupo con mayor exposición a situaciones de presión.",urgency:"baja",date:"May 2026"},
    ],
    milestones:[
      {label:"100 sesiones financiadas",reached:true,date:"Sep 2025",value:100},
      {label:"500 sesiones financiadas",reached:true,date:"Oct 2025",value:500},
      {label:"1.000 sesiones financiadas",reached:true,date:"Dic 2025",value:1000},
      {label:"2.000 sesiones financiadas",reached:true,date:"Mar 2026",value:2000},
      {label:"3.000 sesiones financiadas",reached:false,value:3000},
      {label:"Primer taller realizado",reached:true,date:"Ago 2025"},
      {label:"5 talleres realizados",reached:true,date:"Nov 2025"},
      {label:"7 talleres realizados",reached:true,date:"Mar 2026"},
      {label:"10 talleres realizados",reached:false},
      {label:"6 meses de alianza",reached:true,date:"Ene 2026"},
      {label:"10 meses de alianza",reached:true,date:"May 2026"},
      {label:"Primer año de alianza",reached:false,date:"Jul 2026"},
    ],
    billing:[
      {period:"Jul 2025",amount:1600,   status:"pagado",  invoice:"TT-2025-071",fileUrl:null},
      {period:"Ago 2025",amount:371200, status:"pagado",  invoice:"TT-2025-081",fileUrl:null},
      {period:"Sep 2025",amount:420800, status:"pagado",  invoice:"TT-2025-091",fileUrl:null},
      {period:"Oct 2025",amount:481600, status:"pagado",  invoice:"TT-2025-101",fileUrl:null},
      {period:"Nov 2025",amount:464000, status:"pagado",  invoice:"TT-2025-111",fileUrl:null},
      {period:"Dic 2025",amount:438400, status:"pagado",  invoice:"TT-2025-121",fileUrl:null},
      {period:"Ene 2026",amount:448000, status:"pagado",  invoice:"TT-2026-011",fileUrl:null},
      {period:"Feb 2026",amount:491200, status:"pagado",  invoice:"TT-2026-021",fileUrl:null},
      {period:"Mar 2026",amount:473600, status:"pagado",  invoice:"TT-2026-031",fileUrl:null},
      {period:"Abr 2026",amount:416000, status:"pagado",  invoice:"TT-2026-041",fileUrl:null},
      {period:"May 2026",amount:110400, status:"pendiente",invoice:"TT-2026-051",fileUrl:null},
    ],
  },
};

const TT_TEAM=[
  {name:"Nacho",fullName:"Juan Ignacio Delgado",role:"Desarrollo de Negocio",email:"jdelgado@tuterapia.com.uy",phone:"099495218",whatsapp:"598099495218",calendar:null,initials:"JD",area:"Alianzas B2B",photo:"nacho"},
  {name:"Flor",fullName:"Florencia Iroldi",role:"Customer Success Manager",email:"firoldi@tuterapia.com.uy",phone:"093399250",whatsapp:"59893399250",calendar:"https://calendar.google.com/calendar/r/eventnew?add=firoldi@tuterapia.com.uy&text=Reunión+con+Tu+Terapia&details=Reunión+de+seguimiento+del+beneficio+de+salud+mental",initials:"FI",area:"Gestión de cuentas",photo:"flor"},
  {name:"Isma",fullName:"Ismael Mazzilli",role:"Prospección y Cuentas",email:"imazilli@tuterapia.com.uy",phone:"091738836",whatsapp:"598091738836",calendar:null,initials:"IM",area:"Gestión de cuentas",photo:"isma"},
];

const MODULES=[
  {id:"individual", label:"Colaboradores",  subs:["Sesiones","Adherencia"]},
  {id:"colectivo",  label:"Cultura de Bienestar",   subs:["Talleres","Contenido"]},
  {id:"estrategico",label:"Estrategia de Bienestar", subs:["Bienestar del equipo","Consultoría Tu Terapia","Recursos y reportes"]},
  {id:"gestion",    label:"Gestión",            subs:["Facturación","Plan activo","Equipo TT"],restricted:true},
];

const WSHOP_COLORS={Activación:P.primary,"Concientización":"#1A3A8B",Mindfulness:"#5040A0",Liderazgo:P.accent,"8M":"#8B1A3A"};
const TYPE_COLORS={Campaña:{bg:"#FFF0E6",tx:"#7A3800"},Guía:{bg:P.lighter,tx:P.primary},Protocolo:{bg:"#EEF4FF",tx:"#1A3A8B"},Reporte:{bg:P.gray50,tx:P.textMuted}};
const URGENCY={alta:{bg:P.redBg,tx:P.red,label:"Urgente"},media:{bg:P.accentBg,tx:P.accent,label:"Media prioridad"},baja:{bg:P.lighter,tx:P.primary,label:"A considerar"}};
const COUPON_COLORS=["#1A5C4A","#267A62","#4AA888","#2a6aaa","#D9A060"];

function Avatar({initials,size=36,bg=P.primary}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
    <span style={{color:P.white,fontWeight:700,fontSize:Math.round(size*0.32)}}>{initials}</span>
  </div>;
}
function Stars({rating}){
  return <span style={{display:"flex",alignItems:"center",gap:2}}>
    {[1,2,3,4,5].map(i=><svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i<=Math.round(rating)?P.accent:"#E0E0E0"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
    <span style={{fontSize:11,color:P.textMuted,marginLeft:3}}>{rating.toFixed(1)}</span>
  </span>;
}
function Label({text,bg,tx}){ return <span style={{background:bg,color:tx,fontSize:10,fontWeight:600,letterSpacing:"0.04em",padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap"}}>{text}</span>; }
function KpiCard({label,value,sub,accent,warn}){
  return <div style={{background:accent?P.lighter:warn?P.accentBg:P.white,border:`1px solid ${accent?P.primary+"44":warn?P.accent+"44":P.border}`,borderRadius:12,padding:"16px 18px",display:"flex",flexDirection:"column",gap:4,minWidth:0}}>
    <div style={{fontSize:21,fontWeight:700,color:accent?P.primary:warn?P.accent:P.text,lineHeight:1.1,letterSpacing:"-0.5px"}}>{value}</div>
    <div style={{fontSize:12,fontWeight:600,color:P.text}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:P.textMuted}}>{sub}</div>}
  </div>;
}
function Section({title,children,note,warnNote,action}){
  return <div style={{background:P.white,borderRadius:14,border:`1px solid ${P.border}`,padding:"20px 22px",marginBottom:14}}>
    {title&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.08em"}}>{title}</div>
      {action&&<button onClick={action.fn} style={{fontSize:11,color:P.primary,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>{action.label}</button>}
    </div>}
    {children}
    {note&&<div style={{marginTop:12,padding:"10px 13px",background:P.lighter,borderRadius:8,fontSize:11,color:P.primary,lineHeight:1.6}}>{note}</div>}
    {warnNote&&<div style={{marginTop:12,padding:"10px 13px",background:P.accentBg,borderRadius:8,fontSize:11,color:"#1a4a7a",lineHeight:1.6}}>{warnNote}</div>}
  </div>;
}
const Tip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  const L={canjeadas:"Canjeadas",realizadas:"Realizadas",investment:"Inversión",nuevos:"Nuevos pacientes"};
  return <div style={{background:P.white,border:`1px solid ${P.border}`,borderRadius:10,padding:"10px 14px",fontSize:12,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
    <div style={{fontWeight:600,color:P.text,marginBottom:4}}>{label}</div>
    {payload.map(p=><div key={p.name} style={{color:p.fill||P.primary,display:"flex",justifyContent:"space-between",gap:16}}>
      <span>{L[p.name]||p.name}</span>
      <span style={{fontWeight:600}}>{p.name==="investment"?`$ ${fmt(p.value)}`:p.value}</span>
    </div>)}
  </div>;
};
function FunnelBar({label,value,pct,i}){
  const fills=[P.border,P.light,P.primary];
  return <div style={{display:"flex",alignItems:"center",gap:12}}>
    <div style={{width:200,fontSize:11,color:P.textMuted,flexShrink:0}}>{label}</div>
    <div style={{flex:1,background:P.gray50,borderRadius:6,height:20,overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${pct}%`,background:fills[Math.min(i,2)],borderRadius:6}}/>
      <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:10,fontWeight:600,color:i===0?P.textMuted:P.white,zIndex:1}}>{fmt(value)}</span>
    </div>
    <div style={{fontSize:12,fontWeight:700,color:i===2?P.primary:P.text,width:40,textAlign:"right"}}>{pct}%</div>
  </div>;
}


// ── LOGIN ──────────────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if(!email||!password){ setError("Completá email y contraseña."); return; }
    setLoading(true); setError("");
    const {data, error:authError} = await supabase.auth.signInWithPassword({ email, password });
    if(authError){ setError("Email o contraseña incorrectos."); setLoading(false); return; }
    const {data:userData} = await supabase.from("company_users").select("*, companies(*)").eq("email", email).eq("active", true).single();
    if(!userData){ await supabase.auth.signOut(); setError("No tenés acceso al dashboard."); setLoading(false); return; }
    const {data:permsData} = await supabase.from("user_permissions").select("*").eq("user_id", userData.id);
    onLogin(userData, permsData||[]);
    setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"#EDF5F1",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"#FFFFFF",borderRadius:16,border:"1px solid #DDE8E4",padding:"40px",width:360,boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:48,height:48,borderRadius:12,background:"#1A5C4A",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
            <img src={LOGO_TT} alt="Tu Terapia" style={{width:34,height:34,objectFit:"contain",borderRadius:6}}/>
          </div>
          <div style={{fontSize:20,fontWeight:700,color:"#18211E",marginBottom:4}}>Panel de bienestar</div>
          <div style={{fontSize:13,color:"#607870"}}>Tu Terapia — acceso empresarial</div>
        </div>
        {error&&<div style={{padding:"10px 14px",background:"#FAEAEA",color:"#B03030",borderRadius:8,marginBottom:16,fontSize:12,fontWeight:500}}>{error}</div>}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:600,color:"#607870",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@empresa.com"
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            style={{width:"100%",padding:"10px 12px",border:"1px solid #DDE8E4",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:24}}>
          <label style={{fontSize:11,fontWeight:600,color:"#607870",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            style={{width:"100%",padding:"10px 12px",border:"1px solid #DDE8E4",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <button onClick={handleLogin} disabled={loading}
          style={{width:"100%",padding:"11px",background:"#1A5C4A",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1}}>
          {loading?"Verificando...":"Ingresar"}
        </button>
      </div>
    </div>
  );
}


function TallerCard({ w, talleristas }) {
  const [expanded, setExpanded] = useState(false);
  const tallerista = talleristas.find(t=>t.name===w.speaker||t.initials===w.initials);
  return (
    <div style={{background:"#FFFFFF",borderRadius:12,border:"1px solid #DDE8E4",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setExpanded(!expanded)}>
        {tallerista?.photo_url
          ? <img src={tallerista.photo_url} alt={w.speaker} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
          : <div style={{width:40,height:40,borderRadius:"50%",background:"#1A5C4A",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:12}}>{w.initials||"TT"}</span>
            </div>
        }
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:"#18211E",marginBottom:2}}>{w.title}</div>
          <div style={{fontSize:11,color:"#607870"}}>{w.date} · {w.speaker}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          {w.rating&&<span style={{fontSize:13,fontWeight:700,color:"#2a6aaa"}}>★ {w.rating}</span>}
          <span style={{fontSize:14,color:"#607870",transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
        </div>
      </div>
      {expanded&&<div style={{borderTop:"1px solid #DDE8E4",padding:"14px 16px",background:"#F0F4F2"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
          {[
            {label:"Satisfacción general",value:w.rating,color:"#1A5C4A"},
            {label:"Calificación tallerista",value:w.rating_tallerista,color:"#2a6aaa"},
            {label:"Relevancia del contenido",value:w.rating_relevancia,color:"#5040A0"},
          ].map(({label,value,color})=>(
            <div key={label} style={{background:"#FFFFFF",borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:11,color:"#607870",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>
              <div style={{fontSize:22,fontWeight:700,color}}>{value||"—"}</div>
              <div style={{fontSize:10,color:"#607870"}}>sobre 5</div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

export default function Dashboard(){
  // Auth states MUST be first — React rules of hooks
  const [authUser, setAuthUser] = useState(null);
  const [userPerms, setUserPerms] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [settingPassword, setSettingPassword] = useState(false);

  const [ck,setCk]=useState("tcs");
  const [mod,setMod]=useState("home");
  const [sub,setSub]=useState(null);
  const [npsVal,setNpsVal]=useState(null);
  const [showIII,setShowIII]=useState(false);

  const [consultoriaSolicitado,setConsultoriaSolicitado]=useState(false);
  const [localConsultoriaActiva,setConsultoriaActiva]=useState(false);
  const [expandedSurvey,setExpandedSurvey]=useState(null);
  const [expandedReport,setExpandedReport]=useState(null);
  const [openSections,setOpenSections]=useState({encuestas:true,informes:false,recomendaciones:false,impacto:false});
  const toggleSection=(key)=>setOpenSections(prev=>({...prev,[key]:!prev[key]}));

  const [solicitando,setSolicitando]=useState(false);
  const [contentRatings,setContentRatings]=useState({});
  const [contentSent,setContentSent]=useState({});
  const [contentDownloaded,setContentDownloaded]=useState({});
  const [editNps,setEditNps]=useState(false);
  const [npsInput,setNpsInput]=useState("");
  const [npsDate,setNpsDate]=useState(null);

  useEffect(()=>{
    // Check if coming from password recovery link
    const hash = window.location.hash;
    if(hash.includes('type=recovery') || hash.includes('type=invite')) {
      setShowSetPassword(true);
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(async({data:{session}, error:sessionError})=>{
      if(sessionError||!session?.user){ setAuthLoading(false); return; }
      try {
        const {data:ud, error:udError} = await supabase.from("company_users").select("*, companies(*)").eq("email",session.user.email).eq("active",true).single();
        if(ud&&!udError){
          const {data:pd} = await supabase.from("user_permissions").select("*").eq("user_id",ud.id);
          setAuthUser(ud); setUserPerms(pd||[]);
        } else { await supabase.auth.signOut(); }
      } catch(e) { await supabase.auth.signOut(); }
      setAuthLoading(false);
    });
    // Listen for auth changes (token refresh, logout)
    const {data:{subscription}} = supabase.auth.onAuthStateChange(async(event, session)=>{
      if(event==="SIGNED_OUT"||event==="TOKEN_REFRESHED"&&!session){
        setAuthUser(null); setUserPerms([]);
      }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  // Load dynamic data from Supabase
  const [dbReports, setDbReports] = useState([]);
  const [dbSurveys, setDbSurveys] = useState([]);
  const [dbContent, setDbContent] = useState([]);
  const [dbWorkshops, setDbWorkshops] = useState([]);
  const [dbTalleristas, setDbTalleristas] = useState([]);
  const [dbHeaderTexts, setDbHeaderTexts] = useState([]);
  const [dbCompany, setDbCompany] = useState(null);

  const [dbSessions, setDbSessions] = useState([]);
  const [dbBilling, setDbBilling] = useState([]);
  const [dbRecommendations, setDbRecommendations] = useState([]);
  const [dbMilestones, setDbMilestones] = useState([]);
  const [dbNps, setDbNps] = useState([]);
  const [dbConsultationReasons, setDbConsultationReasons] = useState([]);
  const [dbWorkshopsRec, setDbWorkshopsRec] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(()=>{
    if(!authUser) return;
    const companyId = authUser.company_id;
    if(!companyId) return;
    setDataLoading(true);
    async function loadData() {
      const [
        reports, surveys, content, workshops, workshopsRec, talleristas,
        headerTexts, company, sessions, billing, recommendations,
        milestones, nps, reasons
      ] = await Promise.all([
        supabase.from("informes").select("*").eq("company_id",companyId).order("created_at",{ascending:false}),
        supabase.from("encuestas_archivos").select("*").eq("company_id",companyId).order("created_at",{ascending:false}),
        supabase.from("content").select("*").eq("company_id",companyId).order("created_at",{ascending:false}),
        supabase.from("workshops").select("*").eq("company_id",companyId).order("date",{ascending:true}),
        supabase.from("workshops_recommended").select("*").eq("company_id",companyId).order("created_at",{ascending:false}),
        supabase.from("talleristas").select("*").order("name"),
        supabase.from("header_texts").select("*").eq("company_id",companyId),
        supabase.from("companies").select("*").eq("id",companyId).single(),
        supabase.from("sessions_data").select("*").eq("company_id",companyId).order("year").order("month"),
        supabase.from("billing").select("*").eq("company_id",companyId).order("created_at",{ascending:false}),
        supabase.from("recommendations").select("*").eq("company_id",companyId).order("created_at",{ascending:false}),
        supabase.from("milestones").select("*").eq("company_id",companyId).order("created_at"),
        supabase.from("nps_data").select("*").eq("company_id",companyId).order("created_at",{ascending:false}),
        supabase.from("consultation_reasons").select("*").eq("company_id",companyId).order("percentage",{ascending:false}),
      ]);
      setDbReports(reports.data||[]);
      setDbSurveys(surveys.data||[]);
      setDbContent(content.data||[]);
      setDbWorkshops(workshops.data||[]);
      setDbWorkshopsRec(workshopsRec.data||[]);
      setDbTalleristas(talleristas.data||[]);
      setDbHeaderTexts(headerTexts.data||[]);
      setDbCompany(company.data||null);
      setDbSessions(sessions.data||[]);
      setDbBilling(billing.data||[]);
      setDbRecommendations(recommendations.data||[]);
      setDbMilestones(milestones.data||[]);
      setDbNps(nps.data||[]);
      setDbConsultationReasons(reasons.data||[]);
      setDataLoading(false);
    }
    loadData();
  },[authUser]);

  const hasAccess = (moduleId) => {
    if(userPerms.length===0) return false;
    const perm = userPerms.find(p=>p.section===moduleId);
    return perm ? perm.visible : false;
  };

  // Password set screen (from invite or recovery link)
  if(showSetPassword) return (
    <div style={{minHeight:"100vh",background:"#EDF5F1",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"#FFFFFF",borderRadius:16,border:"1px solid #DDE8E4",padding:"40px",width:380,boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <img src={LOGO_TT} alt="Tu Terapia" style={{height:40,marginBottom:14}}/>
          <div style={{fontSize:20,fontWeight:700,color:"#18211E"}}>Creá tu contraseña</div>
          <div style={{fontSize:13,color:"#607870",marginTop:6}}>Elegí una contraseña para acceder al dashboard</div>
        </div>
        {passwordMsg&&<div style={{padding:"10px 14px",background:passwordMsg.startsWith("Error")||passwordMsg.startsWith("Las")?"#FAEAEA":"#E6F4F0",color:passwordMsg.startsWith("Error")||passwordMsg.startsWith("Las")?"#B03030":"#1A5C4A",borderRadius:8,marginBottom:14,fontSize:12}}>{passwordMsg}</div>}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,fontWeight:600,color:"#607870",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Nueva contraseña</label>
          <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres"
            style={{width:"100%",padding:"10px 12px",border:"1px solid #DDE8E4",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,fontWeight:600,color:"#607870",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Repetí la contraseña</label>
          <input type="password" value={newPassword2} onChange={e=>setNewPassword2(e.target.value)} placeholder="Repetí tu contraseña"
            style={{width:"100%",padding:"10px 12px",border:"1px solid #DDE8E4",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <button disabled={settingPassword} onClick={async()=>{
          if(newPassword.length < 8){ setPasswordMsg("La contraseña debe tener al menos 8 caracteres."); return; }
          if(newPassword !== newPassword2){ setPasswordMsg("Las contraseñas no coinciden."); return; }
          setSettingPassword(true);
          const {error} = await supabase.auth.updateUser({password: newPassword});
          if(error){ setPasswordMsg("Error: "+error.message); setSettingPassword(false); return; }
          setPasswordMsg("¡Contraseña creada! Redirigiendo...");
          setTimeout(()=>{ setShowSetPassword(false); window.location.hash=""; setAuthLoading(false); window.location.reload(); }, 1500);
        }} style={{width:"100%",padding:11,background:"#1A5C4A",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:settingPassword?"not-allowed":"pointer",opacity:settingPassword?0.7:1}}>
          {settingPassword?"Guardando...":"Crear contraseña"}
        </button>
      </div>
    </div>
  );

  // Password set screen (from invite or recovery link)
  if(showSetPassword) return (
    <div style={{minHeight:"100vh",background:"#EDF5F1",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"#FFFFFF",borderRadius:16,border:"1px solid #DDE8E4",padding:"40px",width:380,boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <img src={LOGO_TT} alt="Tu Terapia" style={{height:40,marginBottom:14,display:"block",margin:"0 auto 14px"}}/>
          <div style={{fontSize:20,fontWeight:700,color:"#18211E"}}>Creá tu contraseña</div>
          <div style={{fontSize:13,color:"#607870",marginTop:6}}>Elegí una contraseña para acceder al dashboard</div>
        </div>
        {passwordMsg&&<div style={{padding:"10px 14px",background:passwordMsg.startsWith("Error")||passwordMsg.startsWith("Las")?"#FAEAEA":"#E6F4F0",color:passwordMsg.startsWith("Error")||passwordMsg.startsWith("Las")?"#B03030":"#1A5C4A",borderRadius:8,marginBottom:14,fontSize:12}}>{passwordMsg}</div>}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,fontWeight:600,color:"#607870",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Nueva contraseña</label>
          <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres"
            style={{width:"100%",padding:"10px 12px",border:"1px solid #DDE8E4",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,fontWeight:600,color:"#607870",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Repetí la contraseña</label>
          <input type="password" value={newPassword2} onChange={e=>setNewPassword2(e.target.value)} placeholder="Repetí tu contraseña"
            style={{width:"100%",padding:"10px 12px",border:"1px solid #DDE8E4",borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <button disabled={settingPassword} onClick={async()=>{
          if(newPassword.length<8){setPasswordMsg("La contraseña debe tener al menos 8 caracteres.");return;}
          if(newPassword!==newPassword2){setPasswordMsg("Las contraseñas no coinciden.");return;}
          setSettingPassword(true);
          const {error}=await supabase.auth.updateUser({password:newPassword});
          if(error){setPasswordMsg("Error: "+error.message);setSettingPassword(false);return;}
          setPasswordMsg("¡Contraseña creada! Redirigiendo...");
          setTimeout(()=>{setShowSetPassword(false);window.location.hash="";setAuthLoading(false);window.location.reload();},1500);
        }} style={{width:"100%",padding:11,background:"#1A5C4A",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:settingPassword?"not-allowed":"pointer",opacity:settingPassword?0.7:1}}>
          {settingPassword?"Guardando...":"Crear contraseña"}
        </button>
      </div>
    </div>
  );

  if(authLoading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#EDF5F1",fontFamily:"system-ui,sans-serif",color:"#607870",fontSize:13}}>Cargando...</div>;
  if(!authUser) return <LoginView onLogin={(ud,pd)=>{ setAuthUser(ud); setUserPerms(pd); }}/>;

  // Merge hardcoded TCS data with Supabase data
  const baseC = COMPANIES[ck];
  
  // Build monthlyData from Supabase sessions if available
  const supabaseMonthlyData = dbSessions.length>0 ? dbSessions.map(s=>({
    month: s.month,
    year: s.year,
    canjeadas: s.canjeadas||0,
    realizadas: s.realizadas||0,
    nuevos: s.nuevos||0,
    activos: s.activos||0,
    total_historico: s.total_historico||0,
    primera_vez: s.primera_vez||0,
    c1: s.c1||0, c2: s.c2||0, c3: s.c3||0, c4: s.c4||0, c5: s.c5||0,
    partial: s.partial||false,
  })) : null;

  // Build billing from Supabase if available
  const supabaseBilling = dbBilling.length>0 ? dbBilling.map(b=>({
    period: b.period,
    amount: b.amount||0,
    status: b.status||"pendiente",
    invoice: b.invoice||"",
    fileUrl: b.file_url||null,
  })) : null;

  // Build company config from Supabase if available
  const c = {
    ...baseC,
    // Override with Supabase data when available
    name: dbCompany?.name || baseC.name,
    monthlyData: supabaseMonthlyData || baseC.monthlyData,
    billing: supabaseBilling || baseC.billing,
    workshops: dbWorkshops.length>0 ? dbWorkshops : baseC.workshops,
    workshopsRecommended: dbWorkshopsRec.length>0 ? dbWorkshopsRec : baseC.workshopsRecommended,
    content: dbContent.length>0 ? dbContent : baseC.content,
    recommendations: dbRecommendations.length>0 ? dbRecommendations : baseC.recommendations,
    milestones: dbMilestones.length>0 ? dbMilestones : baseC.milestones,
    consultationReasons: dbConsultationReasons.length>0 ? dbConsultationReasons : baseC.consultationReasons,
    consultoriaActiva: dbCompany?.consultoria_activa || baseC.consultoriaActiva || false,
    consultoriaSolicitada: dbCompany?.consultoria_solicitada || baseC.consultoriaSolicitada || false,
    plan: dbCompany ? {
      type: dbCompany.plan_type || baseC.plan.type,
      coverage: dbCompany.plan_coverage || baseC.plan.coverage,
      sessionsMonth: dbCompany.monthly_plan || baseC.plan.sessionsMonth,
      priceRef: dbCompany.session_price_ref || baseC.plan.priceRef,
      renewal: baseC.plan.renewal,
    } : baseC.plan,
    sessionPriceRef: dbCompany?.session_price_ref || baseC.sessionPriceRef,
    workshopTarget: dbCompany?.workshop_target || baseC.workshopTarget,
    startDate: dbCompany?.start_date || baseC.startDate,
    // NPS from Supabase
    nps: dbNps.length>0 ? dbNps[0].value : baseC.nps,
    npsDate: dbNps.length>0 ? dbNps[0].date : baseC.npsDate,
  };

  // Calculate firstTime from sessions data
  const calcFirstTimeCount = (()=>{
    const data = supabaseMonthlyData || baseC.monthlyData;
    const total = data.reduce((s,m)=>s+(m.primera_vez||0),0);
    return total > 0 ? total : null;
  })();
  const calcTotHistorico = (()=>{
    const data = supabaseMonthlyData || baseC.monthlyData;
    const lastWithHist=[...data].reverse().find(m=>m.total_historico>0);
    return lastWithHist?lastWithHist.total_historico:null;
  })();
  if(calcFirstTimeCount!==null) {
    c.firstTimeCount = calcFirstTimeCount;
    c.firstTimePct = calcTotHistorico ? Math.round((calcFirstTimeCount/calcTotHistorico)*100) : null;
  }

  const getHeaderText = (module, sub, field) => {
    const found = dbHeaderTexts.find(h=>h.module===module&&(h.sub===sub||(!h.sub&&!sub)));
    return found?.[field]||null;
  };
  const months=monthsDiff(c.startDate);
  const activeMod=MODULES.find(m=>m.id===mod);

  const goHome=()=>{ setMod("home"); setSub(null); };
  const setModule=(id)=>{ setMod(id); setSub(MODULES.find(x=>x.id===id)?.subs[0]||null); };

  const fullM=c.monthlyData.filter(m=>!m.partial);
  const totCanj=c.monthlyData.reduce((s,m)=>s+m.canjeadas,0);
  const totReal=c.monthlyData.reduce((s,m)=>s+m.realizadas,0);
  const totNuev=c.monthlyData.reduce((s,m)=>s+m.nuevos,0);
  // Total histórico = last month's total_historico, or sum of nuevos as fallback
  const totHistorico=(()=>{
    const lastWithHist=[...c.monthlyData].reverse().find(m=>m.total_historico>0);
    return lastWithHist?lastWithHist.total_historico:totNuev;
  })();
  const fullCanj=fullM.reduce((s,m)=>s+m.canjeadas,0);
  const fullReal=fullM.reduce((s,m)=>s+m.realizadas,0);
  const compRate=fullCanj>0?Math.round(fullReal/fullCanj*100):0;
  const lastFull=fullM[fullM.length-1];
  const lastM=c.monthlyData[c.monthlyData.length-1];
  const couponD=[
    {name:"1 sesión", value:c.monthlyData.reduce((s,m)=>s+m.c1,0)},
    {name:"2 sesiones",value:c.monthlyData.reduce((s,m)=>s+m.c2,0)},
    {name:"3 sesiones",value:c.monthlyData.reduce((s,m)=>s+m.c3,0)},
    {name:"4 sesiones",value:c.monthlyData.reduce((s,m)=>s+m.c4,0)},
    {name:"5 sesiones",value:c.monthlyData.reduce((s,m)=>s+m.c5,0)},
  ];
  const totCoup=couponD.reduce((s,d)=>s+d.value,0);
  const invTotal=totReal*c.sessionPriceRef;
  const invLastFull=lastFull?lastFull.realizadas*c.sessionPriceRef:0;
  const invPerPat=totNuev>0?invTotal/totNuev:0;
  const invTrend=c.monthlyData.map(m=>({month:m.month,investment:Math.round(m.realizadas*c.sessionPriceRef),partial:m.partial}));
  const billingPaid=c.billing.filter(b=>b.status==="pagado").reduce((s,b)=>s+b.amount,0);
  const billingPending=c.billing.filter(b=>b.status==="pendiente").reduce((s,b)=>s+b.amount,0);

  const QUADRANTS=[
    {id:"individual", label:"Colaboradores", color:P.primary, borderColor:P.primary,
     stats:[`${fmt(totReal)} sesiones realizadas`,`${totNuev} pacientes únicos`,`${compRate}% tasa de realización`]},
    {id:"colectivo",  label:"Cultura de Bienestar",  color:P.purple, borderColor:P.purple,
     stats:[`${c.workshops.length} talleres realizados`,`${c.content.length} recursos disponibles`,"Próximo: Jun 2026"]},
    {id:"estrategico",label:"Estrategia de Bienestar",color:P.accent, borderColor:P.accent,
     stats:["NPS: pendiente Q2","Bienestar: pendiente Q2",`${c.recommendations.length} recomendaciones activas`]},
    {id:"gestion",    label:"Gestión",          color:P.textMuted, borderColor:P.border, restricted:true,
     stats:[`$ ${fmt(billingPaid)} facturado`,`Renovación ${c.plan.renewal}`,"Plan activo"]},
  ];

  return <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",background:P.bg,minHeight:"100vh",color:P.text}}>

    {/* Header */}
    <div style={{background:P.white,borderBottom:`2px solid ${P.primary}`,padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",height:68,flexWrap:"wrap",gap:12}}>
      <button onClick={goHome} style={{display:"flex",alignItems:"center",gap:14,background:"none",border:"none",cursor:"pointer",padding:0}}>
        <img src={LOGO_TT} alt="Tu Terapia" style={{height:44,objectFit:"contain",flexShrink:0}}/>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:16,fontWeight:600,color:P.primary,letterSpacing:"-0.4px"}}>Tu Terapia</div>
          <div style={{fontSize:11,color:P.textMuted}}>Dashboard de bienestar</div>
        </div>
      </button>
      {mod!=="home"&&activeMod&&<div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
        {MODULES.map(m=><button key={m.id} onClick={()=>setModule(m.id)} style={{fontSize:12,fontWeight:mod===m.id?700:400,color:mod===m.id?P.primary:P.textMuted,background:"none",border:"none",borderBottom:mod===m.id?`2px solid ${P.primary}`:"2px solid transparent",padding:"8px 14px",cursor:"pointer",whiteSpace:"nowrap"}}>
          {m.label}
        </button>)}
      </div>}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{background:P.lighter,borderRadius:20,padding:"5px 14px",border:`1px solid #C8E8DF`,display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#22C55E",flexShrink:0}}/>
          <span style={{fontSize:12,fontWeight:500,color:P.primary}}>{c.name}&nbsp;·&nbsp;Plan activo</span>
        </div>
        <button onClick={async()=>{ await supabase.auth.signOut(); setAuthUser(null); setUserPerms([]); }}
          style={{fontSize:11,color:P.textMuted,background:"none",border:`1px solid ${P.border}`,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontWeight:500}}>
          Cerrar sesión
        </button>
      </div>
    </div>

    {/* Sub nav */}
    {mod!=="home"&&<div style={{background:P.white,borderBottom:`1px solid ${P.border}`,padding:"0 28px",display:"flex",alignItems:"center",overflowX:"auto"}}>
      <button onClick={goHome} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:P.textMuted,background:P.gray50,border:`1px solid ${P.border}`,borderRadius:7,padding:"5px 12px",margin:"6px 12px 6px 0",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
        ← Inicio
      </button>
      {activeMod?.subs&&activeMod.subs.map(s=><button key={s} onClick={()=>setSub(s)} style={{fontSize:12,fontWeight:sub===s?600:400,color:sub===s?P.primary:P.textMuted,background:"none",border:"none",borderBottom:sub===s?`2px solid ${P.primary}`:"2px solid transparent",padding:"9px 16px",cursor:"pointer",whiteSpace:"nowrap",letterSpacing:"0.01em"}}>{s}</button>)}
    </div>}

    <div style={{padding:"28px",maxWidth:960,margin:"0 auto"}}>

    {/* ── HOME ── */}
    {mod==="home"&&<>
      {/* Saludo + frase central */}
      <div style={{textAlign:"center",padding:"48px 24px 36px",maxWidth:640,margin:"0 auto"}}>
        <div style={{fontSize:11,fontWeight:700,color:P.textMuted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16}}>
          TCS · {months} meses juntos
        </div>
        <div style={{fontSize:36,fontWeight:800,color:P.text,lineHeight:1.15,letterSpacing:"-1.5px",marginBottom:16}}>
          Tu equipo se está sintiendo mejor
        </div>
        <div style={{fontSize:15,color:P.primary+"CC",lineHeight:1.7,maxWidth:480,margin:"0 auto"}}>
          {sub==="Sesiones"?"Cada sesión es un paso hacia el bienestar de tu equipo.":"Más personas eligieron cuidar su salud este mes."}
        </div>
      </div>

      {/* KPIs protagonistas */}
      {(()=>{
        // Mini sparkline data — sessions trend last 6 months
        const lastSix=c.monthlyData.slice(-6);
        const maxSes=Math.max(...lastSix.map(m=>m.realizadas),1);
        const sparkW=80, sparkH=32;
        const pts=lastSix.map((m,i)=>{
          const x=Math.round(i*(sparkW/(lastSix.length-1)));
          const y=Math.round(sparkH-(m.realizadas/maxSes)*sparkH);
          return `${x},${y}`;
        }).join(' ');

        const lastSixNew=c.monthlyData.slice(-6);
        const maxNew=Math.max(...lastSixNew.map(m=>m.nuevos),1);
        const ptsNew=lastSixNew.map((m,i)=>{
          const x=Math.round(i*(sparkW/(lastSixNew.length-1)));
          const y=Math.round(sparkH-(m.nuevos/maxNew)*sparkH);
          return `${x},${y}`;
        }).join(' ');

        // Progress ring helper
        const Ring=({pct,color,size=56,stroke=5})=>{
          const r=((size-stroke*2)/2);
          const circ=2*Math.PI*r;
          const dash=circ*(pct/100);
          return <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E8EEE8" strokeWidth={stroke}/>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
          </svg>;
        };

        return <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:P.border,borderRadius:16,overflow:"hidden",marginBottom:20,border:`1px solid ${P.border}`}}>
          {/* Sesiones — sparkline */}
          <div style={{background:P.white,padding:"24px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,minHeight:180}}>
            <svg width={sparkW} height={sparkH+4} style={{overflow:"visible"}}>
              <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.primary} stopOpacity="0.15"/><stop offset="100%" stopColor={P.primary} stopOpacity="0"/></linearGradient></defs>
              <polygon points={`0,${sparkH} ${pts} ${sparkW},${sparkH}`} fill="url(#g1)"/>
              <polyline points={pts} fill="none" stroke={P.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {lastSix.map((m,i)=>{
                const x=Math.round(i*(sparkW/(lastSix.length-1)));
                const y=Math.round(sparkH-(m.realizadas/maxSes)*sparkH);
                return i===lastSix.length-1?<circle key={i} cx={x} cy={y} r="3" fill={P.primary}/>:null;
              })}
            </svg>
            <div style={{fontSize:32,fontWeight:800,color:P.primary,letterSpacing:"-1px",lineHeight:1}}>{fmt(totReal)}</div>
            <div style={{fontSize:12,fontWeight:600,color:P.text}}>sesiones realizadas</div>
            <div style={{fontSize:10,color:P.textMuted}}>desde el inicio</div>
          </div>

          {/* Personas — sparkline */}
          <div style={{background:P.white,padding:"24px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,minHeight:180}}>
            <svg width={sparkW} height={sparkH+4} style={{overflow:"visible"}}>
              <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.light} stopOpacity="0.15"/><stop offset="100%" stopColor={P.light} stopOpacity="0"/></linearGradient></defs>
              <polygon points={`0,${sparkH} ${ptsNew} ${sparkW},${sparkH}`} fill="url(#g2)"/>
              <polyline points={ptsNew} fill="none" stroke={P.light} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {lastSixNew.map((m,i)=>{
                const x=Math.round(i*(sparkW/(lastSixNew.length-1)));
                const y=Math.round(sparkH-(m.nuevos/maxNew)*sparkH);
                return i===lastSixNew.length-1?<circle key={i} cx={x} cy={y} r="3" fill={P.light}/>:null;
              })}
            </svg>
            <div style={{fontSize:32,fontWeight:800,color:P.light,letterSpacing:"-1px",lineHeight:1}}>{totNuev}</div>
            <div style={{fontSize:12,fontWeight:600,color:P.text}}>personas acompañadas</div>
            <div style={{fontSize:10,color:P.textMuted}}>pacientes únicos</div>
          </div>

          {/* Primera vez en terapia — ring */}
          <div style={{background:P.white,padding:"24px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,minHeight:180}}>
            <div style={{position:"relative",width:60,height:60}}>
              <Ring pct={c.firstTimePct!=null?c.firstTimePct:0} color={P.primary} size={60} stroke={5}/>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:12,fontWeight:700,color:P.primary}}>{c.firstTimePct!=null?`${c.firstTimePct}%`:"—"}</div>
            </div>
            <div style={{fontSize:12,fontWeight:600,color:P.text,textAlign:"center",lineHeight:1.4}}>Primera vez en terapia</div>
            <div style={{fontSize:11,color:P.textMuted}}>{c.firstTimeCount!=null?`${c.firstTimeCount} personas`:"pendiente"}</div>
          </div>

          {/* Talleres — ring */}
          <div style={{background:P.white,padding:"24px 20px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,minHeight:180}}>
            <div style={{position:"relative",width:60,height:60}}>
              <Ring pct={Math.min(100,Math.round((c.workshops.length/(c.workshopTarget||5))*100))} color={P.purple} size={60} stroke={5}/>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:12,fontWeight:700,color:P.purple}}>{c.workshops.length}/{c.workshopTarget||5}</div>
            </div>
            <div style={{fontSize:32,fontWeight:800,color:P.purple,letterSpacing:"-1px",lineHeight:1}}>{c.workshops.length}</div>
            <div style={{fontSize:12,fontWeight:600,color:P.text}}>talleres realizados</div>
            <div style={{fontSize:10,color:P.textMuted}}>de {c.workshopTarget||5} anuales</div>
          </div>
        </div>;
      })()}

      {/* Pillar cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:20}}>
        {[
          {id:"individual", label:"Colaboradores",           color:"#4a9356", accent:"#f0f8f1"},
          {id:"colectivo",  label:"Cultura de Bienestar",    color:"#9070b8", accent:"#F5F0FA"},
          {id:"estrategico",label:"Estrategia de Bienestar", color:"#2a6aaa", accent:"#e8f2fc"},
          {id:"gestion",    label:"Gestión",                 color:P.textMuted, accent:P.gray50, restricted:true},
        ].filter(p=>hasAccess(p.id)).map(p=><button key={p.id} onClick={()=>setModule(p.id)} style={{
          background:P.white,
          border:`1px solid ${P.border}`,
          borderTop:`3px solid ${p.color}`,
          borderRadius:12, padding:"20px",
          textAlign:"left", cursor:"pointer",
          position:"relative",
        }}>
          {p.restricted&&<span style={{position:"absolute",top:10,right:10,fontSize:9,fontWeight:700,background:P.accentBg,color:P.accent,padding:"2px 6px",borderRadius:4,letterSpacing:"0.04em",textTransform:"uppercase"}}>Restringido</span>}
          <div style={{fontSize:14,fontWeight:700,color:p.color,letterSpacing:"-0.1px",marginBottom:6}}>{p.label}</div>
          <div style={{fontSize:11,color:P.textMuted}}>Ver detalle →</div>
        </button>)}
      </div>

      {/* Hitos — timeline horizontal scrollable */}
      <div style={{background:P.white,borderRadius:14,border:`1px solid ${P.border}`,padding:"20px 28px",marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>Hitos de la alianza</div>
        <div style={{overflowX:"auto",paddingBottom:4}} ref={el=>{if(el){const reached=c.milestones.filter(m=>m.reached);el.scrollLeft=el.scrollWidth;}}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:0,minWidth:"max-content",position:"relative",paddingTop:8,paddingBottom:4}}>
            {/* Horizontal line */}
            <div style={{position:"absolute",top:15,left:16,right:16,height:1.5,background:`linear-gradient(to right, ${P.primary}, ${P.border})`}}/>
            {c.milestones.filter(m=>m.reached).map((m,i)=><div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:120,flexShrink:0,paddingTop:0}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:m.reached?P.primary:P.white,border:`2px solid ${m.reached?P.primary:P.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1,position:"relative"}}>
                {m.reached&&<span style={{fontSize:9,color:P.white,lineHeight:1}}>★</span>}
              </div>
              <div style={{textAlign:"center",paddingLeft:4,paddingRight:4}}>
                <div style={{fontSize:11,fontWeight:m.reached?600:400,color:m.reached?P.text:P.textMuted,lineHeight:1.3}}>{m.label}</div>
                {m.date&&<div style={{fontSize:9,color:m.reached?P.textMuted:"#ccc",marginTop:2}}>{m.date}</div>}
              </div>
            </div>)}
          </div>
        </div>
      </div>

      {/* Referente */}
      <div style={{background:P.white,borderRadius:14,border:`1px solid ${P.border}`,padding:"24px 28px"}}>
        <div style={{fontSize:10,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16,textAlign:"center"}}>Tu referente en Tu Terapia</div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <img src={FLOR_PHOTO} alt="Flor" style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",objectPosition:"center 10%",border:`2px solid ${P.lighter}`,display:"block",flexShrink:0}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:16,fontWeight:700,color:P.text,letterSpacing:"-0.2px",marginBottom:2}}>Flor</div>
            <div style={{fontSize:12,color:P.textMuted}}>{c.accountManager.role}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginTop:4}}>
            <a href={`mailto:${c.accountManager.email}`} style={{display:"flex",alignItems:"center",gap:6,background:P.lighter,color:P.primary,textDecoration:"none",fontSize:11,fontWeight:600,padding:"7px 16px",borderRadius:8,border:`1px solid ${P.border}`}}>✉ Mail</a>
            <a href={`https://wa.me/${c.accountManager.whatsapp}?text=Hola%20Flor%2C%20te%20escribo%20desde%20el%20panel%20de%20Tu%20Terapia.`} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:6,background:"#E8F5E9",color:"#2E7D32",textDecoration:"none",fontSize:11,fontWeight:600,padding:"7px 16px",borderRadius:8,border:"1px solid #C8E6C9"}}>💬 WhatsApp</a>
            <a href={c.accountManager.calendar} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:6,background:"#EEF4FF",color:"#1A3A8B",textDecoration:"none",fontSize:11,fontWeight:600,padding:"7px 16px",borderRadius:8,border:"1px solid #C5D5F5"}}>📅 Agendar reunión</a>
          </div>
        </div>
      </div>
    </>}

    {/* ── INDIVIDUAL ── */}
    {mod==="individual"&&<div style={{background:"linear-gradient(135deg,#e8f5ea,#f2faf3)",borderRadius:14,padding:"28px 28px 20px",marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:"#4a9356",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8,opacity:0.7}}>Colaboradores</div>
      <div style={{fontSize:22,fontWeight:800,color:"#1e4d28",letterSpacing:"-0.5px",marginBottom:4}}>
        {getHeaderText("individual",sub,"title")||(sub==="Adherencia"?"Más personas eligieron cuidar su salud este mes":`${totNuev} personas eligieron cuidar su salud mental`)}
      </div>
      <div style={{fontSize:13,color:"#4a7a52",opacity:0.85}}>
        {getHeaderText("individual",sub,"subtitle")||(sub==="Sesiones"?`${fmt(totReal)} sesiones realizadas · ${compRate}% de utilización del plan`:sub==="Adherencia"?`${totNuev} pacientes únicos desde el inicio`:"")}
      </div>
    </div>}
    {mod==="individual"&&sub==="Sesiones"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:18}}>
        <KpiCard label="Sesiones Canjeadas" value={fmt(totCanj)}/>
        <KpiCard label="Sesiones Realizadas" value={fmt(totReal)} sub="Desde inicio"/>
        <KpiCard label="Tasa de realización" value={`${compRate}%`} sub="Sesiones realizadas / canjeadas"/>
        <KpiCard label="Sesiones realizadas en el último mes" value={lastFull?fmt(lastFull.realizadas):"—"} sub={lastFull?.month}/>
      </div>
      <Section title={`Sesiones canjeadas por mes — plan ${c.monthlyPlan}/mes`}>
        {lastM.partial&&<div style={{marginBottom:10,padding:"8px 12px",background:P.accentBg,borderRadius:6,fontSize:11,color:P.accent}}>{lastM.month} en curso — datos parciales.</div>}
        <div style={{height:210}}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={c.monthlyData} barSize={13}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>} cursor={{fill:P.lighter}}/>
            <ReferenceLine y={c.monthlyPlan} stroke={P.accent} strokeDasharray="4 3" label={{value:`Plan: ${c.monthlyPlan}`,position:"insideTopRight",fontSize:10,fill:P.accent}}/>
            <Bar dataKey="canjeadas" name="canjeadas" radius={[3,3,0,0]}>{c.monthlyData.map((m,i)=><Cell key={i} fill={m.partial?P.greenLight:P.primary}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer></div>
        <div style={{marginTop:6,fontSize:11,color:P.textMuted}}>Los desvíos sobre 300 corresponden a sesiones acumuladas de meses anteriores o ajustes manuales.</div>
      </Section>
      <Section title="Sesiones realizadas por mes">
        <div style={{height:210}}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={c.monthlyData} barSize={13}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>} cursor={{fill:P.lighter}}/>
            <Bar dataKey="realizadas" name="realizadas" radius={[3,3,0,0]}>{c.monthlyData.map((m,i)=><Cell key={i} fill={m.partial?P.greenLight:P.light}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer></div>
      </Section>

    </>}

    {mod==="individual"&&sub==="Adherencia"&&(()=>{
      const fullSessions=fullM.reduce((s,m)=>s+m.realizadas,0);
      const avgPerUser=totHistorico>0?Math.round((fullSessions/totHistorico)*10)/10:0;
      const avgPerMonth=fullM.length>0?Math.round((fullSessions/fullM.length)*10)/10:0;
      return <>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:18}}>
          <KpiCard label="Total de pacientes" value={totHistorico} sub="Pacientes únicos históricos"/>
          <KpiCard label="Promedio de sesiones por persona" value={avgPerUser!=null?Math.ceil(avgPerUser):"—"} sub="Histórico acumulado"/>
          <KpiCard label="Promedio sesiones / persona / mes" value={(totHistorico>0&&fullM.length>0)?Math.ceil(fullSessions/totHistorico/fullM.length):"—"} sub="por persona por mes"/>
          <KpiCard label="Promedio sesiones por mes (empresa)" value={avgPerMonth!=null?Math.ceil(avgPerMonth):"—"} sub="Meses completos"/>
        </div>
        <Section title="Primera vez en terapia">
          <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Colaboradores que accedieron a terapia psicológica por primera vez a través del beneficio de TCS.</div>
          {c.firstTimeCount!=null?
            <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{textAlign:"center",padding:"20px 28px",background:P.lighter,borderRadius:14,border:`1px solid ${P.primary+"44"}`}}>
                <div style={{fontSize:42,fontWeight:700,color:P.primary,lineHeight:1,letterSpacing:"-2px"}}>{c.firstTimeCount}</div>
                <div style={{fontSize:12,color:P.primary,marginTop:4,fontWeight:500}}>personas</div>
              </div>
              <div style={{flex:1,minWidth:180}}>
                <div style={{fontSize:13,fontWeight:600,color:P.text,marginBottom:6}}>{c.firstTimePct}% del total de pacientes activos</div>
                <div style={{fontSize:12,color:P.textMuted,lineHeight:1.7}}>Estos colaboradores nunca habían accedido a psicología antes de este beneficio.</div>
              </div>
            </div>
          :<div style={{padding:"20px",background:P.gray50,borderRadius:10,textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:P.text,marginBottom:4}}>Dato pendiente</div>
            <div style={{fontSize:12,color:P.textMuted}}>Se cargará desde el panel admin.</div>
          </div>}
        </Section>
        
        <Section title="Pacientes activos por mes">
          <div style={{fontSize:11,color:P.textMuted,marginBottom:10,lineHeight:1.6}}>Personas que realizaron al menos una sesión ese mes.</div>
          <div style={{height:200}}><ResponsiveContainer width="100%" height="100%">
            <BarChart data={c.monthlyData} barSize={13}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>} cursor={{fill:P.lighter}}/>
              <Bar dataKey="activos" name="Activos" radius={[3,3,0,0]}>{c.monthlyData.map((m,i)=><Cell key={i} fill={m.partial?P.greenLight:P.primary}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </Section>
        <Section title="Nuevos pacientes por mes">
          <div style={{height:200}}><ResponsiveContainer width="100%" height="100%">
            <BarChart data={c.monthlyData} barSize={13}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>} cursor={{fill:P.lighter}}/>
              <Bar dataKey="nuevos" name="Nuevos pacientes" radius={[3,3,0,0]}>{c.monthlyData.map((m,i)=><Cell key={i} fill={m.partial?P.greenLight:P.light}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </Section>
      </>;
    })()}

    {/* ── COLECTIVO ── */}
    {mod==="colectivo"&&<div style={{background:"linear-gradient(135deg,#f0eaf8,#f8f3fc)",borderRadius:14,padding:"28px 28px 20px",marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:"rgba(74,48,112,0.5)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Cultura de Bienestar</div>
      <div style={{fontSize:22,fontWeight:800,color:"#3d2060",letterSpacing:"-0.5px",marginBottom:4}}>
        {getHeaderText("colectivo",sub,"title")||(sub==="Contenido"?"Recursos para llevar el bienestar a cada rincón del equipo":`${c.workshops.length} talleres de bienestar realizados con tu equipo`)}
      </div>
      <div style={{fontSize:13,color:"rgba(74,48,112,0.7)"}}>
        {getHeaderText("colectivo",sub,"subtitle")||(sub==="Talleres"?`${c.workshops.filter(w=>w.rating>=4.5).length} de ${c.workshops.length} talleres con puntuación destacada`:`${c.content.filter(x=>x.downloaded).length} recursos descargados · ${c.content.filter(x=>x.sent).length} enviados al equipo`)}
      </div>
    </div>}
    {mod==="colectivo"&&sub==="Talleres"&&(()=>{
      // Use Supabase workshops if available, fallback to hardcoded
      const workshops = dbWorkshops.length>0 ? dbWorkshops : c.workshops;
      return <>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:18}}>
          <KpiCard label="Talleres realizados" value={workshops.length} sub={`de ${c.workshopTarget||5} anuales`}/>
          <KpiCard label="Próximo taller" value={c.workshopsRecommended.length>0?c.workshopsRecommended[0].title:"Por definir"} sub="Recomendado"/>
          <KpiCard label="Rating promedio" value={workshops.filter(w=>w.rating).length>0?(workshops.filter(w=>w.rating).reduce((s,w)=>s+(w.rating||0),0)/workshops.filter(w=>w.rating).length).toFixed(1):"—"} sub="★ participantes"/>
        </div>
        <Section title="Talleres realizados">
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {workshops.length===0&&<div style={{fontSize:12,color:P.textMuted,textAlign:"center",padding:"20px"}}>Sin talleres realizados aún.</div>}
            {workshops.map((w,i)=><TallerCard key={w.id||i} w={w} talleristas={dbTalleristas}/>)}
          </div>
        </Section>
        <Section title="Próximos talleres recomendados">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {c.workshopsRecommended.length===0
              ? <div style={{fontSize:12,color:P.textMuted,textAlign:"center",padding:"20px"}}>Sin recomendaciones aún.</div>
              : c.workshopsRecommended.map((w,i)=><div key={i} style={{padding:"12px 16px",background:P.lighter,borderRadius:10,border:`1px solid ${P.border}`}}>
                  <div style={{fontSize:13,fontWeight:600,color:P.primary,marginBottom:3}}>{w.title}</div>
                  {w.descripcion&&<div style={{fontSize:11,color:P.textMuted,marginBottom:4}}>{w.descripcion}</div>}
                  {w.month&&<span style={{background:P.lighter,color:P.primary,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{w.month}</span>}
                </div>)
            }
          </div>
        </Section>
      </>;
    })()}

    {mod==="colectivo"&&sub==="Contenido"&&(()=>{
      const ratings=contentRatings; const setRatings=setContentRatings;
      const sent=contentSent; const setSent=setContentSent;
      const downloaded=contentDownloaded; const setDownloaded=setContentDownloaded;
      const ratingLabel={5:"Muy adecuado",4:"Adecuado",3:"Neutral",2:"Poco adecuado",1:"No adecuado"};
      return <>
        <Section title="Recursos y material">
          <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Descargá el material, evalualo y marcalo como enviado cuando lo compartas con tu equipo.</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {(dbContent.length>0?dbContent:c.content).map((item,i)=>{
              const col=TYPE_COLORS[item.type]||{bg:P.lighter,tx:P.primary};
              return <div key={i} style={{padding:"14px 16px",background:P.white,border:`1px solid ${P.border}`,borderRadius:10}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                  <div style={{background:col.bg,color:col.tx,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,flexShrink:0}}>{item.type}</div>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{fontSize:12,fontWeight:600,color:P.text,marginBottom:2}}>{item.title}</div>
                    <div style={{fontSize:11,color:P.textMuted}}>{item.date}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
                    <button onClick={()=>{setDownloaded(d=>({...d,[i]:true}));if(item.file_url||item.fileUrl){window.open(item.file_url||item.fileUrl,"_blank");}}} style={{background:downloaded[i]?P.lighter:P.white,color:downloaded[i]?P.primary:P.textMuted,border:`1px solid ${downloaded[i]?P.primary+"44":P.border}`,borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>{downloaded[i]?"✓ Descargado":"Descargar"}</button>
                    <button onClick={()=>setSent(s=>({...s,[i]:!s[i]}))} style={{background:sent[i]?"#E8F5E9":P.white,color:sent[i]?"#2E7D32":P.textMuted,border:`1px solid ${sent[i]?"#2E7D3244":P.border}`,borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>{sent[i]?"✓ Enviado":"Marcar enviado"}</button>
                  </div>
                </div>
                <div style={{marginTop:12,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:P.textMuted}}>Tu evaluación:</span>
                  <div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(star=><button key={star} onClick={()=>setRatings(r=>({...r,[i]:star}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:ratings[i]>=star?P.accent:"#DDE8E4",padding:"0 1px",lineHeight:1}}>★</button>)}</div>
                  <span style={{fontSize:11,color:ratings[i]?P.textMuted:"#C0C8C4",fontStyle:ratings[i]?"normal":"italic"}}>{ratings[i]?ratingLabel[ratings[i]]:"Sin evaluar aún"}</span>
                </div>
              </div>;
            })}
          </div>
        </Section>
      </>;
    })()}


    {/* ── ESTRATÉGICO ── */}
    {mod==="estrategico"&&<div style={{background:"linear-gradient(135deg,#e8f2fc,#f0f7ff)",borderRadius:14,padding:"28px 28px 20px",marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:"#2a6aaa",opacity:0.6,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Estrategia de Bienestar</div>
      <div style={{fontSize:22,fontWeight:800,color:"#1a4a7a",letterSpacing:"-0.5px",marginBottom:4}}>
        {getHeaderText("estrategico",sub,"title")||(sub==="Bienestar del equipo"?"Los datos muestran un equipo que avanza":sub==="Consultoría Tu Terapia"?"Consultoría Estratégica Tu Terapia":"Herramientas para tomar mejores decisiones")}
      </div>
      <div style={{fontSize:13,color:"#2a6aaa"}}>
        {getHeaderText("estrategico",sub,"subtitle")||(sub==="Bienestar del equipo"?`NPS ${npsVal!=null?npsVal:"pendiente"} · encuestas Q pendientes`:sub==="Consultoría Tu Terapia"?(c.consultoriaActiva?"Una inversión que se traduce en personas más sanas":"Activá la consultoría para ver el análisis de impacto"):`${c.reports.length} informes disponibles · ${c.recommendations.length} recomendaciones activas`)}
      </div>
    </div>}
    {/* ── ESTRATÉGICO - Bienestar del equipo ── */}
    {mod==="estrategico"&&sub==="Bienestar del equipo"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:18}}>
        <div style={{background:P.white,border:`1px solid ${P.border}`,borderRadius:12,padding:"16px 18px",display:"flex",flexDirection:"column",gap:4}}>
          {editNps?<>
            <input type="number" min="-100" max="100" value={npsInput} onChange={e=>setNpsInput(e.target.value)} style={{fontSize:20,fontWeight:700,border:`1px solid ${P.border}`,borderRadius:7,padding:"4px 8px",outline:"none",width:"100%"}} placeholder="ej. 68"/>
            <div style={{display:"flex",gap:6,marginTop:6}}>
              <button onClick={()=>{setNpsVal(parseInt(npsInput));setNpsDate(new Date().toLocaleDateString("es-UY",{month:"short",year:"numeric"}));setEditNps(false);}} style={{flex:1,background:P.primary,color:P.white,border:"none",borderRadius:6,padding:"5px",fontSize:11,cursor:"pointer",fontWeight:600}}>Guardar</button>
              <button onClick={()=>setEditNps(false)} style={{flex:1,background:"none",border:`1px solid ${P.border}`,borderRadius:6,padding:"5px",fontSize:11,cursor:"pointer"}}>Cancelar</button>
            </div>
          </>:<>
            <div style={{fontSize:21,fontWeight:700,color:npsVal!=null?(npsVal>=50?P.primary:P.accent):P.textMuted,lineHeight:1.1,letterSpacing:"-0.5px"}}>{npsVal!=null?npsVal:"Pendiente"}</div>
            <div style={{fontSize:12,fontWeight:600,color:P.text}}>NPS de Salud Mental y Bienestar</div>
            <div style={{fontSize:11,color:P.textMuted}}>{npsDate?`Actualizado ${npsDate}`:"Sin datos aún"}</div>
            <button onClick={()=>{setNpsInput(npsVal||"");setEditNps(true);}} style={{marginTop:4,background:"none",border:`1px solid ${P.border}`,borderRadius:6,padding:"4px 8px",fontSize:10,cursor:"pointer",color:P.textMuted,textAlign:"left"}}>Actualizar</button>
          </>}
        </div>
        
        <KpiCard label="Motivo principal" value={c.consultationReasons.length>0?c.consultationReasons[0].reason:"Pendiente"} sub={c.consultationReasons.length>0?`${c.consultationReasons[0].percentage}% de los casos`:"Sin datos aún"}/>
      </div>

      <Section title="Seguimiento de personas que usan el beneficio">
        <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Encuesta trimestral intraplataforma · escala 1–10.</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {c.wellbeingByQ.map((q,i)=><div key={i} style={{flex:1,minWidth:110,padding:"16px",background:q.score!=null?P.lighter:P.gray50,border:`1px solid ${q.score!=null?P.primary+"44":P.border}`,borderRadius:10,textAlign:"center"}}>
            <div style={{fontSize:10,fontWeight:600,color:P.textMuted,marginBottom:8,letterSpacing:"0.04em",textTransform:"uppercase"}}>{q.q}</div>
            {q.score!=null?<><div style={{fontSize:26,fontWeight:700,color:P.primary,letterSpacing:"-1px"}}>{q.score}</div><div style={{fontSize:10,color:P.textMuted}}>/10</div></>
            :<div style={{fontSize:12,color:P.textMuted,padding:"6px 0"}}>Pendiente</div>}
          </div>)}
        </div>
      </Section>

      <Section title="Motivos de consulta" note="Fuente: reporte de plataforma Tu Terapia.">
        {c.consultationReasons.length===0
          ? <div style={{fontSize:12,color:P.textMuted,padding:"20px 0",textAlign:"center"}}>Sin datos cargados aún. Tu referente los actualizará periódicamente.</div>
          : <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {c.consultationReasons.map((r,i)=>{
                const colors=["#1A5C4A","#267A62","#5040A0","#2a6aaa","#8B4A8B","#B03030","#c49020","#607870"];
                const color=colors[i%colors.length];
                const pct=r.percentage||0;
                return <div key={r.reason} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#fff",fontSize:9,fontWeight:700}}>#{i+1}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:600,color:P.text}}>{r.reason}</span>
                      <span style={{fontSize:12,fontWeight:700,color:color}}>{pct}%</span>
                    </div>
                    <div style={{height:6,background:P.gray50,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width 0.4s ease"}}/>
                    </div>
                    {r.count&&<div style={{fontSize:10,color:P.textMuted,marginTop:3}}>{r.count} casos — {r.period||"—"}</div>}
                  </div>
                </div>;
              })}
            </div>
        }
      </Section>

      <Section title="Impacto de acciones colectivas" note="Correlación entre talleres/activaciones y nuevos pacientes.">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {c.collectiveImpact.length===0
            ? <div style={{fontSize:12,color:P.textMuted,textAlign:"center",padding:"20px 0"}}>Sin datos cargados aún.</div>
            : c.collectiveImpact.map((item,i)=><div key={i} style={{display:"flex",gap:14,padding:"14px 16px",background:P.bg,borderRadius:10,border:`1px solid ${P.border}`,alignItems:"flex-start"}}>
                <div style={{flexShrink:0,textAlign:"center",minWidth:44}}>
                  <div style={{fontSize:18,fontWeight:700,color:P.primary,lineHeight:1}}>+{item.newPatients}</div>
                  <div style={{fontSize:9,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>nuevos</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap",alignItems:"center"}}>
                    <Label text={item.type} bg={P.lighter} tx={P.primary}/>
                    <span style={{fontSize:11,color:P.textMuted}}>{item.date}</span>
                  </div>
                  <div style={{fontSize:12,fontWeight:600,color:P.text,marginBottom:3}}>{item.event}</div>
                  <div style={{fontSize:11,color:P.textMuted,lineHeight:1.6}}>{item.note}</div>
                </div>
              </div>)
          }
        </div>
      </Section>
    </>}

    {/* ── ESTRATÉGICO - Inversión e impacto ── */}
    {mod==="estrategico"&&sub==="Consultoría Tu Terapia"&&(()=>{
      const consultoriaActiva = c.consultoriaActiva||localConsultoriaActiva||false;
      const solicitado = consultoriaSolicitado || c.consultoriaSolicitada||false;

      async function solicitarConsultoria() {
        setSolicitando(true);
        try {
          await supabase.from("companies").update({ consultoria_solicitada: true }).eq("name", "TCS");
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer re_9rj91mUx_K7pxQ8tKqs6SFoZmZskNTi2n" },
            body: JSON.stringify({ from: "onboarding@resend.dev", to: c.accountManager.email, subject: "Solicitud de activación — Consultoría Estratégica Tu Terapia", html: `<p><b>${c.name}</b> solicitó activar la Consultoría Estratégica Tu Terapia desde su dashboard.</p><p>Contactarse a la brevedad para iniciar el proceso.</p>` })
          });
        } catch(e) { console.log("mail error", e); }
        setConsultoriaSolicitado(true);
        setSolicitando(false);
      }

      if(!consultoriaActiva) return <>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",textAlign:"center",minHeight:400}}>
          {/* Pulsing circle animation */}
          <div style={{position:"relative",width:120,height:120,marginBottom:32}}>
            <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"rgba(26,92,74,0.08)",animation:"pulse 2s ease-in-out infinite"}}/>
            <div style={{position:"absolute",inset:12,borderRadius:"50%",background:"rgba(26,92,74,0.12)",animation:"pulse 2s ease-in-out infinite",animationDelay:"0.3s"}}/>
            <div style={{position:"absolute",inset:24,borderRadius:"50%",background:"rgba(26,92,74,0.18)",animation:"pulse 2s ease-in-out infinite",animationDelay:"0.6s"}}/>
            <div style={{position:"absolute",inset:36,borderRadius:"50%",background:"rgba(26,92,74,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:14,height:14,borderRadius:"50%",background:"#1A5C4A"}}/>
            </div>
          </div>
          <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:0.7} }`}</style>
          {!solicitado ? <>
            <div style={{fontSize:22,fontWeight:700,color:"#18211E",marginBottom:8,letterSpacing:"-0.5px"}}>Consultoría Estratégica Tu Terapia</div>
            <div style={{fontSize:14,color:"#607870",maxWidth:440,lineHeight:1.7,marginBottom:32}}>
              Accedé al Índice Tu Terapia, métricas de impacto, análisis de inversión y seguimiento del bienestar organizacional de tu equipo.
            </div>
            <button onClick={solicitarConsultoria} disabled={solicitando}
              style={{background:"#1A5C4A",color:"#fff",border:"none",borderRadius:10,padding:"13px 28px",fontSize:14,fontWeight:600,cursor:solicitando?"not-allowed":"pointer",opacity:solicitando?0.7:1,letterSpacing:"-0.1px"}}>
              {solicitando?"Enviando solicitud...":"Activar Consultoría Tu Terapia"}
            </button>
          </> : <>
            <div style={{fontSize:18,fontWeight:700,color:"#1A5C4A",marginBottom:8}}>Solicitud enviada</div>
            <div style={{fontSize:13,color:"#607870",maxWidth:380,lineHeight:1.7,marginBottom:20}}>
              Tu referente de Tu Terapia se pondrá en contacto pronto para activar esta sección y comenzar a trabajar juntos.
            </div>
            <button onClick={()=>setConsultoriaActiva(true)}
              style={{background:"none",border:`1px solid #1A5C4A`,borderRadius:8,padding:"9px 20px",fontSize:13,fontWeight:600,color:"#1A5C4A",cursor:"pointer"}}>
              Ver panel →
            </button>
          </>}
        </div>
      </>;

      const dimKeys2=["saludMental","clima","liderazgo","engagement","asistencia","productividad"];
      const firstQ2=c.roiByQ.find(q=>dimKeys2.some(k=>q[k]!==null));
      const lastQ2=[...c.roiByQ].reverse().find(q=>dimKeys2.some(k=>q[k]!==null));
      const hasData2=firstQ2&&lastQ2&&firstQ2!==lastQ2;
      const avgImp2=hasData2?dimKeys2.map(k=>lastQ2[k]!=null&&firstQ2[k]!=null?lastQ2[k]-firstQ2[k]:null).filter(v=>v!==null).reduce((a,b,_,arr)=>a+b/arr.length,0):null;
      const normImp2=avgImp2!=null?Math.max(0,Math.min(100,Math.round((avgImp2/9)*100))):null;
      const utilScore2=Math.round(compRate*0.3);
      const workshopTarget=c.workshopTarget||5;
      const workshopScore=Math.min(100,Math.round((c.workshops.length/workshopTarget)*100));
      const workshopPts=Math.round(workshopScore*0.15);
      const contentEngagement=c.content.length>0?Math.round(((dbContent.length>0?dbContent:c.content).filter(x=>x.downloaded&&x.rating).length/c.content.length)*100):0;
      const contentPts=Math.round(contentEngagement*0.05);
      const iii=normImp2!=null?Math.round(normImp2*0.5+utilScore2+workshopPts+contentPts):null;
      const invTotal2=c.monthlyData.reduce((s,m)=>s+m.realizadas,0)*c.sessionPriceRef;
      const invTrend2=c.monthlyData.map(m=>({month:m.month,investment:Math.round(m.realizadas*c.sessionPriceRef),partial:m.partial}));
      const totNuev2=c.monthlyData.reduce((s,m)=>s+m.nuevos,0);
      const fullM2=c.monthlyData.filter(m=>!m.partial);
      const fullReal2=fullM2.reduce((s,m)=>s+m.realizadas,0);
      const fullCanj2=fullM2.reduce((s,m)=>s+m.canjeadas,0);
      const compRate2=fullCanj2>0?Math.round(fullReal2/fullCanj2*100):0;
      const lastFull2=fullM2[fullM2.length-1];
      const totHistorico2=(()=>{const lh=[...c.monthlyData].reverse().find(m=>m.total_historico>0);return lh?lh.total_historico:totNuev2;})();
  const invPerPat2=totHistorico2>0?invTotal2/totHistorico2:0;
      return <>
        {/* III KPI card */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:18}}>
          <div onMouseEnter={()=>setShowIII(true)} onMouseLeave={()=>setShowIII(false)}
            style={{position:"relative",background:iii!=null?P.lighter:P.gray50,border:`1px solid ${iii!=null?P.primary+"44":P.border}`,borderRadius:12,padding:"16px 18px",display:"flex",flexDirection:"column",gap:4,cursor:"default"}}>
            <div style={{fontSize:21,fontWeight:700,color:iii!=null?P.primary:P.textMuted,lineHeight:1.1,letterSpacing:"-0.5px"}}>{iii!=null?iii:"—"}<span style={{fontSize:12,fontWeight:400,color:P.textMuted}}> /100</span></div>
            <div style={{fontSize:12,fontWeight:600,color:P.text}}>Índice Tu Terapia</div>
            <div style={{fontSize:11,color:P.textMuted}}>{iii!=null?(iii>=70?"Impacto alto":iii>=50?"Impacto medio":"En desarrollo"):"Pendiente Q1"}</div>
            <div style={{fontSize:10,color:P.primary,marginTop:2}}>Hover para ver composición</div>
            {showIII&&<div style={{position:"absolute",top:"calc(100% + 8px)",left:0,width:290,background:P.white,border:`1px solid ${P.border}`,borderRadius:12,padding:"14px 16px",boxShadow:"0 4px 20px rgba(0,0,0,0.10)",zIndex:20}}>
              <div style={{fontSize:10,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Composición del Índice Tu Terapia</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  ["50%","Mejora en dimensiones de bienestar",normImp2!=null?`${Math.round(normImp2*0.5)}pts`:"—","Evolución Q inicial → Q actual en 6 dimensiones."],
                  ["30%","Utilización del plan individual",`${utilScore2}pts`,`Sesiones realizadas sobre contratadas (${compRate2}% actual).`],
                  ["15%","Actividad colectiva — talleres",`${workshopPts}pts`,`${c.workshops.length} de ${workshopTarget} talleres anuales realizados.`],
                  ["5%","Engagement con contenido",`${contentPts}pts`,"Piezas descargadas y evaluadas por RRHH."],
                ].map(([pct,label,pts,desc])=><div key={pct} style={{paddingBottom:8,borderBottom:`1px solid ${P.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:600,color:P.text}}><b>{pct}</b> {label}</span>
                    <span style={{fontSize:12,fontWeight:700,color:P.primary,flexShrink:0,marginLeft:8}}>{pts}</span>
                  </div>
                  <div style={{fontSize:11,color:P.textMuted,lineHeight:1.5}}>{desc}</div>
                </div>)}
              </div>
              <div style={{marginTop:8,fontSize:10,color:P.textMuted,background:P.gray50,borderRadius:6,padding:"6px 10px"}}>
                Índice Tu Terapia = (bienestar×50%) + (utilización×30%) + (talleres×15%) + (contenido×5%)
              </div>
            </div>}
          </div>
          <KpiCard label="Inversión total acumulada" value={`$ ${fmt(invTotal2)}`} sub="UYU · precio de referencia" accent/>
          <KpiCard label="Por paciente único" value={`$ ${fmt(invPerPat2)}`} sub={`${totNuev2} pacientes únicos`}/>
          <KpiCard label="Utilización del plan" value={`${compRate2}%`} sub="Realizadas / contratadas"/>
          <KpiCard label="Sesiones realizadas en el último mes" value={`$ ${fmt(lastFull2?lastFull2.realizadas*c.sessionPriceRef:0)}`} sub={lastFull2?.month}/>
        </div>

        <Section title="6 dimensiones del impacto">
          <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Medidas por encuesta. Escala 1–10.</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {key:"saludMental",label:"Bienestar y salud mental",desc:"Bienestar emocional, estrés y equilibrio vida-trabajo",color:"#1A5C4A"},
              {key:"clima",label:"Clima y comunicación",desc:"Ambiente de equipo y resolución de conflictos",color:"#267A62"},
              {key:"liderazgo",label:"Liderazgo efectivo",desc:"Liderazgo empático y promoción del bienestar",color:"#5040A0"},
              {key:"engagement",label:"Engagement y compromiso",desc:"Motivación, propósito e intención de permanencia",color:"#2a6aaa"},
              {key:"asistencia",label:"Ausentismo percibido",desc:"Energía, presencia real y afectación a la asistencia",color:"#8B4A8B"},
              {key:"productividad",label:"Productividad sostenible",desc:"Concentración, carga manejable y desconexión efectiva",color:"#B03030"},
            ].map((dim,i)=>{
              const scores=c.roiByQ.map(q=>q[dim.key]).filter(v=>v!==null);
              const latest=scores.length>0?scores[scores.length-1]:null;
              const first=scores.length>0?scores[0]:null;
              const trend=scores.length>1?latest-first:null;
              return <div key={i} style={{padding:"12px 14px",background:P.white,border:`1px solid ${P.border}`,borderRadius:10,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{width:4,height:36,borderRadius:2,background:dim.color,flexShrink:0}}/>
                <div style={{flex:1,minWidth:140}}>
                  <div style={{fontSize:12,fontWeight:600,color:P.text,marginBottom:1}}>{dim.label}</div>
                  <div style={{fontSize:11,color:P.textMuted}}>{dim.desc}</div>
                </div>
                <div style={{display:"flex",gap:14,alignItems:"center",flexShrink:0}}>
                  {latest!=null?<>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:18,fontWeight:700,color:dim.color}}>{latest}</div>
                      <div style={{fontSize:9,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>último Q</div>
                    </div>
                    {trend!=null&&<div style={{textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:700,color:trend>0?"#22C55E":trend<0?P.red:P.textMuted}}>{trend>0?"+":""}{trend}</div>
                      <div style={{fontSize:9,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>evolución</div>
                    </div>}
                  </>:<span style={{fontSize:11,color:P.textMuted,fontStyle:"italic"}}>Pendiente</span>}
                </div>
              </div>;
            })}
          </div>
        </Section>

        <Section title="Inversión mensual (UYU)" warnNote="Cálculo de referencia a UY$ 1.600 por sesión.">
          <div style={{height:200}}><ResponsiveContainer width="100%" height="100%">
            <BarChart data={invTrend2} barSize={13}>
              <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<Tip/>} cursor={{fill:P.lighter}}/>
              <Bar dataKey="investment" name="investment" radius={[3,3,0,0]}>{invTrend2.map((m,i)=><Cell key={i} fill={m.partial?P.greenLight:P.primary}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </Section>

        <Section title="Benchmark vs. red Tu Terapia" note="Disponible en la próxima fase.">
          <div style={{padding:"20px",textAlign:"center",color:P.textMuted}}>
            <div style={{fontSize:13,fontWeight:600,color:P.text,marginBottom:4}}>Próximamente</div>
            <div style={{fontSize:12}}>Compará el Índice Tu Terapia con el promedio de la red.</div>
          </div>
        </Section>
      </>;
    })()}

    {/* ── ESTRATÉGICO - Recursos y reportes ── */}
    {mod==="estrategico"&&sub==="Recursos y reportes"&&<>
      <div style={{background:P.white,borderRadius:14,border:`1px solid ${P.border}`,padding:0,marginBottom:14,overflow:"hidden"}}>
        <div onClick={()=>c.consultoriaActiva&&toggleSection("encuestas")}
          style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:c.consultoriaActiva?"pointer":"default",userSelect:"none",opacity:c.consultoriaActiva?1:0.6}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:11,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Encuesta para tu equipo</div>
            {!c.consultoriaActiva&&<span style={{fontSize:10,background:P.accentBg,color:P.accent,padding:"2px 8px",borderRadius:20,fontWeight:600}}>Requiere Consultoría Tu Terapia</span>}
          </div>
          {c.consultoriaActiva&&<span style={{fontSize:14,color:P.textMuted,transform:openSections.encuestas?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>}
        </div>
        {!c.consultoriaActiva&&<div style={{padding:"12px 20px 16px",borderTop:`1px solid ${P.border}`}}>
          <div style={{fontSize:12,color:P.textMuted,lineHeight:1.7}}>
            Esta sección se activa junto con la <b>Consultoría Estratégica Tu Terapia</b>. Al activarla, podrás descargar la encuesta de Índice Tu Terapia para aplicar a tu equipo.
          </div>
        </div>}
        {c.consultoriaActiva&&openSections.encuestas&&<div style={{padding:"0 20px 16px"}}>
          <div style={{fontSize:11,color:P.textMuted,marginBottom:12,lineHeight:1.6}}>Descargá la encuesta, aplicala a tu equipo y envianos los resultados a {c.accountManager.email} para que los procesemos y mostremos en este panel.</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {(dbSurveys.length>0?dbSurveys:c.surveys).map((s,i)=>{
              const isOpen = expandedSurvey===i;
              return <div key={i} style={{background:P.lighter,border:`1px solid ${P.primary+"44"}`,borderRadius:10,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setExpandedSurvey(isOpen?null:i)}>
                  <div style={{width:4,minHeight:40,borderRadius:2,background:P.primary,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:P.text,marginBottom:3}}>{s.title}</div>
                    <div style={{fontSize:11,color:P.textMuted}}>{s.desc}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                    {s.file_url
                      ? <a href={s.file_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{background:P.primary,color:P.white,borderRadius:7,padding:"6px 14px",fontSize:11,fontWeight:600,textDecoration:"none"}}>⬇ Descargar</a>
                      : <span style={{fontSize:11,color:P.textMuted,fontStyle:"italic",padding:"6px 0"}}>Archivo próximamente</span>
                    }
                    <span style={{fontSize:16,color:P.textMuted,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
                  </div>
                </div>
                {isOpen&&<div style={{borderTop:`1px solid ${P.border}`,padding:"14px 16px",background:"rgba(255,255,255,0.7)"}}>
                  <div style={{fontSize:11,fontWeight:600,color:P.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>6 dimensiones que mide</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                    {(s.dims||[]).map(d=><span key={d} style={{fontSize:11,background:P.white,border:`1px solid ${P.border}`,borderRadius:20,padding:"4px 12px",color:P.textMuted}}>{d}</span>)}
                  </div>
                </div>}
              </div>;
            })}
          </div>
        </div>}
      </div>

      <div style={{background:P.white,borderRadius:14,border:`1px solid ${P.border}`,padding:0,marginBottom:14,overflow:"hidden"}}>
        <div onClick={()=>toggleSection("informes")} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer",userSelect:"none"}}>
          <div style={{fontSize:11,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Informes de uso</div>
          <span style={{fontSize:14,color:P.textMuted,transform:openSections.informes?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
        </div>
        {openSections.informes&&<div style={{padding:"0 20px 16px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {(dbReports.length>0?dbReports:c.reports).length===0
            ? <div style={{fontSize:12,color:P.textMuted,textAlign:"center",padding:"20px 0"}}>Sin informes disponibles aún.</div>
            : (dbReports.length>0?dbReports:c.reports).map((r,i)=>{
              const isOpen=expandedReport===i;
              const fileUrl=r.file_url||null;
              return <div key={i} style={{background:P.white,border:`1px solid ${P.border}`,borderRadius:10,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",cursor:"pointer"}} onClick={()=>setExpandedReport(isOpen?null:i)}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:P.text}}>{r.title}</div>
                    <div style={{fontSize:11,color:P.textMuted}}>{r.period||r.date}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {fileUrl
                      ? <a href={fileUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{background:P.primary,color:"#fff",borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:600,textDecoration:"none"}}>⬇ Descargar</a>
                      : <span style={{fontSize:11,color:P.textMuted,fontStyle:"italic"}}>Próximamente</span>
                    }
                    <span style={{fontSize:16,color:P.textMuted,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
                  </div>
                </div>
                {isOpen&&<div style={{borderTop:`1px solid ${P.border}`,padding:"12px 14px",background:P.gray50,fontSize:11,color:P.textMuted,lineHeight:1.7}}>
                  Informe de uso del plan Tu Terapia. Incluye sesiones realizadas, nuevos pacientes, talleres y métricas de adherencia del período.
                </div>}
              </div>;
            })
          }
        </div>
        </div>}
      </div>

      <div style={{background:P.white,borderRadius:14,border:`1px solid ${P.border}`,padding:0,marginBottom:14,overflow:"hidden"}}>
        <div onClick={()=>toggleSection("recomendaciones")} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",cursor:"pointer",userSelect:"none"}}>
          <div style={{fontSize:11,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Recomendaciones de Tu Terapia</div>
          <span style={{fontSize:14,color:P.textMuted,transform:openSections.recomendaciones?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
        </div>
        {openSections.recomendaciones&&<div style={{padding:"0 20px 16px"}}>
        <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Hallazgos sobre la salud mental y bienestar del equipo, elaborados por nuestros profesionales.</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {c.recommendations.map((r,i)=>{
            const u=URGENCY[r.urgency];
            return <div key={i} style={{padding:"16px",background:P.bg,borderRadius:10,border:`1px solid ${P.border}`,borderLeft:`3px solid ${u.tx}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <Label text={u.label} bg={u.bg} tx={u.tx}/>
                <span style={{fontSize:10,color:P.textMuted}}>{r.date}</span>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:5,letterSpacing:"-0.1px"}}>{r.action}</div>
              <div style={{fontSize:12,color:P.textMuted,lineHeight:1.7}}>{r.reason}</div>
            </div>;
          })}
        </div>
        </div>}
      </div>
    </>
    }

    {/* ── GESTIÓN ── */}
    {mod==="gestion"&&<div style={{background:"linear-gradient(135deg,#607870,#8B9E98)",borderRadius:14,padding:"28px 28px 20px",marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Gestión</div>
      <div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-0.5px",marginBottom:4}}>
        {sub==="Facturación"?"Tu plan activo, todo en orden":sub==="Plan activo"?"El acuerdo que hace posible el bienestar de tu equipo":"Las personas detrás del beneficio, siempre disponibles"}
      </div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>
        {sub==="Facturación"?`Renovación ${c.plan.renewal} · ${c.billing.filter(b=>b.status==="pagado").length} períodos pagados`:sub==="Plan activo"?`${c.plan.type} · ${c.plan.sessionsMonth} sesiones por mes`:"Nuestro equipo está disponible para vos"}
      </div>
    </div>}
    {mod==="gestion"&&sub==="Facturación"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:18}}>
        <KpiCard label="Total pagado" value={`$ ${fmt(billingPaid)}`} sub="UYU acumulado"/>
        <KpiCard label="Pendiente de pago" value={`$ ${fmt(billingPending)}`} sub="Período actual" warn={billingPending>0}/>
        <KpiCard label="Períodos facturados" value={c.billing.length} sub="Desde inicio"/>
      </div>
      <Section title="Historial de facturación">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:`1.5px solid ${P.border}`}}>
              {["Período","Factura","Monto (UYU)","Estado",""].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:P.textMuted,fontWeight:600,fontSize:11,letterSpacing:"0.04em",textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>{[...c.billing].reverse().map((b,i)=><tr key={i} style={{borderBottom:`1px solid ${P.border}`,background:i%2===0?P.white:P.bg}}>
              <td style={{padding:"10px 12px",color:P.text,fontWeight:500}}>{b.period}</td>
              <td style={{padding:"10px 12px",color:P.textMuted,fontFamily:"monospace",fontSize:11}}>{b.invoice}</td>
              <td style={{padding:"10px 12px",color:P.text,fontWeight:600}}>$ {fmt(b.amount)}</td>
              <td style={{padding:"10px 12px"}}><Label text={b.status==="pagado"?"Pagado":"Pendiente"} bg={b.status==="pagado"?P.lighter:P.accentBg} tx={b.status==="pagado"?P.primary:P.accent}/></td>
              <td style={{padding:"10px 12px"}}>
                {b.fileUrl
                  ?<a href={b.fileUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,background:P.lighter,color:P.primary,textDecoration:"none",fontSize:11,fontWeight:600,padding:"5px 12px",borderRadius:7,border:`1px solid ${P.border}`}}>⬇ Descargar</a>
                  :<span style={{fontSize:11,color:P.textMuted,fontStyle:"italic"}}>Pendiente</span>
                }
              </td>
            </tr>)}</tbody>
          </table>
        </div>
      </Section>
    </>}

    {mod==="gestion"&&sub==="Plan activo"&&<Section title="Detalles del plan">
      {[["Tipo",c.plan.type],["Sesiones incluidas",`${c.plan.sessionsMonth}/mes`],["Precio de referencia",`UY$ ${fmt(c.plan.priceRef)}/sesión`],["Inicio",c.plan.start],["Renovación",c.plan.renewal],["Estado",c.plan.status]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${P.border}`}}>
        <span style={{fontSize:12,color:P.textMuted}}>{l}</span>
        <span style={{fontSize:12,fontWeight:600,color:P.text}}>{v}</span>
      </div>)}
    </Section>}

    {mod==="gestion"&&sub==="Equipo TT"&&<>
      <div style={{fontSize:12,color:P.textMuted,marginBottom:16,lineHeight:1.6}}>Tu equipo de referencia en Tu Terapia para consultas administrativas, comerciales o de contenido.</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {TT_TEAM.map((p,i)=><div key={i} style={{background:P.white,borderRadius:12,border:`1px solid ${P.border}`,padding:"20px 24px",display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"}}>
          {p.photo==="flor"?<img src={FLOR_PHOTO} alt={p.name} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",objectPosition:"center 10%",flexShrink:0,border:`2px solid ${P.lighter}`}}/>:p.photo==="nacho"?<img src={NACHO_PHOTO} alt={p.name} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",objectPosition:"center 20%",flexShrink:0,border:`2px solid ${P.lighter}`}}/>:p.photo==="isma"?<img src={ISMA_PHOTO} alt={p.name} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",objectPosition:"center 15%",flexShrink:0,border:`2px solid ${P.lighter}`}}/>:<Avatar initials={p.initials} size={48}/>}
          <div style={{flex:1,minWidth:150}}>
            <div style={{fontSize:14,fontWeight:700,color:P.text,letterSpacing:"-0.2px",marginBottom:2}}>{p.fullName||p.name}</div>
            <div style={{fontSize:12,color:P.textMuted,marginBottom:4}}>{p.role}</div>
            <Label text={p.area} bg={P.lighter} tx={P.primary}/>
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            <a href={`mailto:${p.email}`} style={{display:"flex",alignItems:"center",gap:5,background:P.lighter,color:P.primary,textDecoration:"none",fontSize:11,fontWeight:600,padding:"6px 12px",borderRadius:7,border:`1px solid ${P.border}`}}>✉ Mail</a>
            {p.whatsapp&&<a href={`https://wa.me/${p.whatsapp}?text=Hola%2C%20te%20escribo%20desde%20el%20panel%20de%20Tu%20Terapia.`} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,background:"#E8F5E9",color:"#2E7D32",textDecoration:"none",fontSize:11,fontWeight:600,padding:"6px 12px",borderRadius:7,border:"1px solid #C8E6C9"}}>💬 WhatsApp</a>}

          </div>
        </div>)}
      </div>
    </>}

    <div style={{textAlign:"center",marginTop:32,paddingBottom:32,fontSize:10,color:P.textMuted,letterSpacing:"0.02em"}}>
      Datos actualizados a mayo 2026 · Tu Terapia — Salud Mental para Empresas
    </div>
    </div>
  </div>;
}

