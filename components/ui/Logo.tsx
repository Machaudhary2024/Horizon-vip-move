export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Horizon-VIP-Move Logo"
    >
      <path
        d="M8 48 Q32 20 56 48"
        stroke="#C9A227"
        strokeWidth="3"
        fill="none"
        strokeDasharray="6 4"
      />
      <path d="M32 8 L36 18 L46 18 L38 24 L41 34 L32 28 L23 34 L26 24 L18 18 L28 18 Z" fill="#C9A227" />
      <circle cx="32" cy="44" r="3" fill="#E8A317" />
    </svg>
  );
}
