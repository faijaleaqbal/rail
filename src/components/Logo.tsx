export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      role="img"
    >
      {/* Train wheel */}
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Spokes */}
      <line x1="16" y1="3" x2="16" y2="10" stroke="var(--color-accent)" strokeWidth="2" />
      <line x1="16" y1="22" x2="16" y2="29" stroke="var(--color-accent)" strokeWidth="2" />
      <line x1="3" y1="16" x2="10" y2="16" stroke="var(--color-accent)" strokeWidth="2" />
      <line x1="22" y1="16" x2="29" y2="16" stroke="var(--color-accent)" strokeWidth="2" />
      {/* Location pin in center */}
      <path
        d="M16 10c-3 0-5 2.2-5 5 0 3.8 5 9 5 9s5-5.2 5-9c0-2.8-2-5-5-5z"
        fill="var(--color-accent)"
      />
      <circle cx="16" cy="15" r="2" fill="var(--color-on-accent)" />
    </svg>
  );
}
