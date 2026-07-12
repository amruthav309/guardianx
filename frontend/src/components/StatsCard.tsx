interface Props {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

function StatsCard({
  title,
  value,
  icon,
  color = "text-cyan-400",
}: Props) {
  return (
    <div className="bg-[#161616] border border-cyan-500/20 rounded-2xl p-6 shadow-md hover:shadow-cyan-500/20 hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-zinc-400 text-sm font-medium">
            {title}
          </p>

          <h2 className={`text-5xl font-bold mt-3 ${color}`}>
            {value}
          </h2>

          <p className="text-zinc-500 text-sm mt-2">
            Today
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-3xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatsCard;