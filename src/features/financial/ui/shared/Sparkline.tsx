const DEMO_POINTS = [38, 56, 45, 70, 60, 90, 113, 105, 130, 150];

export function Sparkline() {
  const w = 400;
  const h = 120;
  const pad = 16;
  const max = Math.max(...DEMO_POINTS);
  const min = Math.min(...DEMO_POINTS);
  const xs = DEMO_POINTS.map(
    (_, i) => pad + (i / (DEMO_POINTS.length - 1)) * (w - pad * 2)
  );
  const ys = DEMO_POINTS.map(
    (v) => pad + ((max - v) / (max - min)) * (h - pad * 2)
  );

  const linePath = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`)
    .join(" ");
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${h - pad} L ${xs[0]} ${h - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-28"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#32A88D" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#32A88D" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chartGrad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#32A88D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#32A88D" />
      ))}
    </svg>
  );
}
