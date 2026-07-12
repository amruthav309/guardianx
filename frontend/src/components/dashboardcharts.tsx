import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

interface Analytics {
  emails: number;
  urls: number;
  sms: number;
  threats: number;
}

interface Props {
  analytics?: Analytics;
}

function DashboardCharts({ analytics }: Props) {
  const data = analytics ?? {
    emails: 0,
    urls: 0,
    sms: 0,
    threats: 0,
  };

  

  const scanData = [
    { name: "Email", value: data.emails },
    { name: "URL", value: data.urls },
    { name: "SMS", value: data.sms },
  ];

 

  const weeklyTrend = [
    { day: "Mon", scans: 8 },
    { day: "Tue", scans: 12 },
    { day: "Wed", scans: 15 },
    { day: "Thu", scans: 10 },
    { day: "Fri", scans: 18 },
    { day: "Sat", scans: 6 },
    { day: "Sun", scans: 9 },
  ];

  

  return (
    <div className="grid lg:grid-cols-2 gap-8 mt-10">

      {/* Weekly Trend */}

      <div className="bg-[#161616] rounded-2xl p-6 border border-cyan-500/20">

        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Weekly Scan Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={weeklyTrend}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="scans"
              stroke="#06b6d4"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* Scan Distribution */}

      <div className="bg-[#161616] rounded-2xl p-6 border border-cyan-500/20">

        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Scan Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={scanData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#06b6d4"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

     
     

    </div>
  );
}

export default DashboardCharts;