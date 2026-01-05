import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";
import { Upload, Search, ChevronLeft, ChevronRight } from "lucide-react";

const ROWS_PER_PAGE = 25;

export default function FullTable() {
  const { data, columns, fileName } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    
    const searchLower = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col]).toLowerCase().includes(searchLower)
      )
    );
  }, [data, columns, search]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  if (data.length === 0) {
    return (
      <div className="page-section">
        <div className="upload-page">
          <div className="panel text-center p-8">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-4">
              Upload a CSV file to view the full table
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
      <div className="panel">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="chart-title">{fileName}</h3>
            <p className="small">
              {filteredData.length.toLocaleString()} rows • {columns.length} columns
            </p>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[60vh]">
          <table className="simple-table">
            <thead>
              <tr>
                <th className="w-16">#</th>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-medium text-muted-foreground">
                    {(page - 1) * ROWS_PER_PAGE + idx + 1}
                  </td>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="small">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
