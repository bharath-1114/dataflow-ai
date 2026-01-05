import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Upload, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

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
      
      return { column: col, avg, max, min, sum, count: values.length };
    });

    return {
      rowCount: data.length,
      columnCount: columns.length,
      numericColumns,
      columnStats,
    };
  }, [data, columns]);

  if (data.length === 0) {
    return (
      <div className="page-section">
        <div className="upload-page">
          <div className="panel text-center p-8">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-4">
              Upload a CSV file to see your dashboard
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

  const previewData = data.slice(0, 10);
  const firstNumericCol = stats?.numericColumns[0];

  // Find highest and lowest rows based on first numeric column
  let highestRows: typeof data = [];
  let lowestRows: typeof data = [];

  if (firstNumericCol) {
    const sorted = [...data].sort((a, b) => {
      const aVal = (a[firstNumericCol] as number) || 0;
      const bVal = (b[firstNumericCol] as number) || 0;
      return bVal - aVal;
    });
    highestRows = sorted.slice(0, 5);
    lowestRows = sorted.slice(-5).reverse();
  }

  return (
    <div className="page-section animate-fade-in">
      {/* Dataset Overview */}
      <div className="panel">
        <h3 className="chart-title">{fileName}</h3>
        <p className="small">Dataset Overview</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="stat-box">
            Rows: <span className="text-primary">{stats?.rowCount.toLocaleString()}</span>
          </div>
          <div className="stat-box">
            Columns: <span className="text-primary">{stats?.columnCount}</span>
          </div>
          <div className="stat-box">
            Numeric: <span className="text-primary">{stats?.numericColumns.length}</span>
          </div>
          {stats?.columnStats[0] && (
            <>
              <div className="stat-box flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Highest ({stats.columnStats[0].column}): {stats.columnStats[0].max.toLocaleString()}
              </div>
              <div className="stat-box flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Lowest ({stats.columnStats[0].column}): {stats.columnStats[0].min.toLocaleString()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      {stats && stats.columnStats.length > 0 && (
        <div className="panel">
          <h3 className="chart-title">Summary Statistics</h3>
          <div className="overflow-auto">
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Average</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.columnStats.slice(0, 6).map((stat) => (
                  <tr key={stat.column}>
                    <td className="font-medium">{stat.column}</td>
                    <td>{stat.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>{stat.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>{stat.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Highest and Lowest Grid */}
      {firstNumericCol && (
        <div className="bucket-grid">
          {/* Highest Values */}
          <div className="panel">
            <h4 className="chart-title flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Highest {firstNumericCol}
            </h4>
            <table className="simple-table compact">
              <thead>
                <tr>
                  {columns.slice(0, 4).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highestRows.map((row, idx) => (
                  <tr key={idx} className={idx === 0 ? "metric-highlight" : ""}>
                    {columns.slice(0, 4).map((col) => (
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
            <div className="bucket-footer">Top 5 by {firstNumericCol}</div>
          </div>

          {/* Lowest Values */}
          <div className="panel">
            <h4 className="chart-title flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Lowest {firstNumericCol}
            </h4>
            <table className="simple-table compact">
              <thead>
                <tr>
                  {columns.slice(0, 4).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowestRows.map((row, idx) => (
                  <tr key={idx} className={idx === 0 ? "metric-highlight" : ""}>
                    {columns.slice(0, 4).map((col) => (
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
            <div className="bucket-footer">Bottom 5 by {firstNumericCol}</div>
          </div>
        </div>
      )}

      {/* Data Preview */}
      <div className="panel">
        <h3 className="chart-title">Data Preview</h3>
        <p className="small mb-3">Showing first 10 rows</p>
        <div className="overflow-auto max-h-[400px]">
          <table className="simple-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col} className={!row[col] && row[col] !== 0 ? "td-empty" : ""}>
                      {typeof row[col] === "number"
                        ? row[col].toLocaleString(undefined, { maximumFractionDigits: 2 })
                        : row[col] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 10 && (
          <p className="small mt-4 text-center">
            Showing 10 of {data.length} rows.{" "}
            <button
              className="text-primary hover:underline"
              onClick={() => navigate("/full-table")}
            >
              View all <ArrowRight className="h-3 w-3 inline" />
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
