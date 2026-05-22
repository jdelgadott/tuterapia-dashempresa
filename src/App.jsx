import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from "recharts";

const P = {
  primary:"#1A5C4A", light:"#267A62", lighter:"#EAF4F0", bg:"#EDF5F1",
  accent:"#C47B2E", accentBg:"#FBF3E8",
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
      {title:"Encuesta de bienestar general",desc:"Para aplicar al equipo completo · 10 preguntas · 5 min",downloadable:true},
      {title:"Pulso de clima organizacional",desc:"Medición rápida del ambiente laboral · 7 preguntas · 3 min",downloadable:true},
      {title:"Evaluación de liderazgo y bienestar",desc:"Para mandos medios y líderes · 15 preguntas · 8 min",downloadable:true},
    ],
    content:[
      {title:"Kit de activación del beneficio Tu Terapia",type:"Campaña",date:"Ago 2025",downloaded:true,rating:5,sent:true},
      {title:"Material 8M — Salud mental y perspectiva de género",type:"Campaña",date:"Mar 2026",downloaded:true,rating:4,sent:true},
      {title:"Guía para líderes: cómo hablar de salud mental",type:"Guía",date:"Sep 2025",downloaded:true,rating:4,sent:false},
      {title:"Protocolo de acompañamiento en crisis",type:"Protocolo",date:"Nov 2025",downloaded:false,rating:null,sent:false},
      {title:"Protocolo de derivación a psicología",type:"Protocolo",date:"Ene 2026",downloaded:false,rating:null,sent:false},
    ],
    workshopTarget:5,
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
  {name:"Nacho",role:"Desarrollo de Negocio",email:"jdelgado@tuterapia.com.uy",phone:"099495218",whatsapp:"598099495218",calendar:null,initials:"JD",area:"Alianzas B2B",photo:"nacho"},
  {name:"Florencia Iroldi",role:"Customer Success Manager",email:"firoldi@tuterapia.com.uy",phone:"093399250",whatsapp:"59893399250",calendar:"https://calendar.google.com/calendar/r/eventnew?add=firoldi@tuterapia.com.uy&text=Reunión+con+Tu+Terapia&details=Reunión+de+seguimiento+del+beneficio+de+salud+mental",initials:"FI",area:"Gestión de cuentas",photo:"flor"},
  {name:"Isma",role:"Prospección y Cuentas",email:"imazilli@tuterapia.com.uy",phone:"091738836",whatsapp:"598091738836",calendar:null,initials:"IM",area:"Gestión de cuentas"},
];

const MODULES=[
  {id:"individual", label:"Colaboradores",  subs:["Sesiones","Adherencia"]},
  {id:"colectivo",  label:"Cultura de Bienestar",   subs:["Talleres","Contenido"]},
  {id:"estrategico",label:"Estrategia de Bienestar", subs:["Bienestar del equipo","Inversión e impacto","Recursos y reportes"]},
  {id:"gestion",    label:"Gestión",            subs:["Facturación","Plan activo","Equipo TT"],restricted:true},
];

const WSHOP_COLORS={Activación:P.primary,"Concientización":"#1A3A8B",Mindfulness:"#5040A0",Liderazgo:P.accent,"8M":"#8B1A3A"};
const TYPE_COLORS={Campaña:{bg:"#FFF0E6",tx:"#7A3800"},Guía:{bg:P.lighter,tx:P.primary},Protocolo:{bg:"#EEF4FF",tx:"#1A3A8B"},Reporte:{bg:P.gray50,tx:P.textMuted}};
const URGENCY={alta:{bg:P.redBg,tx:P.red,label:"Urgente"},media:{bg:P.accentBg,tx:P.accent,label:"Media prioridad"},baja:{bg:P.lighter,tx:P.primary,label:"A considerar"}};
const COUPON_COLORS=["#1A5C4A","#267A62","#4AA888","#C47B2E","#D9A060"];

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
    {warnNote&&<div style={{marginTop:12,padding:"10px 13px",background:P.accentBg,borderRadius:8,fontSize:11,color:"#7A4A10",lineHeight:1.6}}>{warnNote}</div>}
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

export default function Dashboard(){
  const [ck,setCk]=useState("tcs");
  const [mod,setMod]=useState("home");
  const [sub,setSub]=useState(null);
  const [npsVal,setNpsVal]=useState(null);
  const [showIII,setShowIII]=useState(false);
  const [contentRatings,setContentRatings]=useState(()=>Object.fromEntries((COMPANIES.tcs.content||[]).map((item,i)=>[i,item.rating])));
  const [contentSent,setContentSent]=useState(()=>Object.fromEntries((COMPANIES.tcs.content||[]).map((item,i)=>[i,item.sent])));
  const [contentDownloaded,setContentDownloaded]=useState(()=>Object.fromEntries((COMPANIES.tcs.content||[]).map((item,i)=>[i,item.downloaded])));
  const [editNps,setEditNps]=useState(false);
  const [npsInput,setNpsInput]=useState("");
  const [npsDate,setNpsDate]=useState(null);

  const c=COMPANIES[ck];
  const months=monthsDiff(c.startDate);
  const activeMod=MODULES.find(m=>m.id===mod);

  const goHome=()=>{ setMod("home"); setSub(null); };
  const setModule=(id)=>{ setMod(id); setSub(MODULES.find(x=>x.id===id)?.subs[0]||null); };

  const fullM=c.monthlyData.filter(m=>!m.partial);
  const totCanj=c.monthlyData.reduce((s,m)=>s+m.canjeadas,0);
  const totReal=c.monthlyData.reduce((s,m)=>s+m.realizadas,0);
  const totNuev=c.monthlyData.reduce((s,m)=>s+m.nuevos,0);
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
    <div style={{background:P.white,borderBottom:`1px solid ${P.border}`,padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
      <button onClick={goHome} style={{display:"flex",alignItems:"center",gap:14,background:"none",border:"none",cursor:"pointer",padding:0}}>
        <div style={{background:P.primary,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{color:P.white,fontWeight:800,fontSize:11,letterSpacing:"-0.3px"}}>TT</span>
        </div>
        <div style={{textAlign:"left"}}>
          <div style={{fontSize:13,fontWeight:700,color:P.text,letterSpacing:"-0.2px"}}>Tu Terapia</div>
          <div style={{fontSize:10,color:P.textMuted,letterSpacing:"0.02em"}}>Panel empresarial</div>
        </div>
      </button>
      {mod!=="home"&&activeMod&&<div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
        {MODULES.map(m=><button key={m.id} onClick={()=>setModule(m.id)} style={{fontSize:12,fontWeight:mod===m.id?700:400,color:mod===m.id?P.primary:P.textMuted,background:"none",border:"none",borderBottom:mod===m.id?`2px solid ${P.primary}`:"2px solid transparent",padding:"8px 14px",cursor:"pointer",whiteSpace:"nowrap"}}>
          {m.label}
        </button>)}
      </div>}
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#22C55E"}}/>
        <span style={{fontSize:11,color:P.textMuted}}>{c.name} · {months} meses</span>
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
            {(()=>{
              const firstCount=c.firstTimeCount;
              const firstPct=firstCount!=null&&totNuev>0?Math.round(firstCount/totNuev*100):null;
              return <>
                <div style={{position:"relative",width:60,height:60}}>
                  <Ring pct={firstPct||0} color="#c6b2da" size={60} stroke={5}/>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:11,fontWeight:700,color:"#9070b8"}}>{firstPct!=null?`${firstPct}%`:"—"}</div>
                </div>
                <div style={{fontSize:32,fontWeight:800,color:"#9070b8",letterSpacing:"-1px",lineHeight:1}}>{firstCount!=null?firstCount:"—"}</div>
                <div style={{fontSize:12,fontWeight:600,color:P.text}}>primera vez en terapia</div>
                <div style={{fontSize:10,color:P.textMuted}}>{firstPct!=null?`${firstPct}% del total`:"pendiente"}</div>
              </>;
            })()}
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
          {id:"estrategico",label:"Estrategia de Bienestar", color:"#c49020", accent:"#fef8e8"},
          {id:"gestion",    label:"Gestión",                 color:P.textMuted, accent:P.gray50, restricted:true},
        ].map(p=><button key={p.id} onClick={()=>setModule(p.id)} style={{
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
        {sub==="Adherencia"?"Más personas eligieron cuidar su salud este mes":`${totNuev} personas eligieron cuidar su salud mental`}
      </div>
      <div style={{fontSize:13,color:"#4a7a52",opacity:0.85}}>
        {sub==="Sesiones"?`${fmt(totReal)} sesiones realizadas · ${compRate}% de utilización del plan`:sub==="Adherencia"?`${totNuev} pacientes únicos desde el inicio`:""}
      </div>
    </div>}
    {mod==="individual"&&sub==="Sesiones"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:18}}>
        <KpiCard label="Canjeadas acumuladas" value={fmt(totCanj)} accent/>
        <KpiCard label="Realizadas acumuladas" value={fmt(totReal)} sub="Desde inicio"/>
        <KpiCard label="Tasa de realización" value={`${compRate}%`} sub="Meses completos"/>
        <KpiCard label="Último mes completo" value={lastFull?fmt(lastFull.realizadas):"—"} sub={lastFull?.month}/>
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
      const avgPerUser=totNuev>0?Math.round((fullSessions/totNuev)*10)/10:0;
      const avgPerMonth=fullM.length>0?Math.round((fullSessions/fullM.length)*10)/10:0;
      return <>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:18}}>
          <KpiCard label="Pacientes únicos" value={totNuev} accent/>
          <KpiCard label="Promedio de sesiones por usuario" value={avgPerUser} sub="Histórico acumulado"/>
          <KpiCard label="Promedio sesiones por mes" value={avgPerMonth} sub="Meses completos"/>
          <KpiCard label="Primera vez en terapia" value={c.firstTimeCount!=null?c.firstTimeCount:"—"} sub={c.firstTimePct!=null?`${c.firstTimePct}% del total`:"Pendiente"}/>
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
        <Section title="Promedio de sesiones por usuario">
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <div style={{flex:1,padding:"18px",background:P.lighter,borderRadius:12,border:`1px solid ${P.primary+"44"}`,textAlign:"center"}}>
              <div style={{fontSize:32,fontWeight:700,color:P.primary,letterSpacing:"-1px"}}>{avgPerUser}</div>
              <div style={{fontSize:12,color:P.primary,fontWeight:500,marginTop:4}}>sesiones por usuario</div>
              <div style={{fontSize:11,color:P.textMuted,marginTop:2}}>promedio histórico acumulado</div>
            </div>
            <div style={{flex:1,padding:"18px",background:P.white,borderRadius:12,border:`1px solid ${P.border}`,textAlign:"center"}}>
              <div style={{fontSize:32,fontWeight:700,color:P.text,letterSpacing:"-1px"}}>{avgPerMonth}</div>
              <div style={{fontSize:12,color:P.textMuted,fontWeight:500,marginTop:4}}>sesiones realizadas por mes</div>
              <div style={{fontSize:11,color:P.textMuted,marginTop:2}}>promedio en meses completos</div>
            </div>
          </div>
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
        {sub==="Contenido"?"Recursos para llevar el bienestar a cada rincón del equipo":`${c.workshops.length} talleres de bienestar realizados con tu equipo`}
      </div>
      <div style={{fontSize:13,color:"rgba(74,48,112,0.7)"}}>
        {sub==="Talleres"?`${c.workshops.filter(w=>w.rating>=4.5).length} de ${c.workshops.length} talleres con puntuación destacada`:`${c.content.filter(x=>x.downloaded).length} recursos descargados · ${c.content.filter(x=>x.sent).length} enviados al equipo`}
      </div>
    </div>}
    {mod==="colectivo"&&sub==="Talleres"&&<>
      <Section title={`Talleres realizados (${c.workshops.length})`}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {c.workshops.map((w,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 16px",background:P.bg,borderRadius:10,border:`1px solid ${P.border}`}}>
            <Avatar initials={w.initials} size={38} bg={WSHOP_COLORS[w.type]||P.primary}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                <Label text={w.type} bg={P.lighter} tx={WSHOP_COLORS[w.type]||P.primary}/>
                {w.lang&&<Label text={w.lang} bg={P.gray50} tx={P.textMuted}/>}
              </div>
              <div style={{fontSize:13,fontWeight:600,color:P.text,marginBottom:3,letterSpacing:"-0.1px"}}>{w.title}</div>
              <div style={{fontSize:11,color:P.textMuted,marginBottom:7}}>{w.date} · {w.speaker}</div>
              <Stars rating={w.rating}/>
            </div>
          </div>)}
        </div>
      </Section>
      <Section title="Talleres recomendados" note="Sugeridos en base al perfil y actividad del equipo de TCS.">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {c.workshopsRecommended.map((w,i)=><div key={i} style={{padding:"14px 16px",background:P.white,border:`1px solid ${P.border}`,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:P.text,marginBottom:3,letterSpacing:"-0.1px"}}>{w.title}</div>
              <div style={{fontSize:11,color:P.textMuted}}>{w.desc}</div>
            </div>
            <Label text={w.month} bg={P.lighter} tx={P.primary}/>
          </div>)}
        </div>
      </Section>
    </>}

    {mod==="colectivo"&&sub==="Contenido"&&(()=>{
      const ratings=contentRatings; const setRatings=setContentRatings;
      const sent=contentSent; const setSent=setContentSent;
      const downloaded=contentDownloaded; const setDownloaded=setContentDownloaded;
      const ratingLabel={5:"Muy adecuado",4:"Adecuado",3:"Neutral",2:"Poco adecuado",1:"No adecuado"};
      return <>
        <Section title="Recursos y material">
          <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Descargá el material, evalualo y marcalo como enviado cuando lo compartas con tu equipo.</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {c.content.map((item,i)=>{
              const col=TYPE_COLORS[item.type]||{bg:P.lighter,tx:P.primary};
              return <div key={i} style={{padding:"14px 16px",background:P.white,border:`1px solid ${P.border}`,borderRadius:10}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                  <div style={{background:col.bg,color:col.tx,fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,flexShrink:0}}>{item.type}</div>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{fontSize:12,fontWeight:600,color:P.text,marginBottom:2}}>{item.title}</div>
                    <div style={{fontSize:11,color:P.textMuted}}>{item.date}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
                    <button onClick={()=>setDownloaded(d=>({...d,[i]:true}))} style={{background:downloaded[i]?P.lighter:P.white,color:downloaded[i]?P.primary:P.textMuted,border:`1px solid ${downloaded[i]?P.primary+"44":P.border}`,borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>{downloaded[i]?"✓ Descargado":"Descargar"}</button>
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
    {mod==="estrategico"&&<div style={{background:"linear-gradient(135deg,#fef6e0,#fffbf0)",borderRadius:14,padding:"28px 28px 20px",marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:"#c49820",opacity:0.7,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Estrategia de Bienestar</div>
      <div style={{fontSize:22,fontWeight:800,color:"#7a5a0a",letterSpacing:"-0.5px",marginBottom:4}}>
        {sub==="Bienestar del equipo"?"Los datos muestran un equipo que avanza":sub==="Inversión e impacto"?"Una inversión que se traduce en personas más sanas":"Herramientas para tomar mejores decisiones"}
      </div>
      <div style={{fontSize:13,color:"#a07820"}}>
        {sub==="Bienestar del equipo"?`NPS ${npsVal!=null?npsVal:"pendiente"} · encuestas Q pendientes`:sub==="Inversión e impacto"?`$ ${fmt(c.monthlyData.reduce((s,m)=>s+m.realizadas,0)*c.sessionPriceRef)} invertidos · ${c.monthlyData.filter(m=>!m.partial).reduce((s,m)=>s+(m.canjeadas>0?Math.round(m.realizadas/m.canjeadas*100):0),0)/Math.max(c.monthlyData.filter(m=>!m.partial).length,1)|0}% utilización`:`${c.reports.length} informes disponibles · ${c.recommendations.length} recomendaciones activas`}
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
        <KpiCard label="Encuestas completadas" value="0 / 4" sub="Trimestres del año" warn/>
        <KpiCard label="Motivos de consulta" value={c.consultationReasons.length||"Pendiente"} sub="Categorías registradas"/>
      </div>

      <Section title="Evolución del bienestar por trimestre">
        <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Encuesta trimestral intraplataforma · escala 1–10.</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {c.wellbeingByQ.map((q,i)=><div key={i} style={{flex:1,minWidth:110,padding:"16px",background:q.score!=null?P.lighter:P.gray50,border:`1px solid ${q.score!=null?P.primary+"44":P.border}`,borderRadius:10,textAlign:"center"}}>
            <div style={{fontSize:10,fontWeight:600,color:P.textMuted,marginBottom:8,letterSpacing:"0.04em",textTransform:"uppercase"}}>{q.q}</div>
            {q.score!=null?<><div style={{fontSize:26,fontWeight:700,color:P.primary,letterSpacing:"-1px"}}>{q.score}</div><div style={{fontSize:10,color:P.textMuted}}>/10</div></>
            :<div style={{fontSize:12,color:P.textMuted,padding:"6px 0"}}>Pendiente</div>}
          </div>)}
        </div>
      </Section>

      {c.consultationReasons.length===0?
        <Section title="Motivos de consulta">
          <div style={{padding:"20px",textAlign:"center",color:P.textMuted,fontSize:12}}>Disponibles al integrar los datos del módulo de encuestas.</div>
        </Section>
      :<Section title="Motivos de consulta más frecuentes" note="Datos anonimizados y agrupados por categoría.">
        <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start"}}>
          <div style={{position:"relative",width:140,height:140,flexShrink:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={c.consultationReasons} dataKey="pct" innerRadius={38} outerRadius={62} paddingAngle={2}>
                {c.consultationReasons.map((_,i)=><Cell key={i} fill={REASON_COLORS[i]}/>)}
              </Pie></PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
            {c.consultationReasons.map((r,i)=><div key={r.reason} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:8,height:8,borderRadius:2,background:REASON_COLORS[i],flexShrink:0}}/>
              <div style={{flex:1,background:P.gray50,borderRadius:4,height:16,overflow:"hidden",position:"relative"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${r.pct}%`,background:REASON_COLORS[i],borderRadius:4,opacity:0.85}}/>
                <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:9,color:P.white,fontWeight:600,zIndex:1}}>{r.reason}</span>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:P.text,width:34,textAlign:"right"}}>{r.pct}%</span>
            </div>)}
          </div>
        </div>
      </Section>}
    </>}

    {/* ── ESTRATÉGICO - Inversión e impacto ── */}
    {mod==="estrategico"&&sub==="Inversión e impacto"&&(()=>{
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
      const contentEngagement=c.content.length>0?Math.round((c.content.filter(x=>x.downloaded&&x.rating).length/c.content.length)*100):0;
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
      const invPerPat2=totNuev2>0?invTotal2/totNuev2:0;
      return <>
        {/* III KPI card */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:18}}>
          <div onMouseEnter={()=>setShowIII(true)} onMouseLeave={()=>setShowIII(false)}
            style={{position:"relative",background:iii!=null?P.lighter:P.gray50,border:`1px solid ${iii!=null?P.primary+"44":P.border}`,borderRadius:12,padding:"16px 18px",display:"flex",flexDirection:"column",gap:4,cursor:"default"}}>
            <div style={{fontSize:21,fontWeight:700,color:iii!=null?P.primary:P.textMuted,lineHeight:1.1,letterSpacing:"-0.5px"}}>{iii!=null?iii:"—"}<span style={{fontSize:12,fontWeight:400,color:P.textMuted}}> /100</span></div>
            <div style={{fontSize:12,fontWeight:600,color:P.text}}>Índice III</div>
            <div style={{fontSize:11,color:P.textMuted}}>{iii!=null?(iii>=70?"Impacto alto":iii>=50?"Impacto medio":"En desarrollo"):"Pendiente Q1"}</div>
            <div style={{fontSize:10,color:P.primary,marginTop:2}}>Hover para ver composición</div>
            {showIII&&<div style={{position:"absolute",top:"calc(100% + 8px)",left:0,width:290,background:P.white,border:`1px solid ${P.border}`,borderRadius:12,padding:"14px 16px",boxShadow:"0 4px 20px rgba(0,0,0,0.10)",zIndex:20}}>
              <div style={{fontSize:10,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Composición del índice</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  ["50%","Mejora en bienestar (encuestas)",normImp2!=null?`${Math.round(normImp2*0.5)}pts`:"—","Evolución Q inicial → Q actual en 6 dimensiones."],
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
                III = (bienestar×50%) + (utilización×30%) + (talleres×15%) + (contenido×5%)
              </div>
            </div>}
          </div>
          <KpiCard label="Inversión total acumulada" value={`$ ${fmt(invTotal2)}`} sub="UYU · precio de referencia" accent/>
          <KpiCard label="Por paciente único" value={`$ ${fmt(invPerPat2)}`} sub={`${totNuev2} pacientes únicos`}/>
          <KpiCard label="Utilización del plan" value={`${compRate2}%`} sub="Realizadas / contratadas"/>
          <KpiCard label="Último mes completo" value={`$ ${fmt(lastFull2?lastFull2.realizadas*c.sessionPriceRef:0)}`} sub={lastFull2?.month}/>
        </div>

        <Section title="6 dimensiones del impacto">
          <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Medidas trimestralmente por encuesta. Escala 1–10.</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {key:"saludMental",label:"Bienestar y salud mental",desc:"Bienestar emocional, estrés y equilibrio vida-trabajo",color:"#1A5C4A"},
              {key:"clima",label:"Clima y comunicación",desc:"Ambiente de equipo y resolución de conflictos",color:"#267A62"},
              {key:"liderazgo",label:"Liderazgo efectivo",desc:"Liderazgo empático y promoción del bienestar",color:"#5040A0"},
              {key:"engagement",label:"Engagement y compromiso",desc:"Motivación, propósito e intención de permanencia",color:"#C47B2E"},
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
                  </>:<span style={{fontSize:11,color:P.textMuted,fontStyle:"italic"}}>Pendiente Q1</span>}
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

        <Section title="Benchmark vs. red Tu Terapia" note="Disponible en la próxima fase — comparación con ~40 empresas aliadas.">
          <div style={{padding:"20px",textAlign:"center",color:P.textMuted}}>
            <div style={{fontSize:13,fontWeight:600,color:P.text,marginBottom:4}}>Próximamente</div>
            <div style={{fontSize:12}}>Compará el índice de impacto de TCS con el promedio de la red.</div>
          </div>
        </Section>
      </>;
    })()}

    {/* ── ESTRATÉGICO - Recursos y reportes ── */}
    {mod==="estrategico"&&sub==="Recursos y reportes"&&<>
      <Section title="Encuestas para tu equipo" note={`Descargá la encuesta, aplicala a tu equipo y envianos los resultados a ${COMPANIES.tcs.accountManager.email} para que los procesemos y mostremos en este panel.`}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {COMPANIES.tcs.surveys.map((s,i)=><div key={i} style={{background:s.isMain?P.lighter:P.white,border:`1px solid ${s.isMain?P.primary+"44":P.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
              {s.isMain&&<div style={{width:4,minHeight:40,borderRadius:2,background:P.primary,flexShrink:0}}/>}
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <div style={{fontSize:13,fontWeight:600,color:P.text}}>{s.title}</div>
                  {s.isMain&&<span style={{background:P.primary,color:P.white,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,letterSpacing:"0.04em",textTransform:"uppercase"}}>Principal</span>}
                </div>
                <div style={{fontSize:11,color:P.textMuted}}>{s.desc}</div>
              </div>
              <button style={{background:s.isMain?P.primary:P.lighter,color:s.isMain?P.white:P.primary,border:`1px solid ${s.isMain?P.primary:P.border}`,borderRadius:7,padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>Descargar</button>
            </div>
            {s.isMain&&<div style={{borderTop:`1px solid ${P.border}`,padding:"10px 16px",background:"rgba(255,255,255,0.6)"}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["Bienestar y salud mental","Clima y comunicación","Liderazgo efectivo","Engagement y compromiso","Ausentismo percibido","Productividad sostenible"].map(d=>
                  <span key={d} style={{fontSize:10,background:P.white,border:`1px solid ${P.border}`,borderRadius:20,padding:"3px 10px",color:P.textMuted}}>{d}</span>
                )}
              </div>
            </div>}
          </div>)}
        </div>
      </Section>

      <Section title="Informes de uso">
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {COMPANIES.tcs.reports.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:P.white,border:`1px solid ${P.border}`,borderRadius:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:P.text}}>{r.title}</div>
              <div style={{fontSize:11,color:P.textMuted}}>{r.date}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {r.isNew&&<Label text="Nuevo" bg={P.primary} tx={P.white}/>}
              <button style={{background:P.lighter,color:P.primary,border:`1px solid ${P.border}`,borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>Descargar</button>
            </div>
          </div>)}
        </div>
      </Section>

      <Section title="Recomendaciones de Tu Terapia">
        <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Hallazgos sobre la salud mental y bienestar del equipo, elaborados por nuestros profesionales.</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {COMPANIES.tcs.recommendations.map((r,i)=>{
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
      </Section>

      <Section title="Impacto de acciones colectivas en el uso individual" note="Correlación entre talleres/activaciones y la incorporación de nuevos pacientes.">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {COMPANIES.tcs.collectiveImpact.map((item,i)=><div key={i} style={{display:"flex",gap:14,padding:"14px 16px",background:P.bg,borderRadius:10,border:`1px solid ${P.border}`,alignItems:"flex-start"}}>
            <div style={{flexShrink:0,textAlign:"center",minWidth:44}}>
              <div style={{fontSize:18,fontWeight:700,color:P.primary,letterSpacing:"-0.5px"}}>+{item.newPatients}</div>
              <div style={{fontSize:9,color:P.textMuted,letterSpacing:"0.02em",textTransform:"uppercase"}}>nuevos</div>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap",alignItems:"center"}}>
                <Label text={item.type} bg={P.lighter} tx={P.primary}/>
                <span style={{fontSize:11,color:P.textMuted}}>{item.date}</span>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:P.text,marginBottom:3}}>{item.event}</div>
              <div style={{fontSize:11,color:P.textMuted,lineHeight:1.6}}>{item.note}</div>
            </div>
          </div>)}
        </div>
      </Section>
    </>}
    {/* ── GESTIÓN ── */}
    {mod==="gestion"&&<div style={{background:"linear-gradient(135deg,#607870,#8B9E98)",borderRadius:14,padding:"28px 28px 20px",marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Gestión</div>
      <div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-0.5px",marginBottom:4}}>
        {sub==="Facturación"?"Tu plan activo, todo en orden":sub==="Plan activo"?"El acuerdo que hace posible el bienestar de tu equipo":"Las personas detrás del beneficio, siempre disponibles"}
      </div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>
        {sub==="Facturación"?`Renovación ${c.plan.renewal} · ${c.billing.filter(b=>b.status==="pagado").length} períodos pagados`:sub==="Plan activo"?`${c.plan.type} · ${c.plan.sessionsMonth} sesiones por mes`:`Nacho · Flor · Isma`}
      </div>
    </div>}
    {mod==="gestion"&&sub==="Facturación"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:18}}>
        <KpiCard label="Total pagado" value={`$ ${fmt(billingPaid)}`} sub="UYU acumulado" accent/>
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
          {p.photo==="flor"?<img src={FLOR_PHOTO} alt={p.name} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",objectPosition:"center 10%",flexShrink:0,border:`2px solid ${P.lighter}`}}/>:p.photo==="nacho"?<img src={NACHO_PHOTO} alt={p.name} style={{width:48,height:48,borderRadius:"50%",objectFit:"cover",objectPosition:"center 20%",flexShrink:0,border:`2px solid ${P.lighter}`}}/>:<Avatar initials={p.initials} size={48}/>}
          <div style={{flex:1,minWidth:150}}>
            <div style={{fontSize:14,fontWeight:700,color:P.text,letterSpacing:"-0.2px",marginBottom:2}}>{p.name}</div>
            <div style={{fontSize:12,color:P.textMuted,marginBottom:4}}>{p.role}</div>
            <Label text={p.area} bg={P.lighter} tx={P.primary}/>
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            <a href={`mailto:${p.email}`} style={{display:"flex",alignItems:"center",gap:5,background:P.lighter,color:P.primary,textDecoration:"none",fontSize:11,fontWeight:600,padding:"6px 12px",borderRadius:7,border:`1px solid ${P.border}`}}>✉ Mail</a>
            {p.whatsapp&&<a href={`https://wa.me/${p.whatsapp}?text=Hola%2C%20te%20escribo%20desde%20el%20panel%20de%20Tu%20Terapia.`} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,background:"#E8F5E9",color:"#2E7D32",textDecoration:"none",fontSize:11,fontWeight:600,padding:"6px 12px",borderRadius:7,border:"1px solid #C8E6C9"}}>💬 WhatsApp</a>}
            {p.calendar&&<a href={p.calendar} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,background:"#EEF4FF",color:"#1A3A8B",textDecoration:"none",fontSize:11,fontWeight:600,padding:"6px 12px",borderRadius:7,border:"1px solid #C5D5F5"}}>📅 Reunión</a>}
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

