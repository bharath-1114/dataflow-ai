import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Upload, TrendingUp, TrendingDown, Hash, FileSpreadsheet } from "lucide-react";

export default function TableDashboard() {
  const { data, columns, fileName } = useData();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (data.length === 0) return null;

    const numericColumns = columns.filter((col) =>
      data.some((row) => typeof row[col] === "number")
    );

    const columnStats = numericColumns.map((col) => {
      const values = data
        .map((row) => row[col])
        .filter((v): v is number => typeof v === "number");
      
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      return { column: col, avg, max, min, sum };
    });

    return {
      rowCount: data.length,
      columnCount: columns.length,
      numericColumns: numericColumns.length,
      columnStats,
    };
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
              Upload a CSV file to see your dashboard
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

  const previewData = data.slice(0, 10);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{fileName}</h1>
          <p className="text-muted-foreground">Dataset Overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rowCount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Columns</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.columnCount}</div>
          </CardContent>
        </Card>

        {stats?.columnStats[0] && (
          <>
            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Highest ({stats.columnStats[0].column})
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.columnStats[0].max.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lowest ({stats.columnStats[0].column})
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.columnStats[0].min.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Preview Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col}>
                        {typeof row[col] === "number"
                          ? row[col].toLocaleString(undefined, { maximumFractionDigits: 2 })
                          : row[col] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length > 10 && (
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Showing 10 of {data.length} rows.{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => navigate("/full-table")}
              >
                View all
              </button>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Column Statistics */}
      {stats && stats.columnStats.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Column Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.columnStats.slice(0, 6).map((stat) => (
                <div
                  key={stat.column}
                  className="rounded-lg border border-border bg-muted/30 p-4"
                >
                  <p className="font-medium mb-2">{stat.column}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average</span>
                      <span className="font-medium">
                        {stat.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max</span>
                      <span className="font-medium text-green-600">
                        {stat.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min</span>
                      <span className="font-medium text-destructive">
                        {stat.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
