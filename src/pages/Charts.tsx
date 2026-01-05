import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Upload, FileSpreadsheet } from "lucide-react";
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
  "hsl(221, 83%, 53%)",  // Primary blue
  "hsl(188, 94%, 43%)",  // Secondary teal
  "hsl(142, 76%, 36%)",  // Green
  "hsl(38, 92%, 50%)",   // Orange
  "hsl(0, 84%, 60%)",    // Red
  "hsl(270, 70%, 60%)",  // Purple
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

    // Prepare different chart data
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

    // Aggregate data for pie chart
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-6">
              Upload a CSV file to generate charts
            </p>
            <Button onClick={() => navigate("/upload")}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chartData || chartData.numericColumns.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center shadow-soft">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">No Numeric Data</h2>
            <p className="text-muted-foreground mb-6">
              Charts require numeric columns. Your data appears to have no numeric values.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{fileName} - Charts</h1>
        <p className="text-muted-foreground">
          AI-generated visualizations for your data
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle className="text-lg">Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(215, 19%, 35%)"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 19%, 35%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 91%)",
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
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle className="text-lg">Trend Line</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis
                    dataKey="index"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(215, 19%, 35%)"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 19%, 35%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 91%)",
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
          </CardContent>
        </Card>

        {/* Pie Chart */}
        {chartData.pieData.length > 0 && (
          <Card className="chart-card">
            <CardHeader>
              <CardTitle className="text-lg">Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
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
                      outerRadius={100}
                      fill="#8884d8"
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
                        border: "1px solid hsl(220, 13%, 91%)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Area Chart */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle className="text-lg">Area Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis
                    dataKey="index"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(215, 19%, 35%)"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 19%, 35%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 91%)",
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
