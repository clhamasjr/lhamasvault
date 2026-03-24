import { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { supabase } from "./lib/supabase";
import {
  Shield, Key, Building2, Users, Eye, EyeOff, Search, Plus, Edit3, Trash2,
  ChevronDown, ChevronRight, LogOut, LayoutDashboard, FileText, AlertTriangle,
  CheckCircle, XCircle, Copy, ExternalLink, Filter, RefreshCw, Clock,
  Lock, Unlock, Bot, Store, UserCheck, X, Check, ChevronLeft, Settings,
  Loader2, Upload, Download, AlertCircle
} from "lucide-react";

const font = `'DM Sans', 'Segoe UI', system-ui, -apple-system, sans-serif`;
const mono = `'JetBrains Mono', 'SF Mono', 'Consolas', monospace`;

const theme = {
  bg: "#0C0C0E", bgCard: "#141418", bgCardHover: "#1A1A20",
  bgInput: "#1E1E24", border: "#2A2A32", borderLight: "#35353F",
  text: "#E8E6E1", textMuted: "#8A8A96", textDim: "#5A5A66",
  accent: "#C9A84C", accentDim: "#A08530", accentBg: "rgba(201,168,76,0.08)",
  danger: "#E24B4A", dangerBg: "rgba(226,75,74,0.08)",
  success: "#4CAF50", successBg: "rgba(76,175,80,0.08)",
  warning: "#EF9F27", warningBg: "rgba(239,159,39,0.08)",
  info: "#378ADD", infoBg: "rgba(55,138,221,0.08)",
};

const STATUS_CONFIG = {
  amarelo: { label: "Ativo", color: "#EF9F27" },
  laranja: { label: "Header", color: "#D85A30" },
  vermelho: { label: "Política", color: "#E24B4A" },
  verde: { label: "Instabilidade", color: "#639922" },
  azul_claro: { label: "Padrão", color: "#378ADD" },
  rosa: { label: "Aprovador", color: "#D4537E" },
  roxo: { label: "Master", color: "#7F77DD" },
  azul_bebe: { label: "Robô", color: "#85B7EB" },
  cinza: { label: "Inativo", color: "#888780" }
};

// AUTH CONTEXT
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);
  async function fetchProfile(uid) {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data);
    setLoading(false);
  }
  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }
  async function signUp(email, password, fullName) {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role: 'operator' } } });
    if (error) throw error;
  }
  async function signOut() { await supabase.auth.signOut(); setSession(null); setProfile(null); }
  return <AuthContext.Provider value={{ session, profile, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}
function useAuth() { return useContext(AuthContext); }

// TOAST
function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);
  return { toast, show };
}
function Toast({ toast }) {
  if (!toast) return null;
  const c = { success: { bg: theme.successBg, color: theme.success, Icon: CheckCircle }, error: { bg: theme.dangerBg, color: theme.danger, Icon: AlertCircle }, warning: { bg: theme.warningBg, color: theme.warning, Icon: AlertTriangle }, info: { bg: theme.infoBg, color: theme.info, Icon: AlertCircle } };
  const s = c[toast.type] || c.success;
  return <div style={{ position:"fixed",top:20,right:20,zIndex:9999,display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:12,background:theme.bgCard,border:`1px solid ${s.color}30`,boxShadow:"0 12px 40px rgba(0,0,0,0.5)",animation:"slideIn 0.3s ease",fontSize:13,fontWeight:500,color:s.color }}><s.Icon size={16}/>{toast.message}</div>;
}

// COMPONENTS
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.cinza;
  return <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,color:cfg.color,background:`${cfg.color}15`,border:`1px solid ${cfg.color}30`,letterSpacing:"0.02em",textTransform:"uppercase",whiteSpace:"nowrap" }}><span style={{ width:6,height:6,borderRadius:"50%",background:cfg.color }}/>{cfg.label}</span>;
}
function FlagPill({ active, icon: Icon, label }) {
  if (!active) return null;
  return <span style={{ display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:12,fontSize:10,fontWeight:600,color:theme.accent,background:theme.accentBg,border:`1px solid ${theme.accent}25`,letterSpacing:"0.03em",textTransform:"uppercase" }}><Icon size={10}/>{label}</span>;
}
function StatCard({ icon: Icon, label, value, color, bgColor, sub, loading: ld }) {
  return <div style={{ background:theme.bgCard,borderRadius:14,padding:"18px 20px",border:`1px solid ${theme.border}`,flex:"1 1 180px",minWidth:160 }}>
    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
      <div style={{ width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:bgColor||theme.accentBg,color:color||theme.accent }}><Icon size={18}/></div>
      <span style={{ fontSize:12,color:theme.textMuted,fontWeight:500,letterSpacing:"0.04em",textTransform:"uppercase" }}>{label}</span>
    </div>
    <div style={{ fontSize:28,fontWeight:700,color:color||theme.text,letterSpacing:"-0.02em" }}>{ld?<Loader2 size={24} style={{ animation:"spin 1s linear infinite" }}/>:value}</div>
    {sub&&<div style={{ fontSize:11,color:theme.textDim,marginTop:4 }}>{sub}</div>}
  </div>;
}
function Btn({ children, onClick, variant="default", size="md", icon: Icon, disabled, loading: ld, style: es }) {
  const styles = { primary:{bg:theme.accent,color:"#0C0C0E"},danger:{bg:theme.danger,color:"#fff"},ghost:{bg:"transparent",color:theme.textMuted},default:{bg:theme.bgInput,color:theme.text} };
  const s = styles[variant]||styles.default;
  const pad = size==="sm"?"6px 12px":size==="lg"?"12px 24px":"8px 16px";
  const fz = size==="sm"?12:size==="lg"?15:13;
  return <button onClick={onClick} disabled={disabled||ld} style={{ display:"inline-flex",alignItems:"center",gap:6,padding:pad,borderRadius:10,border:`1px solid ${theme.border}`,background:s.bg,color:s.color,fontSize:fz,fontWeight:600,cursor:(disabled||ld)?"not-allowed":"pointer",opacity:(disabled||ld)?0.5:1,transition:"all 0.15s",fontFamily:font,...es }}>{ld?<Loader2 size={fz} style={{ animation:"spin 1s linear infinite" }}/>:Icon&&<Icon size={fz}/>}{children}</button>;
}
function Input({ label, value, onChange, placeholder, type="text", icon: Icon, style: es, ...props }) {
  return <div style={{ display:"flex",flexDirection:"column",gap:6,...es }}>
    {label&&<label style={{ fontSize:12,fontWeight:600,color:theme.textMuted,letterSpacing:"0.04em",textTransform:"uppercase" }}>{label}</label>}
    <div style={{ position:"relative" }}>
      {Icon&&<Icon size={16} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:theme.textDim }}/>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ width:"100%",padding:Icon?"10px 14px 10px 38px":"10px 14px",background:theme.bgInput,border:`1px solid ${theme.border}`,borderRadius:10,color:theme.text,fontSize:14,fontFamily:font,outline:"none",boxSizing:"border-box" }} {...props}/>
    </div>
  </div>;
}
function Select({ label, value, onChange, options, placeholder, style: es }) {
  return <div style={{ display:"flex",flexDirection:"column",gap:6,...es }}>
    {label&&<label style={{ fontSize:12,fontWeight:600,color:theme.textMuted,letterSpacing:"0.04em",textTransform:"uppercase" }}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%",padding:"10px 14px",background:theme.bgInput,border:`1px solid ${theme.border}`,borderRadius:10,color:value?theme.text:theme.textDim,fontSize:14,fontFamily:font,outline:"none",cursor:"pointer",boxSizing:"border-box" }}>
      <option value="">{placeholder||"Selecione..."}</option>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>;
}
function Modal({ open, onClose, title, children, width=540 }) {
  if (!open) return null;
  return <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)" }}>
    <div onClick={e=>e.stopPropagation()} style={{ background:theme.bgCard,borderRadius:18,border:`1px solid ${theme.border}`,width:"90%",maxWidth:width,maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:`1px solid ${theme.border}` }}>
        <h3 style={{ fontSize:16,fontWeight:700,color:theme.text,margin:0 }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none",border:"none",color:theme.textMuted,cursor:"pointer",padding:4,borderRadius:8,display:"flex" }}><X size={18}/></button>
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  </div>;
}
function EmptyState({ icon: Icon, title, description }) {
  return <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 20px",color:theme.textDim,textAlign:"center" }}><Icon size={48} strokeWidth={1} style={{ marginBottom:16,opacity:0.4 }}/><div style={{ fontSize:16,fontWeight:600,color:theme.textMuted,marginBottom:6 }}>{title}</div><div style={{ fontSize:13 }}>{description}</div></div>;
}
function Spinner() { return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:60 }}><Loader2 size={32} color={theme.accent} style={{ animation:"spin 1s linear infinite" }}/></div>; }

// PASSWORD CELL
function PasswordCell({ credentialId, showToast }) {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleReveal = async () => {
    if (visible) { setVisible(false); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("reveal_password", { p_credential_id: credentialId });
      if (error) throw error;
      setPassword(data); setVisible(true);
    } catch (err) { showToast?.("Erro ao revelar senha: "+err.message,"error"); }
    setLoading(false);
  };
  const handleCopy = () => {
    if (password) { navigator.clipboard?.writeText(password); setCopied(true); showToast?.("Senha copiada!","success"); setTimeout(()=>setCopied(false),2000); }
  };
  return <div style={{ display:"flex",alignItems:"center",gap:6 }}>
    <code style={{ fontFamily:mono,fontSize:13,color:visible?theme.accent:theme.textDim,background:visible?theme.accentBg:"transparent",padding:visible?"2px 8px":0,borderRadius:6,letterSpacing:visible?"0.05em":"0.15em" }}>{visible&&password?password:"••••••••"}</code>
    <button onClick={handleReveal} style={{ background:"none",border:"none",color:theme.textDim,cursor:"pointer",padding:2,display:"flex",borderRadius:6 }}>{loading?<Loader2 size={14} style={{ animation:"spin 1s linear infinite" }}/>:visible?<EyeOff size={14}/>:<Eye size={14}/>}</button>
    {visible&&password&&<button onClick={handleCopy} style={{ background:"none",border:"none",color:copied?theme.success:theme.textDim,cursor:"pointer",padding:2,display:"flex",borderRadius:6 }}>{copied?<Check size={14}/>:<Copy size={14}/>}</button>}
  </div>;
}

// DASHBOARD
function DashboardPage({ showToast }) {
  const [stats, setStats] = useState(null);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ loadData(); },[]);
  async function loadData() {
    setLoading(true);
    const [st, au] = await Promise.all([
      supabase.from("dashboard_stats").select("*").single(),
      supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(5)
    ]);
    setStats(st.data); setAudit(au.data||[]); setLoading(false);
  }
  const s = stats||{};
  return <div>
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28 }}>
      <div><h2 style={{ fontSize:22,fontWeight:700,color:theme.text,margin:"0 0 6px" }}>Dashboard</h2><p style={{ fontSize:14,color:theme.textMuted,margin:0 }}>Visão geral das credenciais da central bancária</p></div>
      <Btn icon={RefreshCw} onClick={loadData} loading={loading} size="sm">Atualizar</Btn>
    </div>
    <div style={{ display:"flex",flexWrap:"wrap",gap:14,marginBottom:28 }}>
      <StatCard icon={Users} label="Operadores" value={s.total_operators??0} loading={loading}/>
      <StatCard icon={Building2} label="Bancos" value={s.total_banks??0} loading={loading}/>
      <StatCard icon={Key} label="Credenciais" value={s.total_credentials??0} color={theme.accent} bgColor={theme.accentBg} loading={loading}/>
      <StatCard icon={AlertTriangle} label="Senhas vencidas" value={s.expired_passwords??0} color={theme.danger} bgColor={theme.dangerBg} sub="Requer atenção" loading={loading}/>
    </div>
    <div style={{ display:"flex",flexWrap:"wrap",gap:14,marginBottom:28 }}>
      <StatCard icon={Clock} label="Vencendo 7d" value={s.expiring_soon??0} color={theme.warning} bgColor={theme.warningBg} loading={loading}/>
      <StatCard icon={UserCheck} label="Aprovadores" value={s.total_approvers??0} color="#D4537E" bgColor="rgba(212,83,126,0.08)" loading={loading}/>
      <StatCard icon={Bot} label="Robôs" value={s.total_robots??0} color={theme.info} bgColor={theme.infoBg} loading={loading}/>
      <StatCard icon={Store} label="Visão Loja" value={s.total_store_view??0} loading={loading}/>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
      <div style={{ background:theme.bgCard,borderRadius:14,border:`1px solid ${theme.border}`,padding:20 }}>
        <h3 style={{ fontSize:14,fontWeight:700,color:theme.text,margin:"0 0 16px",display:"flex",alignItems:"center",gap:8 }}><FileText size={16} color={theme.accent}/>Atividade recente</h3>
        {audit.length===0&&!loading&&<p style={{ fontSize:13,color:theme.textDim,textAlign:"center",padding:20 }}>Nenhuma atividade registrada</p>}
        {audit.map(a=><div key={a.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${theme.border}22` }}>
          <div style={{ width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:a.action==="view_password"?theme.warningBg:a.action==="create"?theme.successBg:a.action==="delete"?theme.dangerBg:theme.infoBg,color:a.action==="view_password"?theme.warning:a.action==="create"?theme.success:a.action==="delete"?theme.danger:theme.info }}>{a.action==="view_password"?<Eye size={14}/>:a.action==="create"?<Plus size={14}/>:a.action==="delete"?<Trash2 size={14}/>:<Edit3 size={14}/>}</div>
          <div style={{ flex:1 }}><div style={{ fontSize:13,color:theme.text,fontWeight:500 }}>{a.action==="view_password"?"Senha visualizada":a.action==="create"?"Credencial criada":a.action==="delete"?"Removida":"Atualizada"}{a.details?.bank&&<span style={{ color:theme.accent }}> — {a.details.bank}</span>}</div><div style={{ fontSize:11,color:theme.textDim }}>{a.user_email} · {new Date(a.created_at).toLocaleString("pt-BR")}</div></div>
        </div>)}
      </div>
      <div style={{ background:theme.bgCard,borderRadius:14,border:`1px solid ${theme.border}`,padding:20 }}>
        <h3 style={{ fontSize:14,fontWeight:700,color:theme.text,margin:"0 0 16px",display:"flex",alignItems:"center",gap:8 }}><Shield size={16} color={theme.accent}/>Legenda de status</h3>
        {Object.entries(STATUS_CONFIG).map(([key,cfg])=><div key={key} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${theme.border}22` }}><span style={{ width:10,height:10,borderRadius:"50%",background:cfg.color }}/><span style={{ fontSize:13,color:theme.text,flex:1 }}>{cfg.label}</span><code style={{ fontSize:11,color:theme.textDim,fontFamily:mono }}>{key}</code></div>)}
      </div>
    </div>
  </div>;
}

// CREDENTIALS PAGE
function CredentialsPage({ showToast }) {
  const [credentials, setCredentials] = useState([]);
  const [banks, setBanks] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterBank, setFilterBank] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const emptyForm = { operator_id:"",bank_id:"",username:"",password:"",status:"azul_claro",observation:"",promotora:"",has_store_view:false,is_robot:false,is_approver:false };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(()=>{ loadAll(); },[]);
  async function loadAll() {
    setLoading(true);
    const [cr,bn,op] = await Promise.all([
      supabase.from("credentials_view").select("*").order("operator_name").order("bank_name"),
      supabase.from("banks").select("*").eq("is_active",true).order("display_order"),
      supabase.from("operators").select("*").order("name"),
    ]);
    setCredentials(cr.data||[]); setBanks(bn.data||[]); setOperators(op.data||[]); setLoading(false);
  }
  const filtered = useMemo(()=>{
    return credentials.filter(c=>{
      const q=search.toLowerCase();
      const ms=!q||c.username?.toLowerCase().includes(q)||c.operator_name?.toLowerCase().includes(q)||c.bank_name?.toLowerCase().includes(q)||c.bank_short_name?.toLowerCase().includes(q)||c.observation?.toLowerCase().includes(q)||c.promotora?.toLowerCase().includes(q);
      return ms&&(!filterBank||c.bank_id===filterBank)&&(!filterOperator||c.operator_id===filterOperator)&&(!filterStatus||c.status===filterStatus);
    });
  },[credentials,search,filterBank,filterOperator,filterStatus]);

  const openNew = () => { setEditItem(null); setFormData(emptyForm); setShowModal(true); };
  const openEdit = (c) => { setEditItem(c); setFormData({ operator_id:c.operator_id,bank_id:c.bank_id,username:c.username||"",password:"",status:c.status,observation:c.observation||"",promotora:c.promotora||"",has_store_view:c.has_store_view,is_robot:c.is_robot,is_approver:c.is_approver }); setShowModal(true); };

  async function handleSave() {
    if (!formData.operator_id||!formData.bank_id) { showToast("Selecione operador e banco","error"); return; }
    setSaving(true);
    try {
      const payload = { operator_id:formData.operator_id,bank_id:formData.bank_id,username:formData.username,status:formData.status,observation:formData.observation||null,promotora:formData.promotora||null,has_store_view:formData.has_store_view,is_robot:formData.is_robot,is_approver:formData.is_approver };
      if (formData.password) {
        const { data:enc } = await supabase.rpc("encrypt_password",{plain_text:formData.password});
        payload.password_encrypted = enc;
        payload.last_password_update = new Date().toISOString();
      }
      if (editItem) {
        const { error } = await supabase.from("credentials").update(payload).eq("id",editItem.id);
        if (error) throw error;
        showToast("Credencial atualizada!","success");
      } else {
        if (!formData.password) { showToast("Informe a senha","error"); setSaving(false); return; }
        const { error } = await supabase.from("credentials").insert(payload);
        if (error) throw error;
        showToast("Credencial criada!","success");
      }
      setShowModal(false); loadAll();
    } catch(err) { showToast("Erro: "+err.message,"error"); }
    setSaving(false);
  }

  async function handleDelete(id) {
    try {
      const { error } = await supabase.from("credentials").delete().eq("id",id);
      if (error) throw error;
      showToast("Credencial removida","success"); setDeleteConfirm(null); loadAll();
    } catch(err) { showToast("Erro: "+err.message,"error"); }
  }

  if (loading) return <Spinner/>;
  return <div>
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
      <div><h2 style={{ fontSize:22,fontWeight:700,color:theme.text,margin:"0 0 6px" }}>Credenciais</h2><p style={{ fontSize:14,color:theme.textMuted,margin:0 }}>{filtered.length} de {credentials.length} credenciais</p></div>
      <div style={{ display:"flex",gap:8 }}><Btn icon={RefreshCw} onClick={loadAll} size="sm">Atualizar</Btn><Btn variant="primary" icon={Plus} onClick={openNew}>Nova credencial</Btn></div>
    </div>
    <div style={{ background:theme.bgCard,borderRadius:14,border:`1px solid ${theme.border}`,marginBottom:16,padding:16 }}>
      <div style={{ display:"flex",gap:10,alignItems:"center" }}>
        <div style={{ flex:1 }}><Input value={search} onChange={setSearch} placeholder="Buscar por usuário, operador, banco, promotora..." icon={Search}/></div>
        <Btn icon={Filter} onClick={()=>setShowFilters(!showFilters)}>Filtros {showFilters?<ChevronDown size={14}/>:<ChevronRight size={14}/>}</Btn>
      </div>
      {showFilters&&<div style={{ display:"flex",gap:12,marginTop:14,flexWrap:"wrap" }}>
        <Select value={filterBank} onChange={setFilterBank} placeholder="Todos os bancos" options={banks.map(b=>({value:b.id,label:b.short_name||b.name}))} style={{ flex:"1 1 180px" }}/>
        <Select value={filterOperator} onChange={setFilterOperator} placeholder="Todos operadores" options={operators.filter(o=>o.is_active).map(o=>({value:o.id,label:o.name}))} style={{ flex:"1 1 180px" }}/>
        <Select value={filterStatus} onChange={setFilterStatus} placeholder="Todos status" options={Object.entries(STATUS_CONFIG).map(([k,v])=>({value:k,label:v.label}))} style={{ flex:"1 1 150px" }}/>
        {(filterBank||filterOperator||filterStatus)&&<Btn variant="ghost" size="sm" onClick={()=>{setFilterBank("");setFilterOperator("");setFilterStatus("");}}>Limpar</Btn>}
      </div>}
    </div>
    <div style={{ background:theme.bgCard,borderRadius:14,border:`1px solid ${theme.border}`,overflow:"hidden" }}>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
          <thead><tr style={{ borderBottom:`1px solid ${theme.border}` }}>
            {["Operador","Banco","Usuário","Senha","Status","Promotora","Flags","Atualiz.",""].map((h,i)=><th key={i} style={{ padding:"12px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:theme.textDim,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(c=><tr key={c.id} style={{ borderBottom:`1px solid ${theme.border}22` }} onMouseEnter={e=>e.currentTarget.style.background=theme.bgCardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{ padding:"10px 14px",color:theme.text,fontWeight:500 }}>{c.operator_name}</td>
              <td style={{ padding:"10px 14px" }}><div style={{ display:"flex",alignItems:"center",gap:6 }}><span style={{ color:theme.text,fontWeight:500 }}>{c.bank_short_name||c.bank_name}</span>{c.bank_url&&<a href={c.bank_url} target="_blank" rel="noopener noreferrer" style={{ color:theme.textDim,display:"flex" }} onClick={e=>e.stopPropagation()}><ExternalLink size={12}/></a>}</div></td>
              <td style={{ padding:"10px 14px" }}><code style={{ fontFamily:mono,fontSize:12,color:theme.textMuted,background:theme.bgInput,padding:"2px 6px",borderRadius:4 }}>{c.username}</code></td>
              <td style={{ padding:"10px 14px" }}><PasswordCell credentialId={c.id} showToast={showToast}/></td>
              <td style={{ padding:"10px 14px" }}><StatusBadge status={c.status}/></td>
              <td style={{ padding:"10px 14px",color:theme.textMuted,fontSize:12 }}>{c.promotora||"—"}</td>
              <td style={{ padding:"10px 14px" }}><div style={{ display:"flex",gap:4,flexWrap:"wrap" }}><FlagPill active={c.has_store_view} icon={Store} label="Loja"/><FlagPill active={c.is_robot} icon={Bot} label="Robô"/><FlagPill active={c.is_approver} icon={UserCheck} label="Aprov"/></div></td>
              <td style={{ padding:"10px 14px",color:theme.textDim,fontSize:12 }}>{c.last_password_update?new Date(c.last_password_update).toLocaleDateString("pt-BR"):"—"}</td>
              <td style={{ padding:"10px 14px" }}><div style={{ display:"flex",gap:4 }}><button onClick={()=>openEdit(c)} style={{ background:"none",border:"none",color:theme.textDim,cursor:"pointer",padding:4,borderRadius:6,display:"flex" }}><Edit3 size={14}/></button><button onClick={()=>setDeleteConfirm(c)} style={{ background:"none",border:"none",color:theme.textDim,cursor:"pointer",padding:4,borderRadius:6,display:"flex" }}><Trash2 size={14}/></button></div></td>
            </tr>)}
            {filtered.length===0&&<tr><td colSpan={9}><EmptyState icon={Key} title="Nenhuma credencial" description="Altere filtros ou adicione nova"/></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
    <Modal open={showModal} onClose={()=>setShowModal(false)} title={editItem?"Editar credencial":"Nova credencial"} width={600}>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          <Select label="Operador" value={formData.operator_id} onChange={v=>setFormData({...formData,operator_id:v})} options={operators.filter(o=>o.is_active).map(o=>({value:o.id,label:o.name}))}/>
          <Select label="Banco" value={formData.bank_id} onChange={v=>setFormData({...formData,bank_id:v})} options={banks.map(b=>({value:b.id,label:b.short_name||b.name}))}/>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          <Input label="Usuário/Login" value={formData.username} onChange={v=>setFormData({...formData,username:v})} placeholder="Ex: CBS126023"/>
          <Input label={editItem?"Nova senha (vazio=manter)":"Senha"} value={formData.password} onChange={v=>setFormData({...formData,password:v})} placeholder="Senha" type="password"/>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          <Select label="Status" value={formData.status} onChange={v=>setFormData({...formData,status:v})} options={Object.entries(STATUS_CONFIG).map(([k,v])=>({value:k,label:v.label}))}/>
          <Input label="Promotora" value={formData.promotora} onChange={v=>setFormData({...formData,promotora:v})} placeholder="LEWE, LHAMAS..."/>
        </div>
        <Input label="Observação" value={formData.observation} onChange={v=>setFormData({...formData,observation:v})} placeholder="Notas..."/>
        <div style={{ display:"flex",gap:20 }}>
          {[{key:"has_store_view",label:"Visão Loja",icon:Store},{key:"is_robot",label:"Robô",icon:Bot},{key:"is_approver",label:"Aprovador",icon:UserCheck}].map(f=><label key={f.key} style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:formData[f.key]?theme.accent:theme.textMuted,fontWeight:500 }}><div onClick={()=>setFormData({...formData,[f.key]:!formData[f.key]})} style={{ width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:formData[f.key]?theme.accent:theme.bgInput,border:`1.5px solid ${formData[f.key]?theme.accent:theme.border}`,cursor:"pointer" }}>{formData[f.key]&&<Check size={13} color="#0C0C0E" strokeWidth={3}/>}</div><f.icon size={14}/>{f.label}</label>)}
        </div>
        <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:8,paddingTop:16,borderTop:`1px solid ${theme.border}` }}>
          <Btn onClick={()=>setShowModal(false)}>Cancelar</Btn>
          <Btn variant="primary" icon={editItem?Check:Plus} onClick={handleSave} loading={saving}>{editItem?"Salvar":"Criar credencial"}</Btn>
        </div>
      </div>
    </Modal>
    <Modal open={!!deleteConfirm} onClose={()=>setDeleteConfirm(null)} title="Confirmar exclusão" width={420}>
      <p style={{ fontSize:14,color:theme.textMuted,marginBottom:8 }}>Tem certeza que deseja excluir?</p>
      {deleteConfirm&&<div style={{ background:theme.bgInput,borderRadius:10,padding:14,marginBottom:20 }}><div style={{ fontSize:14,color:theme.text,fontWeight:600 }}>{deleteConfirm.operator_name} — {deleteConfirm.bank_short_name||deleteConfirm.bank_name}</div><div style={{ fontSize:12,color:theme.textDim,marginTop:4 }}>Usuário: {deleteConfirm.username}</div></div>}
      <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}><Btn onClick={()=>setDeleteConfirm(null)}>Cancelar</Btn><Btn variant="danger" icon={Trash2} onClick={()=>handleDelete(deleteConfirm.id)}>Excluir</Btn></div>
    </Modal>
  </div>;
}

// OPERATORS PAGE
function OperatorsPage({ showToast }) {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const emptyForm = { name:"",email:"",code:"",cpf:"",phone:"",is_active:true,notes:"" };
  const [formData, setFormData] = useState(emptyForm);
  useEffect(()=>{ load(); },[]);
  async function load() { setLoading(true); const{data}=await supabase.from("operators").select("*").order("name"); setOperators(data||[]); setLoading(false); }
  const filtered = operators.filter(o=>{ const q=search.toLowerCase(); return !q||o.name?.toLowerCase().includes(q)||o.email?.toLowerCase().includes(q)||o.code?.includes(q)||o.cpf?.includes(q); });
  const openNew = () => { setEditItem(null); setFormData(emptyForm); setShowModal(true); };
  const openEdit = (op) => { setEditItem(op); setFormData({ name:op.name,email:op.email||"",code:op.code||"",cpf:op.cpf||"",phone:op.phone||"",is_active:op.is_active,notes:op.notes||"" }); setShowModal(true); };
  async function handleSave() {
    if (!formData.name) { showToast("Nome obrigatório","error"); return; }
    setSaving(true);
    try {
      const p = {...formData}; Object.keys(p).forEach(k=>p[k]===""&&(p[k]=null)); p.name=formData.name;
      if (editItem) { const{error}=await supabase.from("operators").update(p).eq("id",editItem.id); if(error)throw error; showToast("Operador atualizado!","success"); }
      else { const{error}=await supabase.from("operators").insert(p); if(error)throw error; showToast("Operador criado!","success"); }
      setShowModal(false); load();
    } catch(err) { showToast("Erro: "+err.message,"error"); }
    setSaving(false);
  }
  if (loading) return <Spinner/>;
  return <div>
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
      <div><h2 style={{ fontSize:22,fontWeight:700,color:theme.text,margin:"0 0 6px" }}>Operadores</h2><p style={{ fontSize:14,color:theme.textMuted,margin:0 }}>{operators.filter(o=>o.is_active).length} ativos de {operators.length}</p></div>
      <Btn variant="primary" icon={Plus} onClick={openNew}>Novo operador</Btn>
    </div>
    <div style={{ marginBottom:16 }}><Input value={search} onChange={setSearch} placeholder="Buscar nome, email, código, CPF..." icon={Search}/></div>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14 }}>
      {filtered.map(op=><div key={op.id} style={{ background:theme.bgCard,borderRadius:14,border:`1px solid ${theme.border}`,padding:20,opacity:op.is_active?1:0.5 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:40,height:40,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:theme.accent,background:theme.accentBg,border:`1px solid ${theme.accent}25` }}>{op.name.charAt(0)}</div>
            <div><div style={{ fontSize:15,fontWeight:600,color:theme.text }}>{op.name}</div><div style={{ fontSize:12,color:theme.textDim }}>{op.email||"—"}</div></div>
          </div>
          {!op.is_active&&<span style={{ fontSize:10,fontWeight:700,color:theme.danger,background:theme.dangerBg,padding:"3px 8px",borderRadius:12,textTransform:"uppercase" }}>Inativo</span>}
        </div>
        <div style={{ display:"flex",gap:16,fontSize:12,color:theme.textMuted }}>
          {op.code&&<span>Código: <strong style={{ color:theme.text }}>{op.code}</strong></span>}
          {op.cpf&&<span>CPF: <strong style={{ color:theme.text }}>{op.cpf}</strong></span>}
        </div>
        <div style={{ display:"flex",gap:8,marginTop:14,paddingTop:14,borderTop:`1px solid ${theme.border}22` }}><Btn size="sm" icon={Edit3} onClick={()=>openEdit(op)}>Editar</Btn></div>
      </div>)}
    </div>
    <Modal open={showModal} onClose={()=>setShowModal(false)} title={editItem?"Editar operador":"Novo operador"} width={500}>
      <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        <Input label="Nome" value={formData.name} onChange={v=>setFormData({...formData,name:v})} placeholder="Nome completo"/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          <Input label="Email" value={formData.email} onChange={v=>setFormData({...formData,email:v})} placeholder="email@exemplo.com"/>
          <Input label="Telefone" value={formData.phone} onChange={v=>setFormData({...formData,phone:v})} placeholder="(15) 99999-0000"/>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          <Input label="Código" value={formData.code} onChange={v=>setFormData({...formData,code:v})} placeholder="0793"/>
          <Input label="CPF" value={formData.cpf} onChange={v=>setFormData({...formData,cpf:v})} placeholder="000.000.000-00"/>
        </div>
        <Input label="Observações" value={formData.notes} onChange={v=>setFormData({...formData,notes:v})} placeholder="Notas..."/>
        <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:formData.is_active?theme.success:theme.danger,fontWeight:500 }}>
          <div onClick={()=>setFormData({...formData,is_active:!formData.is_active})} style={{ width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:formData.is_active?theme.success:theme.bgInput,border:`1.5px solid ${formData.is_active?theme.success:theme.border}`,cursor:"pointer" }}>{formData.is_active&&<Check size={13} color="#fff" strokeWidth={3}/>}</div>
          Operador ativo
        </label>
        <div style={{ display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${theme.border}` }}><Btn onClick={()=>setShowModal(false)}>Cancelar</Btn><Btn variant="primary" icon={Check} onClick={handleSave} loading={saving}>{editItem?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// BANKS PAGE
function BanksPage({ showToast }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const emptyForm = { name:"",short_name:"",url:"",category:"",default_promotora:"",is_active:true,notes:"" };
  const [formData, setFormData] = useState(emptyForm);
  useEffect(()=>{ load(); },[]);
  async function load() { setLoading(true); const{data}=await supabase.from("banks").select("*").order("display_order"); setBanks(data||[]); setLoading(false); }
  const filtered = banks.filter(b=>{ const q=search.toLowerCase(); return !q||b.name?.toLowerCase().includes(q)||b.short_name?.toLowerCase().includes(q)||b.default_promotora?.toLowerCase().includes(q); });
  const openEdit = (b) => { setEditItem(b); setFormData({ name:b.name,short_name:b.short_name||"",url:b.url||"",category:b.category||"",default_promotora:b.default_promotora||"",is_active:b.is_active,notes:b.notes||"" }); setShowModal(true); };
  async function handleSave() {
    if (!formData.name) { showToast("Nome obrigatório","error"); return; }
    setSaving(true);
    try {
      const p = {...formData}; Object.keys(p).forEach(k=>p[k]===""&&(p[k]=null)); p.name=formData.name;
      if (editItem) { const{error}=await supabase.from("banks").update(p).eq("id",editItem.id); if(error)throw error; showToast("Banco atualizado!","success"); }
      else { const{error}=await supabase.from("banks").insert(p); if(error)throw error; showToast("Banco criado!","success"); }
      setShowModal(false); load();
    } catch(err) { showToast("Erro: "+err.message,"error"); }
    setSaving(false);
  }
  if (loading) return <Spinner/>;
  return <div>
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
      <div><h2 style={{ fontSize:22,fontWeight:700,color:theme.text,margin:"0 0 6px" }}>Bancos e sistemas</h2><p style={{ fontSize:14,color:theme.textMuted,margin:0 }}>{banks.filter(b=>b.is_active).length} ativos de {banks.length}</p></div>
      <Btn variant="primary" icon={Plus} onClick={()=>{setEditItem(null);setFormData(emptyForm);setShowModal(true);}}>Novo banco</Btn>
    </div>
    <div style={{ marginBottom:16 }}><Input value={search} onChange={setSearch} placeholder="Buscar banco ou promotora..." icon={Search}/></div>
    <div style={{ background:theme.bgCard,borderRadius:14,border:`1px solid ${theme.border}`,overflow:"hidden" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
        <thead><tr style={{ borderBottom:`1px solid ${theme.border}` }}>{["Nome","Curto","Promotora","URL","Status",""].map((h,i)=><th key={i} style={{ padding:"12px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:theme.textDim,textTransform:"uppercase",letterSpacing:"0.06em" }}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(b=><tr key={b.id} style={{ borderBottom:`1px solid ${theme.border}22` }} onMouseEnter={e=>e.currentTarget.style.background=theme.bgCardHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{ padding:"10px 14px",color:theme.text,fontWeight:500 }}>{b.name}</td>
          <td style={{ padding:"10px 14px" }}><code style={{ fontFamily:mono,fontSize:12,color:theme.accent,background:theme.accentBg,padding:"2px 6px",borderRadius:4 }}>{b.short_name||"—"}</code></td>
          <td style={{ padding:"10px 14px",color:theme.textMuted }}>{b.default_promotora||"—"}</td>
          <td style={{ padding:"10px 14px" }}>{b.url?<a href={b.url} target="_blank" rel="noopener noreferrer" style={{ color:theme.info,fontSize:12,display:"flex",alignItems:"center",gap:4 }}><ExternalLink size={12}/>Acessar</a>:<span style={{ color:theme.textDim }}>—</span>}</td>
          <td style={{ padding:"10px 14px" }}><span style={{ fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:12,textTransform:"uppercase",color:b.is_active?theme.success:theme.danger,background:b.is_active?theme.successBg:theme.dangerBg }}>{b.is_active?"Ativo":"Inativo"}</span></td>
          <td style={{ padding:"10px 14px" }}><button onClick={()=>openEdit(b)} style={{ background:"none",border:"none",color:theme.textDim,cursor:"pointer",padding:4,display:"flex" }}><Edit3 size={14}/></button></td>
        </tr>)}</tbody>
      </table>
    </div>
    <Modal open={showModal} onClose={()=>setShowModal(false)} title={editItem?"Editar banco":"Novo banco"} width={500}>
      <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}><Input label="Nome" value={formData.name} onChange={v=>setFormData({...formData,name:v})} placeholder="SUB SAFRA"/><Input label="Nome curto" value={formData.short_name} onChange={v=>setFormData({...formData,short_name:v})} placeholder="SAFRA"/></div>
        <Input label="URL" value={formData.url} onChange={v=>setFormData({...formData,url:v})} placeholder="https://..."/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}><Input label="Promotora" value={formData.default_promotora} onChange={v=>setFormData({...formData,default_promotora:v})} placeholder="LEWE..."/><Input label="Categoria" value={formData.category} onChange={v=>setFormData({...formData,category:v})} placeholder="Consignado..."/></div>
        <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:formData.is_active?theme.success:theme.danger,fontWeight:500 }}>
          <div onClick={()=>setFormData({...formData,is_active:!formData.is_active})} style={{ width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:formData.is_active?theme.success:theme.bgInput,border:`1.5px solid ${formData.is_active?theme.success:theme.border}`,cursor:"pointer" }}>{formData.is_active&&<Check size={13} color="#fff" strokeWidth={3}/>}</div>Banco ativo
        </label>
        <div style={{ display:"flex",gap:10,justifyContent:"flex-end",paddingTop:16,borderTop:`1px solid ${theme.border}` }}><Btn onClick={()=>setShowModal(false)}>Cancelar</Btn><Btn variant="primary" icon={Check} onClick={handleSave} loading={saving}>{editItem?"Salvar":"Criar"}</Btn></div>
      </div>
    </Modal>
  </div>;
}

// AUDIT PAGE
function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ load(); },[]);
  async function load() { setLoading(true); const{data}=await supabase.from("audit_log").select("*").order("created_at",{ascending:false}).limit(100); setLogs(data||[]); setLoading(false); }
  if (loading) return <Spinner/>;
  return <div>
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
      <div><h2 style={{ fontSize:22,fontWeight:700,color:theme.text,margin:"0 0 6px" }}>Auditoria</h2><p style={{ fontSize:14,color:theme.textMuted,margin:0 }}>{logs.length} registros</p></div>
      <Btn icon={RefreshCw} onClick={load} size="sm">Atualizar</Btn>
    </div>
    <div style={{ background:theme.bgCard,borderRadius:14,border:`1px solid ${theme.border}`,overflow:"hidden" }}>
      {logs.length===0?<EmptyState icon={FileText} title="Nenhum registro" description="Ações serão registradas aqui"/>:
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
        <thead><tr style={{ borderBottom:`1px solid ${theme.border}` }}>{["Data/Hora","Usuário","Ação","Tipo","Detalhes"].map((h,i)=><th key={i} style={{ padding:"12px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:theme.textDim,textTransform:"uppercase",letterSpacing:"0.06em" }}>{h}</th>)}</tr></thead>
        <tbody>{logs.map(a=><tr key={a.id} style={{ borderBottom:`1px solid ${theme.border}22` }}>
          <td style={{ padding:"10px 14px",color:theme.textDim,fontSize:12,fontFamily:mono }}>{new Date(a.created_at).toLocaleString("pt-BR")}</td>
          <td style={{ padding:"10px 14px",color:theme.text,fontWeight:500 }}>{a.user_email||"—"}</td>
          <td style={{ padding:"10px 14px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:12,textTransform:"uppercase",color:a.action==="view_password"?theme.warning:a.action==="create"?theme.success:a.action==="delete"?theme.danger:theme.info,background:a.action==="view_password"?theme.warningBg:a.action==="create"?theme.successBg:a.action==="delete"?theme.dangerBg:theme.infoBg }}>{a.action==="view_password"?"Visualização":a.action==="create"?"Criação":a.action==="delete"?"Exclusão":"Atualização"}</span></td>
          <td style={{ padding:"10px 14px",color:theme.textMuted }}>{a.entity_type}</td>
          <td style={{ padding:"10px 14px",color:theme.textMuted,fontSize:12 }}>{a.details&&typeof a.details==='object'&&Object.entries(a.details).map(([k,v])=><span key={k} style={{ marginRight:12 }}>{k}: <strong style={{ color:theme.text }}>{String(v)}</strong></span>)}</td>
        </tr>)}</tbody>
      </table>}
    </div>
  </div>;
}

// LOGIN
function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit() {
    if (!email||!password) { setError("Preencha email e senha"); return; }
    if (isSignUp&&!fullName) { setError("Preencha o nome"); return; }
    setLoading(true); setError("");
    try {
      if (isSignUp) { await signUp(email,password,fullName); setIsSignUp(false); setError(""); alert("Conta criada! Faça login."); }
      else { await signIn(email,password); }
    } catch(err) { setError(err.message==="Invalid login credentials"?"Email ou senha incorretos":err.message); }
    setLoading(false);
  }
  return <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:theme.bg,fontFamily:font }}>
    <div style={{ width:420,background:theme.bgCard,borderRadius:20,border:`1px solid ${theme.border}`,padding:"40px 36px",boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>
      <div style={{ textAlign:"center",marginBottom:32 }}>
        <div style={{ width:56,height:56,borderRadius:16,margin:"0 auto 16px",background:`linear-gradient(135deg,${theme.accent},${theme.accentDim})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${theme.accent}40` }}><Shield size={28} color="#0C0C0E"/></div>
        <h1 style={{ fontSize:22,fontWeight:800,color:theme.text,margin:"0 0 6px" }}>LhamasCred Vault</h1>
        <p style={{ fontSize:13,color:theme.textMuted,margin:0 }}>Central de credenciais bancárias</p>
      </div>
      {error&&<div style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,background:theme.dangerBg,border:`1px solid ${theme.danger}30`,marginBottom:16,fontSize:13,color:theme.danger }}><AlertCircle size={16}/>{error}</div>}
      <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
        {isSignUp&&<Input label="Nome completo" value={fullName} onChange={setFullName} placeholder="Carlos Lhamas" icon={Users}/>}
        <Input label="Email" value={email} onChange={setEmail} placeholder="carlos@lhamascred.com.br" icon={Users}/>
        <Input label="Senha" value={password} onChange={setPassword} placeholder="••••••••" type="password" icon={Lock} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
        <Btn variant="primary" size="lg" onClick={handleSubmit} loading={loading} style={{ width:"100%",justifyContent:"center",marginTop:8,borderRadius:12,padding:"14px 20px",fontSize:15 }}>{isSignUp?"Criar conta":"Entrar"}</Btn>
      </div>
      <div style={{ textAlign:"center",marginTop:20 }}><button onClick={()=>{setIsSignUp(!isSignUp);setError("");}} style={{ background:"none",border:"none",color:theme.accent,cursor:"pointer",fontSize:13,fontFamily:font,fontWeight:500 }}>{isSignUp?"Já tem conta? Login":"Criar nova conta"}</button></div>
      <div style={{ textAlign:"center",marginTop:12,fontSize:11,color:theme.textDim }}>Acesso restrito a colaboradores</div>
    </div>
  </div>;
}

// MAIN APP
const NAV = [
  { id:"dashboard",label:"Dashboard",icon:LayoutDashboard },
  { id:"credentials",label:"Credenciais",icon:Key },
  { id:"operators",label:"Operadores",icon:Users },
  { id:"banks",label:"Bancos",icon:Building2 },
  { id:"audit",label:"Auditoria",icon:FileText },
];

function AppLayout() {
  const { profile, signOut } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { toast, show } = useToast();
  const renderPage = () => {
    switch(page) {
      case "dashboard": return <DashboardPage showToast={show}/>;
      case "credentials": return <CredentialsPage showToast={show}/>;
      case "operators": return <OperatorsPage showToast={show}/>;
      case "banks": return <BanksPage showToast={show}/>;
      case "audit": return <AuditPage/>;
      default: return <DashboardPage showToast={show}/>;
    }
  };
  return <div style={{ display:"flex",minHeight:"100vh",background:theme.bg,fontFamily:font,color:theme.text }}>
    <Toast toast={toast}/>
    <div style={{ width:collapsed?68:240,background:theme.bgCard,borderRight:`1px solid ${theme.border}`,display:"flex",flexDirection:"column",transition:"width 0.2s",flexShrink:0 }}>
      <div style={{ padding:collapsed?"20px 12px":"20px 20px",borderBottom:`1px solid ${theme.border}`,display:"flex",alignItems:"center",gap:12 }}>
        <div style={{ width:36,height:36,borderRadius:10,flexShrink:0,background:`linear-gradient(135deg,${theme.accent},${theme.accentDim})`,display:"flex",alignItems:"center",justifyContent:"center" }}><Shield size={18} color="#0C0C0E"/></div>
        {!collapsed&&<div><div style={{ fontSize:14,fontWeight:800,letterSpacing:"-0.02em" }}>LhamasCred</div><div style={{ fontSize:10,color:theme.textDim,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em" }}>Vault</div></div>}
      </div>
      <nav style={{ flex:1,padding:"12px 8px" }}>
        {NAV.map(item=>{const active=page===item.id;return<button key={item.id} onClick={()=>setPage(item.id)} style={{ display:"flex",alignItems:"center",gap:12,width:"100%",padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",background:active?theme.accentBg:"transparent",color:active?theme.accent:theme.textMuted,fontSize:13,fontWeight:active?600:500,fontFamily:font,marginBottom:4,justifyContent:collapsed?"center":"flex-start" }}><item.icon size={18}/>{!collapsed&&item.label}</button>;})}
      </nav>
      <div style={{ padding:"12px 8px",borderTop:`1px solid ${theme.border}` }}>
        <button onClick={()=>setCollapsed(!collapsed)} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",borderRadius:10,border:"none",background:"transparent",color:theme.textDim,cursor:"pointer",fontSize:12,fontFamily:font,justifyContent:collapsed?"center":"flex-start" }}>{collapsed?<ChevronRight size={16}/>:<><ChevronLeft size={16}/>Recolher</>}</button>
        <button onClick={signOut} style={{ display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",borderRadius:10,border:"none",background:"transparent",color:theme.textDim,cursor:"pointer",fontSize:12,fontFamily:font,justifyContent:collapsed?"center":"flex-start",marginTop:4 }}><LogOut size={16}/>{!collapsed&&"Sair"}</button>
      </div>
    </div>
    <div style={{ flex:1,overflow:"auto" }}>
      <div style={{ padding:"14px 28px",borderBottom:`1px solid ${theme.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:theme.bgCard }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,color:theme.textDim }}><Shield size={14} color={theme.accent}/><span>Central bancária</span><span style={{ color:theme.border }}>·</span><span style={{ color:theme.accent,fontWeight:600 }}>{NAV.find(n=>n.id===page)?.label}</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:12,color:theme.text,fontWeight:500 }}>{profile?.full_name||"Usuário"}</div><div style={{ fontSize:10,color:theme.textDim,textTransform:"uppercase" }}>{profile?.role||"operator"}</div></div>
          <div style={{ width:32,height:32,borderRadius:10,background:theme.accentBg,color:theme.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700 }}>{(profile?.full_name||"U").charAt(0)}</div>
        </div>
      </div>
      <div style={{ padding:28 }}>{renderPage()}</div>
    </div>
  </div>;
}

export default function App() {
  return <>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    <AuthProvider><AppInner/></AuthProvider>
  </>;
}
function AppInner() {
  const { session, loading } = useAuth();
  if (loading) return <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:theme.bg,fontFamily:font }}><div style={{ textAlign:"center" }}><div style={{ width:56,height:56,borderRadius:16,margin:"0 auto 20px",background:`linear-gradient(135deg,${theme.accent},${theme.accentDim})`,display:"flex",alignItems:"center",justifyContent:"center" }}><Shield size={28} color="#0C0C0E"/></div><Loader2 size={24} color={theme.accent} style={{ animation:"spin 1s linear infinite" }}/><p style={{ color:theme.textDim,fontSize:13,marginTop:12 }}>Carregando...</p></div></div>;
  return session ? <AppLayout/> : <LoginPage/>;
}
