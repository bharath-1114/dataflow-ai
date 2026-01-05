import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, FileSpreadsheet, Download, ArrowRight, X } from "lucide-react";

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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Upload Your Data</h1>
          <p className="text-muted-foreground">
            Import a CSV file to get started with AI-powered analysis
          </p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              CSV Upload
            </CardTitle>
            <CardDescription>
              Drag and drop your file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`file-drop-zone cursor-pointer ${isDragging ? "active" : ""} ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
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
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                    <UploadIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Drop your CSV file here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                </div>
              )}
            </div>

            {data.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.length} rows • {Object.keys(data[0] || {}).length} columns
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadJSON}>
                      <Download className="h-4 w-4 mr-1" />
                      JSON
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => navigate("/table")}
                  >
                    View Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/charts")}
                  >
                    View Charts
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
