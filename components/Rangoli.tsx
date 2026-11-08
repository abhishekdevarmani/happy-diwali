const PETALS = Array.from({ length: 12 }, (_, i) => i * 30);
const INNER = Array.from({ length: 12 }, (_, i) => i * 30 + 15);
const DOTS = Array.from({ length: 36 }, (_, i) => i * 10);

export default function Rangoli({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle r="97" />
        <circle r="90" strokeDasharray="1 3.2" />
        {PETALS.map((a) => (
          <g key={`p${a}`} transform={`rotate(${a})`}>
            <path d="M0 -88 C15 -72 15 -54 0 -38 C-15 -54 -15 -72 0 -88Z" />
            <path d="M0 -84 C8 -72 8 -60 0 -50 C-8 -60 -8 -72 0 -84Z" />
          </g>
        ))}
        {INNER.map((a) => (
          <g key={`i${a}`} transform={`rotate(${a})`}>
            <path d="M0 -36 C8 -28 8 -20 0 -12 C-8 -20 -8 -28 0 -36Z" />
          </g>
        ))}
        <circle r="38" />
        <circle r="10" />
        <circle r="4" fill="currentColor" />
      </g>
      <g fill="currentColor">
        {DOTS.map((a) => (
          <circle key={`d${a}`} cx="0" cy="-93.5" r="1.1" transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}
