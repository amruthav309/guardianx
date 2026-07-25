import { useState } from "react";

interface Analytics {
  emails?: number;
  urls?: number;
  sms?: number;
  threats?: number;
  total_scans?: number;
}

interface Props {
  analytics: Analytics;
  theme?: "cyan" | "red";
}

export default function DashboardCharts({ analytics, theme = "cyan" }: Props) {
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);
  const [activeBar, setActiveBar] = useState<number | null>(null);

  const isRed = theme === "red";

  const emails = analytics?.emails || 0;
  const urls = analytics?.urls || 0;
  const sms = analytics?.sms || 0;
  const threats = analytics?.threats || 0;
  const totalScans = analytics?.total_scans || (emails + urls + sms) || 0;

  const safeScans = Math.max(0, totalScans - threats);
  const safeRate = totalScans > 0 ? ((safeScans / totalScans) * 100).toFixed(1) : "100.0";
  const threatRate = totalScans > 0 ? ((threats / totalScans) * 100).toFixed(1) : "0.0";

  // 1. Pie / Donut Chart Slices
  const pieData = [
    {
      name: "Verified Safe",
      count: safeScans,
      percentage: safeRate,
      color: isRed ? "#38bdf8" : "#00f0ff", // Sky Blue / Cyan
    },
    {
      name: "Threats Neutralized",
      count: threats,
      percentage: threatRate,
      color: isRed ? "#f43f5e" : "#f43f5e", // Rose Red
    },
  ];


  // Helper for rendering SVG Pie/Donut Arcs
  const getArcPath = (cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) => {
    let angleDiff = endAngle - startAngle;
    if (angleDiff >= 2 * Math.PI - 0.001) {
      angleDiff = 2 * Math.PI - 0.001;
      endAngle = startAngle + angleDiff;
    }
    const x1 = cx + rOuter * Math.cos(startAngle);
    const y1 = cy + rOuter * Math.sin(startAngle);
    const x2 = cx + rOuter * Math.cos(endAngle);
    const y2 = cy + rOuter * Math.sin(endAngle);

    const ix1 = cx + rInner * Math.cos(endAngle);
    const iy1 = cy + rInner * Math.sin(endAngle);
    const ix2 = cx + rInner * Math.cos(startAngle);
    const iy2 = cy + rInner * Math.sin(startAngle);

    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${ix2} ${iy2} Z`;
  };

  // 2. Bar Chart Data (Scan Channels)
  const scanData = [
    { name: "Email Scans", value: emails, color: "#38bdf8" },
    { name: "URL Scans", value: urls, color: "#00f0ff" },
    { name: "SMS Scans", value: sms, color: "#0284c7" },
    { name: "Threats Neutralized", value: threats, color: "#f43f5e" },
  ];

  const maxBarVal = Math.max(...scanData.map((d) => d.value), 1);

  return (
    <div className="grid lg:grid-cols-2 gap-6">


      {/* GRAPH 1: Threat Verdict Distribution (SVG Pie / Donut Chart) */}
      <div className={isRed ? "bg-[#0f0609]/95 border border-red-600/25 rounded-2xl p-5 shadow-2xl transition-all hover:border-red-600/40" : "bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl transition-all hover:border-sky-500/40"}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={isRed ? "text-red-400 text-lg font-bold font-serif-header flex items-center gap-2" : "text-sky-400 text-lg font-bold font-serif-header flex items-center gap-2"}>
              Threat Verdict Distribution
            </h2>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Proportional breakdown of clean scans vs isolated threats
            </p>
          </div>
          <span className={isRed ? "text-[9px] font-cyber px-2.5 py-1 rounded-lg bg-red-600/15 text-red-400 border border-red-600/30 font-bold uppercase tracking-widest" : "text-[9px] font-cyber px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold uppercase tracking-widest"}>
            PIE TELEMETRY
          </span>
        </div>

        {/* Pie SVG Container */}
        <div className="w-full h-[250px] relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 500 240" className="w-full h-full overflow-visible">
            {/* Render Donut Slices */}
            {(() => {
              let currentAngle = -Math.PI / 2;
              const cx = 140;
              const cy = 120;
              const rOuter = 82;
              const rInner = 50;

              if (totalScans === 0) {
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={rOuter}
                    fill="none"
                    stroke={isRed ? "#f87171" : "#38bdf8"}
                    strokeWidth="20"
                    opacity="0.3"
                  />
                );
              }

              return pieData.map((slice, idx) => {
                if (slice.count === 0) return null;
                const portion = slice.count / totalScans;
                const angleSpan = portion * 2 * Math.PI;
                const startA = currentAngle;
                const endA = currentAngle + angleSpan;
                currentAngle = endA;

                const isHovered = activePieIndex === idx;
                const path = getArcPath(cx, cy, isHovered ? rOuter + 6 : rOuter, rInner, startA, endA);

                return (
                  <path
                    key={slice.name}
                    d={path}
                    fill={slice.color}
                    opacity={isHovered ? 1 : 0.9}
                    stroke="#080e18"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setActivePieIndex(idx)}
                    onMouseLeave={() => setActivePieIndex(null)}
                  />
                );
              });
            })()}

            {/* Center Text inside Donut */}
            <text x="140" y="112" textAnchor="middle" fill={isRed ? "#f87171" : "#00f0ff"} fontSize="24" fontWeight="bold" fontFamily="JetBrains Mono">
              {totalScans}
            </text>
            <text x="140" y="130" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">
              TOTAL SCANS
            </text>

            {/* Side Legend & Breakdown */}
            <g transform="translate(270, 45)">
              {pieData.map((item, idx) => (
                <g
                  key={item.name}
                  transform={`translate(0, ${idx * 65})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setActivePieIndex(idx)}
                  onMouseLeave={() => setActivePieIndex(null)}
                >
                  <rect
                    x="0"
                    y="0"
                    width="190"
                    height="52"
                    rx="10"
                    fill={isRed ? "#0a0407" : "#080e18"}
                    stroke={item.color}
                    strokeWidth={activePieIndex === idx ? "2" : "1"}
                    strokeOpacity={activePieIndex === idx ? "0.8" : "0.3"}
                  />
                  <circle cx="16" cy="26" r="6" fill={item.color} />
                  <text x="30" y="22" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">
                    {item.name}
                  </text>
                  <text x="30" y="38" fill={item.color} fontSize="11" fontFamily="JetBrains Mono">
                    {item.count} scans ({item.percentage}%)
                  </text>
                </g>
              ))}
            </g>
          </svg>

          {/* Active Hover Tooltip for Pie Slice */}
          {activePieIndex !== null && (
            <div
              className={isRed ? "absolute z-20 bg-[#0a0407] border border-red-600/60 p-2.5 rounded-xl text-xs font-mono shadow-2xl pointer-events-none transition-all" : "absolute z-20 bg-[#080e18] border border-sky-500/60 p-2.5 rounded-xl text-xs font-mono shadow-2xl pointer-events-none transition-all"}
              style={{
                left: "28%",
                top: "15%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p className={isRed ? "font-bold text-red-400 border-b border-red-600/20 pb-1 mb-1" : "font-bold text-sky-400 border-b border-sky-500/20 pb-1 mb-1"}>
                {pieData[activePieIndex].name}
              </p>
              <p className="text-zinc-200">
                Count: <span className="font-bold" style={{ color: pieData[activePieIndex].color }}>{pieData[activePieIndex].count}</span>
              </p>
              <p className={isRed ? "text-red-400/80" : "text-sky-400/80"}>
                Share: <span className="font-bold">{pieData[activePieIndex].percentage}%</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* GRAPH 2: Scan Vector Distribution (SVG Bar Chart) */}
      <div className={isRed ? "bg-[#0f0609]/95 border border-red-600/25 rounded-2xl p-5 shadow-2xl transition-all hover:border-red-600/40" : "bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-xl transition-all hover:border-sky-500/40"}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={isRed ? "text-red-400 text-lg font-bold font-serif-header flex items-center gap-2" : "text-sky-400 text-lg font-bold font-serif-header flex items-center gap-2"}>
              Scan Vector Distribution
            </h2>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Live count tally per security scan channel
            </p>
          </div>
          <span className={isRed ? "text-[9px] font-cyber px-2.5 py-1 rounded-lg bg-red-600/15 text-red-400 border border-red-600/30 font-bold uppercase tracking-widest" : "text-[9px] font-cyber px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold uppercase tracking-widest"}>
            BY VECTOR
          </span>
        </div>


        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-2 text-xs font-mono">
          {scanData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300">{item.name.replace(" Scans", "").replace(" Neutralized", "")}</span>
            </div>
          ))}
        </div>

        {/* SVG Bar Chart Canvas */}
        <div className="w-full h-[250px] relative overflow-hidden">
          <svg viewBox="0 0 500 240" className="w-full h-full overflow-visible">
            <defs>
              {scanData.map((item, idx) => (
                <linearGradient key={idx} id={`barGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={item.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={item.color} stopOpacity="0.35" />
                </linearGradient>
              ))}
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = 200 - ratio * 150;
              const val = Math.round(ratio * maxBarVal);
              return (
                <g key={i}>
                  <line x1="40" y1={y} x2="470" y2={y} stroke={isRed ? "rgba(220, 38, 38, 0.12)" : "rgba(56, 189, 248, 0.12)"} strokeDasharray="4 4" />
                  <text x="32" y={y + 4} textAnchor="end" fill={isRed ? "#9f7070" : "#64748b"} fontSize="10" fontFamily="JetBrains Mono">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {scanData.map((item, idx) => {
              const barWidth = 60;
              const x = 60 + idx * 105;
              const height = item.value > 0 ? Math.max(12, (item.value / maxBarVal) * 150) : 2;
              const y = 200 - height;
              const isHovered = activeBar === idx;

              return (
                <g
                  key={item.name}
                  onMouseEnter={() => setActiveBar(idx)}
                  onMouseLeave={() => setActiveBar(null)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Bar Pillars */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    rx="8"
                    fill={`url(#barGrad-${idx})`}
                    stroke={item.color}
                    strokeWidth={isHovered ? "2" : "1"}
                    className="transition-all duration-300"
                  />

                  {/* Value Label directly on top of bar */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fill={item.color}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono"
                  >
                    {item.value}
                  </text>

                  {/* Channel label underneath */}
                  <text
                    x={x + barWidth / 2}
                    y="222"
                    textAnchor="middle"
                    fill={isRed ? "#9f7070" : "#94a3b8"}
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    {item.name.replace(" Scans", "").replace(" Neutralized", "")}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Active Hover Tooltip for Bar */}
          {activeBar !== null && (
            <div
              className={isRed ? "absolute z-20 bg-[#0a0407] border border-red-600/60 p-2.5 rounded-xl text-xs font-mono shadow-2xl pointer-events-none transition-all" : "absolute z-20 bg-[#080e18] border border-sky-500/60 p-2.5 rounded-xl text-xs font-mono shadow-2xl pointer-events-none transition-all"}
              style={{
                left: `${((60 + activeBar * 105 + 30) / 500) * 100}%`,
                top: "20%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p className={isRed ? "font-bold text-red-400 border-b border-red-600/20 pb-1 mb-1" : "font-bold text-sky-400 border-b border-sky-500/20 pb-1 mb-1"}>
                {scanData[activeBar].name}
              </p>
              <p className="text-zinc-200 font-bold">
                Count: <span style={{ color: scanData[activeBar].color }}>{scanData[activeBar].value}</span>
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}