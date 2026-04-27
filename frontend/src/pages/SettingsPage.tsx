import { useState } from "react";
import {
  User, Palette, Globe, Bell, Monitor, Save, RotateCcw,
  Building2, Mail, Shield, Clock, Hash, Eye, EyeOff,
  Package, AlertTriangle, CheckCircle, ChevronRight,
  LayoutGrid, List, Rows3, Info, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useSettings } from "../context/SettingsContext";
import type { Currency, Language, DateFormat, TimeFormat } from "../context/SettingsContext";

/* ============================================================
   SETTINGS PAGE — Enterprise-grade admin configuration
   Sections:
   1. Profile & Organization
   2. Appearance
   3. Regional & Localization
   4. Display Preferences
   5. Notifications
   6. Security
   7. System & About
   ============================================================ */

/* ---- Nav tabs --------------------------------------------- */

type Tab = {
  id: string;
  label: string;
  icon: typeof User;
};

const TABS: Tab[] = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "appearance",   label: "Appearance",    icon: Palette },
  { id: "regional",     label: "Regional",      icon: Globe },
  { id: "display",      label: "Display",       icon: Monitor },
  { id: "notifications",label: "Notifications", icon: Bell },
  { id: "security",     label: "Security",      icon: Shield },
  { id: "system",       label: "System",        icon: Info },
];

/* ---- Reusable primitives ---------------------------------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4 mt-6 first:mt-0">
      {children}
    </h3>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-[var(--color-border)]/40 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
        {description && (
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 rounded-full"
    >
      <div
        className={[
          "relative w-11 h-6 rounded-full transition-colors duration-300",
          checked
            ? "bg-[var(--color-primary)]"
            : "bg-[var(--color-surface-high)] border border-[var(--color-border)]",
        ].join(" ")}
      >
        <div
          className={[
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300",
            checked ? "translate-x-5" : "translate-x-0.5",
          ].join(" ")}
        />
      </div>
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        "px-3 py-2 text-sm rounded-xl appearance-none",
        "bg-[var(--color-surface-low)] border border-[var(--color-border)]",
        "text-[var(--color-text-primary)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)]",
        "transition-all duration-200 min-w-[160px]",
      ].join(" ")}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className={[
        "w-24 px-3 py-2 text-sm rounded-xl text-center",
        "bg-[var(--color-surface-low)] border border-[var(--color-border)]",
        "text-[var(--color-text-primary)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)]",
        "transition-all duration-200",
      ].join(" ")}
    />
  );
}

function SaveBar({
  onSave,
  onDiscard,
  loading,
}: {
  onSave: () => void;
  onDiscard: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-6 mt-2 border-t border-[var(--color-border)]/40">
      <Button variant="ghost" size="sm" onClick={onDiscard} icon={RotateCcw}>
        Discard changes
      </Button>
      <Button icon={loading ? undefined : Save} loading={loading} onClick={onSave}>
        Save changes
      </Button>
    </div>
  );
}

/* ============================================================
   SECTION COMPONENTS
   ============================================================ */

/* ---- 1. Profile ------------------------------------------- */

function ProfileSection() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({
    companyName: settings.companyName,
    adminName:   settings.adminName,
    adminEmail:  settings.adminEmail,
    adminRole:   settings.adminRole,
  });
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      updateSettings(form);
      toast.success("Profile updated");
      setSaving(false);
    }, 400);
  }

  return (
    <div className="space-y-0">
      <SectionTitle>Organization</SectionTitle>

      <div className="mb-6">
        <Input
          id="companyName"
          label="Company name"
          icon={Building2}
          value={form.companyName}
          onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
          hint="Displayed in the sidebar and reports"
        />
      </div>

      <SectionTitle>Administrator account</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Input
          id="adminName"
          label="Display name"
          icon={User}
          value={form.adminName}
          onChange={(e) => setForm((p) => ({ ...p, adminName: e.target.value }))}
        />
        <Input
          id="adminRole"
          label="Role"
          icon={Shield}
          value={form.adminRole}
          onChange={(e) => setForm((p) => ({ ...p, adminRole: e.target.value }))}
          hint="e.g. Administrator, Inventory Manager"
        />
      </div>

      <div className="mb-2">
        <Input
          id="adminEmail"
          label="Email address"
          type="email"
          icon={Mail}
          value={form.adminEmail}
          onChange={(e) => setForm((p) => ({ ...p, adminEmail: e.target.value }))}
          hint="Used for system notifications"
        />
      </div>

      <SaveBar onSave={handleSave} loading={saving} onDiscard={() => setForm({
        companyName: settings.companyName,
        adminName:   settings.adminName,
        adminEmail:  settings.adminEmail,
        adminRole:   settings.adminRole,
      })} />
    </div>
  );
}

/* ---- 2. Appearance ---------------------------------------- */

function AppearanceSection() {
  return (
    <div>
      <SectionTitle>Theme</SectionTitle>
      <Row
        label="Color theme"
        description="Choose between light, dark, or follow your operating system preference automatically."
      >
        <ThemeToggle variant="full" />
      </Row>
    </div>
  );
}

/* ---- 3. Regional ------------------------------------------ */

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "COP", label: "Colombian Peso (COP)" },
  { value: "MXN", label: "Mexican Peso (MXN)" },
  { value: "ARS", label: "Argentine Peso (ARS)" },
];

const LOCALES: Record<Currency, string> = {
  USD: "en-US", EUR: "de-DE", GBP: "en-GB",
  COP: "es-CO", MXN: "es-MX", ARS: "es-AR",
};

const TIMEZONES = [
  { value: "America/Bogota",      label: "America/Bogota (COT, UTC-5)" },
  { value: "America/New_York",    label: "America/New_York (EST, UTC-5)" },
  { value: "America/Chicago",     label: "America/Chicago (CST, UTC-6)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST, UTC-8)" },
  { value: "America/Mexico_City", label: "America/Mexico_City (CST, UTC-6)" },
  { value: "America/Sao_Paulo",   label: "America/Sao_Paulo (BRT, UTC-3)" },
  { value: "Europe/London",       label: "Europe/London (GMT, UTC+0)" },
  { value: "Europe/Madrid",       label: "Europe/Madrid (CET, UTC+1)" },
  { value: "Europe/Berlin",       label: "Europe/Berlin (CET, UTC+1)" },
  { value: "UTC",                 label: "UTC (UTC+0)" },
];

function RegionalSection() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState({
    currency:   settings.currency,
    language:   settings.language,
    dateFormat: settings.dateFormat,
    timeFormat: settings.timeFormat,
    timezone:   settings.timezone,
  });

  const previewPrice = new Intl.NumberFormat(LOCALES[form.currency], {
    style: "currency",
    currency: form.currency,
  }).format(1234567.89);

  const previewDate = new Intl.DateTimeFormat(
    form.language === "en" ? "en-US" : "es-CO",
    { dateStyle: "long", timeStyle: "short", hour12: form.timeFormat === "12h" }
  ).format(new Date());

  function handleSave() {
    updateSettings(form);
    toast.success("Regional settings saved");
  }

  return (
    <div>
      <SectionTitle>Language & Currency</SectionTitle>

      <Row label="Language" description="Interface display language.">
        <Select
          value={form.language}
          onChange={(v) => setForm((p) => ({ ...p, language: v as Language }))}
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
          ]}
        />
      </Row>

      <Row label="Currency" description="Applied to all price fields and reports.">
        <Select
          value={form.currency}
          onChange={(v) => setForm((p) => ({ ...p, currency: v as Currency }))}
          options={CURRENCIES}
        />
      </Row>

      <SectionTitle>Date & Time</SectionTitle>

      <Row label="Date format" description="How dates are displayed across the application.">
        <Select
          value={form.dateFormat}
          onChange={(v) => setForm((p) => ({ ...p, dateFormat: v as DateFormat }))}
          options={[
            { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)" },
            { value: "DD/MM/YYYY", label: "DD/MM/YYYY (EU)" },
            { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)" },
          ]}
        />
      </Row>

      <Row label="Time format" description="12-hour or 24-hour clock.">
        <Select
          value={form.timeFormat}
          onChange={(v) => setForm((p) => ({ ...p, timeFormat: v as TimeFormat }))}
          options={[
            { value: "12h", label: "12-hour (AM/PM)" },
            { value: "24h", label: "24-hour" },
          ]}
        />
      </Row>

      <Row label="Timezone" description="Used for timestamps and scheduled reports.">
        <Select
          value={form.timezone}
          onChange={(v) => setForm((p) => ({ ...p, timezone: v }))}
          options={TIMEZONES}
        />
      </Row>

      {/* Live preview */}
      <div className="mt-4 p-4 bg-[var(--color-surface-low)] rounded-xl border border-[var(--color-border)]/40 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          Live preview
        </p>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Price</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">{previewPrice}</p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Date & time</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">{previewDate}</p>
          </div>
        </div>
      </div>

      <SaveBar onSave={handleSave} onDiscard={() => setForm({
        currency:   settings.currency,
        language:   settings.language,
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
        timezone:   settings.timezone,
      })} />
    </div>
  );
}

/* ---- 4. Display ------------------------------------------- */

function DisplaySection() {
  const { settings, updateDisplay } = useSettings();
  const [form, setForm] = useState({ ...settings.display });

  function handleSave() {
    updateDisplay(form);
    toast.success("Display preferences saved");
  }

  return (
    <div>
      <SectionTitle>Layout</SectionTitle>

      <Row label="Default inventory view" description="Table view shows more data; grid view shows product cards.">
        <div className="flex rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-low)]">
          {([
            { value: "table", icon: List,        label: "Table" },
            { value: "grid",  icon: LayoutGrid,  label: "Grid"  },
          ] as const).map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((p) => ({ ...p, defaultView: value }))}
              className={[
                "flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all",
                form.defaultView === value
                  ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-card"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
              ].join(" ")}
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      </Row>

      <Row label="Items per page" description="Number of products shown per page in the inventory table.">
        <Select
          value={String(form.itemsPerPage)}
          onChange={(v) => setForm((p) => ({ ...p, itemsPerPage: Number(v) }))}
          options={[
            { value: "10",  label: "10 per page" },
            { value: "25",  label: "25 per page" },
            { value: "50",  label: "50 per page" },
            { value: "100", label: "100 per page" },
          ]}
        />
      </Row>

      <Row label="Compact mode" description="Reduce row height and padding for denser information display.">
        <Toggle checked={form.compactMode} onChange={(v) => setForm((p) => ({ ...p, compactMode: v }))} />
      </Row>

      <SectionTitle>Visibility</SectionTitle>

      <Row label="Show cost price" description="Display the cost price column in the inventory table. Only visible to admins.">
        <Toggle checked={form.showCostPrice} onChange={(v) => setForm((p) => ({ ...p, showCostPrice: v }))} />
      </Row>

      <Row label="Stock warnings" description="Highlight low stock and out-of-stock products with color indicators.">
        <Toggle checked={form.showStockWarnings} onChange={(v) => setForm((p) => ({ ...p, showStockWarnings: v }))} />
      </Row>

      <SaveBar onSave={handleSave} onDiscard={() => setForm({ ...settings.display })} />
    </div>
  );
}

/* ---- 5. Notifications ------------------------------------- */

function NotificationsSection() {
  const { settings, updateNotifications } = useSettings();
  const [form, setForm] = useState({ ...settings.notifications });

  function handleSave() {
    updateNotifications(form);
    toast.success("Notification settings saved");
  }

  return (
    <div>
      <SectionTitle>Inventory alerts</SectionTitle>

      <Row label="Low stock alert" description="Notify when a product stock falls below the threshold.">
        <Toggle checked={form.lowStockAlert} onChange={(v) => setForm((p) => ({ ...p, lowStockAlert: v }))} />
      </Row>

      {form.lowStockAlert && (
        <Row label="Low stock threshold" description="Alert when stock drops to this quantity or below.">
          <div className="flex items-center gap-2">
            <NumberInput
              value={form.lowStockThreshold}
              onChange={(v) => setForm((p) => ({ ...p, lowStockThreshold: v }))}
              min={1}
              max={999}
            />
            <span className="text-sm text-[var(--color-text-muted)]">units</span>
          </div>
        </Row>
      )}

      <Row label="Out of stock alert" description="Notify immediately when a product reaches 0 units.">
        <Toggle checked={form.outOfStockAlert} onChange={(v) => setForm((p) => ({ ...p, outOfStockAlert: v }))} />
      </Row>

      <Row label="New product alert" description="Notify when a new product is added to the inventory.">
        <Toggle checked={form.newProductAlert} onChange={(v) => setForm((p) => ({ ...p, newProductAlert: v }))} />
      </Row>

      <SectionTitle>Delivery channels</SectionTitle>

      <Row label="In-app notifications" description="Show notification badges and alerts inside the application.">
        <Toggle checked={form.browserNotifications} onChange={(v) => setForm((p) => ({ ...p, browserNotifications: v }))} />
      </Row>

      <Row label="Email notifications" description="Send alert emails to your registered admin email address.">
        <Toggle checked={form.emailNotifications} onChange={(v) => setForm((p) => ({ ...p, emailNotifications: v }))} />
      </Row>

      {form.emailNotifications && (
        <div className="mt-2 p-3 bg-[var(--color-warning-container)]/30 border border-[var(--color-warning)]/20 rounded-xl flex items-start gap-2">
          <AlertTriangle size={14} className="text-[var(--color-warning)] shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-xs text-[var(--color-on-warning-container)]">
            Email delivery requires SMTP configuration in the backend environment variables.
          </p>
        </div>
      )}

      <SaveBar onSave={handleSave} onDiscard={() => setForm({ ...settings.notifications })} />
    </div>
  );
}

/* ---- 6. Security ------------------------------------------ */

function SecuritySection() {
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [saving, setSaving]             = useState(false);

  function handleChangePassword() {
    if (!form.current || !form.newPwd || !form.confirm) {
      toast.error("All password fields are required");
      return;
    }
    if (form.newPwd !== form.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.newPwd.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      toast.success("Password changed successfully");
      setForm({ current: "", newPwd: "", confirm: "" });
      setSaving(false);
    }, 600);
  }

  function PasswordInput({
    id, label, value, onChange, show, onToggle,
  }: {
    id: string; label: string; value: string;
    onChange: (v: string) => void; show: boolean; onToggle: () => void;
  }) {
    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="block text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={[
              "w-full px-4 pr-10 py-2.5 text-sm rounded-xl",
              "bg-[var(--color-surface-low)] border border-[var(--color-border)]",
              "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)]",
              "transition-all duration-200",
            ].join(" ")}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {show ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle>Change password</SectionTitle>

      <div className="space-y-4 mb-6">
        <PasswordInput
          id="current"
          label="Current password"
          value={form.current}
          onChange={(v) => setForm((p) => ({ ...p, current: v }))}
          show={showCurrent}
          onToggle={() => setShowCurrent((x) => !x)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordInput
            id="newPwd"
            label="New password"
            value={form.newPwd}
            onChange={(v) => setForm((p) => ({ ...p, newPwd: v }))}
            show={showNew}
            onToggle={() => setShowNew((x) => !x)}
          />
          <PasswordInput
            id="confirm"
            label="Confirm new password"
            value={form.confirm}
            onChange={(v) => setForm((p) => ({ ...p, confirm: v }))}
            show={showConfirm}
            onToggle={() => setShowConfirm((x) => !x)}
          />
        </div>

        <div className="p-3 bg-[var(--color-surface-low)] rounded-xl border border-[var(--color-border)]/40">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
            Password requirements
          </p>
          {[
            { label: "At least 8 characters", met: form.newPwd.length >= 8 },
            { label: "Contains a number", met: /\d/.test(form.newPwd) },
            { label: "Contains uppercase letter", met: /[A-Z]/.test(form.newPwd) },
            { label: "Passwords match", met: form.newPwd.length > 0 && form.newPwd === form.confirm },
          ].map(({ label, met }) => (
            <div key={label} className="flex items-center gap-2 py-0.5">
              <CheckCircle
                size={12}
                strokeWidth={2.5}
                className={met ? "text-[var(--color-secondary)]" : "text-[var(--color-text-muted)]"}
              />
              <span className={[
                "text-xs",
                met ? "text-[var(--color-secondary)] font-semibold" : "text-[var(--color-text-muted)]",
              ].join(" ")}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Button icon={saving ? undefined : Shield} loading={saving} onClick={handleChangePassword}>
        Change password
      </Button>

      <SectionTitle>Session</SectionTitle>

      <Row label="Active session" description="You are currently logged in as Administrator.">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
          <span className="text-xs font-semibold text-[var(--color-secondary)]">Active</span>
        </div>
      </Row>

      <Row label="Sign out all devices" description="End all active sessions across all browsers and devices.">
        <Button variant="danger" size="sm">
          Sign out all
        </Button>
      </Row>
    </div>
  );
}

/* ---- 7. System -------------------------------------------- */

function SystemSection() {
  const { resetSettings } = useSettings();

  function handleReset() {
    if (window.confirm("This will reset all settings to defaults. Are you sure?")) {
      resetSettings();
      toast.success("Settings reset to defaults");
    }
  }

  const INFO = [
    { label: "Application",    value: "Streamline Inventory" },
    { label: "Version",        value: "1.0.0" },
    { label: "Frontend",       value: "React 19 + Vite 8 + Tailwind CSS 4" },
    { label: "Backend",        value: "Express 5 + TypeScript 6 + Sequelize" },
    { label: "Database",       value: "PostgreSQL via Sequelize ORM" },
    { label: "Node.js",        value: "v22 LTS" },
  ];

  return (
    <div>
      <SectionTitle>System information</SectionTitle>

      {INFO.map(({ label, value }) => (
        <Row key={label} label={label}>
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">{value}</span>
        </Row>
      ))}

      <Row label="API documentation" description="Interactive Swagger UI for all REST endpoints.">
        <a
          href="http://localhost:3000/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" size="sm" iconRight={ExternalLink}>
            Open Swagger
          </Button>
        </a>
      </Row>

      <SectionTitle>Danger zone</SectionTitle>

      <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error-container)]/20 p-5 space-y-4">
        <Row
          label="Reset all settings"
          description="Restore all settings to their default values. This cannot be undone."
        >
          <Button variant="danger" size="sm" icon={RotateCcw} onClick={handleReset}>
            Reset defaults
          </Button>
        </Row>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  profile:       ProfileSection,
  appearance:    AppearanceSection,
  regional:      RegionalSection,
  display:       DisplaySection,
  notifications: NotificationsSection,
  security:      SecuritySection,
  system:        SystemSection,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const ActiveSection = SECTION_COMPONENTS[activeTab];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account, preferences, and system configuration."
        breadcrumbs={[{ label: "Dashboard", to: "/" }]}
      />

      <div className="flex gap-8 items-start">
        {/* ── Sidebar nav ── */}
        <nav className="w-52 shrink-0 space-y-0.5 sticky top-20">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={[
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold",
                "transition-all duration-150 text-left group",
                activeTab === id
                  ? "bg-[var(--color-primary-container)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-text-primary)]",
              ].join(" ")}
            >
              <Icon
                size={15}
                strokeWidth={activeTab === id ? 2.5 : 2}
                className="shrink-0"
              />
              {label}
              {activeTab === id && (
                <ChevronRight size={13} className="ml-auto opacity-60" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </nav>

        {/* ── Content panel ── */}
        <div className="flex-1 min-w-0 bg-[var(--color-surface)] rounded-2xl p-8 shadow-card border border-[var(--color-border)]/40">
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
