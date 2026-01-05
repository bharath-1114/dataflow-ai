import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Upload } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const CHART_COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(188, 94%, 43%)",
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(270, 70%, 60%)",
];

export default function Charts() {
  const { data, columns, fileName } = useData();
  const navigate = useNavigate();

  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const numericColumns = columns.filter((col) =>
      data.some((row) => typeof row[col] === "number")
    );
    
    const stringColumns = columns.filter((col) =>
      data.some((row) => typeof row[col] === "string")
    );

    const barData = data.slice(0, 10).map((row, idx) => ({
      name: stringColumns[0] ? String(row[stringColumns[0]]).slice(0, 15) : `Row ${idx + 1}`,
      ...numericColumns.slice(0, 3).reduce((acc, col) => ({
        ...acc,
        [col]: row[col],
      }), {} as Record<string, string | number>),
    }));

    const lineData = data.slice(0, 20).map((row, idx) => ({
      index: idx + 1,
      ...numericColumns.slice(0, 2).reduce((acc, col) => ({
        ...acc,
        [col]: row[col],
      }), {}),
    }));

    const pieColumn = numericColumns[0];
    const pieData = stringColumns[0]
      ? Object.entries(
          data.reduce<Record<string, number>>((acc, row) => {
            const key = String(row[stringColumns[0]]).slice(0, 15);
            const pieValue = row[pieColumn];
            const numericPieValue = typeof pieValue === "number" ? pieValue : 0;
            acc[key] = (acc[key] || 0) + numericPieValue;
            return acc;
          }, {})
        )
          .slice(0, 6)
          .map(([name, value]) => ({ name, value }))
      : [];

    return { barData, lineData, pieData, numericColumns, stringColumns };
  }, [data, columns]);

  if (data.length === 0) {
    return (
      <div className="page-section">
        <div className="upload-page">
          <div className="panel text-center p-8">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-4">
              Upload a CSV file to generate charts
            </p>
            <Button onClick={() => navigate("/upload")}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.numericColumns.length === 0) {
    return (
      <div className="page-section">
        <div className="upload-page">
          <div className="panel text-center p-8">
            <h2 className="text-xl font-semibold mb-2">No Numeric Data</h2>
            <p className="text-muted-foreground">
              Charts require numeric columns. Your data appears to have no numeric values.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section animate-fade-in">
      {/* Header */}
      <div className="panel mb-0">
        <h3 className="chart-title">{fileName} - Charts</h3>
        <p className="small">AI-generated visualizations for your data</p>
      </div>

      {/* Charts Grid */}
      <div className="chart-block mt-4">
        {/* Bar Chart */}
        <div className="chartpanel">
          <h4 className="chart-title">Bar Chart</h4>
          <p className="chart-meta">Comparing values across categories</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(0, 0%, 90%)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {chartData.numericColumns.slice(0, 3).map((col, i) => (
                  <Bar
                    key={col}
                    dataKey={col}
                    fill={CHART_COLORS[i]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="chartpanel">
          <h4 className="chart-title">Trend Line</h4>
          <p className="chart-meta">Values over row index</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="index" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(0, 0%, 90%)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {chartData.numericColumns.slice(0, 2).map((col, i) => (
                  <Line
                    key={col}
                    type="monotone"
                    dataKey={col}
                    stroke={CHART_COLORS[i]}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[i], strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        {chartData.pieData.length > 0 && (
          <div className="chartpanel">
            <h4 className="chart-title">Distribution</h4>
            <p className="chart-meta">Category breakdown</p>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={90}
                    innerRadius={40}
                    dataKey="value"
                  >
                    {chartData.pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(0, 0%, 90%)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Area Chart */}
        <div className="chartpanel">
          <h4 className="chart-title">Area Chart</h4>
          <p className="chart-meta">Trend visualization</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="index" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(0, 0%, 90%)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {chartData.numericColumns.slice(0, 2).map((col, i) => (
                  <Area
                    key={col}
                    type="monotone"
                    dataKey={col}
                    stroke={CHART_COLORS[i]}
                    fill={CHART_COLORS[i]}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
