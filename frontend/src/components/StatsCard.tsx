interface Props {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
  subtext?: string;
}

function StatsCard({
  title,
  value,
  icon,
  color = "text-sky-400",
  subtext = "Active session metrics",
}: Props) {
  return (
    <div className="bg-[#111927]/90 border border-sky-500/20 rounded-2xl p-5 shadow-lg hover:shadow-sky-500/15 hover:border-sky-500/40 transition-all duration-300 hover:-translate-y-1 group">

      <div className="flex justify-between items-start">

        <div>
          <p className="text-sky-300/70 text-xs font-cyber tracking-wider uppercase">
            {title}
          </p>

          <h2 className={`text-4xl font-bold mt-2 font-serif-header ${color}`}>
            {value}
          </h2>

          <p className="text-sky-400/50 text-[10px] mt-2 font-mono">
            {subtext}
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatsCard;