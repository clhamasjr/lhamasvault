import { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { supabase } from "./lib/supabase";
import {
  Shield,Key,Building2,Users,Eye,EyeOff,Search,Plus,Edit3,Trash2,
  ChevronDown,ChevronRight,LogOut,LayoutDashboard,FileText,AlertTriangle,
  CheckCircle,Copy,ExternalLink,Filter,RefreshCw,Clock,
  Lock,Bot,Store,UserCheck,X,Check,ChevronLeft,Save,
  Loader2,AlertCircle,Award,Briefcase,Network,UserCog
} from "lucide-react";

const font=`'DM Sans','Segoe UI',system-ui,sans-serif`;
const mono=`'JetBrains Mono','Consolas',monospace`;
const T={bg:"#0C0C0E",bgC:"#141418",bgH:"#1A1A20",bgI:"#1E1E24",bd:"#2A2A32",tx:"#E8E6E1",txM:"#8A8A96",txD:"#5A5A66",ac:"#C9A84C",acD:"#A08530",acB:"rgba(201,168,76,0.08)",dg:"#E24B4A",dgB:"rgba(226,75,74,0.08)",sc:"#4CAF50",scB:"rgba(76,175,80,0.08)",wn:"#EF9F27",wnB:"rgba(239,159,39,0.08)",inf:"#378ADD",inB:"rgba(55,138,221,0.08)"};
const STATUS={amarelo:{l:"Ativo",c:"#EF9F27"},laranja:{l:"Header",c:"#D85A30"},vermelho:{l:"Política",c:"#E24B4A"},verde:{l:"Instabilidade",c:"#639922"},azul_claro:{l:"Padrão",c:"#378ADD"},rosa:{l:"Aprovador",c:"#D4537E"},roxo:{l:"Master",c:"#7F77DD"},azul_bebe:{l:"Robô",c:"#85B7EB"},cinza:{l:"Inativo",c:"#888780"}};

const AuthCtx=createContext(null);
function AuthProvider({children}){
  const[s,setS]=useState(null);const[p,setP]=useState(null);const[ld,setLd]=useState(true);
  useEffect(()=>{supabase.auth.getSession().then(({data:{session}})=>{setS(session);if(session)fp(session.user.id);else setLd(false);});const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setS(session);if(session)fp(session.user.id);else{setP(null);setLd(false);}});return()=>subscription.unsubscribe();},[]);
  async function fp(uid){const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();setP(data);setLd(false);}
  async function signIn(e,pw){const{error}=await supabase.auth.signInWithPassword({email:e,password:pw});if(error)throw error;}
  async function signUp(e,pw,n){const{error}=await supabase.auth.signUp({email:e,password:pw,options:{data:{full_name:n}}});if(error)throw error;}
  async function signOut(){await supabase.auth.signOut();setS(null);setP(null);}
  return<AuthCtx.Provider value={{session:s,profile:p,loading:ld,signIn,signUp,signOut}}>{children}</AuthCtx.Provider>;
}
function useAuth(){return useContext(AuthCtx);}
function useToast(){const[t,setT]=useState(null);const show=useCallback((m,ty="success")=>{setT({m,ty});setTimeout(()=>setT(null),3500);},[]);return{toast:t,show};}
function Toast({toast:t}){if(!t)return null;const c={success:{c:T.sc,I:CheckCircle},error:{c:T.dg,I:AlertCircle},warning:{c:T.wn,I:AlertTriangle}};const s=c[t.ty]||c.success;return<div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:12,background:T.bgC,border:`1px solid ${s.c}30`,boxShadow:"0 12px 40px rgba(0,0,0,0.5)",animation:"slideIn .3s ease",fontSize:13,fontWeight:500,color:s.c}}><s.I size={16}/>{t.m}</div>;}

// UI Components
function Badge({status}){const c=STATUS[status]||STATUS.cinza;return<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,color:c.c,background:`${c.c}15`,border:`1px solid ${c.c}30`,textTransform:"uppercase",whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.c}}/>{c.l}</span>;}
function Flag({on,icon:I,label}){if(!on)return null;return<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:600,color:T.ac,background:T.acB,textTransform:"uppercase"}}><I size={10}/>{label}</span>;}
function Stat({icon:I,label,value,color,bgColor,ld}){return<div style={{background:T.bgC,borderRadius:14,padding:"18px 20px",border:`1px solid ${T.bd}`,flex:"1 1 160px",minWidth:140}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:bgColor||T.acB,color:color||T.ac}}><I size={18}/></div><span style={{fontSize:11,color:T.txM,fontWeight:600,textTransform:"uppercase"}}>{label}</span></div><div style={{fontSize:26,fontWeight:700,color:color||T.tx}}>{ld?<Loader2 size={22} style={{animation:"spin 1s linear infinite"}}/>:value}</div></div>;}
function Btn({children,onClick,variant="default",size="md",icon:I,disabled,loading:ld,style:es}){const sty={primary:{bg:T.ac,c:"#0C0C0E"},danger:{bg:T.dg,c:"#fff"},ghost:{bg:"transparent",c:T.txM},default:{bg:T.bgI,c:T.tx}};const s=sty[variant]||sty.default;const pd=size==="sm"?"6px 12px":size==="lg"?"12px 24px":"8px 16px";const fz=size==="sm"?12:size==="lg"?15:13;return<button onClick={onClick} disabled={disabled||ld} style={{display:"inline-flex",alignItems:"center",gap:6,padding:pd,borderRadius:10,border:`1px solid ${T.bd}`,background:s.bg,color:s.c,fontSize:fz,fontWeight:600,cursor:(disabled||ld)?"not-allowed":"pointer",opacity:(disabled||ld)?0.5:1,fontFamily:font,...es}}>{ld?<Loader2 size={fz} style={{animation:"spin 1s linear infinite"}}/>:I&&<I size={fz}/>}{children}</button>;}
function Inp({label,value,onChange,placeholder,type="text",icon:I,style:es,...props}){return<div style={{display:"flex",flexDirection:"column",gap:6,...es}}>{label&&<label style={{fontSize:12,fontWeight:600,color:T.txM,textTransform:"uppercase"}}>{label}</label>}<div style={{position:"relative"}}>{I&&<I size={16} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.txD}}/>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:I?"10px 14px 10px 38px":"10px 14px",background:T.bgI,border:`1px solid ${T.bd}`,borderRadius:10,color:T.tx,fontSize:14,fontFamily:font,outline:"none",boxSizing:"border-box"}} {...props}/></div></div>;}
function Sel({label,value,onChange,options,placeholder,style:es}){return<div style={{display:"flex",flexDirection:"column",gap:6,...es}}>{label&&<label style={{fontSize:12,fontWeight:600,color:T.txM,textTransform:"uppercase"}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",background:T.bgI,border:`1px solid ${T.bd}`,borderRadius:10,color:value?T.tx:T.txD,fontSize:14,fontFamily:font,outline:"none",cursor:"pointer",boxSizing:"border-box"}}><option value="">{placeholder||"Selecione..."}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;}
function Modal({open,onClose,title,children,width=540}){if(!open)return null;return<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"}}><div onClick={e=>e.stopPropagation()} style={{background:T.bgC,borderRadius:18,border:`1px solid ${T.bd}`,width:"90%",maxWidth:width,maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.5)"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:`1px solid ${T.bd}`}}><h3 style={{fontSize:16,fontWeight:700,color:T.tx,margin:0}}>{title}</h3><button onClick={onClose} style={{background:"none",border:"none",color:T.txM,cursor:"pointer",padding:4,display:"flex"}}><X size={18}/></button></div><div style={{padding:24}}>{children}</div></div></div>;}
function Empty({icon:I,title,desc}){return<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",color:T.txD,textAlign:"center"}}><I size={48} strokeWidth={1} style={{marginBottom:16,opacity:0.4}}/><div style={{fontSize:16,fontWeight:600,color:T.txM,marginBottom:6}}>{title}</div><div style={{fontSize:13}}>{desc}</div></div>;}
function Spinner(){return<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:60}}><Loader2 size={32} color={T.ac} style={{animation:"spin 1s linear infinite"}}/></div>;}
function Chk({label,checked,onChange,color}){return<label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:checked?(color||T.ac):T.txM,fontWeight:500}}><div onClick={()=>onChange(!checked)} style={{width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:checked?(color||T.ac):T.bgI,border:`1.5px solid ${checked?(color||T.ac):T.bd}`,cursor:"pointer"}}>{checked&&<Check size={13} color="#0C0C0E" strokeWidth={3}/>}</div>{label}</label>;}

function PwCell({id,type="bank",showToast}){
  const[vis,setVis]=useState(false);const[pw,setPw]=useState(null);const[ld,setLd]=useState(false);const[cp,setCp]=useState(false);
  const reveal=async()=>{if(vis){setVis(false);return;}setLd(true);try{const fn=type==="promotora"?"reveal_promotora_password":"reveal_password";const{data,error}=await supabase.rpc(fn,{p_credential_id:id});if(error)throw error;setPw(data);setVis(true);}catch(e){showToast?.("Erro: "+e.message,"error");}setLd(false);};
  const copy=()=>{if(pw){navigator.clipboard?.writeText(pw);setCp(true);showToast?.("Copiada!","success");setTimeout(()=>setCp(false),2000);}};
  return<div style={{display:"flex",alignItems:"center",gap:6}}><code style={{fontFamily:mono,fontSize:12,color:vis?T.ac:T.txD,background:vis?T.acB:"transparent",padding:vis?"2px 8px":0,borderRadius:6}}>{vis&&pw?pw:"••••••••"}</code><button onClick={reveal} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:2,display:"flex"}}>{ld?<Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>:vis?<EyeOff size={14}/>:<Eye size={14}/>}</button>{vis&&pw&&<button onClick={copy} style={{background:"none",border:"none",color:cp?T.sc:T.txD,cursor:"pointer",padding:2,display:"flex"}}>{cp?<Check size={14}/>:<Copy size={14}/>}</button>}</div>;
}

// ============================================================
// DASHBOARD
// ============================================================
function DashboardPage({showToast}){
  const[stats,setStats]=useState(null);const[audit,setAudit]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const[st,au]=await Promise.all([supabase.from("dashboard_stats").select("*").single(),supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(10)]);setStats(st.data);setAudit(au.data||[]);setLd(false);}
  const s=stats||{};
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}><div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Dashboard</h2></div><Btn icon={RefreshCw} onClick={load} loading={ld} size="sm">Atualizar</Btn></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:14,marginBottom:28}}>
      <Stat icon={Users} label="Operadores" value={s.total_operators??0} ld={ld}/>
      <Stat icon={Building2} label="Bancos" value={s.total_banks??0} ld={ld}/>
      <Stat icon={Key} label="Cred. Banco" value={s.total_bank_credentials??0} color={T.ac} bgColor={T.acB} ld={ld}/>
      <Stat icon={Briefcase} label="Cred. Promotora" value={s.total_promotora_credentials??0} color="#D4537E" bgColor="rgba(212,83,126,0.08)" ld={ld}/>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:14,marginBottom:28}}>
      <Stat icon={UserCheck} label="Aprovadores" value={s.total_approvers??0} ld={ld}/>
      <Stat icon={Bot} label="Robôs" value={s.total_robots??0} color={T.inf} bgColor={T.inB} ld={ld}/>
      <Stat icon={Store} label="Visão Loja" value={s.total_store_view??0} ld={ld}/>
      <Stat icon={Award} label="Certificados" value={9} ld={ld}/>
    </div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,padding:20}}>
      <h3 style={{fontSize:14,fontWeight:700,color:T.tx,margin:"0 0 16px",display:"flex",alignItems:"center",gap:8}}><FileText size={16} color={T.ac}/>Atividade recente</h3>
      {audit.length===0&&!ld&&<p style={{fontSize:13,color:T.txD,textAlign:"center",padding:20}}>Nenhuma atividade</p>}
      {audit.map(a=><div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.bd}22`}}>
        <div style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:a.action==="view_password"?T.wnB:a.action==="update"?T.inB:T.scB,color:a.action==="view_password"?T.wn:a.action==="update"?T.inf:T.sc}}>{a.action==="view_password"?<Eye size={14}/>:a.action==="update"?<Edit3 size={14}/>:<Plus size={14}/>}</div>
        <div style={{flex:1}}><div style={{fontSize:13,color:T.tx,fontWeight:500}}>{a.action==="view_password"?"Senha visualizada":a.action==="update"?"Senha alterada":"Ação: "+a.action}{a.details?.bank&&<span style={{color:T.ac}}> — {a.details.bank}</span>}</div><div style={{fontSize:11,color:T.txD}}>por <strong>{a.user_email||"sistema"}</strong> · {new Date(a.created_at).toLocaleString("pt-BR")}</div></div>
      </div>)}
    </div>
  </div>;
}

// ============================================================
// BANK CREDENTIALS - Grouped by bank > section, with EDIT
// ============================================================
function BankCredsPage({showToast}){
  const[creds,setCreds]=useState([]);const[banks,setBanks]=useState([]);const[sections,setSections]=useState([]);const[operators,setOps]=useState([]);
  const[ld,setLd]=useState(true);const[search,setSearch]=useState("");const[filterBank,setFB]=useState("");const[showFilters,setSF]=useState(false);
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({operator_id:"",section_id:"",username:"",password:"",status:"amarelo",observation:"",has_store_view:false,is_robot:false,is_approver:false});

  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const[cr,bk,sc,op]=await Promise.all([supabase.from("bank_credentials_view").select("*").order("bank_name").order("section_code").order("username"),supabase.from("banks").select("*").eq("is_active",true).order("name"),supabase.from("bank_sections").select("*").order("display_order"),supabase.from("operators").select("*").eq("is_active",true).order("name")]);setCreds(cr.data||[]);setBanks(bk.data||[]);setSections(sc.data||[]);setOps(op.data||[]);setLd(false);}
  
  const filtered=useMemo(()=>creds.filter(c=>{const q=search.toLowerCase();return(!q||c.username?.toLowerCase().includes(q)||c.operator_name?.toLowerCase().includes(q)||c.bank_name?.toLowerCase().includes(q)||c.section_code?.toLowerCase().includes(q)||c.observation?.toLowerCase().includes(q))&&(!filterBank||c.bank_id===filterBank);}),[creds,search,filterBank]);
  
  const grouped=useMemo(()=>{const g={};filtered.forEach(c=>{const bk=c.bank_short_name||c.bank_name;if(!g[bk])g[bk]={};const sc=c.section_code||"PRINCIPAL";if(!g[bk][sc])g[bk][sc]=[];g[bk][sc].push(c);});return Object.fromEntries(Object.entries(g).sort(([a],[b])=>a.localeCompare(b)));},[filtered]);

  function openEdit(c){setModal("edit");setForm({operator_id:c.operator_id,section_id:c.section_id,username:c.username||"",password:"",status:c.status,observation:c.observation||"",has_store_view:c.has_store_view,is_robot:c.is_robot,is_approver:c.is_approver,_id:c.id});}
  function openNew(){setModal("new");setForm({operator_id:"",section_id:"",username:"",password:"",status:"amarelo",observation:"",has_store_view:false,is_robot:false,is_approver:false});}

  async function handleSave(){
    if(!form.operator_id||!form.section_id||!form.username){showToast("Preencha operador, seção e usuário","error");return;}
    setSaving(true);
    try{
      const payload={operator_id:form.operator_id,section_id:form.section_id,username:form.username,status:form.status,observation:form.observation||null,has_store_view:form.has_store_view,is_robot:form.is_robot,is_approver:form.is_approver};
      if(form.password){const{data:enc}=await supabase.rpc("encrypt_password",{plain_text:form.password});payload.password_encrypted=enc;payload.last_password_update=new Date().toISOString();}
      if(modal==="edit"){const{error}=await supabase.from("bank_credentials").update(payload).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
      else{if(!form.password){showToast("Informe a senha","error");setSaving(false);return;}const{error}=await supabase.from("bank_credentials").insert(payload);if(error)throw error;showToast("Criado!","success");}
      setModal(null);load();
    }catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);
  }

  async function handleDelete(id){if(!confirm("Excluir esta credencial?"))return;const{error}=await supabase.from("bank_credentials").delete().eq("id",id);if(error)showToast("Erro: "+error.message,"error");else{showToast("Removido","success");load();}}

  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Credenciais de banco</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{filtered.length} credenciais</p></div>
      <div style={{display:"flex",gap:8}}><Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn><Btn variant="primary" icon={Plus} onClick={openNew}>Nova</Btn></div>
    </div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,padding:16}}>
      <div style={{display:"flex",gap:10}}><div style={{flex:1}}><Inp value={search} onChange={setSearch} placeholder="Buscar usuário, banco, seção..." icon={Search}/></div><Btn icon={Filter} onClick={()=>setSF(!showFilters)}>Filtros</Btn></div>
      {showFilters&&<div style={{marginTop:14}}><Sel value={filterBank} onChange={setFB} placeholder="Todos os bancos" options={banks.map(b=>({value:b.id,label:b.short_name||b.name}))}/></div>}
    </div>

    {Object.keys(grouped).length===0&&<div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`}}><Empty icon={Key} title="Nenhuma credencial" desc="Altere filtros"/></div>}
    {Object.entries(grouped).map(([bankName,secs])=>(
      <div key={bankName} style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.bd}`,background:T.bgI,display:"flex",alignItems:"center",gap:10}}><Building2 size={16} color={T.ac}/><span style={{fontSize:15,fontWeight:700,color:T.ac}}>{bankName}</span><span style={{fontSize:12,color:T.txD}}>({Object.values(secs).flat().length})</span></div>
        {Object.entries(secs).map(([secCode,items])=>(
          <div key={secCode}>
            {secCode!=="PRINCIPAL"&&<div style={{padding:"8px 18px",background:`${T.ac}08`,borderBottom:`1px solid ${T.bd}22`}}><span style={{fontSize:12,fontWeight:600,color:T.txM,textTransform:"uppercase"}}>{secCode}</span></div>}
            <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{borderBottom:`1px solid ${T.bd}22`}}>{["Usuário","Senha","Status","Observação","Loja","Robô","Aprov.","Atualiz.","Ações"].map((h,i)=><th key={i} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
              <tbody>{items.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${T.bd}11`}} onMouseEnter={e=>e.currentTarget.style.background=T.bgH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"8px 14px"}}><code style={{fontFamily:mono,fontSize:12,color:T.txM,background:T.bgI,padding:"2px 6px",borderRadius:4}}>{c.username}</code></td>
                <td style={{padding:"8px 14px"}}><PwCell id={c.id} type="bank" showToast={showToast}/></td>
                <td style={{padding:"8px 14px"}}><Badge status={c.status}/></td>
                <td style={{padding:"8px 14px",color:T.txD,fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.observation||"—"}</td>
                <td style={{padding:"8px 14px"}}>{c.has_store_view?<span style={{color:T.sc,fontSize:11,fontWeight:600}}>SIM</span>:<span style={{color:T.txD,fontSize:11}}>NÃO</span>}</td>
                <td style={{padding:"8px 14px"}}>{c.is_robot?<span style={{color:T.inf,fontSize:11,fontWeight:600}}>SIM</span>:<span style={{color:T.txD,fontSize:11}}>NÃO</span>}</td>
                <td style={{padding:"8px 14px"}}>{c.is_approver?<span style={{color:"#D4537E",fontSize:11,fontWeight:600}}>SIM</span>:<span style={{color:T.txD,fontSize:11}}>NÃO</span>}</td>
                <td style={{padding:"8px 14px",fontSize:12,color:T.txD,fontFamily:mono}}>{c.last_password_update?new Date(c.last_password_update).toLocaleDateString("pt-BR"):"—"}</td>
                <td style={{padding:"8px 14px"}}><div style={{display:"flex",gap:4}}><button onClick={()=>openEdit(c)} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button><button onClick={()=>handleDelete(c.id)} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:4,display:"flex"}}><Trash2 size={14}/></button></div></td>
              </tr>)}</tbody>
            </table></div>
          </div>
        ))}
      </div>
    ))}

    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar credencial":"Nova credencial"} width={600}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Sel label="Operador" value={form.operator_id} onChange={v=>setForm({...form,operator_id:v})} options={operators.map(o=>({value:o.id,label:o.name}))}/>
          <Sel label="Seção" value={form.section_id} onChange={v=>setForm({...form,section_id:v})} options={sections.map(s=>({value:s.id,label:s.code}))}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Inp label="Usuário/Login" value={form.username} onChange={v=>setForm({...form,username:v})} placeholder="CBS126023"/>
          <Inp label={modal==="edit"?"Nova senha (vazio=manter)":"Senha"} value={form.password} onChange={v=>setForm({...form,password:v})} type="password" placeholder="••••••••"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Sel label="Status" value={form.status} onChange={v=>setForm({...form,status:v})} options={Object.entries(STATUS).map(([k,v])=>({value:k,label:v.l}))}/>
          <Inp label="Observação" value={form.observation} onChange={v=>setForm({...form,observation:v})} placeholder="Notas..."/>
        </div>
        <div style={{display:"flex",gap:20}}>
          <Chk label="Visão Loja" checked={form.has_store_view} onChange={v=>setForm({...form,has_store_view:v})}/>
          <Chk label="Robô" checked={form.is_robot} onChange={v=>setForm({...form,is_robot:v})}/>
          <Chk label="Aprovador" checked={form.is_approver} onChange={v=>setForm({...form,is_approver:v})}/>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${T.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// PROMOTORA CREDENTIALS - with EDIT, senha + contra senha, status
// ============================================================
function PromCredsPage({showToast}){
  const[creds,setCreds]=useState([]);const[proms,setProms]=useState([]);const[ops,setOps]=useState([]);
  const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({promotora_id:"",operator_id:"",login_username:"",password:"",contra_senha:"",person_name:"",sector:"",ramal:"",partner_code:"",is_active:true,status:"ativo"});

  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const[cr,pr,op]=await Promise.all([supabase.from("promotora_credentials_view").select("*").order("promotora_name").order("person_name"),supabase.from("promotoras").select("*").order("name"),supabase.from("operators").select("*").eq("is_active",true).order("name")]);setCreds(cr.data||[]);setProms(pr.data||[]);setOps(op.data||[]);setLd(false);}
  
  const filtered=useMemo(()=>{const q=search.toLowerCase();return creds.filter(c=>!q||c.login_username?.toLowerCase().includes(q)||c.person_name?.toLowerCase().includes(q)||c.promotora_name?.toLowerCase().includes(q)||c.sector?.toLowerCase().includes(q));},[creds,search]);
  const grouped=useMemo(()=>{const g={};filtered.forEach(c=>{const p=c.promotora_name||"Outro";if(!g[p])g[p]=[];g[p].push(c);});return Object.fromEntries(Object.entries(g).sort(([a],[b])=>a.localeCompare(b)));},[filtered]);

  function openEdit(c){setModal("edit");setForm({promotora_id:c.promotora_id,operator_id:c.operator_id||"",login_username:c.login_username,password:"",contra_senha:"",person_name:c.person_name||"",sector:c.sector||"",ramal:c.ramal||"",partner_code:c.partner_code||"",is_active:c.is_active,status:c.status||"ativo",_id:c.id});}
  function openNew(){setModal("new");setForm({promotora_id:"",operator_id:"",login_username:"",password:"",contra_senha:"",person_name:"",sector:"",ramal:"",partner_code:"",is_active:true,status:"ativo"});}

  async function handleSave(){
    if(!form.promotora_id||!form.login_username){showToast("Preencha promotora e login","error");return;}
    setSaving(true);
    try{
      const payload={promotora_id:form.promotora_id,operator_id:form.operator_id||null,login_username:form.login_username,person_name:form.person_name||null,sector:form.sector||null,ramal:form.ramal||null,partner_code:form.partner_code||null,is_active:form.is_active,status:form.status||"ativo"};
      if(form.password){const{data:enc}=await supabase.rpc("encrypt_password",{plain_text:form.password});payload.password_encrypted=enc;payload.last_password_update=new Date().toISOString();}
      if(form.contra_senha){const{data:enc}=await supabase.rpc("encrypt_password",{plain_text:form.contra_senha});payload.contra_senha_encrypted=enc;}
      if(modal==="edit"){const{error}=await supabase.from("promotora_credentials").update(payload).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
      else{if(!form.password){showToast("Informe a senha","error");setSaving(false);return;}const{error}=await supabase.from("promotora_credentials").insert(payload);if(error)throw error;showToast("Criado!","success");}
      setModal(null);load();
    }catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);
  }

  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Credenciais de promotora</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{filtered.length} credenciais</p></div>
      <div style={{display:"flex",gap:8}}><Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn><Btn variant="primary" icon={Plus} onClick={openNew}>Nova</Btn></div>
    </div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar login, pessoa, promotora, setor..." icon={Search}/></div>
    {Object.entries(grouped).map(([pName,items])=>(
      <div key={pName} style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.bd}`,background:T.bgI,display:"flex",alignItems:"center",gap:10}}><Briefcase size={16} color="#D4537E"/><span style={{fontSize:15,fontWeight:700,color:"#D4537E"}}>{pName}</span><span style={{fontSize:12,color:T.txD}}>({items.length})</span></div>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:`1px solid ${T.bd}22`}}>{["Login","Senha","Pessoa","Setor","Cód.Parc","Status","Ativo","Atualiz.","Ações"].map((h,i)=><th key={i} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{items.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${T.bd}11`}} onMouseEnter={e=>e.currentTarget.style.background=T.bgH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <td style={{padding:"8px 14px"}}><code style={{fontFamily:mono,fontSize:11,color:T.txM,background:T.bgI,padding:"2px 6px",borderRadius:4}}>{c.login_username}</code></td>
            <td style={{padding:"8px 14px"}}><PwCell id={c.id} type="promotora" showToast={showToast}/></td>
            <td style={{padding:"8px 14px",color:T.tx,fontWeight:500}}>{c.person_name||"—"}</td>
            <td style={{padding:"8px 14px"}}>{c.sector?<span style={{fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:12,color:c.sector==="MASTER"?T.ac:c.sector==="FINANCEIRO"?T.wn:c.sector==="CONTRA SENHA"?T.dg:T.txM,background:c.sector==="MASTER"?T.acB:c.sector==="FINANCEIRO"?T.wnB:c.sector==="CONTRA SENHA"?T.dgB:T.bgI}}>{c.sector}</span>:"—"}</td>
            <td style={{padding:"8px 14px",color:T.txD,fontSize:12,fontFamily:mono}}>{c.partner_code&&c.partner_code!=="---"?c.partner_code:"—"}</td>
            <td style={{padding:"8px 14px"}}><span style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:12,color:T.txM,background:T.bgI}}>{c.status||"ativo"}</span></td>
            <td style={{padding:"8px 14px"}}><span style={{fontSize:10,fontWeight:700,color:c.is_active?T.sc:T.dg}}>{c.is_active?"SIM":"NÃO"}</span></td>
            <td style={{padding:"8px 14px",fontSize:12,color:T.txD}}>{c.last_password_update?new Date(c.last_password_update).toLocaleDateString("pt-BR"):"—"}</td>
            <td style={{padding:"8px 14px"}}><button onClick={()=>openEdit(c)} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button></td>
          </tr>)}</tbody>
        </table></div>
      </div>
    ))}
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar credencial":"Nova credencial"} width={600}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Sel label="Promotora" value={form.promotora_id} onChange={v=>setForm({...form,promotora_id:v})} options={proms.map(p=>({value:p.id,label:p.name}))}/>
          <Sel label="Operador" value={form.operator_id} onChange={v=>setForm({...form,operator_id:v})} options={[{value:"",label:"—"},...ops.map(o=>({value:o.id,label:o.name}))]}/>
        </div>
        <Inp label="Login/Usuário" value={form.login_username} onChange={v=>setForm({...form,login_username:v})} placeholder="000793master"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Inp label={modal==="edit"?"Nova senha (vazio=manter)":"Senha"} value={form.password} onChange={v=>setForm({...form,password:v})} type="password" placeholder="••••••••"/>
          <Inp label="Contra senha" value={form.contra_senha} onChange={v=>setForm({...form,contra_senha:v})} type="password" placeholder="Contra senha (se houver)"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
          <Inp label="Pessoa" value={form.person_name} onChange={v=>setForm({...form,person_name:v})} placeholder="CARLOS"/>
          <Sel label="Setor" value={form.sector} onChange={v=>setForm({...form,sector:v})} options={["MASTER","OPERACIONAL","FINANCEIRO","VENDAS","CONTRA SENHA","T.I","AUDITORIA","CAIXA EMAIL","USUARIOS","MARKETING"].map(s=>({value:s,label:s}))}/>
          <Inp label="Cód. Parceiro" value={form.partner_code} onChange={v=>setForm({...form,partner_code:v})} placeholder="793"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Inp label="Ramal" value={form.ramal} onChange={v=>setForm({...form,ramal:v})} placeholder="---"/>
          <Sel label="Status" value={form.status} onChange={v=>setForm({...form,status:v})} options={["ativo","inativo","bloqueado","pendente"].map(s=>({value:s,label:s.toUpperCase()}))}/>
        </div>
        <Chk label="Ativo" checked={form.is_active} onChange={v=>setForm({...form,is_active:v})} color={T.sc}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${T.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// MAPA BANCO×PROMOTORA - Editable
// ============================================================
function MapPage({showToast}){
  const[map,setMap]=useState([]);const[proms,setProms]=useState([]);const[ops,setOps]=useState([]);
  const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({operator_id:"",bank_name:"",promotora_id:"",promotora_name:"",notes:""});

  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const[mp,pr,op]=await Promise.all([supabase.from("operator_bank_map_view").select("*").order("operator_name").order("bank_name"),supabase.from("promotoras").select("*").order("name"),supabase.from("operators").select("*").eq("is_active",true).order("name")]);setMap(mp.data||[]);setProms(pr.data||[]);setOps(op.data||[]);setLd(false);}
  const filtered=map.filter(m=>{const q=search.toLowerCase();return!q||m.bank_name?.toLowerCase().includes(q)||m.promotora_name?.toLowerCase().includes(q)||m.operator_name?.toLowerCase().includes(q);});
  const grouped=useMemo(()=>{const g={};filtered.forEach(m=>{const op=m.operator_name;if(!g[op])g[op]=[];g[op].push(m);});return g;},[filtered]);

  function openEdit(m){setModal("edit");setForm({operator_id:m.operator_id,bank_name:m.bank_name,promotora_id:m.promotora_id||"",promotora_name:m.promotora_name||"",notes:m.notes||"",_id:m.id});}
  function openNew(){setModal("new");setForm({operator_id:"",bank_name:"",promotora_id:"",promotora_name:"",notes:""});}

  async function handleSave(){
    if(!form.operator_id||!form.bank_name){showToast("Preencha operador e banco","error");return;}
    setSaving(true);
    try{
      const prom=proms.find(p=>p.id===form.promotora_id);
      const payload={operator_id:form.operator_id,bank_name:form.bank_name,promotora_id:form.promotora_id||null,promotora_name:prom?.name||form.promotora_name||null,notes:form.notes||null};
      if(modal==="edit"){const{error}=await supabase.from("operator_bank_map").update(payload).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
      else{const{error}=await supabase.from("operator_bank_map").insert(payload);if(error)throw error;showToast("Criado!","success");}
      setModal(null);load();
    }catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);
  }

  async function handleDelete(id){if(!confirm("Excluir mapeamento?"))return;const{error}=await supabase.from("operator_bank_map").delete().eq("id",id);if(error)showToast("Erro","error");else{showToast("Removido","success");load();}}

  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Mapa banco × promotora</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{map.length} mapeamentos</p></div>
      <div style={{display:"flex",gap:8}}><Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn><Btn variant="primary" icon={Plus} onClick={openNew}>Novo</Btn></div>
    </div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar banco, promotora, operador..." icon={Search}/></div>
    {Object.entries(grouped).map(([opName,items])=>(
      <div key={opName} style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.bd}`,background:T.bgI,display:"flex",alignItems:"center",gap:8}}><Users size={16} color={T.ac}/><span style={{fontSize:14,fontWeight:700,color:T.tx}}>{opName}</span><span style={{fontSize:12,color:T.txD}}>({items.length})</span></div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <tbody>{items.map(m=><tr key={m.id} style={{borderBottom:`1px solid ${T.bd}11`}} onMouseEnter={e=>e.currentTarget.style.background=T.bgH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <td style={{padding:"10px 18px",color:T.tx,fontWeight:500,width:"40%"}}>{m.bank_name}</td>
            <td style={{padding:"10px 14px"}}><span style={{fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:12,color:T.ac,background:T.acB}}>{m.promotora_name}</span></td>
            <td style={{padding:"10px 14px",textAlign:"right"}}><div style={{display:"flex",gap:4,justifyContent:"flex-end"}}><button onClick={()=>openEdit(m)} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button><button onClick={()=>handleDelete(m.id)} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:4,display:"flex"}}><Trash2 size={14}/></button></div></td>
          </tr>)}</tbody>
        </table>
      </div>
    ))}
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar mapeamento":"Novo mapeamento"} width={500}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Sel label="Operador" value={form.operator_id} onChange={v=>setForm({...form,operator_id:v})} options={ops.map(o=>({value:o.id,label:o.name}))}/>
        <Inp label="Banco" value={form.bank_name} onChange={v=>setForm({...form,bank_name:v})} placeholder="AGIBANK, C6 BANK..."/>
        <Sel label="Promotora" value={form.promotora_id} onChange={v=>setForm({...form,promotora_id:v})} options={proms.map(p=>({value:p.id,label:p.name}))}/>
        <Inp label="Notas" value={form.notes} onChange={v=>setForm({...form,notes:v})} placeholder="Observações..."/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${T.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// OPERADORES - with CRUD
// ============================================================
function OperatorsPage({showToast}){
  const[ops,setOps]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({name:"",email:"",code:"",cpf:"",phone:"",is_active:true,notes:""});
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("operators").select("*").order("name");setOps(data||[]);setLd(false);}
  const filtered=ops.filter(o=>{const q=search.toLowerCase();return!q||o.name?.toLowerCase().includes(q)||o.email?.toLowerCase().includes(q)||o.code?.includes(q);});
  function openEdit(op){setModal("edit");setForm({name:op.name,email:op.email||"",code:op.code||"",cpf:op.cpf||"",phone:op.phone||"",is_active:op.is_active,notes:op.notes||"",_id:op.id});}
  function openNew(){setModal("new");setForm({name:"",email:"",code:"",cpf:"",phone:"",is_active:true,notes:""});}
  async function handleSave(){
    if(!form.name){showToast("Nome obrigatório","error");return;}setSaving(true);
    try{const p={name:form.name,email:form.email||null,code:form.code||null,cpf:form.cpf||null,phone:form.phone||null,is_active:form.is_active,notes:form.notes||null};
    if(modal==="edit"){const{error}=await supabase.from("operators").update(p).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
    else{const{error}=await supabase.from("operators").insert(p);if(error)throw error;showToast("Criado!","success");}
    setModal(null);load();}catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);
  }
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Operadores</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{ops.filter(o=>o.is_active).length} ativos de {ops.length}</p></div>
      <Btn variant="primary" icon={Plus} onClick={openNew}>Novo operador</Btn>
    </div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar nome, email, código..." icon={Search}/></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
      {filtered.map(op=><div key={op.id} style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,padding:20,opacity:op.is_active?1:0.5}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:40,height:40,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:T.ac,background:T.acB}}>{op.name.charAt(0)}</div>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:T.tx}}>{op.name}</div><div style={{fontSize:12,color:T.txD}}>{op.email||"—"}</div></div>
          {!op.is_active&&<span style={{fontSize:10,fontWeight:700,color:T.dg,background:T.dgB,padding:"3px 8px",borderRadius:12}}>INATIVO</span>}
        </div>
        <div style={{display:"flex",gap:16,fontSize:12,color:T.txM,marginBottom:12}}>{op.code&&<span>Código: <strong style={{color:T.tx}}>{op.code}</strong></span>}{op.cpf&&<span>CPF: <strong style={{color:T.tx}}>{op.cpf}</strong></span>}</div>
        <Btn size="sm" icon={Edit3} onClick={()=>openEdit(op)}>Editar</Btn>
      </div>)}
    </div>
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar operador":"Novo operador"} width={500}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Inp label="Nome" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Nome completo"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="email@..."/><Inp label="Telefone" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="(15) 99999-0000"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Código" value={form.code} onChange={v=>setForm({...form,code:v})} placeholder="0793"/><Inp label="CPF" value={form.cpf} onChange={v=>setForm({...form,cpf:v})} placeholder="000.000.000-00"/></div>
        <Chk label="Operador ativo" checked={form.is_active} onChange={v=>setForm({...form,is_active:v})} color={T.sc}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${T.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// BANCOS - alphabetical, separated SUB vs Direct, with EDIT
// ============================================================
function BanksPage({showToast}){
  const[banks,setBanks]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({name:"",short_name:"",url:"",default_promotora:"",is_active:true});
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("banks").select("*").order("name");setBanks(data||[]);setLd(false);}
  const filtered=banks.filter(b=>{const q=search.toLowerCase();return!q||b.name?.toLowerCase().includes(q)||b.short_name?.toLowerCase().includes(q);});
  const subs=filtered.filter(b=>b.name?.startsWith("SUB ")).sort((a,b)=>a.name.localeCompare(b.name));
  const directs=filtered.filter(b=>!b.name?.startsWith("SUB ")).sort((a,b)=>a.name.localeCompare(b.name));
  
  function openEdit(b){setModal("edit");setForm({name:b.name,short_name:b.short_name||"",url:b.url||"",default_promotora:b.default_promotora||"",is_active:b.is_active,_id:b.id});}
  function openNew(){setModal("new");setForm({name:"",short_name:"",url:"",default_promotora:"",is_active:true});}
  async function handleSave(){
    if(!form.name){showToast("Nome obrigatório","error");return;}setSaving(true);
    try{const p={name:form.name,short_name:form.short_name||null,url:form.url||null,default_promotora:form.default_promotora||null,is_active:form.is_active};
    if(modal==="edit"){const{error}=await supabase.from("banks").update(p).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
    else{const{error}=await supabase.from("banks").insert(p);if(error)throw error;showToast("Criado!","success");}
    setModal(null);load();}catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);
  }

  const renderTable=(list,title,color)=><div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,overflow:"hidden"}}>
    <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.bd}`,background:T.bgI}}><span style={{fontSize:13,fontWeight:700,color}}>{title} ({list.length})</span></div>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><tbody>{list.map(b=><tr key={b.id} style={{borderBottom:`1px solid ${T.bd}11`}} onMouseEnter={e=>e.currentTarget.style.background=T.bgH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <td style={{padding:"10px 14px",color:T.tx,fontWeight:500}}>{b.name}</td>
      <td style={{padding:"10px 14px"}}><code style={{fontFamily:mono,fontSize:12,color:T.ac,background:T.acB,padding:"2px 6px",borderRadius:4}}>{b.short_name||"—"}</code></td>
      <td style={{padding:"10px 14px",color:T.txM,fontSize:12}}>{b.default_promotora||"—"}</td>
      <td style={{padding:"10px 14px"}}>{b.url?<a href={b.url} target="_blank" rel="noopener noreferrer" style={{color:T.inf,fontSize:12,display:"flex",alignItems:"center",gap:4}}><ExternalLink size={12}/>Acessar</a>:"—"}</td>
      <td style={{padding:"10px 14px"}}><button onClick={()=>openEdit(b)} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button></td>
    </tr>)}</tbody></table></div>;

  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Bancos e sistemas</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{banks.length} cadastrados</p></div>
      <Btn variant="primary" icon={Plus} onClick={openNew}>Novo banco</Btn>
    </div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar banco..." icon={Search}/></div>
    {renderTable(subs,"Via promotora (SUB)",T.ac)}
    {renderTable(directs,"Acesso direto",T.inf)}
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar banco":"Novo banco"} width={500}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Nome" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="SUB SAFRA"/><Inp label="Nome curto" value={form.short_name} onChange={v=>setForm({...form,short_name:v})} placeholder="SAFRA"/></div>
        <Inp label="URL" value={form.url} onChange={v=>setForm({...form,url:v})} placeholder="https://..."/>
        <Inp label="Promotora padrão" value={form.default_promotora} onChange={v=>setForm({...form,default_promotora:v})} placeholder="LEWE..."/>
        <Chk label="Banco ativo" checked={form.is_active} onChange={v=>setForm({...form,is_active:v})} color={T.sc}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${T.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// CERTIFICADOS - with EDIT
// ============================================================
function CertsPage({showToast}){
  const[certs,setCerts]=useState([]);const[ld,setLd]=useState(true);
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({operator_name:"",cpf:"",cert_number:"",aneps_code:"",aneps_expiry:"",has_pldft:false,pldft_expiry:"",password:"",has_document:false});
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("certificates").select("*").order("operator_name");setCerts(data||[]);setLd(false);}
  function openEdit(c){setModal("edit");setForm({operator_name:c.operator_name,cpf:c.cpf||"",cert_number:c.cert_number||"",aneps_code:c.aneps_code||"",aneps_expiry:c.aneps_expiry?c.aneps_expiry.split("T")[0]:"",has_pldft:c.has_pldft,pldft_expiry:c.pldft_expiry?c.pldft_expiry.split("T")[0]:"",password:"",has_document:c.has_document,_id:c.id});}
  function openNew(){setModal("new");setForm({operator_name:"",cpf:"",cert_number:"",aneps_code:"",aneps_expiry:"",has_pldft:false,pldft_expiry:"",password:"",has_document:false});}
  async function handleSave(){
    if(!form.operator_name){showToast("Nome obrigatório","error");return;}setSaving(true);
    try{const p={operator_name:form.operator_name,cpf:form.cpf||null,cert_number:form.cert_number||null,aneps_code:form.aneps_code||null,aneps_expiry:form.aneps_expiry||null,has_pldft:form.has_pldft,pldft_expiry:form.pldft_expiry||null,has_document:form.has_document};
    if(form.password){const{data:enc}=await supabase.rpc("encrypt_password",{plain_text:form.password});p.password_encrypted=enc;}
    if(modal==="edit"){const{error}=await supabase.from("certificates").update(p).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
    else{const{error}=await supabase.from("certificates").insert(p);if(error)throw error;showToast("Criado!","success");}
    setModal(null);load();}catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);
  }
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Certificados</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{certs.length} cadastrados</p></div>
      <Btn variant="primary" icon={Plus} onClick={openNew}>Novo certificado</Btn>
    </div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,overflow:"hidden"}}>
      {certs.length===0?<Empty icon={Award} title="Nenhum certificado" desc=""/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:`1px solid ${T.bd}`}}>{["Nome","CPF","Nº Cert.","ANEPS","Val. ANEPS","PLDFT","Val. PLDFT","Doc","Ações"].map((h,i)=><th key={i} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{certs.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${T.bd}11`}}>
          <td style={{padding:"10px 14px",color:T.tx,fontWeight:500,fontSize:12}}>{c.operator_name}</td>
          <td style={{padding:"10px 14px",fontFamily:mono,fontSize:11,color:T.txM}}>{c.cpf}</td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txM}}>{c.cert_number||"—"}</td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txM}}>{c.aneps_code||"—"}</td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txM}}>{c.aneps_expiry?new Date(c.aneps_expiry).toLocaleDateString("pt-BR"):"—"}</td>
          <td style={{padding:"10px 14px"}}>{c.has_pldft?<span style={{color:T.sc,fontSize:11,fontWeight:600}}>SIM</span>:<span style={{color:T.txD,fontSize:11}}>NÃO</span>}</td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txM}}>{c.pldft_expiry?new Date(c.pldft_expiry).toLocaleDateString("pt-BR"):"—"}</td>
          <td style={{padding:"10px 14px"}}>{c.has_document?<Check size={14} color={T.sc}/>:<X size={14} color={T.txD}/>}</td>
          <td style={{padding:"10px 14px"}}><button onClick={()=>openEdit(c)} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button></td>
        </tr>)}</tbody>
      </table>}
    </div>
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar certificado":"Novo certificado"} width={560}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Nome completo" value={form.operator_name} onChange={v=>setForm({...form,operator_name:v})} placeholder="CARLOS AURELIO..."/><Inp label="CPF" value={form.cpf} onChange={v=>setForm({...form,cpf:v})} placeholder="331.178.768-47"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Nº Certificado" value={form.cert_number} onChange={v=>setForm({...form,cert_number:v})} placeholder="8291019058..."/><Inp label="ANEPS/FEBRABAN" value={form.aneps_code} onChange={v=>setForm({...form,aneps_code:v})} placeholder="Fbb100"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Validade ANEPS" value={form.aneps_expiry} onChange={v=>setForm({...form,aneps_expiry:v})} type="date"/><Inp label="Validade PLDFT" value={form.pldft_expiry} onChange={v=>setForm({...form,pldft_expiry:v})} type="date"/></div>
        <Inp label={modal==="edit"?"Nova senha (vazio=manter)":"Senha"} value={form.password} onChange={v=>setForm({...form,password:v})} type="password" placeholder="••••••••"/>
        <div style={{display:"flex",gap:20}}><Chk label="PLDFT" checked={form.has_pldft} onChange={v=>setForm({...form,has_pldft:v})}/><Chk label="Documento entregue" checked={form.has_document} onChange={v=>setForm({...form,has_document:v})}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${T.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// USERS MANAGEMENT
// ============================================================
function UsersPage({showToast}){
  const[profiles,setProfiles]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("profiles").select("*").order("created_at",{ascending:false});setProfiles(data||[]);setLd(false);}
  async function changeRole(id,role){const{error}=await supabase.from("profiles").update({role}).eq("id",id);if(error)showToast("Erro: "+error.message,"error");else{showToast("Role atualizada!","success");load();}}
  async function toggleActive(id,active){const{error}=await supabase.from("profiles").update({is_active:!active}).eq("id",id);if(error)showToast("Erro","error");else{showToast("Status atualizado!","success");load();}}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Usuários do sistema</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{profiles.length} usuários (contas criadas pelo login)</p></div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,overflow:"hidden"}}>
      {profiles.length===0?<Empty icon={UserCog} title="Nenhum usuário" desc="Crie contas pela tela de login"/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:`1px solid ${T.bd}`}}>{["Nome","Email","Role","Status","Criado","Ações"].map((h,i)=><th key={i} style={{padding:"12px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{profiles.map(p=><tr key={p.id} style={{borderBottom:`1px solid ${T.bd}11`}}>
          <td style={{padding:"10px 14px",color:T.tx,fontWeight:500}}>{p.full_name}</td>
          <td style={{padding:"10px 14px",fontFamily:mono,fontSize:12,color:T.txM}}>{p.email}</td>
          <td style={{padding:"10px 14px"}}><select value={p.role} onChange={e=>changeRole(p.id,e.target.value)} style={{background:T.bgI,border:`1px solid ${T.bd}`,borderRadius:8,color:T.tx,padding:"4px 8px",fontSize:12,fontFamily:font,cursor:"pointer"}}><option value="admin">Admin</option><option value="supervisor">Supervisor</option><option value="operator">Operador</option></select></td>
          <td style={{padding:"10px 14px"}}><span style={{fontSize:10,fontWeight:700,color:p.is_active?T.sc:T.dg,background:p.is_active?T.scB:T.dgB,padding:"3px 8px",borderRadius:12}}>{p.is_active?"ATIVO":"INATIVO"}</span></td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txD}}>{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
          <td style={{padding:"10px 14px"}}><Btn size="sm" onClick={()=>toggleActive(p.id,p.is_active)}>{p.is_active?"Desativar":"Ativar"}</Btn></td>
        </tr>)}</tbody>
      </table>}
    </div>
  </div>;
}

// ============================================================
// AUDIT
// ============================================================
function AuditPage(){
  const[logs,setLogs]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(200);setLogs(data||[]);setLd(false);}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Auditoria</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{logs.length} registros</p></div>
      <Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn>
    </div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,overflow:"hidden"}}>
      {logs.length===0?<Empty icon={FileText} title="Nenhum registro" desc="Ações serão registradas aqui"/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:`1px solid ${T.bd}`}}>{["Data/Hora","Quem","Ação","Tipo","Detalhes"].map((h,i)=><th key={i} style={{padding:"12px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{logs.map(a=><tr key={a.id} style={{borderBottom:`1px solid ${T.bd}11`}}>
          <td style={{padding:"10px 14px",color:T.txD,fontSize:12,fontFamily:mono}}>{new Date(a.created_at).toLocaleString("pt-BR")}</td>
          <td style={{padding:"10px 14px",color:T.tx,fontWeight:500,fontSize:12}}>{a.user_email||"sistema"}</td>
          <td style={{padding:"10px 14px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,textTransform:"uppercase",color:a.action==="view_password"?T.wn:a.action==="update"?T.inf:T.sc,background:a.action==="view_password"?T.wnB:a.action==="update"?T.inB:T.scB}}>{a.action==="view_password"?"Senha visualizada":a.action}</span></td>
          <td style={{padding:"10px 14px",color:T.txM,fontSize:12}}>{a.entity_type}</td>
          <td style={{padding:"10px 14px",color:T.txD,fontSize:12}}>{a.details&&typeof a.details==='object'?JSON.stringify(a.details).slice(0,80):"—"}</td>
        </tr>)}</tbody>
      </table>}
    </div>
  </div>;
}

// ============================================================
// LOGIN
// ============================================================
function LoginPage(){
  const{signIn,signUp}=useAuth();const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[name,setName]=useState("");
  const[isUp,setIsUp]=useState(false);const[ld,setLd]=useState(false);const[err,setErr]=useState("");
  async function go(){if(!email||!pw){setErr("Preencha email e senha");return;}setLd(true);setErr("");try{if(isUp){await signUp(email,pw,name);setIsUp(false);alert("Conta criada! Faça login.");}else{await signIn(email,pw);}}catch(e){setErr(e.message==="Invalid login credentials"?"Email ou senha incorretos":e.message);}setLd(false);}
  return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:font}}>
    <div style={{width:420,background:T.bgC,borderRadius:20,border:`1px solid ${T.bd}`,padding:"40px 36px",boxShadow:"0 24px 80px rgba(0,0,0,0.4)"}}>
      <div style={{textAlign:"center",marginBottom:32}}><div style={{width:56,height:56,borderRadius:16,margin:"0 auto 16px",background:`linear-gradient(135deg,${T.ac},${T.acD})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={28} color="#0C0C0E"/></div><h1 style={{fontSize:22,fontWeight:800,color:T.tx,margin:"0 0 6px"}}>LhamasCred Vault</h1><p style={{fontSize:13,color:T.txM,margin:0}}>Central de credenciais bancárias</p></div>
      {err&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,background:T.dgB,border:`1px solid ${T.dg}30`,marginBottom:16,fontSize:13,color:T.dg}}><AlertCircle size={16}/>{err}</div>}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {isUp&&<Inp label="Nome" value={name} onChange={setName} placeholder="Carlos Lhamas" icon={Users}/>}
        <Inp label="Email" value={email} onChange={setEmail} placeholder="carlos@lhamascred.com.br" icon={Users}/>
        <Inp label="Senha" value={pw} onChange={setPw} placeholder="••••••••" type="password" icon={Lock} onKeyDown={e=>e.key==="Enter"&&go()}/>
        <Btn variant="primary" size="lg" onClick={go} loading={ld} style={{width:"100%",justifyContent:"center",marginTop:8,borderRadius:12,padding:"14px 20px",fontSize:15}}>{isUp?"Criar conta":"Entrar"}</Btn>
      </div>
      <div style={{textAlign:"center",marginTop:20}}><button onClick={()=>{setIsUp(!isUp);setErr("");}} style={{background:"none",border:"none",color:T.ac,cursor:"pointer",fontSize:13,fontFamily:font,fontWeight:500}}>{isUp?"Já tem conta? Login":"Criar nova conta"}</button></div>
    </div>
  </div>;
}

// ============================================================
// NAV + LAYOUT
// ============================================================
const NAV=[
  {id:"dashboard",l:"Dashboard",i:LayoutDashboard},
  {id:"bank_creds",l:"Bancos",i:Key},
  {id:"prom_creds",l:"Promotoras",i:Briefcase},
  {id:"map",l:"Mapa",i:Network},
  {id:"operators",l:"Operadores",i:Users},
  {id:"banks_list",l:"Lista Bancos",i:Building2},
  {id:"certificates",l:"Certificados",i:Award},
  {id:"users",l:"Usuários",i:UserCog},
  {id:"audit",l:"Auditoria",i:FileText},
];

function AppLayout(){
  const{profile,signOut}=useAuth();const[page,setPage]=useState("dashboard");const[col,setCol]=useState(false);const{toast,show}=useToast();
  const render=()=>{switch(page){case"dashboard":return<DashboardPage showToast={show}/>;case"bank_creds":return<BankCredsPage showToast={show}/>;case"prom_creds":return<PromCredsPage showToast={show}/>;case"map":return<MapPage showToast={show}/>;case"operators":return<OperatorsPage showToast={show}/>;case"banks_list":return<BanksPage showToast={show}/>;case"certificates":return<CertsPage showToast={show}/>;case"users":return<UsersPage showToast={show}/>;case"audit":return<AuditPage/>;default:return<DashboardPage showToast={show}/>;}};
  return<div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:font,color:T.tx}}>
    <Toast toast={toast}/>
    <div style={{width:col?68:220,background:T.bgC,borderRight:`1px solid ${T.bd}`,display:"flex",flexDirection:"column",transition:"width .2s",flexShrink:0}}>
      <div style={{padding:col?"20px 12px":"20px 16px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:`linear-gradient(135deg,${T.ac},${T.acD})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={18} color="#0C0C0E"/></div>{!col&&<div><div style={{fontSize:14,fontWeight:800}}>LhamasCred</div><div style={{fontSize:10,color:T.txD,fontWeight:600,textTransform:"uppercase"}}>Vault</div></div>}</div>
      <nav style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>{NAV.map(n=>{const a=page===n.id;return<button key={n.id} onClick={()=>setPage(n.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:10,border:"none",cursor:"pointer",background:a?T.acB:"transparent",color:a?T.ac:T.txM,fontSize:12,fontWeight:a?600:500,fontFamily:font,marginBottom:2,justifyContent:col?"center":"flex-start"}}><n.i size={16}/>{!col&&n.l}</button>;})}</nav>
      <div style={{padding:"8px 6px",borderTop:`1px solid ${T.bd}`}}>
        <button onClick={()=>setCol(!col)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",borderRadius:10,border:"none",background:"transparent",color:T.txD,cursor:"pointer",fontSize:12,fontFamily:font,justifyContent:col?"center":"flex-start"}}>{col?<ChevronRight size={16}/>:<><ChevronLeft size={16}/>Recolher</>}</button>
        <button onClick={signOut} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",borderRadius:10,border:"none",background:"transparent",color:T.txD,cursor:"pointer",fontSize:12,fontFamily:font,justifyContent:col?"center":"flex-start",marginTop:2}}><LogOut size={16}/>{!col&&"Sair"}</button>
      </div>
    </div>
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{padding:"12px 24px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bgC}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:T.txD}}><Shield size={14} color={T.ac}/><span>Central bancária</span><span style={{color:T.bd}}>·</span><span style={{color:T.ac,fontWeight:600}}>{NAV.find(n=>n.id===page)?.l}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{textAlign:"right"}}><div style={{fontSize:12,color:T.tx,fontWeight:500}}>{profile?.full_name||"Usuário"}</div><div style={{fontSize:10,color:T.txD,textTransform:"uppercase"}}>{profile?.role||"operator"}</div></div><div style={{width:32,height:32,borderRadius:10,background:T.acB,color:T.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>{(profile?.full_name||"U").charAt(0)}</div></div>
      </div>
      <div style={{padding:24}}>{render()}</div>
    </div>
  </div>;
}

export default function App(){return<><style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style><AuthProvider><AppInner/></AuthProvider></>;}
function AppInner(){const{session,loading}=useAuth();if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:font}}><Loader2 size={32} color={T.ac} style={{animation:"spin 1s linear infinite"}}/></div>;return session?<AppLayout/>:<LoginPage/>;}
