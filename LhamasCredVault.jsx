import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Shield, Key, Building2, Users, Eye, EyeOff, Search, Plus, Edit3, Trash2,
  ChevronDown, ChevronRight, LogOut, LayoutDashboard, FileText, AlertTriangle,
  CheckCircle, XCircle, Copy, ExternalLink, Filter, RefreshCw, Clock,
  Lock, Unlock, Bot, Store, UserCheck, X, Check, ChevronLeft, Settings
} from "lucide-react";

// ============================================================
// CONFIG - Substituir com suas credenciais Supabase
// ============================================================
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA-ANON-KEY";

// ============================================================
// MOCK DATA (para demonstração antes de conectar ao Supabase)
// ============================================================
const MOCK_STATS = {
  total_operators: 12, total_banks: 64, total_credentials: 847,
  total_approvers: 23, total_robots: 8, total_store_view: 31,
  expired_passwords: 14, expiring_soon: 7
};

const STATUS_CONFIG = {
  amarelo: { label: "Ativo", color: "#EF9F27", bg: "#FAEEDA" },
  laranja: { label: "Header", color: "#D85A30", bg: "#FAECE7" },
  vermelho: { label: "Política", color: "#E24B4A", bg: "#FCEBEB" },
  verde: { label: "Instabilidade", color: "#639922", bg: "#EAF3DE" },
  azul_claro: { label: "Padrão", color: "#378ADD", bg: "#E6F1FB" },
  rosa: { label: "Aprovador", color: "#D4537E", bg: "#FBEAF0" },
  roxo: { label: "Master", color: "#7F77DD", bg: "#EEEDFE" },
  azul_bebe: { label: "Robô", color: "#85B7EB", bg: "#E6F1FB" },
  cinza: { label: "Inativo", color: "#888780", bg: "#F1EFE8" }
};

const MOCK_BANKS = [
  { id: "1", name: "SUB SAFRA", short_name: "SAFRA", url: "", default_promotora: "LEWE", is_active: true },
  { id: "2", name: "SUB C6 BANK", short_name: "C6 BANK", url: "", default_promotora: "LHAMAS", is_active: true },
  { id: "3", name: "SUB PAN LHAMAS 7524", short_name: "PAN 7524", url: "", default_promotora: "LHAMAS", is_active: true },
  { id: "4", name: "SUB ITAU/360 CONSIGNADO", short_name: "ITAÚ 360", url: "", default_promotora: "LHAMAS", is_active: true },
  { id: "5", name: "SUB IC DIGITAL CONSIGNADO", short_name: "IC DIGITAL", url: "", default_promotora: "LHAMAS", is_active: true },
  { id: "6", name: "SUB INTERFILE CONSIGNADO", short_name: "INTERFILE", url: "", default_promotora: "LEWE", is_active: true },
  { id: "7", name: "SUB FACTA CONSIGNADO", short_name: "FACTA", url: "", default_promotora: "LEWE", is_active: true },
  { id: "8", name: "SUB DAYCOVAL - LOJA 5753", short_name: "DAYCOVAL", url: "", default_promotora: "LEWE", is_active: true },
  { id: "9", name: "QUALICONSIG (INBURSA)", short_name: "QUALICONSIG", url: "", default_promotora: null, is_active: true },
  { id: "10", name: "SUB BRB", short_name: "BRB", url: "", default_promotora: null, is_active: true },
  { id: "11", name: "TOTAL CASH", short_name: "TOTAL CASH", url: "https://totalcash.net.br/login", default_promotora: null, is_active: true },
  { id: "12", name: "PH TECH", short_name: "PH TECH", url: "https://phtech.uy3.com.br/login", default_promotora: "LEWE", is_active: true },
  { id: "13", name: "VCTEX", short_name: "VCTEX", url: "https://www.appvctex.com.br/login", default_promotora: "LEWE", is_active: true },
  { id: "14", name: "NOVO SAQUE", short_name: "NOVO SAQUE", url: "https://sistema.novosaque.com.br/login", default_promotora: "LEWE", is_active: true },
  { id: "15", name: "BMG", short_name: "BMG", url: "", default_promotora: "LEWE", is_active: true },
  { id: "16", name: "MAESTRO PAY", short_name: "MAESTRO PAY", url: "", default_promotora: null, is_active: true },
];

const MOCK_OPERATORS = [
  { id: "1", name: "Carlos Lhamas", email: "carlos@lhamascred.com.br", code: "0793", cpf: "331.178.768-47", is_active: true },
  { id: "2", name: "Nathalia", email: "nathalia.lhamas@hotmail.com", code: "6607", cpf: "336.577.748-23", is_active: true },
  { id: "3", name: "Danielle", email: "danielle@lhamascred.com.br", code: "3201", cpf: "", is_active: true },
  { id: "4", name: "Matheus", email: "matheus@lhamascred.com.br", code: "4520", cpf: "", is_active: true },
  { id: "5", name: "Maurício", email: "mauricio@lhamascred.com.br", code: "8814", cpf: "", is_active: true },
  { id: "6", name: "Paola", email: "paola@lhamascred.com.br", code: "7721", cpf: "367.017.548-21", is_active: true },
  { id: "7", name: "Ana Fazano", email: "ana@lhamascred.com.br", code: "", cpf: "", is_active: false },
];

const MOCK_CREDENTIALS = [
  { id: "c1", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "1", bank_name: "SAFRA", bank_short_name: "SAFRA", username: "CBS126023", status: "amarelo", observation: "CRIADOR DE USUÁRIO", has_store_view: true, is_robot: false, is_approver: true, last_password_update: "2025-08-22", promotora: "LEWE", bank_url: "" },
  { id: "c2", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "2", bank_name: "C6 BANK", bank_short_name: "C6 BANK", username: "33117876847_000267", status: "amarelo", observation: "CRIADOR DE USUÁRIO LOJA 0267", has_store_view: false, is_robot: false, is_approver: false, last_password_update: "2025-06-18", promotora: "LHAMAS", bank_url: "" },
  { id: "c3", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "4", bank_name: "ITAÚ 360", bank_short_name: "ITAÚ 360", username: "sp.793", status: "laranja", observation: "ITAU", has_store_view: true, is_robot: false, is_approver: false, last_password_update: "2024-11-13", promotora: "LHAMAS", bank_url: "" },
  { id: "c4", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "5", bank_name: "IC DIGITAL", bank_short_name: "IC DIGITAL", username: "33117876847@46831", status: "amarelo", observation: "IC DIGITAL", has_store_view: true, is_robot: false, is_approver: false, last_password_update: "2023-10-06", promotora: "LHAMAS", bank_url: "" },
  { id: "c5", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "8", bank_name: "DAYCOVAL", bank_short_name: "DAYCOVAL", username: "DCE-WLCASAQUI6684", status: "verde", observation: "DAYCOVAL", has_store_view: true, is_robot: false, is_approver: true, last_password_update: "2025-11-18", promotora: "LEWE", bank_url: "" },
  { id: "c6", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "12", bank_name: "PH TECH", bank_short_name: "PH TECH", username: "carlos@lhamascred.com.br", status: "amarelo", observation: "", has_store_view: false, is_robot: false, is_approver: false, last_password_update: "2025-05-07", promotora: "LEWE", bank_url: "https://phtech.uy3.com.br/login" },
  { id: "c7", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "15", bank_name: "BMG", bank_short_name: "BMG", username: "master56863", status: "roxo", observation: "", has_store_view: false, is_robot: false, is_approver: false, last_password_update: "2025-12-29", promotora: "LEWE", bank_url: "" },
  { id: "c8", operator_id: "2", operator_name: "Nathalia", bank_id: "2", bank_name: "C6 BANK", bank_short_name: "C6 BANK", username: "33657774823_003854", status: "amarelo", observation: "LOKER OPERACIONAL", has_store_view: false, is_robot: false, is_approver: false, last_password_update: "2025-09-22", promotora: "LHAMAS", bank_url: "" },
  { id: "c9", operator_id: "2", operator_name: "Nathalia", bank_id: "1", bank_name: "SAFRA", bank_short_name: "SAFRA", username: "CBS226024", status: "amarelo", observation: "", has_store_view: false, is_robot: false, is_approver: false, last_password_update: "2025-03-15", promotora: "LEWE", bank_url: "" },
  { id: "c10", operator_id: "6", operator_name: "Paola", bank_id: "1", bank_name: "SAFRA", bank_short_name: "SAFRA", username: "CBS336025", status: "vermelho", observation: "Migração para o celular Paola", has_store_view: false, is_robot: false, is_approver: false, last_password_update: "2025-02-05", promotora: "LEWE", bank_url: "" },
  { id: "c11", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "11", bank_name: "TOTAL CASH", bank_short_name: "TOTAL CASH", username: "331.178.768-47", status: "amarelo", observation: "https://totalcash.net.br/login", has_store_view: false, is_robot: false, is_approver: false, last_password_update: "2025-08-11", promotora: null, bank_url: "https://totalcash.net.br/login" },
  { id: "c12", operator_id: "1", operator_name: "Carlos Lhamas", bank_id: "9", bank_name: "QUALICONSIG", bank_short_name: "QUALICONSIG", username: "gerente1.lhamascred@qualiconsig.com.br", status: "rosa", observation: "GERENTE", has_store_view: false, is_robot: false, is_approver: false, last_password_update: "2024-12-09", promotora: null, bank_url: "" },
];

const MOCK_AUDIT = [
  { id: "a1", user_email: "carlos@lhamascred.com.br", action: "view_password", entity_type: "credential", details: { bank: "SAFRA", operator: "Carlos Lhamas" }, created_at: "2026-03-23T14:30:00" },
  { id: "a2", user_email: "carlos@lhamascred.com.br", action: "update", entity_type: "credential", details: { bank: "C6 BANK", field: "password" }, created_at: "2026-03-23T11:15:00" },
  { id: "a3", user_email: "carlos@lhamascred.com.br", action: "create", entity_type: "credential", details: { bank: "PH TECH", operator: "Nathalia" }, created_at: "2026-03-22T16:45:00" },
  { id: "a4", user_email: "carlos@lhamascred.com.br", action: "view_password", entity_type: "credential", details: { bank: "DAYCOVAL", operator: "Carlos Lhamas" }, created_at: "2026-03-22T09:20:00" },
  { id: "a5", user_email: "carlos@lhamascred.com.br", action: "delete", entity_type: "credential", details: { bank: "PRESENÇABANK", operator: "Ana Fazano" }, created_at: "2026-03-21T17:00:00" },
];

// ============================================================
// STYLES
// ============================================================
const font = `'DM Sans', 'Segoe UI', system-ui, -apple-system, sans-serif`;
const mono = `'JetBrains Mono', 'SF Mono', 'Consolas', monospace`;

const theme = {
  bg: "#0C0C0E",
  bgCard: "#141418",
  bgCardHover: "#1A1A20",
  bgInput: "#1E1E24",
  border: "#2A2A32",
  borderLight: "#35353F",
  text: "#E8E6E1",
  textMuted: "#8A8A96",
  textDim: "#5A5A66",
  accent: "#C9A84C",
  accentDim: "#A08530",
  accentBg: "rgba(201,168,76,0.08)",
  danger: "#E24B4A",
  dangerBg: "rgba(226,75,74,0.08)",
  success: "#4CAF50",
  successBg: "rgba(76,175,80,0.08)",
  warning: "#EF9F27",
  warningBg: "rgba(239,159,39,0.08)",
  info: "#378ADD",
  infoBg: "rgba(55,138,221,0.08)",
};

// ============================================================
// COMPONENTS
// ============================================================

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.cinza;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`,
      letterSpacing: "0.02em", textTransform: "uppercase", whiteSpace: "nowrap"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function FlagPill({ active, icon: Icon, label }) {
  if (!active) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600,
      color: theme.accent, background: theme.accentBg, border: `1px solid ${theme.accent}25`,
      letterSpacing: "0.03em", textTransform: "uppercase"
    }}>
      <Icon size={10} /> {label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor, sub }) {
  return (
    <div style={{
      background: theme.bgCard, borderRadius: 14, padding: "18px 20px",
      border: `1px solid ${theme.border}`, flex: "1 1 180px", minWidth: 160,
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: bgColor || theme.accentBg, color: color || theme.accent
        }}>
          <Icon size={18} />
        </div>
        <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || theme.text, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: theme.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Btn({ children, onClick, variant = "default", size = "md", icon: Icon, disabled, style: extraStyle }) {
  const styles = {
    primary: { bg: theme.accent, color: "#0C0C0E", hoverBg: "#D4B35A" },
    danger: { bg: theme.danger, color: "#fff", hoverBg: "#C43C3B" },
    ghost: { bg: "transparent", color: theme.textMuted, hoverBg: theme.bgInput },
    default: { bg: theme.bgInput, color: theme.text, hoverBg: theme.borderLight },
  };
  const s = styles[variant] || styles.default;
  const pad = size === "sm" ? "6px 12px" : size === "lg" ? "12px 24px" : "8px 16px";
  const fz = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: pad, borderRadius: 10, border: `1px solid ${theme.border}`,
        background: s.bg, color: s.color, fontSize: fz, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s", fontFamily: font, letterSpacing: "0.01em",
        ...extraStyle
      }}
    >
      {Icon && <Icon size={fz} />}
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", icon: Icon, style: extraStyle, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...extraStyle }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {Icon && <Icon size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: theme.textDim }} />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: Icon ? "10px 14px 10px 38px" : "10px 14px",
            background: theme.bgInput, border: `1px solid ${theme.border}`,
            borderRadius: 10, color: theme.text, fontSize: 14, fontFamily: font,
            outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
          }}
          {...props}
        />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder, style: extraStyle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...extraStyle }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", background: theme.bgInput,
          border: `1px solid ${theme.border}`, borderRadius: 10,
          color: value ? theme.text : theme.textDim, fontSize: 14, fontFamily: font,
          outline: "none", cursor: "pointer", boxSizing: "border-box",
        }}
      >
        <option value="">{placeholder || "Selecione..."}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Modal({ open, onClose, title, children, width = 540 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}`,
        width: "90%", maxWidth: width, maxHeight: "85vh", overflow: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)"
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", borderBottom: `1px solid ${theme.border}`
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: theme.textMuted,
            cursor: "pointer", padding: 4, borderRadius: 8, display: "flex"
          }}><X size={18} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function PasswordCell({ credentialId }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const mockPw = "••••••••";
  const realPw = "S3nh@Mock!";

  const handleCopy = () => {
    navigator.clipboard?.writeText(realPw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <code style={{
        fontFamily: mono, fontSize: 13, color: visible ? theme.accent : theme.textDim,
        background: visible ? theme.accentBg : "transparent",
        padding: visible ? "2px 8px" : 0, borderRadius: 6,
        letterSpacing: visible ? "0.05em" : "0.15em",
        transition: "all 0.2s"
      }}>
        {visible ? realPw : mockPw}
      </code>
      <button onClick={() => setVisible(!visible)} title={visible ? "Ocultar" : "Revelar"} style={{
        background: "none", border: "none", color: theme.textDim,
        cursor: "pointer", padding: 2, display: "flex", borderRadius: 6,
      }}>
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      {visible && (
        <button onClick={handleCopy} title="Copiar" style={{
          background: "none", border: "none",
          color: copied ? theme.success : theme.textDim,
          cursor: "pointer", padding: 2, display: "flex", borderRadius: 6,
        }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "60px 20px", color: theme.textDim,
      textAlign: "center"
    }}>
      <Icon size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.4 }} />
      <div style={{ fontSize: 16, fontWeight: 600, color: theme.textMuted, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{description}</div>
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================

function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: "0 0 6px" }}>Dashboard</h2>
        <p style={{ fontSize: 14, color: theme.textMuted, margin: 0 }}>Visão geral das credenciais da central bancária</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
        <StatCard icon={Users} label="Operadores" value={MOCK_STATS.total_operators} />
        <StatCard icon={Building2} label="Bancos" value={MOCK_STATS.total_banks} />
        <StatCard icon={Key} label="Credenciais" value={MOCK_STATS.total_credentials} color={theme.accent} bgColor={theme.accentBg} />
        <StatCard icon={AlertTriangle} label="Senhas vencidas" value={MOCK_STATS.expired_passwords} color={theme.danger} bgColor={theme.dangerBg} sub="Requer atenção imediata" />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 28 }}>
        <StatCard icon={Clock} label="Vencendo em 7 dias" value={MOCK_STATS.expiring_soon} color={theme.warning} bgColor={theme.warningBg} />
        <StatCard icon={UserCheck} label="Aprovadores" value={MOCK_STATS.total_approvers} color="#D4537E" bgColor="rgba(212,83,126,0.08)" />
        <StatCard icon={Bot} label="Robôs" value={MOCK_STATS.total_robots} color={theme.info} bgColor={theme.infoBg} />
        <StatCard icon={Store} label="Visão Loja" value={MOCK_STATS.total_store_view} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{
          background: theme.bgCard, borderRadius: 14, border: `1px solid ${theme.border}`,
          padding: 20
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: theme.text, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} color={theme.accent} /> Atividade recente
          </h3>
          {MOCK_AUDIT.slice(0, 4).map(a => (
            <div key={a.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0", borderBottom: `1px solid ${theme.border}22`
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: a.action === "view_password" ? theme.warningBg :
                  a.action === "create" ? theme.successBg :
                  a.action === "delete" ? theme.dangerBg : theme.infoBg,
                color: a.action === "view_password" ? theme.warning :
                  a.action === "create" ? theme.success :
                  a.action === "delete" ? theme.danger : theme.info,
              }}>
                {a.action === "view_password" ? <Eye size={14} /> :
                 a.action === "create" ? <Plus size={14} /> :
                 a.action === "delete" ? <Trash2 size={14} /> : <Edit3 size={14} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>
                  {a.action === "view_password" ? "Senha visualizada" :
                   a.action === "create" ? "Credencial criada" :
                   a.action === "delete" ? "Credencial removida" : "Credencial atualizada"}
                  {a.details?.bank && <span style={{ color: theme.accent }}> — {a.details.bank}</span>}
                </div>
                <div style={{ fontSize: 11, color: theme.textDim }}>{new Date(a.created_at).toLocaleString("pt-BR")}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: theme.bgCard, borderRadius: 14, border: `1px solid ${theme.border}`,
          padding: 20
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: theme.text, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={16} color={theme.accent} /> Status por cor
          </h3>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 0", borderBottom: `1px solid ${theme.border}22`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: cfg.color }} />
                <span style={{ fontSize: 13, color: theme.text }}>{cfg.label}</span>
              </div>
              <span style={{ fontSize: 12, color: theme.textDim, fontFamily: mono }}>
                {Math.floor(Math.random() * 120 + 10)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CredentialsPage() {
  const [search, setSearch] = useState("");
  const [filterBank, setFilterBank] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_CREDENTIALS.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.username?.toLowerCase().includes(q) ||
        c.operator_name?.toLowerCase().includes(q) ||
        c.bank_name?.toLowerCase().includes(q) ||
        c.bank_short_name?.toLowerCase().includes(q) ||
        c.observation?.toLowerCase().includes(q);
      const matchBank = !filterBank || c.bank_id === filterBank;
      const matchOp = !filterOperator || c.operator_id === filterOperator;
      const matchStatus = !filterStatus || c.status === filterStatus;
      return matchSearch && matchBank && matchOp && matchStatus;
    });
  }, [search, filterBank, filterOperator, filterStatus]);

  const [formData, setFormData] = useState({
    operator_id: "", bank_id: "", username: "", password: "",
    status: "azul_claro", observation: "", promotora: "",
    has_store_view: false, is_robot: false, is_approver: false
  });

  const openNew = () => {
    setEditItem(null);
    setFormData({
      operator_id: "", bank_id: "", username: "", password: "",
      status: "azul_claro", observation: "", promotora: "",
      has_store_view: false, is_robot: false, is_approver: false
    });
    setShowModal(true);
  };

  const openEdit = (cred) => {
    setEditItem(cred);
    setFormData({
      operator_id: cred.operator_id, bank_id: cred.bank_id,
      username: cred.username, password: "",
      status: cred.status, observation: cred.observation || "",
      promotora: cred.promotora || "",
      has_store_view: cred.has_store_view,
      is_robot: cred.is_robot, is_approver: cred.is_approver
    });
    setShowModal(true);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: "0 0 6px" }}>Credenciais</h2>
          <p style={{ fontSize: 14, color: theme.textMuted, margin: 0 }}>{filtered.length} credenciais encontradas</p>
        </div>
        <Btn variant="primary" icon={Plus} onClick={openNew}>Nova credencial</Btn>
      </div>

      <div style={{
        background: theme.bgCard, borderRadius: 14, border: `1px solid ${theme.border}`,
        marginBottom: 16, padding: 16
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <Input value={search} onChange={setSearch} placeholder="Buscar por usuário, operador, banco..." icon={Search} />
          </div>
          <Btn icon={Filter} onClick={() => setShowFilters(!showFilters)}>
            Filtros {showFilters ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </Btn>
        </div>
        {showFilters && (
          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            <Select value={filterBank} onChange={setFilterBank} placeholder="Todos os bancos"
              options={MOCK_BANKS.map(b => ({ value: b.id, label: b.short_name }))}
              style={{ flex: "1 1 180px" }} />
            <Select value={filterOperator} onChange={setFilterOperator} placeholder="Todos os operadores"
              options={MOCK_OPERATORS.filter(o => o.is_active).map(o => ({ value: o.id, label: o.name }))}
              style={{ flex: "1 1 180px" }} />
            <Select value={filterStatus} onChange={setFilterStatus} placeholder="Todos os status"
              options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))}
              style={{ flex: "1 1 150px" }} />
            {(filterBank || filterOperator || filterStatus) && (
              <Btn variant="ghost" size="sm" onClick={() => { setFilterBank(""); setFilterOperator(""); setFilterStatus(""); }}>
                Limpar filtros
              </Btn>
            )}
          </div>
        )}
      </div>

      <div style={{
        background: theme.bgCard, borderRadius: 14, border: `1px solid ${theme.border}`,
        overflow: "hidden"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {["Operador", "Banco", "Usuário", "Senha", "Status", "Flags", "Atualização", ""].map((h, i) => (
                  <th key={i} style={{
                    padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700,
                    color: theme.textDim, textTransform: "uppercase", letterSpacing: "0.06em",
                    whiteSpace: "nowrap"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{
                  borderBottom: `1px solid ${theme.border}22`,
                  transition: "background 0.1s",
                  cursor: "pointer"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = theme.bgCardHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "10px 14px", color: theme.text, fontWeight: 500 }}>{c.operator_name}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: theme.text, fontWeight: 500 }}>{c.bank_short_name || c.bank_name}</span>
                      {c.bank_url && (
                        <a href={c.bank_url} target="_blank" rel="noopener noreferrer"
                          style={{ color: theme.textDim, display: "flex" }}
                          onClick={e => e.stopPropagation()}>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <code style={{ fontFamily: mono, fontSize: 12, color: theme.textMuted, background: theme.bgInput, padding: "2px 6px", borderRadius: 4 }}>
                      {c.username}
                    </code>
                  </td>
                  <td style={{ padding: "10px 14px" }}><PasswordCell credentialId={c.id} /></td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <FlagPill active={c.has_store_view} icon={Store} label="Loja" />
                      <FlagPill active={c.is_robot} icon={Bot} label="Robô" />
                      <FlagPill active={c.is_approver} icon={UserCheck} label="Aprov" />
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: theme.textDim, fontSize: 12 }}>
                    {c.last_password_update ? new Date(c.last_password_update).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                        style={{ background: "none", border: "none", color: theme.textDim, cursor: "pointer", padding: 4, borderRadius: 6, display: "flex" }}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={(e) => e.stopPropagation()}
                        style={{ background: "none", border: "none", color: theme.textDim, cursor: "pointer", padding: 4, borderRadius: 6, display: "flex" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}>
                  <EmptyState icon={Key} title="Nenhuma credencial encontrada" description="Tente alterar os filtros de busca" />
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editItem ? "Editar credencial" : "Nova credencial"} width={600}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Select label="Operador" value={formData.operator_id} onChange={v => setFormData({ ...formData, operator_id: v })}
              options={MOCK_OPERATORS.filter(o => o.is_active).map(o => ({ value: o.id, label: o.name }))} />
            <Select label="Banco" value={formData.bank_id} onChange={v => setFormData({ ...formData, bank_id: v })}
              options={MOCK_BANKS.map(b => ({ value: b.id, label: b.short_name }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Input label="Usuário / Login" value={formData.username} onChange={v => setFormData({ ...formData, username: v })} placeholder="Ex: CBS126023" />
            <Input label="Senha" value={formData.password} onChange={v => setFormData({ ...formData, password: v })} placeholder={editItem ? "Deixe vazio para manter" : "Senha de acesso"} type="password" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Select label="Status" value={formData.status} onChange={v => setFormData({ ...formData, status: v })}
              options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))} />
            <Input label="Promotora" value={formData.promotora} onChange={v => setFormData({ ...formData, promotora: v })} placeholder="Ex: LEWE, LHAMAS..." />
          </div>
          <Input label="Observação" value={formData.observation} onChange={v => setFormData({ ...formData, observation: v })} placeholder="Notas adicionais..." />

          <div style={{ display: "flex", gap: 20 }}>
            {[
              { key: "has_store_view", label: "Visão Loja", icon: Store },
              { key: "is_robot", label: "Robô", icon: Bot },
              { key: "is_approver", label: "Aprovador", icon: UserCheck },
            ].map(f => (
              <label key={f.key} style={{
                display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                fontSize: 13, color: formData[f.key] ? theme.accent : theme.textMuted, fontWeight: 500,
                transition: "color 0.15s"
              }}>
                <div onClick={() => setFormData({ ...formData, [f.key]: !formData[f.key] })} style={{
                  width: 20, height: 20, borderRadius: 6, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: formData[f.key] ? theme.accent : theme.bgInput,
                  border: `1.5px solid ${formData[f.key] ? theme.accent : theme.border}`,
                  cursor: "pointer", transition: "all 0.15s"
                }}>
                  {formData[f.key] && <Check size={13} color="#0C0C0E" strokeWidth={3} />}
                </div>
                <f.icon size={14} /> {f.label}
              </label>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
            <Btn onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn variant="primary" icon={editItem ? Check : Plus} onClick={() => setShowModal(false)}>
              {editItem ? "Salvar alterações" : "Criar credencial"}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function OperatorsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const filtered = MOCK_OPERATORS.filter(o => {
    const q = search.toLowerCase();
    return !q || o.name.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q) || o.code?.includes(q);
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: "0 0 6px" }}>Operadores</h2>
          <p style={{ fontSize: 14, color: theme.textMuted, margin: 0 }}>{MOCK_OPERATORS.filter(o => o.is_active).length} ativos</p>
        </div>
        <Btn variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Novo operador</Btn>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input value={search} onChange={setSearch} placeholder="Buscar por nome, email ou código..." icon={Search} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {filtered.map(op => (
          <div key={op.id} style={{
            background: theme.bgCard, borderRadius: 14, border: `1px solid ${theme.border}`,
            padding: 20, transition: "border-color 0.15s",
            opacity: op.is_active ? 1 : 0.5,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, display: "flex",
                  alignItems: "center", justifyContent: "center", fontWeight: 700,
                  fontSize: 16, color: theme.accent, background: theme.accentBg,
                  border: `1px solid ${theme.accent}25`
                }}>
                  {op.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{op.name}</div>
                  <div style={{ fontSize: 12, color: theme.textDim }}>{op.email || "—"}</div>
                </div>
              </div>
              {!op.is_active && (
                <span style={{
                  fontSize: 10, fontWeight: 700, color: theme.danger, background: theme.dangerBg,
                  padding: "3px 8px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.05em"
                }}>Inativo</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: theme.textMuted }}>
              {op.code && <span>Código: <strong style={{ color: theme.text }}>{op.code}</strong></span>}
              {op.cpf && <span>CPF: <strong style={{ color: theme.text }}>{op.cpf}</strong></span>}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.border}22` }}>
              <Btn size="sm" icon={Edit3}>Editar</Btn>
              <Btn size="sm" icon={Key}>Credenciais</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BanksPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_BANKS.filter(b => {
    const q = search.toLowerCase();
    return !q || b.name.toLowerCase().includes(q) || b.short_name?.toLowerCase().includes(q) || b.default_promotora?.toLowerCase().includes(q);
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: "0 0 6px" }}>Bancos e sistemas</h2>
          <p style={{ fontSize: 14, color: theme.textMuted, margin: 0 }}>{MOCK_BANKS.length} cadastrados</p>
        </div>
        <Btn variant="primary" icon={Plus}>Novo banco</Btn>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input value={search} onChange={setSearch} placeholder="Buscar por banco ou promotora..." icon={Search} />
      </div>

      <div style={{
        background: theme.bgCard, borderRadius: 14, border: `1px solid ${theme.border}`,
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["Nome", "Nome curto", "Promotora", "URL", "Status", ""].map((h, i) => (
                <th key={i} style={{
                  padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700,
                  color: theme.textDim, textTransform: "uppercase", letterSpacing: "0.06em"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} style={{ borderBottom: `1px solid ${theme.border}22` }}
                onMouseEnter={e => e.currentTarget.style.background = theme.bgCardHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px", color: theme.text, fontWeight: 500 }}>{b.name}</td>
                <td style={{ padding: "10px 14px" }}>
                  <code style={{ fontFamily: mono, fontSize: 12, color: theme.accent, background: theme.accentBg, padding: "2px 6px", borderRadius: 4 }}>
                    {b.short_name}
                  </code>
                </td>
                <td style={{ padding: "10px 14px", color: theme.textMuted }}>{b.default_promotora || "—"}</td>
                <td style={{ padding: "10px 14px" }}>
                  {b.url ? (
                    <a href={b.url} target="_blank" rel="noopener noreferrer" style={{ color: theme.info, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                      <ExternalLink size={12} /> Acessar
                    </a>
                  ) : <span style={{ color: theme.textDim }}>—</span>}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 12,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    color: b.is_active ? theme.success : theme.danger,
                    background: b.is_active ? theme.successBg : theme.dangerBg,
                  }}>{b.is_active ? "Ativo" : "Inativo"}</span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <button style={{ background: "none", border: "none", color: theme.textDim, cursor: "pointer", padding: 4, display: "flex" }}>
                    <Edit3 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditPage() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: "0 0 6px" }}>Log de auditoria</h2>
        <p style={{ fontSize: 14, color: theme.textMuted, margin: 0 }}>Registro de todas as ações no sistema</p>
      </div>

      <div style={{
        background: theme.bgCard, borderRadius: 14, border: `1px solid ${theme.border}`,
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["Data/Hora", "Usuário", "Ação", "Detalhes"].map((h, i) => (
                <th key={i} style={{
                  padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700,
                  color: theme.textDim, textTransform: "uppercase", letterSpacing: "0.06em"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_AUDIT.map(a => (
              <tr key={a.id} style={{ borderBottom: `1px solid ${theme.border}22` }}>
                <td style={{ padding: "10px 14px", color: theme.textDim, fontSize: 12, fontFamily: mono }}>
                  {new Date(a.created_at).toLocaleString("pt-BR")}
                </td>
                <td style={{ padding: "10px 14px", color: theme.text, fontWeight: 500 }}>{a.user_email}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                    textTransform: "uppercase", letterSpacing: "0.04em",
                    color: a.action === "view_password" ? theme.warning :
                      a.action === "create" ? theme.success :
                      a.action === "delete" ? theme.danger : theme.info,
                    background: a.action === "view_password" ? theme.warningBg :
                      a.action === "create" ? theme.successBg :
                      a.action === "delete" ? theme.dangerBg : theme.infoBg,
                  }}>
                    {a.action === "view_password" ? "Visualização" :
                     a.action === "create" ? "Criação" :
                     a.action === "delete" ? "Exclusão" : "Atualização"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", color: theme.textMuted, fontSize: 12 }}>
                  {a.details && Object.entries(a.details).map(([k, v]) => (
                    <span key={k} style={{ marginRight: 12 }}>{k}: <strong style={{ color: theme.text }}>{v}</strong></span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: theme.bg, fontFamily: font,
    }}>
      <div style={{
        width: 400, background: theme.bgCard, borderRadius: 20,
        border: `1px solid ${theme.border}`, padding: "40px 36px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.4)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDim})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 8px 32px ${theme.accent}40`
          }}>
            <Shield size={28} color="#0C0C0E" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: theme.text, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            LhamasCred Vault
          </h1>
          <p style={{ fontSize: 13, color: theme.textMuted, margin: 0 }}>Central de credenciais bancárias</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Email" value={email} onChange={setEmail} placeholder="carlos@lhamascred.com.br" icon={Users} />
          <Input label="Senha" value={password} onChange={setPassword} placeholder="••••••••" type="password" icon={Lock} />
          <Btn variant="primary" size="lg" onClick={onLogin}
            style={{ width: "100%", justifyContent: "center", marginTop: 8, borderRadius: 12, padding: "14px 20px", fontSize: 15 }}>
            Entrar no sistema
          </Btn>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: theme.textDim }}>
          Acesso restrito a colaboradores autorizados
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "credentials", label: "Credenciais", icon: Key },
  { id: "operators", label: "Operadores", icon: Users },
  { id: "banks", label: "Bancos", icon: Building2 },
  { id: "audit", label: "Auditoria", icon: FileText },
];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage />;
      case "credentials": return <CredentialsPage />;
      case "operators": return <OperatorsPage />;
      case "banks": return <BanksPage />;
      case "audit": return <AuditPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, fontFamily: font, color: theme.text }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? 68 : 240,
        background: theme.bgCard,
        borderRight: `1px solid ${theme.border}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.2s ease",
        flexShrink: 0
      }}>
        <div style={{
          padding: sidebarCollapsed ? "20px 12px" : "20px 20px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDim})`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Shield size={18} color="#0C0C0E" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em" }}>LhamasCred</div>
              <div style={{ fontSize: 10, color: theme.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Vault</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: sidebarCollapsed ? "10px 14px" : "10px 14px",
                  borderRadius: 10, border: "none", cursor: "pointer",
                  background: active ? theme.accentBg : "transparent",
                  color: active ? theme.accent : theme.textMuted,
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  fontFamily: font, transition: "all 0.15s",
                  marginBottom: 4, justifyContent: sidebarCollapsed ? "center" : "flex-start",
                }}
              >
                <item.icon size={18} />
                {!sidebarCollapsed && item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: `1px solid ${theme.border}` }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "8px 14px", borderRadius: 10, border: "none",
            background: "transparent", color: theme.textDim, cursor: "pointer",
            fontSize: 12, fontFamily: font, justifyContent: sidebarCollapsed ? "center" : "flex-start",
          }}>
            {sidebarCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Recolher</>}
          </button>
          <button onClick={() => setLoggedIn(false)} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "8px 14px", borderRadius: 10, border: "none",
            background: "transparent", color: theme.textDim, cursor: "pointer",
            fontSize: 12, fontFamily: font, justifyContent: sidebarCollapsed ? "center" : "flex-start",
            marginTop: 4
          }}>
            <LogOut size={16} />
            {!sidebarCollapsed && "Sair"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div style={{
          padding: "14px 28px", borderBottom: `1px solid ${theme.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: theme.bgCard,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: theme.textDim }}>
            <Shield size={14} color={theme.accent} />
            <span>Central bancária</span>
            <span style={{ color: theme.border }}>·</span>
            <span style={{ color: theme.accent, fontWeight: 600 }}>{NAV_ITEMS.find(n => n.id === page)?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: theme.textMuted }}>Carlos Lhamas</span>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: theme.accentBg, color: theme.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700
            }}>CL</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 28 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
