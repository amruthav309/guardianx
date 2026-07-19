import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

interface Analytics {
  emails: number;
  urls: number;
  sms: number;
  weekly_trend: {
    day: string;
    scans: number;
  }[];
}

interface Props {
  analytics: Analytics;
}

export default function DashboardCharts({
  analytics,
}: Props) {

  const weeklyData =
    analytics?.weekly_trend?.length
      ? analytics.weekly_trend
      : [
          { day: "Mon", scans: 0 },
          { day: "Tue", scans: 0 },
          { day: "Wed", scans: 0 },
          { day: "Thu", scans: 0 },
          { day: "Fri", scans: 0 },
          { day: "Sat", scans: 0 },
          { day: "Sun", scans: 0 },
        ];

  const scanData = [
    {
      name: "Email",
      value: analytics.emails,
    },
    {
      name: "URL",
      value: analytics.urls,
    },
    {
      name: "SMS",
      value: analytics.sms,
    },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">

      <div className="bg-[#161616] rounded-xl p-5">

        <h2 className="text-cyan-400 text-2xl font-bold mb-5">
          Weekly Scan Trend
        </h2>

        <div className="overflow-x-auto">

          <LineChart
            width={620}
            height={300}
            data={weeklyData}
          >

            <CartesianGrid stroke="#333" />

            <XAxis dataKey="day" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="scans"
              stroke="#06b6d4"
              strokeWidth={3}
            />

          </LineChart>

        </div>

      </div>

      <div className="bg-[#161616] rounded-xl p-5">

        <h2 className="text-cyan-400 text-2xl font-bold mb-5">
          Scan Distribution
        </h2>

        <div className="overflow-x-auto">

          <BarChart
            width={620}
            height={300}
            data={scanData}
          >

            <CartesianGrid stroke="#333" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#06b6d4"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </div>

      </div>

    </div>
  );
}