
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from "recharts";
const P = {
  primary:"#1A5C4A", light:"#267A62", lighter:"#EAF4F0", bg:"#F5F7F6",
  accent:"#C47B2E", accentBg:"#FBF3E8",
  border:"#DDE8E4", text:"#18211E", textMuted:"#607870", white:"#FFFFFF",
  green:"#267A62", greenLight:"#A8D4C6", gray50:"#F0F4F2",
  red:"#B03030", redBg:"#FAEAEA",
  purple:"#5040A0", purpleBg:"#EEEAF8",
};
const fmt = (n) => new Intl.NumberFormat("es-UY").format(Math.round(n));

function monthsDiff(startStr){
  const map={Enero:0,Febrero:1,Marzo:2,Abril:3,Mayo:4,Junio:5,Julio:6,Agosto:7,Septiembre:8,Octubre:9,Noviembre:10,Diciembre:11};
  const [mon,yr]=startStr.split(" ");
  const d=new Date(parseInt(yr),map[mon]||6,1);
  const now=new Date(2026,4,1);
  return Math.max(0,(now.getFullYear()-d.getFullYear())*12+now.getMonth()-d.getMonth());
}

const COMPANIES = {
  tcs:{
    name:"TCS", industry:"Tecnología",
    planType:"Cuponera Fija", planCoverage:"100%", monthlyPlan:300,
    startDate:"Julio 2025", sessionPriceRef:1600, coveragePct:1.0,
    accountManager:{name:"Florencia Iroldi",role:"Customer Success Manager",email:"firoldi@tuterapia.com.uy",phone:null,initials:"FI"},
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
    nps:null, npsDate:null, consultationReasons:[],
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
      {title:"Kit de activación del beneficio Tu Terapia",type:"Campaña",date:"Ago 2025",downloadable:true,isNew:false},
      {title:"Material 8M — Salud mental y perspectiva de género",type:"Campaña",date:"Mar 2026",downloadable:true,isNew:false},
      {title:"Guía para líderes: cómo hablar de salud mental",type:"Guía",date:"Sep 2025",downloadable:true,isNew:false},
      {title:"Protocolo de acompañamiento en crisis",type:"Protocolo",date:"Nov 2025",downloadable:true,isNew:false},
      {title:"Protocolo de derivación a psicología",type:"Protocolo",date:"Ene 2026",downloadable:true,isNew:false},
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
      {period:"Jul 2025",amount:1600,   status:"pagado",invoice:"TT-2025-071"},
      {period:"Ago 2025",amount:371200, status:"pagado",invoice:"TT-2025-081"},
      {period:"Sep 2025",amount:420800, status:"pagado",invoice:"TT-2025-091"},
      {period:"Oct 2025",amount:481600, status:"pagado",invoice:"TT-2025-101"},
      {period:"Nov 2025",amount:464000, status:"pagado",invoice:"TT-2025-111"},
      {period:"Dic 2025",amount:438400, status:"pagado",invoice:"TT-2025-121"},
      {period:"Ene 2026",amount:448000, status:"pagado",invoice:"TT-2026-011"},
      {period:"Feb 2026",amount:491200, status:"pagado",invoice:"TT-2026-021"},
      {period:"Mar 2026",amount:473600, status:"pagado",invoice:"TT-2026-031"},
      {period:"Abr 2026",amount:416000, status:"pagado",invoice:"TT-2026-041"},
      {period:"May 2026",amount:110400, status:"pendiente",invoice:"TT-2026-051"},
    ],
  },
};

const TT_TEAM=[
  {name:"Juan Ignacio Delgado",role:"Desarrollo de Negocio",email:"jdelgado@tuterapia.com.uy",phone:"+598 99 123 456",initials:"JD",area:"Alianzas B2B"},
  {name:"Florencia Iroldi",role:"Customer Success Manager",email:"firoldi@tuterapia.com.uy",phone:null,initials:"FI",area:"Gestión de cuentas"},
  {name:"Ismael Rodríguez",role:"Prospección y Cuentas",email:"irodriguez@tuterapia.com.uy",phone:null,initials:"IR",area:"Gestión de cuentas"},
];

const MODULES=[
  {id:"individual", label:"Pilar Individual",  subs:["Sesiones","Adherencia"]},
  {id:"colectivo",  label:"Pilar Colectivo",   subs:["Talleres","Contenido"]},
  {id:"estrategico",label:"Pilar Estratégico", subs:["Bienestar","Inversión e impacto"]},
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
    {id:"individual", label:"Pilar Individual", color:P.primary, borderColor:P.primary,
     stats:[`${fmt(totReal)} sesiones realizadas`,`${totNuev} pacientes únicos`,`${compRate}% tasa de realización`]},
    {id:"colectivo",  label:"Pilar Colectivo",  color:P.purple, borderColor:P.purple,
     stats:[`${c.workshops.length} talleres realizados`,`${c.content.length} recursos disponibles`,"Próximo: Jun 2026"]},
    {id:"estrategico",label:"Pilar Estratégico",color:P.accent, borderColor:P.accent,
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
    {mod!=="home"&&activeMod?.subs&&<div style={{background:P.white,borderBottom:`1px solid ${P.border}`,padding:"0 28px",display:"flex",overflowX:"auto"}}>
      {activeMod.subs.map(s=><button key={s} onClick={()=>setSub(s)} style={{fontSize:12,fontWeight:sub===s?600:400,color:sub===s?P.primary:P.textMuted,background:"none",border:"none",borderBottom:sub===s?`2px solid ${P.primary}`:"2px solid transparent",padding:"9px 16px",cursor:"pointer",whiteSpace:"nowrap",letterSpacing:"0.01em"}}>{s}</button>)}
    </div>}

    <div style={{padding:"28px",maxWidth:960,margin:"0 auto"}}>

    {/* ── HOME ── */}
    {mod==="home"&&<>
      {/* Alliance header */}
      <div style={{background:P.white,borderRadius:16,border:`1px solid ${P.border}`,padding:"36px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,marginBottom:32,flexWrap:"wrap"}}>
          <button onClick={goHome} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer"}}>
            <div style={{width:80,height:80,borderRadius:14,background:"#003087",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,48,135,0.18)"}}>
              <span style={{color:"white",fontWeight:900,fontSize:24,letterSpacing:"-1px"}}>TCS</span>
            </div>
            <span style={{fontSize:11,color:P.textMuted,fontWeight:500,letterSpacing:"0.04em",textTransform:"uppercase"}}>TCS</span>
          </button>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <div style={{width:1,height:32,background:P.border}}/>
            <span style={{fontSize:11,fontWeight:600,color:P.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}}>{months} meses</span>
            <div style={{width:1,height:32,background:P.border}}/>
          </div>
          <button onClick={goHome} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer"}}>
            <div style={{width:80,height:80,borderRadius:14,background:P.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(26,92,74,0.18)"}}>
              <span style={{color:"white",fontWeight:800,fontSize:11,textAlign:"center",lineHeight:1.3,letterSpacing:"-0.2px"}}>Tu{"\n"}Terapia</span>
            </div>
            <span style={{fontSize:11,color:P.textMuted,fontWeight:500,letterSpacing:"0.04em",textTransform:"uppercase"}}>Tu Terapia</span>
          </button>
        </div>

        {/* 4 quadrants */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
          {QUADRANTS.map(q=><button key={q.id} onClick={()=>setModule(q.id)} style={{background:P.bg,border:`1px solid ${P.border}`,borderTop:`3px solid ${q.borderColor}`,borderRadius:10,padding:"20px",textAlign:"left",cursor:"pointer",position:"relative",transition:"border-color 0.15s"}}>
            {q.restricted&&<span style={{position:"absolute",top:10,right:10,fontSize:9,fontWeight:700,background:P.accentBg,color:P.accent,padding:"2px 6px",borderRadius:4,letterSpacing:"0.04em",textTransform:"uppercase"}}>Restringido</span>}
            <div style={{fontSize:13,fontWeight:700,color:q.color,marginBottom:12,letterSpacing:"-0.1px"}}>{q.label}</div>
            {q.stats.map((s,i)=><div key={i} style={{fontSize:11,color:P.textMuted,padding:"5px 0",borderBottom:`1px solid ${P.border}`,lineHeight:1.4}}>{s}</div>)}
            <div style={{marginTop:12,fontSize:11,fontWeight:600,color:q.color,letterSpacing:"0.01em"}}>Ver detalle →</div>
          </button>)}
        </div>
      </div>

      {/* Account manager */}
      <div style={{background:P.white,borderRadius:14,border:`1px solid ${P.border}`,padding:"22px 28px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",marginBottom:20}}>
        <Avatar initials={c.accountManager.initials} size={50}/>
        <div style={{flex:1,minWidth:160}}>
          <div style={{fontSize:10,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Tu referente en Tu Terapia</div>
          <div style={{fontSize:15,fontWeight:700,color:P.text,letterSpacing:"-0.2px",marginBottom:2}}>{c.accountManager.name}</div>
          <div style={{fontSize:12,color:P.textMuted}}>{c.accountManager.role}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <a href={`mailto:${c.accountManager.email}`} style={{fontSize:12,color:P.primary,textDecoration:"none",fontWeight:500}}>{c.accountManager.email}</a>
          {c.accountManager.phone&&<span style={{fontSize:12,color:P.textMuted}}>{c.accountManager.phone}</span>}
        </div>
      </div>

      {/* Milestones */}
      <div style={{background:P.white,borderRadius:14,border:`1px solid ${P.border}`,padding:"22px 28px"}}>
        <div style={{fontSize:11,fontWeight:700,color:P.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>Hitos de la alianza</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          {c.milestones.map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:m.reached?P.lighter:P.gray50,border:`1px solid ${m.reached?P.primary+"44":P.border}`,borderRadius:8,opacity:m.reached?1:0.5}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:m.reached?P.primary:P.border,flexShrink:0}}/>
            <div>
              <div style={{fontSize:12,fontWeight:m.reached?600:400,color:m.reached?P.text:P.textMuted}}>{m.label}</div>
              {m.reached&&m.date&&<div style={{fontSize:10,color:P.textMuted}}>{m.date}</div>}
              {!m.reached&&m.date&&<div style={{fontSize:10,color:P.textMuted}}>Próximamente · {m.date}</div>}
            </div>
          </div>)}
        </div>
      </div>
    </>}

    {/* ── INDIVIDUAL ── */}
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
      <Section title="Distribución de cupones canjeados">
        <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",width:136,height:136,flexShrink:0}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={couponD} dataKey="value" innerRadius={36} outerRadius={60} paddingAngle={2}>{couponD.map((_,i)=><Cell key={i} fill={COUPON_COLORS[i]}/>)}</Pie></PieChart>
            </ResponsiveContainer>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
              <div style={{fontSize:16,fontWeight:700,color:P.text}}>{fmt(totCoup)}</div>
              <div style={{fontSize:9,color:P.textMuted,letterSpacing:"0.02em"}}>cupones</div>
            </div>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:7,minWidth:180}}>
            {couponD.map((d,i)=><div key={d.name} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:8,height:8,borderRadius:2,background:COUPON_COLORS[i],flexShrink:0}}/>
              <div style={{flex:1,background:P.gray50,borderRadius:4,height:16,overflow:"hidden",position:"relative"}}>
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:`${Math.round(d.value/couponD[0].value*100)}%`,background:COUPON_COLORS[i],borderRadius:4,opacity:0.85}}/>
                <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:9,color:P.white,fontWeight:600,zIndex:1}}>{d.name}</span>
              </div>
              <span style={{fontSize:11,fontWeight:600,color:P.text,width:72,textAlign:"right"}}>{d.value} ({Math.round(d.value/totCoup*100)}%)</span>
            </div>)}
          </div>
        </div>
      </Section>
    </>}

    {mod==="individual"&&sub==="Adherencia"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:18}}>
        <KpiCard label="Pacientes únicos" value={totNuev} accent/>
        <KpiCard label="Nuevos último mes completo" value={lastFull?.nuevos||"—"} sub={lastFull?.month}/>
        <KpiCard label="Tasa de realización" value={`${compRate}%`} sub="Meses completos"/>
      </div>
      <Section title="Funnel de adherencia">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {label:"Sesiones contratadas (acum.)",value:c.monthlyPlan*fullM.length,pct:100},
            {label:"Sesiones canjeadas",value:totCanj,pct:Math.min(100,Math.round(totCanj/(c.monthlyPlan*fullM.length)*100))},
            {label:"Sesiones realizadas",value:totReal,pct:Math.round(totReal/(c.monthlyPlan*fullM.length)*100)},
          ].map((d,i)=><FunnelBar key={d.label} {...d} i={i}/>)}
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
    </>}

    {/* ── COLECTIVO ── */}
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

    {mod==="colectivo"&&sub==="Contenido"&&<>
      {["Campaña","Guía","Protocolo"].map(type=>{
        const items=c.content.filter(x=>x.type===type);
        if(!items.length)return null;
        const col=TYPE_COLORS[type]||{bg:P.lighter,tx:P.primary};
        return <Section key={type} title={`${type}s`}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {items.map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:P.white,border:`1px solid ${P.border}`,borderRadius:10}}>
              <div style={{background:col.bg,color:col.tx,fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:20,flexShrink:0,letterSpacing:"0.03em"}}>{item.type}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:P.text}}>{item.title}</div>
                <div style={{fontSize:11,color:P.textMuted}}>{item.date}</div>
              </div>
              <button style={{background:P.lighter,color:P.primary,border:`1px solid ${P.border}`,borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>Descargar</button>
            </div>)}
          </div>
        </Section>;
      })}
    </>}

    {/* ── ESTRATÉGICO - Bienestar ── */}
    {mod==="estrategico"&&sub==="Bienestar"&&<>
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
        <div style={{fontSize:11,color:P.textMuted,marginBottom:14,lineHeight:1.6}}>Encuesta trimestral intraplataforma · escala 1–10. Los datos aparecerán al completarse cada período.</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {c.wellbeingByQ.map((q,i)=><div key={i} style={{flex:1,minWidth:110,padding:"16px",background:q.score!=null?P.lighter:P.gray50,border:`1px solid ${q.score!=null?P.primary+"44":P.border}`,borderRadius:10,textAlign:"center"}}>
            <div style={{fontSize:10,fontWeight:600,color:P.textMuted,marginBottom:8,letterSpacing:"0.04em",textTransform:"uppercase"}}>{q.q}</div>
            {q.score!=null?<><div style={{fontSize:26,fontWeight:700,color:P.primary,letterSpacing:"-1px"}}>{q.score}</div><div style={{fontSize:10,color:P.textMuted}}>/10</div></>
            :<div style={{fontSize:12,color:P.textMuted,padding:"6px 0"}}>Pendiente</div>}
          </div>)}
        </div>
      </Section>

      <Section title="Encuestas para tu equipo" note={`Descargá la encuesta, aplicala a tu equipo y envianos los resultados a ${c.accountManager.email} para que los procesemos y mostremos en este panel.`}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {c.surveys.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:P.white,border:`1px solid ${P.border}`,borderRadius:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:P.text,marginBottom:3}}>{s.title}</div>
              <div style={{fontSize:11,color:P.textMuted}}>{s.desc}</div>
            </div>
            <button style={{background:P.lighter,color:P.primary,border:`1px solid ${P.border}`,borderRadius:7,padding:"6px 14px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>Descargar</button>
          </div>)}
        </div>
      </Section>

      <Section title="Informes de uso">
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {c.reports.map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:P.white,border:`1px solid ${P.border}`,borderRadius:10}}>
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
          {c.recommendations.map((r,i)=>{
            const u=URGENCY[r.urgency];
            return <div key={i} style={{padding:"16px",background:P.bg,borderRadius:10,border:`1px solid ${P.border}`,borderLeft:`3px solid ${u.tx}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <Label text={u.label} bg={u.bg} tx={u.tx}/>
                <span style={{fontSize:10,color:P.textMuted,letterSpacing:"0.02em"}}>{r.date}</span>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:5,letterSpacing:"-0.1px"}}>{r.action}</div>
              <div style={{fontSize:12,color:P.textMuted,lineHeight:1.7}}>{r.reason}</div>
            </div>;
          })}
        </div>
      </Section>

      <Section title="Impacto de acciones colectivas en el uso individual" note="Correlación entre talleres y activaciones realizadas y la incorporación de nuevos pacientes al plan individual.">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {c.collectiveImpact.map((item,i)=><div key={i} style={{display:"flex",gap:14,padding:"14px 16px",background:P.bg,borderRadius:10,border:`1px solid ${P.border}`,alignItems:"flex-start"}}>
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

    {/* ── ESTRATÉGICO - Inversión ── */}
    {mod==="estrategico"&&sub==="Inversión e impacto"&&<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:18}}>
        <KpiCard label="Inversión total acumulada" value={`$ ${fmt(invTotal)}`} sub="UYU · precio de referencia" accent/>
        <KpiCard label="Por paciente único" value={`$ ${fmt(invPerPat)}`} sub={`${totNuev} pacientes únicos`}/>
        <KpiCard label="Utilización del plan" value={`${compRate}%`} sub="Realizadas / contratadas"/>
        <KpiCard label="Último mes completo" value={`$ ${fmt(invLastFull)}`} sub={lastFull?.month}/>
      </div>
      <Section title="Inversión mensual (UYU)" warnNote="Cálculo de referencia a UY$ 1.600 por sesión. El valor real depende del precio contratado.">
        <div style={{height:200}}><ResponsiveContainer width="100%" height="100%">
          <BarChart data={invTrend} barSize={13}>
            <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:P.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
            <Tooltip content={<Tip/>} cursor={{fill:P.lighter}}/>
            <Bar dataKey="investment" name="investment" radius={[3,3,0,0]}>{invTrend.map((m,i)=><Cell key={i} fill={m.partial?P.greenLight:P.primary}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer></div>
      </Section>
      <Section title="Benchmark vs. red Tu Terapia" note="Disponible en la próxima fase — comparación con ~40 empresas aliadas.">
        <div style={{padding:"24px",textAlign:"center",color:P.textMuted}}>
          <div style={{fontSize:13,fontWeight:600,color:P.text,marginBottom:4}}>Próximamente</div>
          <div style={{fontSize:12}}>Compará la utilización y adopción de TCS con el promedio de la red.</div>
        </div>
      </Section>
    </>}

    {/* ── GESTIÓN ── */}
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
              {["Período","Factura","Monto (UYU)","Estado"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:P.textMuted,fontWeight:600,fontSize:11,letterSpacing:"0.04em",textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>{[...c.billing].reverse().map((b,i)=><tr key={i} style={{borderBottom:`1px solid ${P.border}`,background:i%2===0?P.white:P.bg}}>
              <td style={{padding:"10px 12px",color:P.text,fontWeight:500}}>{b.period}</td>
              <td style={{padding:"10px 12px",color:P.textMuted,fontFamily:"monospace",fontSize:11}}>{b.invoice}</td>
              <td style={{padding:"10px 12px",color:P.text,fontWeight:600}}>$ {fmt(b.amount)}</td>
              <td style={{padding:"10px 12px"}}><Label text={b.status==="pagado"?"Pagado":"Pendiente"} bg={b.status==="pagado"?P.lighter:P.accentBg} tx={b.status==="pagado"?P.primary:P.accent}/></td>
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
          <Avatar initials={p.initials} size={48}/>
          <div style={{flex:1,minWidth:150}}>
            <div style={{fontSize:14,fontWeight:700,color:P.text,letterSpacing:"-0.2px",marginBottom:2}}>{p.name}</div>
            <div style={{fontSize:12,color:P.textMuted,marginBottom:4}}>{p.role}</div>
            <Label text={p.area} bg={P.lighter} tx={P.primary}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,minWidth:200}}>
            <a href={`mailto:${p.email}`} style={{fontSize:12,color:P.primary,textDecoration:"none",fontWeight:500}}>{p.email}</a>
            {p.phone&&<span style={{fontSize:12,color:P.textMuted}}>{p.phone}</span>}
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

