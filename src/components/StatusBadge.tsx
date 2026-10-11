interface StatusBadgeProps {
  status: "on_time" | "late" | "early" | "delayed" | "cancelled" | "unknown";
  delayMinutes?: number;
}

const statusConfig = {
  on_time: { label: "On Time", className: "bg-success-subtle text-success" },
  late: { label: "Late", className: "bg-danger-subtle text-danger" },
  early: { label: "Early", className: "bg-info-subtle text-info" },
  delayed: { label: "Delayed", className: "bg-warning-subtle text-warning" },
  cancelled: { label: "Cancelled", className: "bg-danger-subtle text-danger" },
  unknown: { label: "Unknown", className: "bg-surface text-text-muted" },
};

export function StatusBadge({ status, delayMinutes = 0 }: StatusBadgeProps) {
  const config = statusConfig[status];
  const label = delayMinutes > 0 ? `${delayMinutes} min late` : config.label;

  return (
    <span
      className={`inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-semibold ${config.className}`}
      role="status"
      aria-label={label}
    >
      {label}
    </span>
  );
}

interface PlatformBadgeProps {
  platform: string | null;
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-sm border border-border bg-surface px-1.5 py-0.5 text-xs font-medium text-text-muted"
      aria-label={platform ? `Platform ${platform}` : "Platform to be determined"}
    >
      {platform ? `PF ${platform}` : "PF TBD"}
    </span>
  );
}
