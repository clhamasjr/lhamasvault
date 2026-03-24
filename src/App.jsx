import { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { supabase } from "./lib/supabase";
import {
  Shield, Key, Building2, Users, Eye, EyeOff, Search, Plus, Edit3, Trash2,
  ChevronDown, ChevronRight, LogOut, LayoutDashboard, FileText, AlertTriangle,
  CheckCircle, XCircle, Copy, ExternalLink, Filter, RefreshCw, Clock,
  Lock, Bot, Store, UserCheck, X, Check, ChevronLeft,
  Loader2, AlertCircle, Award, Briefcase, Network, UserCog
} from "lucide-react";

const font = `'DM Sans','Segoe UI',system-ui,-apple-system,sans-serif`;
const mono = `'JetBrains Mono','SF Mono','Consolas',monospace`;
const T = {
  bg:"#0C0C0E",bgC:"#141418",bgH:"#1A1A20",bgI:"#1E1E24",
  bd:"#2A2A32",bdL:"#35353F",tx:"#E8E6E1",txM:"#8A8A96",txD:"#5A5A66",
  ac:"#C9A84C",acD:"#A08530",acB:"rgba(201,168,76,0.08)",
  dg:"#E24B4A",dgB:"rgba(226,75,74,0.08)",
  sc:"#4CAF50",scB:"rgba(76,175,80,0.08)",
  wn:"#EF9F27",wnB:"rgba(239,159,39,0.08)",
  in:"#378ADD",inB:"rgba(55,138,221,0.08)",
};
const STATUS = {
  amarelo:{l:"Ativo",c:"#EF9F27"},laranja:{l:"Header",c:"#D85A30"},vermelho:{l:"Política",c:"#E24B4A"},
  verde:{l:"Instabilidade",c:"#639922"},azul_claro:{l:"Padrão",c:"#378ADD"},rosa:{l:"Aprovador",c:"#D4537E"},
  roxo:{l:"Master",c:"#7F77DD"},azul_bebe:{l:"Robô",c:"#85B7EB"},cinza:{l:"Inativo",c:"#888780"}
};

// AUTH
const AuthCtx = createContext(null);
function AuthProvider({children}){
  const[s,setS]=useState(null);const[p,setP]=useState(null);const[ld,setLd]=useState(true);
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setS(session);if(session)fp(session.user.id);else setLd(false);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{setS(session);if(session)fp(session.user.id);else{setP(null);setLd(false);}});
    return()=>subscription.unsubscribe();
  },[]);
  async function fp(uid){const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();setP(data);setLd(false);}
  async function signIn(e,pw){const{error}=await supabase.auth.signInWithPassword({email:e,password:pw});if(error)throw error;}
  async function signUp(e,pw,n){const{error}=await supabase.auth.signUp({email:e,password:pw,options:{data:{full_name:n,role:'operator'}}});if(error)throw error;}
  async function signOut(){await supabase.auth.signOut();setS(null);setP(null);}
  return<AuthCtx.Provider value={{session:s,profile:p,loading:ld,signIn,signUp,signOut}}>{children}</AuthCtx.Provider>;
}
function useAuth(){return useContext(AuthCtx);}

// TOAST
function useToast(){const[t,setT]=useState(null);const show=useCallback((m,ty="success")=>{setT({m,ty});setTimeout(()=>setT(null),3500);},[]);return{toast:t,show};}
function Toast({toast:t}){
  if(!t)return null;
  const c={success:{c:T.sc,Icon:CheckCircle},error:{c:T.dg,Icon:AlertCircle},warning:{c:T.wn,Icon:AlertTriangle}};
  const s=c[t.ty]||c.success;
  return<div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:12,background:T.bgC,border:`1px solid ${s.c}30`,boxShadow:"0 12px 40px rgba(0,0,0,0.5)",animation:"slideIn .3s ease",fontSize:13,fontWeight:500,color:s.c}}><s.Icon size={16}/>{t.m}</div>;
}

// COMPONENTS
function Badge({status}){const c=STATUS[status]||STATUS.cinza;return<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,color:c.c,background:`${c.c}15`,border:`1px solid ${c.c}30`,textTransform:"uppercase",whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.c}}/>{c.l}</span>;}
function Flag({on,icon:I,label}){if(!on)return null;return<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:600,color:T.ac,background:T.acB,border:`1px solid ${T.ac}25`,textTransform:"uppercase"}}><I size={10}/>{label}</span>;}
function Stat({icon:I,label,value,color,bgColor,sub,ld}){return<div style={{background:T.bgC,borderRadius:14,padding:"18px 20px",border:`1px solid ${T.bd}`,flex:"1 1 160px",minWidth:140}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:bgColor||T.acB,color:color||T.ac}}><I size={18}/></div><span style={{fontSize:11,color:T.txM,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase"}}>{label}</span></div><div style={{fontSize:26,fontWeight:700,color:color||T.tx}}>{ld?<Loader2 size={22} style={{animation:"spin 1s linear infinite"}}/>:value}</div>{sub&&<div style={{fontSize:11,color:T.txD,marginTop:4}}>{sub}</div>}</div>;}
function Btn({children,onClick,variant="default",size="md",icon:I,disabled,loading:ld,style:es}){
  const sty={primary:{bg:T.ac,c:"#0C0C0E"},danger:{bg:T.dg,c:"#fff"},ghost:{bg:"transparent",c:T.txM},default:{bg:T.bgI,c:T.tx}};
  const s=sty[variant]||sty.default;const pd=size==="sm"?"6px 12px":size==="lg"?"12px 24px":"8px 16px";const fz=size==="sm"?12:size==="lg"?15:13;
  return<button onClick={onClick} disabled={disabled||ld} style={{display:"inline-flex",alignItems:"center",gap:6,padding:pd,borderRadius:10,border:`1px solid ${T.bd}`,background:s.bg,color:s.c,fontSize:fz,fontWeight:600,cursor:(disabled||ld)?"not-allowed":"pointer",opacity:(disabled||ld)?0.5:1,fontFamily:font,...es}}>{ld?<Loader2 size={fz} style={{animation:"spin 1s linear infinite"}}/>:I&&<I size={fz}/>}{children}</button>;
}
function Inp({label,value,onChange,placeholder,type="text",icon:I,style:es,...props}){
  return<div style={{display:"flex",flexDirection:"column",gap:6,...es}}>{label&&<label style={{fontSize:12,fontWeight:600,color:T.txM,letterSpacing:"0.04em",textTransform:"uppercase"}}>{label}</label>}<div style={{position:"relative"}}>{I&&<I size={16} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.txD}}/>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:I?"10px 14px 10px 38px":"10px 14px",background:T.bgI,border:`1px solid ${T.bd}`,borderRadius:10,color:T.tx,fontSize:14,fontFamily:font,outline:"none",boxSizing:"border-box"}} {...props}/></div></div>;
}
function Sel({label,value,onChange,options,placeholder,style:es}){
  return<div style={{display:"flex",flexDirection:"column",gap:6,...es}}>{label&&<label style={{fontSize:12,fontWeight:600,color:T.txM,letterSpacing:"0.04em",textTransform:"uppercase"}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",background:T.bgI,border:`1px solid ${T.bd}`,borderRadius:10,color:value?T.tx:T.txD,fontSize:14,fontFamily:font,outline:"none",cursor:"pointer",boxSizing:"border-box"}}><option value="">{placeholder||"Selecione..."}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
}
function Modal({open,onClose,title,children,width=540}){
  if(!open)return null;
  return<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"}}><div onClick={e=>e.stopPropagation()} style={{background:T.bgC,borderRadius:18,border:`1px solid ${T.bd}`,width:"90%",maxWidth:width,maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.5)"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:`1px solid ${T.bd}`}}><h3 style={{fontSize:16,fontWeight:700,color:T.tx,margin:0}}>{title}</h3><button onClick={onClose} style={{background:"none",border:"none",color:T.txM,cursor:"pointer",padding:4,borderRadius:8,display:"flex"}}><X size={18}/></button></div><div style={{padding:24}}>{children}</div></div></div>;
}
function Empty({icon:I,title,desc}){return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",color:T.txD,textAlign:"center"}}><I size={48} strokeWidth={1} style={{marginBottom:16,opacity:0.4}}/><div style={{fontSize:16,fontWeight:600,color:T.txM,marginBottom:6}}>{title}</div><div style={{fontSize:13}}>{desc}</div></div>;}
function Spinner(){return<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:60}}><Loader2 size={32} color={T.ac} style={{animation:"spin 1s linear infinite"}}/></div>;}

// PASSWORD CELL
function PwCell({id,type="bank",showToast}){
  const[vis,setVis]=useState(false);const[pw,setPw]=useState(null);const[ld,setLd]=useState(false);const[cp,setCp]=useState(false);
  const reveal=async()=>{
    if(vis){setVis(false);return;}setLd(true);
    try{
      const fn=type==="promotora"?"reveal_promotora_password":"reveal_password";
      const{data,error}=await supabase.rpc(fn,{p_credential_id:id});
      if(error)throw error;setPw(data);setVis(true);
    }catch(e){showToast?.("Erro: "+e.message,"error");}setLd(false);
  };
  const copy=()=>{if(pw){navigator.clipboard?.writeText(pw);setCp(true);showToast?.("Copiada!","success");setTimeout(()=>setCp(false),2000);}};
  return<div style={{display:"flex",alignItems:"center",gap:6}}>
    <code style={{fontFamily:mono,fontSize:13,color:vis?T.ac:T.txD,background:vis?T.acB:"transparent",padding:vis?"2px 8px":0,borderRadius:6,letterSpacing:vis?"0.05em":"0.15em"}}>{vis&&pw?pw:"••••••••"}</code>
    <button onClick={reveal} style={{background:"none",border:"none",color:T.txD,cursor:"pointer",padding:2,display:"flex"}}>{ld?<Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>:vis?<EyeOff size={14}/>:<Eye size={14}/>}</button>
    {vis&&pw&&<button onClick={copy} style={{background:"none",border:"none",color:cp?T.sc:T.txD,cursor:"pointer",padding:2,display:"flex"}}>{cp?<Check size={14}/>:<Copy size={14}/>}</button>}
  </div>;
}

// ============================================================
// DASHBOARD
// ============================================================
function DashboardPage({showToast}){
  const[stats,setStats]=useState(null);const[audit,setAudit]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){
    setLd(true);
    const[st,au]=await Promise.all([supabase.from("dashboard_stats").select("*").single(),supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(5)]);
    setStats(st.data);setAudit(au.data||[]);setLd(false);
  }
  const s=stats||{};
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Dashboard</h2><p style={{fontSize:14,color:T.txM,margin:0}}>Visão geral do LhamasCred Vault</p></div>
      <Btn icon={RefreshCw} onClick={load} loading={ld} size="sm">Atualizar</Btn>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:14,marginBottom:28}}>
      <Stat icon={Users} label="Operadores" value={s.total_operators??0} ld={ld}/>
      <Stat icon={Building2} label="Bancos" value={s.total_banks??0} ld={ld}/>
      <Stat icon={Key} label="Cred. Banco" value={s.total_bank_credentials??0} color={T.ac} bgColor={T.acB} ld={ld}/>
      <Stat icon={Briefcase} label="Promotoras" value={s.total_promotoras??0} color={T.in} bgColor={T.inB} ld={ld}/>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:14,marginBottom:28}}>
      <Stat icon={Key} label="Cred. Promotora" value={s.total_promotora_credentials??0} color="#D4537E" bgColor="rgba(212,83,126,0.08)" ld={ld}/>
      <Stat icon={UserCheck} label="Aprovadores" value={s.total_approvers??0} ld={ld}/>
      <Stat icon={Bot} label="Robôs" value={s.total_robots??0} color={T.in} bgColor={T.inB} ld={ld}/>
      <Stat icon={Store} label="Visão Loja" value={s.total_store_view??0} ld={ld}/>
    </div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,padding:20}}>
      <h3 style={{fontSize:14,fontWeight:700,color:T.tx,margin:"0 0 16px",display:"flex",alignItems:"center",gap:8}}><FileText size={16} color={T.ac}/>Atividade recente</h3>
      {audit.length===0&&!ld&&<p style={{fontSize:13,color:T.txD,textAlign:"center",padding:20}}>Nenhuma atividade</p>}
      {audit.map(a=><div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.bd}22`}}>
        <div style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:a.action==="view_password"?T.wnB:a.action==="create"?T.scB:T.inB,color:a.action==="view_password"?T.wn:a.action==="create"?T.sc:T.in}}>{a.action==="view_password"?<Eye size={14}/>:a.action==="create"?<Plus size={14}/>:<Edit3 size={14}/>}</div>
        <div style={{flex:1}}><div style={{fontSize:13,color:T.tx,fontWeight:500}}>{a.action==="view_password"?"Senha visualizada":"Ação: "+a.action}</div><div style={{fontSize:11,color:T.txD}}>{a.user_email} · {new Date(a.created_at).toLocaleString("pt-BR")}</div></div>
      </div>)}
    </div>
  </div>;
}

// ============================================================
// BANK CREDENTIALS PAGE (grouped by bank → section)
// ============================================================
function BankCredsPage({showToast}){
  const[creds,setCreds]=useState([]);const[banks,setBanks]=useState([]);const[sections,setSections]=useState([]);
  const[operators,setOps]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  const[filterBank,setFB]=useState("");const[showFilters,setSF]=useState(false);

  useEffect(()=>{load();},[]);
  async function load(){
    setLd(true);
    const[cr,bk,sc,op]=await Promise.all([
      supabase.from("bank_credentials_view").select("*").order("bank_name").order("section_code").order("username"),
      supabase.from("banks").select("*").eq("is_active",true).order("display_order"),
      supabase.from("bank_sections").select("*").order("display_order"),
      supabase.from("operators").select("*").eq("is_active",true).order("name"),
    ]);
    setCreds(cr.data||[]);setBanks(bk.data||[]);setSections(sc.data||[]);setOps(op.data||[]);setLd(false);
  }

  const filtered=useMemo(()=>{
    return creds.filter(c=>{
      const q=search.toLowerCase();
      const ms=!q||c.username?.toLowerCase().includes(q)||c.operator_name?.toLowerCase().includes(q)||c.bank_name?.toLowerCase().includes(q)||c.section_code?.toLowerCase().includes(q)||c.observation?.toLowerCase().includes(q);
      return ms&&(!filterBank||c.bank_id===filterBank);
    });
  },[creds,search,filterBank]);

  // Group by bank → section
  const grouped=useMemo(()=>{
    const g={};
    filtered.forEach(c=>{
      const bk=c.bank_short_name||c.bank_name;
      if(!g[bk])g[bk]={};
      const sc=c.section_code||"PRINCIPAL";
      if(!g[bk][sc])g[bk][sc]=[];
      g[bk][sc].push(c);
    });
    return g;
  },[filtered]);

  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Credenciais de banco</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{filtered.length} de {creds.length} credenciais</p></div>
      <Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn>
    </div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,padding:16}}>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <div style={{flex:1}}><Inp value={search} onChange={setSearch} placeholder="Buscar usuário, banco, seção..." icon={Search}/></div>
        <Btn icon={Filter} onClick={()=>setSF(!showFilters)}>Filtros</Btn>
      </div>
      {showFilters&&<div style={{display:"flex",gap:12,marginTop:14,flexWrap:"wrap"}}>
        <Sel value={filterBank} onChange={setFB} placeholder="Todos os bancos" options={banks.map(b=>({value:b.id,label:b.short_name||b.name}))} style={{flex:"1 1 200px"}}/>
        {filterBank&&<Btn variant="ghost" size="sm" onClick={()=>setFB("")}>Limpar</Btn>}
      </div>}
    </div>

    {Object.keys(grouped).length===0&&<div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`}}><Empty icon={Key} title="Nenhuma credencial" desc="Altere os filtros"/></div>}

    {Object.entries(grouped).map(([bankName,sections])=>(
      <div key={bankName} style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.bd}`,background:T.bgI,display:"flex",alignItems:"center",gap:10}}>
          <Building2 size={16} color={T.ac}/>
          <span style={{fontSize:15,fontWeight:700,color:T.ac}}>{bankName}</span>
          <span style={{fontSize:12,color:T.txD}}>({Object.values(sections).flat().length} credenciais)</span>
        </div>
        {Object.entries(sections).map(([secCode,secCreds])=>(
          <div key={secCode}>
            {secCode!=="PRINCIPAL"&&<div style={{padding:"8px 18px",background:`${T.ac}08`,borderBottom:`1px solid ${T.bd}22`}}>
              <span style={{fontSize:12,fontWeight:600,color:T.txM,textTransform:"uppercase",letterSpacing:"0.04em"}}>{secCode}</span>
            </div>}
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{borderBottom:`1px solid ${T.bd}22`}}>
                  {["Usuário","Senha","Status","Observação","Loja","Robô","Aprov.","Atualiz."].map((h,i)=><th key={i} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
                </tr></thead>
                <tbody>{secCreds.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${T.bd}11`}} onMouseEnter={e=>e.currentTarget.style.background=T.bgH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"8px 14px"}}><code style={{fontFamily:mono,fontSize:12,color:T.txM,background:T.bgI,padding:"2px 6px",borderRadius:4}}>{c.username}</code></td>
                  <td style={{padding:"8px 14px"}}><PwCell id={c.id} type="bank" showToast={showToast}/></td>
                  <td style={{padding:"8px 14px"}}><Badge status={c.status}/></td>
                  <td style={{padding:"8px 14px",color:T.txD,fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.observation||"—"}</td>
                  <td style={{padding:"8px 14px"}}>{c.has_store_view?<Flag on icon={Store} label="SIM"/>:<span style={{color:T.txD,fontSize:11}}>NÃO</span>}</td>
                  <td style={{padding:"8px 14px"}}>{c.is_robot?<Flag on icon={Bot} label="SIM"/>:<span style={{color:T.txD,fontSize:11}}>NÃO</span>}</td>
                  <td style={{padding:"8px 14px"}}>{c.is_approver?<Flag on icon={UserCheck} label="SIM"/>:<span style={{color:T.txD,fontSize:11}}>NÃO</span>}</td>
                  <td style={{padding:"8px 14px",color:T.txD,fontSize:12,fontFamily:mono}}>{c.last_password_update?new Date(c.last_password_update).toLocaleDateString("pt-BR"):"—"}</td>
                </tr>)}</tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>;
}

// ============================================================
// PROMOTORA CREDENTIALS PAGE
// ============================================================
function PromCredsPage({showToast}){
  const[creds,setCreds]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  useEffect(()=>{load();},[]);
  async function load(){
    setLd(true);
    const{data}=await supabase.from("promotora_credentials_view").select("*").order("promotora_name").order("seq_id");
    setCreds(data||[]);setLd(false);
  }
  const filtered=useMemo(()=>{
    const q=search.toLowerCase();
    return creds.filter(c=>!q||c.login_username?.toLowerCase().includes(q)||c.person_name?.toLowerCase().includes(q)||c.promotora_name?.toLowerCase().includes(q)||c.sector?.toLowerCase().includes(q));
  },[creds,search]);

  const grouped=useMemo(()=>{
    const g={};
    filtered.forEach(c=>{const p=c.promotora_name||"Outro";if(!g[p])g[p]=[];g[p].push(c);});
    return g;
  },[filtered]);

  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Credenciais de promotora</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{filtered.length} credenciais em {Object.keys(grouped).length} promotoras</p></div>
      <Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn>
    </div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar login, pessoa, promotora, setor..." icon={Search}/></div>

    {Object.entries(grouped).map(([promName,promCreds])=>(
      <div key={promName} style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.bd}`,background:T.bgI,display:"flex",alignItems:"center",gap:10}}>
          <Briefcase size={16} color="#D4537E"/>
          <span style={{fontSize:15,fontWeight:700,color:"#D4537E"}}>{promName}</span>
          <span style={{fontSize:12,color:T.txD}}>({promCreds.length})</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:`1px solid ${T.bd}22`}}>
              {["ID","Login","Senha","Pessoa","Setor","Ramal","Cód.Parc","Atualiz.","Ativo"].map((h,i)=><th key={i} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
            </tr></thead>
            <tbody>{promCreds.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${T.bd}11`}} onMouseEnter={e=>e.currentTarget.style.background=T.bgH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"8px 14px",color:T.txD,fontSize:12}}>{c.seq_id||"—"}</td>
              <td style={{padding:"8px 14px"}}><code style={{fontFamily:mono,fontSize:11,color:T.txM,background:T.bgI,padding:"2px 6px",borderRadius:4}}>{c.login_username}</code></td>
              <td style={{padding:"8px 14px"}}><PwCell id={c.id} type="promotora" showToast={showToast}/></td>
              <td style={{padding:"8px 14px",color:T.tx,fontWeight:500}}>{c.person_name||"—"}</td>
              <td style={{padding:"8px 14px"}}>{c.sector?<span style={{fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:12,color:c.sector==="MASTER"?T.ac:c.sector==="FINANCEIRO"?T.wn:T.txM,background:c.sector==="MASTER"?T.acB:c.sector==="FINANCEIRO"?T.wnB:T.bgI}}>{c.sector}</span>:"—"}</td>
              <td style={{padding:"8px 14px",color:T.txD,fontSize:12}}>{c.ramal&&c.ramal!=="---"?c.ramal:"—"}</td>
              <td style={{padding:"8px 14px",color:T.txD,fontSize:12,fontFamily:mono}}>{c.partner_code&&c.partner_code!=="---"?c.partner_code:"—"}</td>
              <td style={{padding:"8px 14px",color:T.txD,fontSize:12}}>{c.last_password_update?new Date(c.last_password_update).toLocaleDateString("pt-BR"):"—"}</td>
              <td style={{padding:"8px 14px"}}><span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,textTransform:"uppercase",color:c.is_active?T.sc:T.dg,background:c.is_active?T.scB:T.dgB}}>{c.is_active?"Ativo":"Inativo"}</span></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    ))}
  </div>;
}

// ============================================================
// OPERATORS PAGE
// ============================================================
function OperatorsPage({showToast}){
  const[ops,setOps]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("operators").select("*").order("name");setOps(data||[]);setLd(false);}
  const filtered=ops.filter(o=>{const q=search.toLowerCase();return!q||o.name?.toLowerCase().includes(q)||o.email?.toLowerCase().includes(q)||o.code?.includes(q);});
  if(ld)return<Spinner/>;
  return<div>
    <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Operadores</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{ops.filter(o=>o.is_active).length} ativos de {ops.length}</p></div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar nome, email, código..." icon={Search}/></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
      {filtered.map(op=><div key={op.id} style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,padding:20,opacity:op.is_active?1:0.5}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:40,height:40,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:T.ac,background:T.acB,border:`1px solid ${T.ac}25`}}>{op.name.charAt(0)}</div>
          <div><div style={{fontSize:15,fontWeight:600,color:T.tx}}>{op.name}</div><div style={{fontSize:12,color:T.txD}}>{op.email||"—"}</div></div>
          {!op.is_active&&<span style={{fontSize:10,fontWeight:700,color:T.dg,background:T.dgB,padding:"3px 8px",borderRadius:12,textTransform:"uppercase",marginLeft:"auto"}}>Inativo</span>}
        </div>
        <div style={{display:"flex",gap:16,fontSize:12,color:T.txM}}>
          {op.code&&<span>Código: <strong style={{color:T.tx}}>{op.code}</strong></span>}
          {op.cpf&&<span>CPF: <strong style={{color:T.tx}}>{op.cpf}</strong></span>}
        </div>
      </div>)}
    </div>
  </div>;
}

// ============================================================
// BANKS PAGE
// ============================================================
function BanksPage({showToast}){
  const[banks,setBanks]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("banks").select("*").order("display_order");setBanks(data||[]);setLd(false);}
  const filtered=banks.filter(b=>{const q=search.toLowerCase();return!q||b.name?.toLowerCase().includes(q)||b.short_name?.toLowerCase().includes(q);});
  const subs=filtered.filter(b=>b.name?.startsWith("SUB "));
  const directs=filtered.filter(b=>!b.name?.startsWith("SUB "));
  if(ld)return<Spinner/>;
  
  const renderTable=(list,title,color)=>(
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,overflow:"hidden"}}>
      <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.bd}`,background:T.bgI}}>
        <span style={{fontSize:13,fontWeight:700,color}}>{title}</span>
        <span style={{fontSize:12,color:T.txD,marginLeft:8}}>({list.length})</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <tbody>{list.map(b=><tr key={b.id} style={{borderBottom:`1px solid ${T.bd}11`}} onMouseEnter={e=>e.currentTarget.style.background=T.bgH} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"10px 14px",color:T.tx,fontWeight:500}}>{b.name}</td>
          <td style={{padding:"10px 14px"}}><code style={{fontFamily:mono,fontSize:12,color:T.ac,background:T.acB,padding:"2px 6px",borderRadius:4}}>{b.short_name||"—"}</code></td>
          <td style={{padding:"10px 14px",color:T.txM,fontSize:12}}>{b.default_promotora||"—"}</td>
          <td style={{padding:"10px 14px"}}>{b.url?<a href={b.url} target="_blank" rel="noopener noreferrer" style={{color:T.in,fontSize:12,display:"flex",alignItems:"center",gap:4}}><ExternalLink size={12}/>Acessar</a>:<span style={{color:T.txD}}>—</span>}</td>
        </tr>)}</tbody>
      </table>
    </div>
  );

  return<div>
    <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Bancos e sistemas</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{banks.length} cadastrados ({subs.length} via promotora, {directs.length} diretos)</p></div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar banco..." icon={Search}/></div>
    {renderTable(subs,"Via promotora (SUB)",T.ac)}
    {renderTable(directs,"Acesso direto",T.in)}
  </div>;
}

// ============================================================
// OPERATOR BANK MAP PAGE
// ============================================================
function MapPage({showToast}){
  const[map,setMap]=useState([]);const[ld,setLd]=useState(true);const[search,setSearch]=useState("");
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("operator_bank_map_view").select("*").order("operator_name").order("bank_name");setMap(data||[]);setLd(false);}
  const filtered=map.filter(m=>{const q=search.toLowerCase();return!q||m.bank_name?.toLowerCase().includes(q)||m.promotora_name?.toLowerCase().includes(q)||m.operator_name?.toLowerCase().includes(q);});
  const grouped=useMemo(()=>{const g={};filtered.forEach(m=>{const op=m.operator_name;if(!g[op])g[op]=[];g[op].push(m);});return g;},[filtered]);
  if(ld)return<Spinner/>;
  return<div>
    <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Mapa banco × promotora</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{map.length} mapeamentos por operador</p></div>
    <div style={{marginBottom:16}}><Inp value={search} onChange={setSearch} placeholder="Buscar banco, promotora, operador..." icon={Search}/></div>
    {Object.entries(grouped).map(([opName,items])=>(
      <div key={opName} style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,marginBottom:16,overflow:"hidden"}}>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.bd}`,background:T.bgI,display:"flex",alignItems:"center",gap:8}}>
          <Users size={16} color={T.ac}/><span style={{fontSize:14,fontWeight:700,color:T.tx}}>{opName}</span><span style={{fontSize:12,color:T.txD}}>({items.length} bancos)</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:1,background:T.bd}}>
          {items.map(m=><div key={m.id} style={{padding:"10px 14px",background:T.bgC,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:T.tx}}>{m.bank_name}</span>
            <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:12,color:T.ac,background:T.acB}}>{m.promotora_name}</span>
          </div>)}
        </div>
      </div>
    ))}
  </div>;
}

// ============================================================
// CERTIFICATES PAGE
// ============================================================
function CertsPage({showToast}){
  const[certs,setCerts]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("certificates").select("*").order("operator_name");setCerts(data||[]);setLd(false);}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Certificados</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{certs.length} certificados cadastrados</p></div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,overflow:"hidden"}}>
      {certs.length===0?<Empty icon={Award} title="Nenhum certificado" desc=""/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:`1px solid ${T.bd}`}}>
          {["Nome","CPF","Nº Cert.","ANEPS","Validade","PLDFT","Val. PLDFT","Doc"].map((h,i)=><th key={i} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase"}}>{h}</th>)}
        </tr></thead>
        <tbody>{certs.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${T.bd}11`}}>
          <td style={{padding:"10px 14px",color:T.tx,fontWeight:500}}>{c.operator_name}</td>
          <td style={{padding:"10px 14px",fontFamily:mono,fontSize:12,color:T.txM}}>{c.cpf}</td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txM}}>{c.cert_number||"—"}</td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txM}}>{c.aneps_code||"—"}</td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txM}}>{c.aneps_expiry?new Date(c.aneps_expiry).toLocaleDateString("pt-BR"):"—"}</td>
          <td style={{padding:"10px 14px"}}>{c.has_pldft?<span style={{color:T.sc,fontSize:11,fontWeight:600}}>SIM</span>:<span style={{color:T.txD,fontSize:11}}>NÃO</span>}</td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txM}}>{c.pldft_expiry?new Date(c.pldft_expiry).toLocaleDateString("pt-BR"):"—"}</td>
          <td style={{padding:"10px 14px"}}>{c.has_document?<Check size={14} color={T.sc}/>:<X size={14} color={T.txD}/>}</td>
        </tr>)}</tbody>
      </table>}
    </div>
  </div>;
}

// ============================================================
// USERS MANAGEMENT PAGE
// ============================================================
function UsersPage({showToast}){
  const[profiles,setProfiles]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("profiles").select("*").order("created_at",{ascending:false});setProfiles(data||[]);setLd(false);}
  
  async function changeRole(profileId,newRole){
    const{error}=await supabase.from("profiles").update({role:newRole}).eq("id",profileId);
    if(error){showToast("Erro: "+error.message,"error");}else{showToast("Role atualizada!","success");load();}
  }

  if(ld)return<Spinner/>;
  return<div>
    <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Usuários do sistema</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{profiles.length} usuários cadastrados</p></div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,overflow:"hidden"}}>
      {profiles.length===0?<Empty icon={UserCog} title="Nenhum usuário" desc="Crie contas pela tela de login"/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:`1px solid ${T.bd}`}}>
          {["Nome","Email","Role","Status","Criado em","Ações"].map((h,i)=><th key={i} style={{padding:"12px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase"}}>{h}</th>)}
        </tr></thead>
        <tbody>{profiles.map(p=><tr key={p.id} style={{borderBottom:`1px solid ${T.bd}11`}}>
          <td style={{padding:"10px 14px",color:T.tx,fontWeight:500}}>{p.full_name}</td>
          <td style={{padding:"10px 14px",fontFamily:mono,fontSize:12,color:T.txM}}>{p.email}</td>
          <td style={{padding:"10px 14px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,textTransform:"uppercase",color:p.role==="admin"?T.ac:p.role==="supervisor"?"#D4537E":T.in,background:p.role==="admin"?T.acB:p.role==="supervisor"?"rgba(212,83,126,0.08)":T.inB}}>{p.role}</span></td>
          <td style={{padding:"10px 14px"}}><span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,color:p.is_active?T.sc:T.dg,background:p.is_active?T.scB:T.dgB}}>{p.is_active?"Ativo":"Inativo"}</span></td>
          <td style={{padding:"10px 14px",fontSize:12,color:T.txD}}>{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
          <td style={{padding:"10px 14px"}}>
            <select value={p.role} onChange={e=>changeRole(p.id,e.target.value)} style={{background:T.bgI,border:`1px solid ${T.bd}`,borderRadius:8,color:T.tx,padding:"4px 8px",fontSize:12,fontFamily:font,cursor:"pointer"}}>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
              <option value="operator">Operador</option>
            </select>
          </td>
        </tr>)}</tbody>
      </table>}
    </div>
  </div>;
}

// ============================================================
// AUDIT PAGE
// ============================================================
function AuditPage(){
  const[logs,setLogs]=useState([]);const[ld,setLd]=useState(true);
  useEffect(()=>{load();},[]);
  async function load(){setLd(true);const{data}=await supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(100);setLogs(data||[]);setLd(false);}
  if(ld)return<Spinner/>;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:T.tx,margin:"0 0 6px"}}>Auditoria</h2><p style={{fontSize:14,color:T.txM,margin:0}}>{logs.length} registros</p></div>
      <Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn>
    </div>
    <div style={{background:T.bgC,borderRadius:14,border:`1px solid ${T.bd}`,overflow:"hidden"}}>
      {logs.length===0?<Empty icon={FileText} title="Nenhum registro" desc="Ações serão registradas aqui"/>:
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:`1px solid ${T.bd}`}}>{["Data/Hora","Usuário","Ação","Tipo"].map((h,i)=><th key={i} style={{padding:"12px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.txD,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{logs.map(a=><tr key={a.id} style={{borderBottom:`1px solid ${T.bd}11`}}>
          <td style={{padding:"10px 14px",color:T.txD,fontSize:12,fontFamily:mono}}>{new Date(a.created_at).toLocaleString("pt-BR")}</td>
          <td style={{padding:"10px 14px",color:T.tx,fontWeight:500}}>{a.user_email||"—"}</td>
          <td style={{padding:"10px 14px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,textTransform:"uppercase",color:a.action==="view_password"?T.wn:T.in,background:a.action==="view_password"?T.wnB:T.inB}}>{a.action}</span></td>
          <td style={{padding:"10px 14px",color:T.txM}}>{a.entity_type}</td>
        </tr>)}</tbody>
      </table>}
    </div>
  </div>;
}

// ============================================================
// LOGIN
// ============================================================
function LoginPage(){
  const{signIn,signUp}=useAuth();
  const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[name,setName]=useState("");
  const[isUp,setIsUp]=useState(false);const[ld,setLd]=useState(false);const[err,setErr]=useState("");
  async function go(){
    if(!email||!pw){setErr("Preencha email e senha");return;}
    setLd(true);setErr("");
    try{
      if(isUp){await signUp(email,pw,name);setIsUp(false);alert("Conta criada! Faça login.");}
      else{await signIn(email,pw);}
    }catch(e){setErr(e.message==="Invalid login credentials"?"Email ou senha incorretos":e.message);}
    setLd(false);
  }
  return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:font}}>
    <div style={{width:420,background:T.bgC,borderRadius:20,border:`1px solid ${T.bd}`,padding:"40px 36px",boxShadow:"0 24px 80px rgba(0,0,0,0.4)"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:56,height:56,borderRadius:16,margin:"0 auto 16px",background:`linear-gradient(135deg,${T.ac},${T.acD})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${T.ac}40`}}><Shield size={28} color="#0C0C0E"/></div>
        <h1 style={{fontSize:22,fontWeight:800,color:T.tx,margin:"0 0 6px"}}>LhamasCred Vault</h1>
        <p style={{fontSize:13,color:T.txM,margin:0}}>Central de credenciais bancárias</p>
      </div>
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
// MAIN APP
// ============================================================
const NAV=[
  {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},
  {id:"bank_creds",label:"Bancos",icon:Key},
  {id:"prom_creds",label:"Promotoras",icon:Briefcase},
  {id:"map",label:"Mapa",icon:Network},
  {id:"operators",label:"Operadores",icon:Users},
  {id:"banks_list",label:"Lista Bancos",icon:Building2},
  {id:"certificates",label:"Certificados",icon:Award},
  {id:"users",label:"Usuários",icon:UserCog},
  {id:"audit",label:"Auditoria",icon:FileText},
];

function AppLayout(){
  const{profile,signOut}=useAuth();
  const[page,setPage]=useState("dashboard");
  const[col,setCol]=useState(false);
  const{toast,show}=useToast();
  const render=()=>{
    switch(page){
      case"dashboard":return<DashboardPage showToast={show}/>;
      case"bank_creds":return<BankCredsPage showToast={show}/>;
      case"prom_creds":return<PromCredsPage showToast={show}/>;
      case"map":return<MapPage showToast={show}/>;
      case"operators":return<OperatorsPage showToast={show}/>;
      case"banks_list":return<BanksPage showToast={show}/>;
      case"certificates":return<CertsPage showToast={show}/>;
      case"users":return<UsersPage showToast={show}/>;
      case"audit":return<AuditPage/>;
      default:return<DashboardPage showToast={show}/>;
    }
  };
  return<div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:font,color:T.tx}}>
    <Toast toast={toast}/>
    <div style={{width:col?68:220,background:T.bgC,borderRight:`1px solid ${T.bd}`,display:"flex",flexDirection:"column",transition:"width .2s",flexShrink:0}}>
      <div style={{padding:col?"20px 12px":"20px 16px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:`linear-gradient(135deg,${T.ac},${T.acD})`,display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={18} color="#0C0C0E"/></div>
        {!col&&<div><div style={{fontSize:14,fontWeight:800}}>LhamasCred</div><div style={{fontSize:10,color:T.txD,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>Vault</div></div>}
      </div>
      <nav style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>
        {NAV.map(n=>{const a=page===n.id;return<button key={n.id} onClick={()=>setPage(n.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:10,border:"none",cursor:"pointer",background:a?T.acB:"transparent",color:a?T.ac:T.txM,fontSize:12,fontWeight:a?600:500,fontFamily:font,marginBottom:2,justifyContent:col?"center":"flex-start"}}><n.icon size={16}/>{!col&&n.label}</button>;})}
      </nav>
      <div style={{padding:"8px 6px",borderTop:`1px solid ${T.bd}`}}>
        <button onClick={()=>setCol(!col)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",borderRadius:10,border:"none",background:"transparent",color:T.txD,cursor:"pointer",fontSize:12,fontFamily:font,justifyContent:col?"center":"flex-start"}}>{col?<ChevronRight size={16}/>:<><ChevronLeft size={16}/>Recolher</>}</button>
        <button onClick={signOut} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",borderRadius:10,border:"none",background:"transparent",color:T.txD,cursor:"pointer",fontSize:12,fontFamily:font,justifyContent:col?"center":"flex-start",marginTop:2}}><LogOut size={16}/>{!col&&"Sair"}</button>
      </div>
    </div>
    <div style={{flex:1,overflow:"auto"}}>
      <div style={{padding:"12px 24px",borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bgC}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:T.txD}}><Shield size={14} color={T.ac}/><span>Central bancária</span><span style={{color:T.bd}}>·</span><span style={{color:T.ac,fontWeight:600}}>{NAV.find(n=>n.id===page)?.label}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{textAlign:"right"}}><div style={{fontSize:12,color:T.tx,fontWeight:500}}>{profile?.full_name||"Usuário"}</div><div style={{fontSize:10,color:T.txD,textTransform:"uppercase"}}>{profile?.role||"operator"}</div></div>
          <div style={{width:32,height:32,borderRadius:10,background:T.acB,color:T.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>{(profile?.full_name||"U").charAt(0)}</div>
        </div>
      </div>
      <div style={{padding:24}}>{render()}</div>
    </div>
  </div>;
}

export default function App(){
  return<><style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style><AuthProvider><AppInner/></AuthProvider></>;
}
function AppInner(){
  const{session,loading}=useAuth();
  if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,fontFamily:font}}><Loader2 size={32} color={T.ac} style={{animation:"spin 1s linear infinite"}}/></div>;
  return session?<AppLayout/>:<LoginPage/>;
}
