import React, { createContext, useContext, useState } from "react";

interface DataRow {
  [key: string]: string | number;
}

interface DataContextType {
  data: DataRow[];
  columns: string[];
  fileName: string | null;
  setData: (data: DataRow[], columns: string[], fileName: string) => void;
  clearData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setDataState] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const setData = (newData: DataRow[], newColumns: string[], name: string) => {
    setDataState(newData);
    setColumns(newColumns);
    setFileName(name);
  };

  const clearData = () => {
    setDataState([]);
    setColumns([]);
    setFileName(null);
  };

  return (
    <DataContext.Provider value={{ data, columns, fileName, setData, clearData }}>
      {children}
    </DataContext.Provider>
  );
};
