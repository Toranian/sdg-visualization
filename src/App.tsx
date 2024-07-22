import { useEffect, useState } from "react";
import { getCSVFile } from "./utils";
import { SDGRow } from "./types";

function App() {
  const [data, setData] = useState<SDGRow[]>([]);

  const getData = async () => {
    const { data: csvData } = await getCSVFile();
    setData(csvData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h2>CSV Data</h2>

      {data.length === 0 && <h1>Loading data...</h1>}

      {data.length > 0 && (
        <div>
          {data.slice(0, 5).map((row: SDGRow, index) => (
            <div key={index} className="flex flex-row">
              {row.year}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
