import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Upload, Plus, BarChart3, Table, X, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CustomItem {
  id: string;
  type: "table" | "chart";
  title: string;
}

export default function Custom() {
  const { data, columns } = useData();
  const navigate = useNavigate();
  const [items, setItems] = useState<CustomItem[]>([]);

  const addItem = (type: "table" | "chart") => {
    const newItem: CustomItem = {
      id: crypto.randomUUID(),
      type,
      title: type === "table" ? "Custom Table" : "Custom Chart",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const numericColumns = columns.filter((col) =>
    data.some((row) => typeof row[col] === "number")
  );

  const chartData = data.slice(0, 8).map((row) => ({
    name: String(row[columns[0]]).slice(0, 12),
    value: typeof row[numericColumns[0]] === "number" ? row[numericColumns[0]] : 0,
  }));

  if (data.length === 0) {
    return (
      <div className="page-section">
        <div className="upload-page">
          <div className="panel text-center p-8">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-4">
              Upload a CSV file to create custom dashboards
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

  return (
    <div className="page-section animate-fade-in">
      {/* Controls */}
      <div className="panel mb-4">
        <h3 className="chart-title">Custom Dashboard Builder</h3>
        <p className="small mb-4">Add tables and charts to build your custom view</p>
        <div className="flex gap-3">
          <Button onClick={() => addItem("table")} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            <Table className="h-4 w-4 mr-2" />
            Add Table
          </Button>
          <Button onClick={() => addItem("chart")} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            <BarChart3 className="h-4 w-4 mr-2" />
            Add Chart
          </Button>
        </div>
      </div>

      {/* Widgets Grid */}
      {items.length === 0 ? (
        <div className="panel text-center py-16">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Start Building</h3>
          <p className="text-muted-foreground mb-4">
            Click "Add Table" or "Add Chart" to build your custom dashboard
          </p>
        </div>
      ) : (
        <div className="custom-grid">
          {items.map((item) => (
            <div key={item.id} className={item.type === "chart" ? "chartpanel" : "panel"}>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>
                <X className="h-4 w-4" />
              </button>

              {item.type === "table" ? (
                <>
                  <h4 className="chart-title flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    {item.title}
                  </h4>
                  <div className="overflow-auto max-h-[250px] mt-2">
                    <table className="simple-table compact">
                      <thead>
                        <tr>
                          {columns.slice(0, 4).map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.slice(0, 8).map((row, idx) => (
                          <tr key={idx}>
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
                  </div>
                </>
              ) : (
                <>
                  <h4 className="chart-title flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {item.title}
                  </h4>
                  <p className="chart-meta">{numericColumns[0] || "Values"}</p>
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
