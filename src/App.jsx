import{useState,useEffect,useCallback,useMemo,createContext,useContext}from"react";
import{supabase}from"./lib/supabase";
import{Shield,Key,Building2,Users,Eye,EyeOff,Search,Plus,Edit3,Trash2,ChevronDown,ChevronRight,LogOut,LayoutDashboard,FileText,AlertTriangle,CheckCircle,Copy,ExternalLink,Filter,RefreshCw,Lock,Bot,Store,UserCheck,X,Check,ChevronLeft,Save,Loader2,AlertCircle,Award,Briefcase,UserCog,Network}from"lucide-react";

const mono=`'JetBrains Mono',monospace`;
const C={bg:"#F7F8FA",card:"#FFFFFF",tx:"#1A1D26",txM:"#6B7280",txD:"#9CA3AF",bd:"#E5E7EB",bdL:"#F3F4F6",ac:"#2563EB",acB:"#EFF6FF",acD:"#1D4ED8",brand:"#B45309",brandB:"#FFFBEB",sc:"#059669",scB:"#ECFDF5",dg:"#DC2626",dgB:"#FEF2F2",wn:"#D97706",wnB:"#FFFBEB",bgI:"#F9FAFB",hover:"#F3F4F6"};
const STATUS={amarelo:{l:"Ativo",c:"#D97706",b:"#FFFBEB"},laranja:{l:"Header",c:"#EA580C",b:"#FFF7ED"},vermelho:{l:"Política",c:"#DC2626",b:"#FEF2F2"},verde:{l:"Instável",c:"#059669",b:"#ECFDF5"},azul_claro:{l:"Padrão",c:"#2563EB",b:"#EFF6FF"},rosa:{l:"Aprovador",c:"#DB2777",b:"#FDF2F8"},roxo:{l:"Master",c:"#7C3AED",b:"#F5F3FF"},azul_bebe:{l:"Robô",c:"#0891B2",b:"#ECFEFF"},cinza:{l:"Inativo",c:"#6B7280",b:"#F3F4F6"}};

// Auth
const AuthCtx=createContext(null);
function AuthProv({children}){const[s,setS]=useState(null);const[p,setP]=useState(null);const[ld,setLd]=useState(true);
useEffect(()=>{supabase.auth.getSession().then(({data:{session}})=>{setS(session);if(session)fp(session.user.id);else setLd(false);});const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setS(session);if(session)fp(session.user.id);else{setP(null);setLd(false);}});return()=>subscription.unsubscribe();},[]);
async function fp(uid){const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();setP(data);setLd(false);}
async function signIn(e,pw){const{error}=await supabase.auth.signInWithPassword({email:e,password:pw});if(error)throw error;}
async function signUp(e,pw,n){const{error}=await supabase.auth.signUp({email:e,password:pw,options:{data:{full_name:n}}});if(error)throw error;}
async function signOut(){await supabase.auth.signOut();setS(null);setP(null);}
return<AuthCtx.Provider value={{session:s,profile:p,loading:ld,signIn,signUp,signOut}}>{children}</AuthCtx.Provider>;}
function useAuth(){return useContext(AuthCtx);}
function useToast(){const[t,setT]=useState(null);const show=useCallback((m,ty="success")=>{setT({m,ty});setTimeout(()=>setT(null),3500);},[]);return{toast:t,show};}
function Toast({toast:t}){if(!t)return null;const colors={success:{c:C.sc,bg:C.scB},error:{c:C.dg,bg:C.dgB},warning:{c:C.wn,bg:C.wnB}};const s=colors[t.ty]||colors.success;return<div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",alignItems:"center",gap:10,padding:"12px 20px",borderRadius:12,background:s.bg,border:`1px solid ${s.c}30`,boxShadow:"0 4px 24px rgba(0,0,0,0.08)",animation:"slideIn .3s ease",fontSize:13,fontWeight:600,color:s.c}}>{t.m}</div>;}

// UI
function Badge({status}){const c=STATUS[status]||STATUS.cinza;return<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,color:c.c,background:c.b,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.c}}/>{c.l}</span>;}
function Stat({icon:I,label,value,color,ld}){return<div style={{background:C.card,borderRadius:16,padding:"20px 22px",border:`1px solid ${C.bd}`,flex:"1 1 160px",minWidth:140,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{width:38,height:38,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:color?`${color}15`:C.acB,color:color||C.ac}}><I size={18}/></div><span style={{fontSize:11,color:C.txM,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</span></div><div style={{fontSize:28,fontWeight:800,color:color||C.tx}}>{ld?<Loader2 size={22} style={{animation:"spin 1s linear infinite"}}/>:value}</div></div>;}
function Btn({children,onClick,variant="default",size="md",icon:I,disabled,loading:ld,style:es}){const sty={primary:{bg:C.ac,c:"#fff",bd:C.ac},danger:{bg:C.dg,c:"#fff",bd:C.dg},ghost:{bg:"transparent",c:C.txM,bd:"transparent"},default:{bg:C.card,c:C.tx,bd:C.bd}};const s=sty[variant]||sty.default;const pd=size==="sm"?"6px 14px":size==="lg"?"12px 28px":"8px 18px";const fz=size==="sm"?12:size==="lg"?15:13;return<button onClick={onClick} disabled={disabled||ld} style={{display:"inline-flex",alignItems:"center",gap:6,padding:pd,borderRadius:10,border:`1px solid ${s.bd}`,background:s.bg,color:s.c,fontSize:fz,fontWeight:600,cursor:(disabled||ld)?"not-allowed":"pointer",opacity:(disabled||ld)?0.5:1,boxShadow:variant==="default"?"0 1px 2px rgba(0,0,0,0.05)":"none",...es}}>{ld?<Loader2 size={fz} style={{animation:"spin 1s linear infinite"}}/>:I&&<I size={fz}/>}{children}</button>;}
function Inp({label,value,onChange,placeholder,type="text",icon:I,style:es,...props}){return<div style={{display:"flex",flexDirection:"column",gap:6,...es}}>{label&&<label style={{fontSize:12,fontWeight:600,color:C.txM,textTransform:"uppercase",letterSpacing:"0.04em"}}>{label}</label>}<div style={{position:"relative"}}>{I&&<I size={16} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.txD}}/>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:I?"10px 14px 10px 40px":"10px 14px",background:C.card,border:`1px solid ${C.bd}`,borderRadius:10,color:C.tx,fontSize:14,outline:"none",boxSizing:"border-box"}} {...props}/></div></div>;}
function Sel({label,value,onChange,options,placeholder,style:es}){return<div style={{display:"flex",flexDirection:"column",gap:6,...es}}>{label&&<label style={{fontSize:12,fontWeight:600,color:C.txM,textTransform:"uppercase",letterSpacing:"0.04em"}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",background:C.card,border:`1px solid ${C.bd}`,borderRadius:10,color:value?C.tx:C.txD,fontSize:14,outline:"none",cursor:"pointer",boxSizing:"border-box"}}><option value="">{placeholder||"Selecione..."}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;}
function Modal({open,onClose,title,children,width=540}){if(!open)return null;return<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(2px)"}}><div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:20,border:`1px solid ${C.bd}`,width:"90%",maxWidth:width,maxHeight:"85vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.12)"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:`1px solid ${C.bd}`}}><h3 style={{fontSize:16,fontWeight:700,color:C.tx,margin:0}}>{title}</h3><button onClick={onClose} style={{background:"none",border:"none",color:C.txM,cursor:"pointer",padding:4,display:"flex"}}><X size={18}/></button></div><div style={{padding:24}}>{children}</div></div></div>;}
function Empty({icon:I,title,desc}){return<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",color:C.txD,textAlign:"center"}}><I size={48} strokeWidth={1} style={{marginBottom:16,opacity:0.3}}/><div style={{fontSize:16,fontWeight:600,color:C.txM,marginBottom:4}}>{title}</div><div style={{fontSize:13}}>{desc}</div></div>;}
function Spinner(){return<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:60}}><Loader2 size={28} color={C.ac} style={{animation:"spin 1s linear infinite"}}/></div>;}
function Chk({label,checked,onChange,color}){return<label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:checked?(color||C.ac):C.txM,fontWeight:500}}><div onClick={()=>onChange(!checked)} style={{width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:checked?(color||C.ac):C.card,border:`2px solid ${checked?(color||C.ac):C.bd}`,cursor:"pointer"}}>{checked&&<Check size={13} color="#fff" strokeWidth={3}/>}</div>{label}</label>;}
function PwCell({id,type="bank",showToast}){const[vis,setVis]=useState(false);const[pw,setPw]=useState(null);const[ld,setLd]=useState(false);const[cp,setCp]=useState(false);
const reveal=async()=>{if(vis){setVis(false);return;}setLd(true);try{const fn=type==="promotora"?"reveal_promotora_password":"reveal_password";const{data,error}=await supabase.rpc(fn,{p_credential_id:id});if(error)throw error;setPw(data);setVis(true);}catch(e){showToast?.("Erro: "+e.message,"error");}setLd(false);};
const copy=()=>{if(pw){navigator.clipboard?.writeText(pw);setCp(true);showToast?.("Copiada!","success");setTimeout(()=>setCp(false),2000);}};
return<div style={{display:"flex",alignItems:"center",gap:6}}><code style={{fontFamily:mono,fontSize:12,color:vis?C.ac:C.txD,background:vis?C.acB:"transparent",padding:vis?"2px 8px":0,borderRadius:6}}>{vis&&pw?pw:"••••••••"}</code><button onClick={reveal} style={{background:"none",border:"none",color:C.txD,cursor:"pointer",padding:2,display:"flex"}}>{ld?<Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>:vis?<EyeOff size={14}/>:<Eye size={14}/>}</button>{vis&&pw&&<button onClick={copy} style={{background:"none",border:"none",color:cp?C.sc:C.txD,cursor:"pointer",padding:2,display:"flex"}}>{cp?<Check size={14}/>:<Copy size={14}/>}</button>}</div>;}

// ============================================================
// DASHBOARD
// ============================================================
function DashboardPage({showToast}){
  const[stats,setStats]=useState(null);const[audit,setAudit]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const[st,au]=await Promise.all([supabase.from("dashboard_stats").select("*").single(),supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(10)]);setStats(st.data);setAudit(au.data||[]);setLd(false);}
  const s=stats||{};
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}><h2 style={{fontSize:24,fontWeight:800,color:C.tx}}>Dashboard</h2><Btn icon={RefreshCw} onClick={load} loading={ld} size="sm">Atualizar</Btn></div>
    <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:28}}>
      <Stat icon={Building2} label="Bancos" value={s.total_banks??0} ld={ld}/>
      <Stat icon={Key} label="Cred. Banco" value={s.total_bank_credentials??0} color={C.brand} ld={ld}/>
      <Stat icon={Briefcase} label="Cred. Promotora" value={s.total_promotora_credentials??0} color="#7C3AED" ld={ld}/>
      <Stat icon={Users} label="Operadores" value={s.total_operators??0} ld={ld}/>
    </div>
    <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.bd}`,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <h3 style={{fontSize:15,fontWeight:700,color:C.tx,margin:"0 0 16px",display:"flex",alignItems:"center",gap:8}}><FileText size={16} color={C.ac}/>Atividade recente</h3>
      {audit.length===0&&!ld&&<p style={{fontSize:13,color:C.txD,textAlign:"center",padding:20}}>Nenhuma atividade</p>}
      {audit.map(a=><div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.bdL}`}}>
        <div style={{width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:a.action==="view_password"?C.wnB:C.acB,color:a.action==="view_password"?C.wn:C.ac}}>{a.action==="view_password"?<Eye size={15}/>:<Edit3 size={15}/>}</div>
        <div style={{flex:1}}><div style={{fontSize:13,color:C.tx,fontWeight:600}}>{a.action==="view_password"?"Senha visualizada":"Senha alterada"}</div><div style={{fontSize:12,color:C.txD}}>por <strong style={{color:C.txM}}>{a.user_email||"sistema"}</strong> · {new Date(a.created_at).toLocaleString("pt-BR")}</div></div>
      </div>)}
    </div>
  </div>;
}

// ============================================================
// BANK CREDENTIALS - grouped bank→section with CRUD
// ============================================================
function BankCredsPage({showToast}){
  const[creds,setCreds]=useState([]);const[banks,setBanks]=useState([]);const[sections,setSections]=useState([]);const[operators,setOps]=useState([]);
  const[ld,setLd]=useState(true);const[search,setSearch]=useState("");const[filterBank,setFB]=useState("");const[showFilters,setSF]=useState(false);
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({operator_id:"",bank_id:"",section_id:"",username:"",password:"",status:"amarelo",observation:"",emprestado_para:"",has_store_view:false,is_robot:false,is_approver:false});

  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const[cr,bk,sc,op]=await Promise.all([supabase.from("bank_credentials_view").select("*").order("bank_name").order("section_code").order("username"),supabase.from("banks").select("*").eq("is_active",true).order("name"),supabase.from("bank_sections").select("*,banks(name,short_name)").order("display_order"),supabase.from("operators").select("*").eq("is_active",true).order("name")]);setCreds(cr.data||[]);setBanks(bk.data||[]);setSections(sc.data||[]);setOps(op.data||[]);setLd(false);}
  const filtered=useMemo(()=>creds.filter(c=>{const q=search.toLowerCase();return(!q||c.username?.toLowerCase().includes(q)||c.operator_name?.toLowerCase().includes(q)||c.bank_name?.toLowerCase().includes(q)||c.section_code?.toLowerCase().includes(q)||c.observation?.toLowerCase().includes(q)||c.emprestado_para?.toLowerCase().includes(q))&&(!filterBank||c.bank_id===filterBank);}),[creds,search,filterBank]);
  const grouped=useMemo(()=>{const g={};filtered.forEach(c=>{const bk=c.bank_short_name||c.bank_name;if(!g[bk])g[bk]={};const sc=c.section_code||"PRINCIPAL";if(!g[bk][sc])g[bk][sc]=[];g[bk][sc].push(c);});return Object.fromEntries(Object.entries(g).sort(([a],[b])=>a.localeCompare(b)));},[filtered]);
  const filteredSections=useMemo(()=>form.bank_id?sections.filter(s=>s.bank_id===form.bank_id):[],[sections,form.bank_id]);

  function openEdit(c){setModal("edit");setForm({operator_id:c.operator_id,bank_id:c.bank_id||"",section_id:c.section_id,username:c.username||"",password:"",status:c.status,observation:c.observation||"",emprestado_para:c.emprestado_para||"",has_store_view:c.has_store_view,is_robot:c.is_robot,is_approver:c.is_approver,_id:c.id});}
  function openNew(){setModal("new");setForm({operator_id:"",bank_id:"",section_id:"",username:"",password:"",status:"amarelo",observation:"",emprestado_para:"",has_store_view:false,is_robot:false,is_approver:false});}
  async function handleSave(){
    if(!form.section_id||!form.username){showToast("Preencha seção e usuário","error");return;}setSaving(true);
    try{const payload={operator_id:form.operator_id||null,section_id:form.section_id,username:form.username,status:form.status,observation:form.observation||null,emprestado_para:form.emprestado_para||null,has_store_view:form.has_store_view,is_robot:form.is_robot,is_approver:form.is_approver};
    if(form.password){const{data:enc}=await supabase.rpc("encrypt_password",{plain_text:form.password});payload.password_encrypted=enc;payload.last_password_update=new Date().toISOString();}
    if(modal==="edit"){const{error}=await supabase.from("bank_credentials").update(payload).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
    else{if(!form.password){showToast("Informe a senha","error");setSaving(false);return;}const{error}=await supabase.from("bank_credentials").insert(payload);if(error)throw error;showToast("Criado!","success");}
    setModal(null);load();}catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);}
  async function handleDelete(id){if(!confirm("Excluir?"))return;const{error}=await supabase.from("bank_credentials").delete().eq("id",id);if(error)showToast("Erro","error");else{showToast("Removido","success");load();}}

  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><h2 style={{fontSize:24,fontWeight:800,color:C.tx}}>Credenciais de banco</h2><p style={{fontSize:14,color:C.txM,marginTop:4}}>{filtered.length} credenciais</p></div><div style={{display:"flex",gap:8}}><Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn><Btn variant="primary" icon={Plus} onClick={openNew}>Nova</Btn></div></div>
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`,marginBottom:16,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",gap:10}}><div style={{flex:1}}><Inp value={search} onChange={setSearch} placeholder="Buscar usuário, banco, seção..." icon={Search}/></div><Btn icon={Filter} onClick={()=>setSF(!showFilters)}>Filtros</Btn></div>
      {showFilters&&<div style={{marginTop:14}}><Sel value={filterBank} onChange={setFB} placeholder="Todos os bancos" options={banks.map(b=>({value:b.id,label:b.short_name||b.name}))}/></div>}
    </div>
    {Object.keys(grouped).length===0&&<div style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`}}><Empty icon={Key} title="Nenhuma credencial" desc="Altere filtros"/></div>}
    {Object.entries(grouped).map(([bankName,secs])=>(
      <div key={bankName} style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`,marginBottom:16,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.bd}`,background:C.bgI,display:"flex",alignItems:"center",gap:10}}><Building2 size={16} color={C.brand}/><span style={{fontSize:15,fontWeight:700,color:C.brand}}>{bankName}</span><span style={{fontSize:12,color:C.txD,background:C.card,padding:"2px 8px",borderRadius:12}}>{Object.values(secs).flat().length}</span></div>
        {Object.entries(secs).map(([secCode,items])=>(
          <div key={secCode}>
            {secCode!=="PRINCIPAL"&&<div style={{padding:"6px 20px",background:`${C.brand}08`,borderBottom:`1px solid ${C.bd}40`}}><span style={{fontSize:11,fontWeight:700,color:C.brand,textTransform:"uppercase",letterSpacing:"0.05em"}}>{secCode}</span></div>}
            <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr>{["Usuário","Senha","Status","Observação","Emprestado","Loja","Robô","Aprov.","Atualiz.",""].map((h,i)=><th key={i} style={{padding:"8px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txD,textTransform:"uppercase",borderBottom:`1px solid ${C.bdL}`}}>{h}</th>)}</tr></thead>
              <tbody>{items.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${C.bdL}`}} onMouseEnter={e=>e.currentTarget.style.background=C.hover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"8px 16px"}}><code style={{fontFamily:mono,fontSize:12,color:C.txM,background:C.bgI,padding:"2px 8px",borderRadius:6}}>{c.username}</code></td>
                <td style={{padding:"8px 16px"}}><PwCell id={c.id} type="bank" showToast={showToast}/></td>
                <td style={{padding:"8px 16px"}}><Badge status={c.status}/></td>
                <td style={{padding:"8px 16px",color:C.txD,fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.observation||"—"}</td>
                <td style={{padding:"8px 16px"}}>{c.emprestado_para?<span style={{fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:8,color:"#7C3AED",background:"#F5F3FF"}}>{c.emprestado_para}</span>:<span style={{color:C.txD,fontSize:11}}>—</span>}</td>
                <td style={{padding:"8px 16px",fontSize:11,fontWeight:600,color:c.has_store_view?C.sc:C.txD}}>{c.has_store_view?"SIM":"NÃO"}</td>
                <td style={{padding:"8px 16px",fontSize:11,fontWeight:600,color:c.is_robot?C.ac:C.txD}}>{c.is_robot?"SIM":"NÃO"}</td>
                <td style={{padding:"8px 16px",fontSize:11,fontWeight:600,color:c.is_approver?"#DB2777":C.txD}}>{c.is_approver?"SIM":"NÃO"}</td>
                <td style={{padding:"8px 16px",fontSize:12,color:C.txD}}>{c.last_password_update?new Date(c.last_password_update).toLocaleDateString("pt-BR"):"—"}</td>
                <td style={{padding:"8px 16px"}}><div style={{display:"flex",gap:4}}><button onClick={()=>openEdit(c)} style={{background:"none",border:"none",color:C.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button><button onClick={()=>handleDelete(c.id)} style={{background:"none",border:"none",color:C.txD,cursor:"pointer",padding:4,display:"flex"}}><Trash2 size={14}/></button></div></td>
              </tr>)}</tbody></table></div></div>))}
      </div>))}
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar credencial":"Nova credencial"} width={600}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Sel label="Operador" value={form.operator_id} onChange={v=>setForm({...form,operator_id:v})} options={operators.map(o=>({value:o.id,label:o.name}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Sel label="Banco" value={form.bank_id} onChange={v=>setForm({...form,bank_id:v,section_id:""})} options={banks.map(b=>({value:b.id,label:b.short_name||b.name}))}/>
          <Sel label="Seção" value={form.section_id} onChange={v=>setForm({...form,section_id:v})} options={filteredSections.map(s=>({value:s.id,label:s.code}))} placeholder={form.bank_id?"Selecione seção":"Selecione banco primeiro"}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Inp label="Usuário/Login" value={form.username} onChange={v=>setForm({...form,username:v})} placeholder="CBS126023"/>
          <Inp label={modal==="edit"?"Nova senha (vazio=manter)":"Senha"} value={form.password} onChange={v=>setForm({...form,password:v})} type="password"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Sel label="Status" value={form.status} onChange={v=>setForm({...form,status:v})} options={Object.entries(STATUS).map(([k,v])=>({value:k,label:v.l}))}/>
          <Inp label="Observação" value={form.observation} onChange={v=>setForm({...form,observation:v})}/>
        </div>
        <Inp label="Emprestado para (parceiro)" value={form.emprestado_para} onChange={v=>setForm({...form,emprestado_para:v})} placeholder="Nome do parceiro (vazio = não emprestado)"/>
        <div style={{display:"flex",gap:20}}><Chk label="Visão Loja" checked={form.has_store_view} onChange={v=>setForm({...form,has_store_view:v})}/><Chk label="Robô" checked={form.is_robot} onChange={v=>setForm({...form,is_robot:v})}/><Chk label="Aprovador" checked={form.is_approver} onChange={v=>setForm({...form,is_approver:v})}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// PROMOTORA CREDENTIALS
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
    if(!form.promotora_id||!form.login_username){showToast("Preencha promotora e login","error");return;}setSaving(true);
    try{const payload={promotora_id:form.promotora_id,operator_id:form.operator_id||null,login_username:form.login_username,person_name:form.person_name||null,sector:form.sector||null,ramal:form.ramal||null,partner_code:form.partner_code||null,is_active:form.is_active,status:form.status||"ativo"};
    if(form.password){const{data:enc}=await supabase.rpc("encrypt_password",{plain_text:form.password});payload.password_encrypted=enc;payload.last_password_update=new Date().toISOString();}
    if(form.contra_senha){const{data:enc}=await supabase.rpc("encrypt_password",{plain_text:form.contra_senha});payload.contra_senha_encrypted=enc;}
    if(modal==="edit"){const{error}=await supabase.from("promotora_credentials").update(payload).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
    else{if(!form.password){showToast("Informe a senha","error");setSaving(false);return;}const{error}=await supabase.from("promotora_credentials").insert(payload);if(error)throw error;showToast("Criado!","success");}
    setModal(null);load();}catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><h2 style={{fontSize:24,fontWeight:800,color:C.tx}}>Credenciais de promotora</h2><p style={{fontSize:14,color:C.txM,marginTop:4}}>{filtered.length} credenciais</p></div><div style={{display:"flex",gap:8}}><Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn><Btn variant="primary" icon={Plus} onClick={openNew}>Nova</Btn></div></div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar login, pessoa, promotora..." icon={Search}/></div>
    {Object.entries(grouped).map(([pName,items])=>(
      <div key={pName} style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`,marginBottom:16,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.bd}`,background:C.bgI,display:"flex",alignItems:"center",gap:10}}><Briefcase size={16} color="#7C3AED"/><span style={{fontSize:15,fontWeight:700,color:"#7C3AED"}}>{pName}</span><span style={{fontSize:12,color:C.txD,background:C.card,padding:"2px 8px",borderRadius:12}}>{items.length}</span></div>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr>{["Login","Senha","Pessoa","Setor","Cód.Parc","Status","Ativo","Ações"].map((h,i)=><th key={i} style={{padding:"8px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txD,textTransform:"uppercase",borderBottom:`1px solid ${C.bdL}`}}>{h}</th>)}</tr></thead>
          <tbody>{items.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${C.bdL}`}} onMouseEnter={e=>e.currentTarget.style.background=C.hover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <td style={{padding:"8px 16px"}}><code style={{fontFamily:mono,fontSize:11,color:C.txM,background:C.bgI,padding:"2px 6px",borderRadius:4}}>{c.login_username}</code></td>
            <td style={{padding:"8px 16px"}}><PwCell id={c.id} type="promotora" showToast={showToast}/></td>
            <td style={{padding:"8px 16px",color:C.tx,fontWeight:600}}>{c.person_name||"—"}</td>
            <td style={{padding:"8px 16px"}}>{c.sector?<span style={{fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:8,color:c.sector==="MASTER"?C.brand:c.sector==="FINANCEIRO"?C.wn:c.sector==="CONTRA SENHA"?C.dg:C.txM,background:c.sector==="MASTER"?C.brandB:c.sector==="FINANCEIRO"?C.wnB:c.sector==="CONTRA SENHA"?C.dgB:C.bgI}}>{c.sector}</span>:"—"}</td>
            <td style={{padding:"8px 16px",fontSize:12,color:C.txD,fontFamily:mono}}>{c.partner_code&&c.partner_code!=="---"?c.partner_code:"—"}</td>
            <td style={{padding:"8px 16px"}}><span style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:8,color:C.txM,background:C.bgI}}>{c.status||"ativo"}</span></td>
            <td style={{padding:"8px 16px",fontSize:11,fontWeight:600,color:c.is_active?C.sc:C.dg}}>{c.is_active?"SIM":"NÃO"}</td>
            <td style={{padding:"8px 16px"}}><button onClick={()=>openEdit(c)} style={{background:"none",border:"none",color:C.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button></td>
          </tr>)}</tbody></table></div></div>))}
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar credencial":"Nova credencial"} width={600}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Sel label="Promotora" value={form.promotora_id} onChange={v=>setForm({...form,promotora_id:v})} options={proms.map(p=>({value:p.id,label:p.name}))}/><Sel label="Operador" value={form.operator_id} onChange={v=>setForm({...form,operator_id:v})} options={[{value:"",label:"—"},...ops.map(o=>({value:o.id,label:o.name}))]}/></div>
        <Inp label="Login/Usuário" value={form.login_username} onChange={v=>setForm({...form,login_username:v})} placeholder="000793master"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label={modal==="edit"?"Nova senha (vazio=manter)":"Senha"} value={form.password} onChange={v=>setForm({...form,password:v})} type="password"/><Inp label="Contra senha" value={form.contra_senha} onChange={v=>setForm({...form,contra_senha:v})} type="password" placeholder="Se houver"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}><Inp label="Pessoa" value={form.person_name} onChange={v=>setForm({...form,person_name:v})}/><Sel label="Setor" value={form.sector} onChange={v=>setForm({...form,sector:v})} options={["MASTER","OPERACIONAL","FINANCEIRO","VENDAS","CONTRA SENHA","T.I","AUDITORIA"].map(s=>({value:s,label:s}))}/><Inp label="Cód. Parceiro" value={form.partner_code} onChange={v=>setForm({...form,partner_code:v})}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Ramal" value={form.ramal} onChange={v=>setForm({...form,ramal:v})}/><Sel label="Status" value={form.status} onChange={v=>setForm({...form,status:v})} options={["ativo","inativo","bloqueado","pendente"].map(s=>({value:s,label:s.toUpperCase()}))}/></div>
        <Chk label="Ativo" checked={form.is_active} onChange={v=>setForm({...form,is_active:v})} color={C.sc}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// BANCOS - with promotora link built-in (no separate map)
// ============================================================
function BanksPage({showToast}){
  const[banks,setBanks]=useState([]);const[proms,setProms]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({name:"",short_name:"",url:"",promotora_id:"",is_active:true});
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const[bk,pr]=await Promise.all([supabase.from("banks").select("*").order("name"),supabase.from("promotoras").select("*").order("name")]);setBanks(bk.data||[]);setProms(pr.data||[]);setLd(false);}
  const filtered=banks.filter(b=>{const q=search.toLowerCase();return!q||b.name?.toLowerCase().includes(q)||b.short_name?.toLowerCase().includes(q)||b.default_promotora?.toLowerCase().includes(q);});
  function openEdit(b){setModal("edit");setForm({name:b.name,short_name:b.short_name||"",url:b.url||"",promotora_id:proms.find(p=>p.name===b.default_promotora)?.id||"",is_active:b.is_active,_id:b.id});}
  function openNew(){setModal("new");setForm({name:"",short_name:"",url:"",promotora_id:"",is_active:true});}
  async function handleSave(){
    if(!form.name){showToast("Nome obrigatório","error");return;}setSaving(true);
    try{const prom=proms.find(p=>p.id===form.promotora_id);
    const p={name:form.name,short_name:form.short_name||null,url:form.url||null,default_promotora:prom?.name||null,is_active:form.is_active};
    if(modal==="edit"){const{error}=await supabase.from("banks").update(p).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
    else{const{error}=await supabase.from("banks").insert(p);if(error)throw error;showToast("Criado!","success");}
    setModal(null);load();}catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><h2 style={{fontSize:24,fontWeight:800,color:C.tx}}>Bancos e sistemas</h2><p style={{fontSize:14,color:C.txM,marginTop:4}}>{banks.length} bancos cadastrados</p></div><Btn variant="primary" icon={Plus} onClick={openNew}>Novo banco</Btn></div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar banco ou promotora..." icon={Search}/></div>
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr>{["Banco","Nome curto","Promotora","URL","Status",""].map((h,i)=><th key={i} style={{padding:"12px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txD,textTransform:"uppercase",borderBottom:`1px solid ${C.bd}`}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(b=><tr key={b.id} style={{borderBottom:`1px solid ${C.bdL}`}} onMouseEnter={e=>e.currentTarget.style.background=C.hover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 16px",color:C.tx,fontWeight:600}}>{b.name}</td>
          <td style={{padding:"10px 16px"}}><code style={{fontFamily:mono,fontSize:12,color:C.brand,background:C.brandB,padding:"2px 8px",borderRadius:6}}>{b.short_name||"—"}</code></td>
          <td style={{padding:"10px 16px"}}>{b.default_promotora?<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:8,color:"#7C3AED",background:"#F5F3FF"}}>{b.default_promotora}</span>:<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:8,color:C.ac,background:C.acB}}>DIRETO</span>}</td>
          <td style={{padding:"10px 16px"}}>{b.url?<a href={b.url} target="_blank" rel="noopener noreferrer" style={{color:C.ac,fontSize:12,display:"flex",alignItems:"center",gap:4}}><ExternalLink size={12}/>Acessar</a>:<span style={{color:C.txD}}>—</span>}</td>
          <td style={{padding:"10px 16px"}}><span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:8,color:b.is_active?C.sc:C.dg,background:b.is_active?C.scB:C.dgB}}>{b.is_active?"ATIVO":"INATIVO"}</span></td>
          <td style={{padding:"10px 16px"}}><button onClick={()=>openEdit(b)} style={{background:"none",border:"none",color:C.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button></td>
        </tr>)}</tbody></table></div>
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar banco":"Novo banco"} width={500}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Nome" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="SUB SAFRA"/><Inp label="Nome curto" value={form.short_name} onChange={v=>setForm({...form,short_name:v})} placeholder="SAFRA"/></div>
        <Inp label="URL" value={form.url} onChange={v=>setForm({...form,url:v})} placeholder="https://..."/>
        <Sel label="Promotora vinculada" value={form.promotora_id} onChange={v=>setForm({...form,promotora_id:v})} options={[{value:"",label:"DIRETO (sem promotora)"},...proms.map(p=>({value:p.id,label:p.name}))]}/>
        <Chk label="Banco ativo" checked={form.is_active} onChange={v=>setForm({...form,is_active:v})} color={C.sc}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// OPERADORES
// ============================================================
function OperatorsPage({showToast}){
  const[ops,setOps]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({name:"",email:"",code:"",cpf:"",phone:"",is_active:true});
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("operators").select("*").order("name");setOps(data||[]);setLd(false);}
  const filtered=ops.filter(o=>{const q=search.toLowerCase();return!q||o.name?.toLowerCase().includes(q)||o.email?.toLowerCase().includes(q)||o.code?.includes(q);});
  function openEdit(op){setModal("edit");setForm({name:op.name,email:op.email||"",code:op.code||"",cpf:op.cpf||"",phone:op.phone||"",is_active:op.is_active,_id:op.id});}
  async function handleSave(){
    if(!form.name){showToast("Nome obrigatório","error");return;}setSaving(true);
    try{const p={name:form.name,email:form.email||null,code:form.code||null,cpf:form.cpf||null,phone:form.phone||null,is_active:form.is_active};
    if(modal==="edit"){const{error}=await supabase.from("operators").update(p).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
    else{const{error}=await supabase.from("operators").insert(p);if(error)throw error;showToast("Criado!","success");}
    setModal(null);load();}catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><h2 style={{fontSize:24,fontWeight:800,color:C.tx}}>Operadores</h2><p style={{fontSize:14,color:C.txM,marginTop:4}}>{ops.filter(o=>o.is_active).length} ativos de {ops.length}</p></div><Btn variant="primary" icon={Plus} onClick={()=>{setModal("new");setForm({name:"",email:"",code:"",cpf:"",phone:"",is_active:true});}}>Novo</Btn></div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar nome, email, código..." icon={Search}/></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
      {filtered.map(op=><div key={op.id} style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`,padding:20,opacity:op.is_active?1:0.5,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:42,height:42,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:C.ac,background:C.acB}}>{op.name.charAt(0)}</div>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:C.tx}}>{op.name}</div><div style={{fontSize:12,color:C.txD}}>{op.email||"—"}</div></div>
          {!op.is_active&&<span style={{fontSize:10,fontWeight:700,color:C.dg,background:C.dgB,padding:"3px 8px",borderRadius:8}}>INATIVO</span>}
        </div>
        <div style={{display:"flex",gap:16,fontSize:12,color:C.txM,marginBottom:14}}>{op.code&&<span>Código: <strong style={{color:C.tx}}>{op.code}</strong></span>}{op.cpf&&<span>CPF: <strong style={{color:C.tx}}>{op.cpf}</strong></span>}</div>
        <Btn size="sm" icon={Edit3} onClick={()=>openEdit(op)}>Editar</Btn>
      </div>)}
    </div>
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar operador":"Novo operador"} width={480}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Inp label="Nome" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Nome completo"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Email" value={form.email} onChange={v=>setForm({...form,email:v})}/><Inp label="Telefone" value={form.phone} onChange={v=>setForm({...form,phone:v})}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Código" value={form.code} onChange={v=>setForm({...form,code:v})} placeholder="0793"/><Inp label="CPF" value={form.cpf} onChange={v=>setForm({...form,cpf:v})}/></div>
        <Chk label="Ativo" checked={form.is_active} onChange={v=>setForm({...form,is_active:v})} color={C.sc}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// CERTIFICADOS
// ============================================================
function CertsPage({showToast}){
  const[certs,setCerts]=useState([]);const[ld,setLd]=useState(true);
  const[modal,setModal]=useState(null);const[saving,setSaving]=useState(false);
  const[form,setForm]=useState({operator_name:"",cpf:"",cert_number:"",aneps_code:"",aneps_expiry:"",has_pldft:false,pldft_expiry:"",password:"",has_document:false});
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("certificates").select("*").order("operator_name");setCerts(data||[]);setLd(false);}
  function openEdit(c){setModal("edit");setForm({operator_name:c.operator_name,cpf:c.cpf||"",cert_number:c.cert_number||"",aneps_code:c.aneps_code||"",aneps_expiry:c.aneps_expiry?c.aneps_expiry.split("T")[0]:"",has_pldft:c.has_pldft,pldft_expiry:c.pldft_expiry?c.pldft_expiry.split("T")[0]:"",password:"",has_document:c.has_document,_id:c.id});}
  async function handleSave(){
    if(!form.operator_name){showToast("Nome obrigatório","error");return;}setSaving(true);
    try{const p={operator_name:form.operator_name,cpf:form.cpf||null,cert_number:form.cert_number||null,aneps_code:form.aneps_code||null,aneps_expiry:form.aneps_expiry||null,has_pldft:form.has_pldft,pldft_expiry:form.pldft_expiry||null,has_document:form.has_document};
    if(form.password){const{data:enc}=await supabase.rpc("encrypt_password",{plain_text:form.password});p.password_encrypted=enc;}
    if(modal==="edit"){const{error}=await supabase.from("certificates").update(p).eq("id",form._id);if(error)throw error;showToast("Atualizado!","success");}
    else{const{error}=await supabase.from("certificates").insert(p);if(error)throw error;showToast("Criado!","success");}
    setModal(null);load();}catch(e){showToast("Erro: "+e.message,"error");}setSaving(false);}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><h2 style={{fontSize:24,fontWeight:800,color:C.tx}}>Certificados</h2><Btn variant="primary" icon={Plus} onClick={()=>{setModal("new");setForm({operator_name:"",cpf:"",cert_number:"",aneps_code:"",aneps_expiry:"",has_pldft:false,pldft_expiry:"",password:"",has_document:false});}}>Novo</Btn></div>
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      {certs.length===0?<Empty icon={Award} title="Nenhum certificado" desc=""/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr>{["Nome","CPF","Nº Cert.","ANEPS","Val. ANEPS","PLDFT","Val. PLDFT","Doc",""].map((h,i)=><th key={i} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txD,textTransform:"uppercase",borderBottom:`1px solid ${C.bd}`}}>{h}</th>)}</tr></thead>
      <tbody>{certs.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${C.bdL}`}}>
        <td style={{padding:"10px 16px",color:C.tx,fontWeight:600,fontSize:12}}>{c.operator_name}</td>
        <td style={{padding:"10px 16px",fontFamily:mono,fontSize:11,color:C.txM}}>{c.cpf}</td>
        <td style={{padding:"10px 16px",fontSize:12,color:C.txM}}>{c.cert_number||"—"}</td>
        <td style={{padding:"10px 16px",fontSize:12,color:C.txM}}>{c.aneps_code||"—"}</td>
        <td style={{padding:"10px 16px",fontSize:12,color:C.txM}}>{c.aneps_expiry?new Date(c.aneps_expiry).toLocaleDateString("pt-BR"):"—"}</td>
        <td style={{padding:"10px 16px",fontSize:11,fontWeight:600,color:c.has_pldft?C.sc:C.txD}}>{c.has_pldft?"SIM":"NÃO"}</td>
        <td style={{padding:"10px 16px",fontSize:12,color:C.txM}}>{c.pldft_expiry?new Date(c.pldft_expiry).toLocaleDateString("pt-BR"):"—"}</td>
        <td style={{padding:"10px 16px"}}>{c.has_document?<Check size={14} color={C.sc}/>:<X size={14} color={C.txD}/>}</td>
        <td style={{padding:"10px 16px"}}><button onClick={()=>openEdit(c)} style={{background:"none",border:"none",color:C.txD,cursor:"pointer",padding:4,display:"flex"}}><Edit3 size={14}/></button></td>
      </tr>)}</tbody></table>}
    </div>
    <Modal open={!!modal} onClose={()=>setModal(null)} title={modal==="edit"?"Editar certificado":"Novo certificado"} width={540}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Nome completo" value={form.operator_name} onChange={v=>setForm({...form,operator_name:v})}/><Inp label="CPF" value={form.cpf} onChange={v=>setForm({...form,cpf:v})}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Nº Certificado" value={form.cert_number} onChange={v=>setForm({...form,cert_number:v})}/><Inp label="ANEPS/FEBRABAN" value={form.aneps_code} onChange={v=>setForm({...form,aneps_code:v})}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp label="Validade ANEPS" value={form.aneps_expiry} onChange={v=>setForm({...form,aneps_expiry:v})} type="date"/><Inp label="Validade PLDFT" value={form.pldft_expiry} onChange={v=>setForm({...form,pldft_expiry:v})} type="date"/></div>
        <Inp label={modal==="edit"?"Nova senha (vazio=manter)":"Senha"} value={form.password} onChange={v=>setForm({...form,password:v})} type="password"/>
        <div style={{display:"flex",gap:20}}><Chk label="PLDFT" checked={form.has_pldft} onChange={v=>setForm({...form,has_pldft:v})}/><Chk label="Documento entregue" checked={form.has_document} onChange={v=>setForm({...form,has_document:v})}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${C.bd}`}}><Btn onClick={()=>setModal(null)}>Cancelar</Btn><Btn variant="primary" icon={Save} onClick={handleSave} loading={saving}>{modal==="edit"?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// ============================================================
// USUÁRIOS DO SISTEMA
// ============================================================
function UsersPage({showToast}){
  const[profiles,setProfiles]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("profiles").select("*").order("created_at",{ascending:false});setProfiles(data||[]);setLd(false);}
  async function changeRole(id,role){const{error}=await supabase.from("profiles").update({role}).eq("id",id);if(error)showToast("Erro","error");else{showToast("Atualizado!","success");load();}}
  async function toggleActive(id,active){const{error}=await supabase.from("profiles").update({is_active:!active}).eq("id",id);if(error)showToast("Erro","error");else{showToast("Atualizado!","success");load();}}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{marginBottom:20}}><h2 style={{fontSize:24,fontWeight:800,color:C.tx}}>Usuários do sistema</h2><p style={{fontSize:14,color:C.txM,marginTop:4}}>{profiles.length} contas cadastradas</p></div>
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      {profiles.length===0?<Empty icon={UserCog} title="Nenhum usuário" desc="Crie contas pela tela de login"/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr>{["Nome","Email","Role","Status","Criado","Ações"].map((h,i)=><th key={i} style={{padding:"12px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txD,textTransform:"uppercase",borderBottom:`1px solid ${C.bd}`}}>{h}</th>)}</tr></thead>
      <tbody>{profiles.map(p=><tr key={p.id} style={{borderBottom:`1px solid ${C.bdL}`}}>
        <td style={{padding:"10px 16px",color:C.tx,fontWeight:600}}>{p.full_name}</td>
        <td style={{padding:"10px 16px",fontFamily:mono,fontSize:12,color:C.txM}}>{p.email}</td>
        <td style={{padding:"10px 16px"}}><select value={p.role} onChange={e=>changeRole(p.id,e.target.value)} style={{background:C.bgI,border:`1px solid ${C.bd}`,borderRadius:8,color:C.tx,padding:"4px 8px",fontSize:12,cursor:"pointer"}}><option value="admin">Admin</option><option value="supervisor">Supervisor</option><option value="operator">Operador</option></select></td>
        <td style={{padding:"10px 16px"}}><span style={{fontSize:10,fontWeight:700,color:p.is_active?C.sc:C.dg,background:p.is_active?C.scB:C.dgB,padding:"3px 8px",borderRadius:8}}>{p.is_active?"ATIVO":"INATIVO"}</span></td>
        <td style={{padding:"10px 16px",fontSize:12,color:C.txD}}>{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
        <td style={{padding:"10px 16px"}}><Btn size="sm" onClick={()=>toggleActive(p.id,p.is_active)}>{p.is_active?"Desativar":"Ativar"}</Btn></td>
      </tr>)}</tbody></table>}
    </div>
  </div>;
}

// ============================================================
// AUDITORIA
// ============================================================
function AuditPage(){
  const[logs,setLogs]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(200);setLogs(data||[]);setLd(false);}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><h2 style={{fontSize:24,fontWeight:800,color:C.tx}}>Auditoria</h2><Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn></div>
    <div style={{background:C.card,borderRadius:14,border:`1px solid ${C.bd}`,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      {logs.length===0?<Empty icon={FileText} title="Nenhum registro" desc=""/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr>{["Data/Hora","Quem","Ação","Tipo"].map((h,i)=><th key={i} style={{padding:"12px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txD,textTransform:"uppercase",borderBottom:`1px solid ${C.bd}`}}>{h}</th>)}</tr></thead>
      <tbody>{logs.map(a=><tr key={a.id} style={{borderBottom:`1px solid ${C.bdL}`}}>
        <td style={{padding:"10px 16px",color:C.txD,fontSize:12,fontFamily:mono}}>{new Date(a.created_at).toLocaleString("pt-BR")}</td>
        <td style={{padding:"10px 16px",color:C.tx,fontWeight:600,fontSize:12}}>{a.user_email||"sistema"}</td>
        <td style={{padding:"10px 16px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:8,color:a.action==="view_password"?C.wn:C.ac,background:a.action==="view_password"?C.wnB:C.acB}}>{a.action==="view_password"?"Senha visualizada":a.action}</span></td>
        <td style={{padding:"10px 16px",color:C.txM,fontSize:12}}>{a.entity_type}</td>
      </tr>)}</tbody></table>}
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
  return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#F0F4FF 0%,#FEFCE8 100%)"}}>
    <div style={{width:420,background:C.card,borderRadius:24,border:`1px solid ${C.bd}`,padding:"44px 40px",boxShadow:"0 20px 60px rgba(0,0,0,0.08)"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{width:56,height:56,borderRadius:16,margin:"0 auto 16px",background:"linear-gradient(135deg,#B45309,#D97706)",display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={28} color="#fff"/></div>
        <h1 style={{fontSize:24,fontWeight:800,color:C.tx,margin:"0 0 6px"}}>LhamasCred Vault</h1>
        <p style={{fontSize:13,color:C.txM,margin:0}}>Central de credenciais bancárias</p>
      </div>
      {err&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,background:C.dgB,border:`1px solid ${C.dg}30`,marginBottom:16,fontSize:13,color:C.dg}}><AlertCircle size={16}/>{err}</div>}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {isUp&&<Inp label="Nome" value={name} onChange={setName} placeholder="Carlos Lhamas" icon={Users}/>}
        <Inp label="Email" value={email} onChange={setEmail} placeholder="carlos@lhamascred.com.br" icon={Users}/>
        <Inp label="Senha" value={pw} onChange={setPw} placeholder="••••••••" type="password" icon={Lock} onKeyDown={e=>e.key==="Enter"&&go()}/>
        <Btn variant="primary" size="lg" onClick={go} loading={ld} style={{width:"100%",justifyContent:"center",marginTop:8,borderRadius:12,padding:"14px 20px",fontSize:15}}>{isUp?"Criar conta":"Entrar"}</Btn>
      </div>
      <div style={{textAlign:"center",marginTop:20}}><button onClick={()=>{setIsUp(!isUp);setErr("");}} style={{background:"none",border:"none",color:C.ac,cursor:"pointer",fontSize:13,fontWeight:600}}>{isUp?"Já tem conta? Login":"Criar nova conta"}</button></div>
    </div>
  </div>;
}

// ============================================================
// NAV + LAYOUT
// ============================================================
const NAV=[
  {id:"dashboard",l:"Dashboard",i:LayoutDashboard},
  {id:"bank_creds",l:"Credenciais Banco",i:Key},
  {id:"prom_creds",l:"Credenciais Promotora",i:Briefcase},
  {id:"banks_list",l:"Bancos",i:Building2},
  {id:"operators",l:"Operadores",i:Users},
  {id:"certificates",l:"Certificados",i:Award},
  {id:"users",l:"Usuários",i:UserCog},
  {id:"audit",l:"Auditoria",i:FileText},
];

function AppLayout(){
  const{profile,signOut}=useAuth();const[page,setPage]=useState("dashboard");const[col,setCol]=useState(false);const{toast,show}=useToast();
  const render=()=>{switch(page){case"dashboard":return<DashboardPage showToast={show}/>;case"bank_creds":return<BankCredsPage showToast={show}/>;case"prom_creds":return<PromCredsPage showToast={show}/>;case"banks_list":return<BanksPage showToast={show}/>;case"operators":return<OperatorsPage showToast={show}/>;case"certificates":return<CertsPage showToast={show}/>;case"users":return<UsersPage showToast={show}/>;case"audit":return<AuditPage/>;default:return<DashboardPage showToast={show}/>;}};
  return<div style={{display:"flex",minHeight:"100vh",background:C.bg}}>
    <Toast toast={toast}/>
    <div style={{width:col?68:240,background:C.card,borderRight:`1px solid ${C.bd}`,display:"flex",flexDirection:"column",transition:"width .2s",flexShrink:0}}>
      <div style={{padding:col?"20px 14px":"20px 20px",borderBottom:`1px solid ${C.bd}`,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:38,height:38,borderRadius:10,flexShrink:0,background:"linear-gradient(135deg,#B45309,#D97706)",display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={18} color="#fff"/></div>
        {!col&&<div><div style={{fontSize:15,fontWeight:800,color:C.tx}}>LhamasCred</div><div style={{fontSize:10,color:C.txD,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>Vault</div></div>}
      </div>
      <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
        {NAV.map(n=>{const a=page===n.id;return<button key={n.id} onClick={()=>setPage(n.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",background:a?C.acB:"transparent",color:a?C.ac:C.txM,fontSize:13,fontWeight:a?600:500,marginBottom:2,justifyContent:col?"center":"flex-start"}}><n.i size={17}/>{!col&&n.l}</button>;})}
      </nav>
      <div style={{padding:"10px 8px",borderTop:`1px solid ${C.bd}`}}>
        <button onClick={()=>setCol(!col)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",borderRadius:10,border:"none",background:"transparent",color:C.txD,cursor:"pointer",fontSize:12,justifyContent:col?"center":"flex-start"}}>{col?<ChevronRight size={16}/>:<><ChevronLeft size={16}/>Recolher</>}</button>
        <button onClick={signOut} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",borderRadius:10,border:"none",background:"transparent",color:C.txD,cursor:"pointer",fontSize:12,justifyContent:col?"center":"flex-start",marginTop:2}}><LogOut size={16}/>{!col&&"Sair"}</button>
      </div>
    </div>
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{padding:"14px 28px",borderBottom:`1px solid ${C.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:C.txD}}><span style={{color:C.brand,fontWeight:700}}>{NAV.find(n=>n.id===page)?.l}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{textAlign:"right"}}><div style={{fontSize:13,color:C.tx,fontWeight:600}}>{profile?.full_name||"Usuário"}</div><div style={{fontSize:10,color:C.txD,textTransform:"uppercase",fontWeight:600}}>{profile?.role||"operator"}</div></div>
          <div style={{width:34,height:34,borderRadius:10,background:C.acB,color:C.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>{(profile?.full_name||"U").charAt(0)}</div>
        </div>
      </div>
      <div style={{padding:28}}>{render()}</div>
    </div>
  </div>;
}

export default function App(){return<><style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style><AuthProv><AppInner/></AuthProv></>;}
function AppInner(){const{session,loading}=useAuth();if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}><Loader2 size={28} color={C.ac} style={{animation:"spin 1s linear infinite"}}/></div>;return session?<AppLayout/>:<LoginPage/>;}
