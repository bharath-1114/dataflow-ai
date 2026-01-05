import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Upload, FileSpreadsheet, Plus, BarChart3, Table, X, Sparkles } from "lucide-react";

interface CustomItem {
  id: string;
  type: "table" | "chart";
  title: string;
}

export default function Custom() {
  const { data, columns, fileName } = useData();
  const navigate = useNavigate();
  const [items, setItems] = useState<CustomItem[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addItem = (type: "table" | "chart") => {
    const newItem: CustomItem = {
      id: crypto.randomUUID(),
      type,
      title: type === "table" ? "Custom Table" : "Custom Chart",
    };
    setItems([...items, newItem]);
    setShowAddMenu(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

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
              Upload a CSV file to create custom dashboards
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Custom Analysis</h1>
          <p className="text-muted-foreground">
            Build your personalized dashboard
          </p>
        </div>

        <div className="relative">
          <Button onClick={() => setShowAddMenu(!showAddMenu)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card p-2 shadow-lg z-10">
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => addItem("table")}
              >
                <Table className="h-4 w-4" />
                Add Table
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => addItem("chart")}
              >
                <BarChart3 className="h-4 w-4" />
                Add Chart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Building</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Click "Add Widget" to add tables and charts to your custom dashboard
            </p>
            <Button variant="outline" onClick={() => setShowAddMenu(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Widget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="shadow-soft relative group">
              <button
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted"
                onClick={() => removeItem(item.id)}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {item.type === "table" ? (
                    <Table className="h-5 w-5 text-primary" />
                  ) : (
                    <BarChart3 className="h-5 w-5 text-secondary" />
                  )}
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.type === "table" ? (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {columns.slice(0, 4).map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.slice(0, 5).map((row, i) => (
                          <tr key={i}>
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
                ) : (
                  <div className="h-48 flex items-center justify-center rounded-lg bg-muted/50 border border-dashed border-border">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Chart visualization
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
