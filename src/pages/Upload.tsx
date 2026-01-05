import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, FileSpreadsheet, Download, ArrowRight, X, Table, BarChart3 } from "lucide-react";

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data, setData, fileName } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const parseCSV = (text: string): { data: Record<string, string | number>[]; columns: string[] } => {
    const lines = text.trim().split("\n");
    if (lines.length === 0) return { data: [], columns: [] };
    
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: Record<string, string | number> = {};
      headers.forEach((header, index) => {
        const value = values[index] || "";
        const numValue = parseFloat(value);
        row[header] = isNaN(numValue) ? value : numValue;
      });
      return row;
    });
    
    return { data: rows, columns: headers };
  };

  const handleFile = useCallback(async (uploadedFile: File) => {
    if (!uploadedFile.name.endsWith(".csv")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file",
      });
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const text = await uploadedFile.text();
      const { data: parsedData, columns } = parseCSV(text);
      
      if (parsedData.length === 0) {
        toast({
          variant: "destructive",
          title: "Empty file",
          description: "The CSV file appears to be empty",
        });
        return;
      }

      setData(parsedData, columns, uploadedFile.name);
      
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${parsedData.length} rows with ${columns.length} columns`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error processing file",
        description: "Could not parse the CSV file",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [setData, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const downloadJSON = () => {
    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "No data",
        description: "Please upload a CSV file first",
      });
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName?.replace(".csv", ".json") || "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <div className="page-section">
      <div className="upload-page">
        <div className="panel" style={{ maxWidth: "600px", width: "100%" }}>
          <h2 className="chart-title text-center mb-2">Upload & Convert</h2>
          <p className="small text-center mb-6">Import a CSV file to get started with AI-powered analysis</p>

          {/* Drop Zone */}
          <div
            className={`file-drop-zone ${isDragging ? "active" : ""} ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />
            
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="font-medium">Processing file...</p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">{file.name}</p>
                  <p className="small">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                  <UploadIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Drop your CSV file here</p>
                  <p className="small">or click to browse</p>
                </div>
              </div>
            )}
          </div>

          {data.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/20 p-4">
                <div>
                  <p className="font-medium">{fileName}</p>
                  <p className="small">
                    {data.length} rows • {Object.keys(data[0] || {}).length} columns
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadJSON}>
                  <Download className="h-4 w-4 mr-1" />
                  JSON
                </Button>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => navigate("/table")}>
                  <Table className="h-4 w-4 mr-2" />
                  View Table
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => navigate("/charts")}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Charts
                </Button>
              </div>
            </div>
          )}

          <p className="small text-center mt-6">Choose a CSV and click Upload.</p>
        </div>
      </div>
    </div>
  );
}
