import { useEffect, useState } from "react";
import { getCSVFile } from "./utils";
import { SDGRow, Topology } from "./types";
import countriesURL from "./countries-50m.json?url";
import { SvgMap } from "./components/SvgMap";

function App() {
  const [year, setYear] = useState(2022);

  const [data, setData] = useState<SDGRow[]>([]);
  const [topology, setTopology] = useState<null | Topology>(null);

  const getData = async () => {
    const { data: csvData } = await getCSVFile();
    setData(csvData);
  };

  const getTopology = async () => {
    const resp = await fetch(countriesURL);
    setTopology(await resp.json());
  };

  useEffect(() => {
    getData();
    getTopology();
  }, []);

  return (
    <div className="w-max h-[100svh]">
      <div className="absolute bottom-10 left-10 z-10 p-3 rounded-lg bg-white flex flex-row gap-3">
        <label htmlFor="yearinput" className="font-bold">
          Year:
        </label>
        <span>{year}</span>
        <input
          id="yearinput"
          type="range"
          min="2000"
          max="2022"
          defaultValue="2022"
          list="yearvalues"
          onInput={(e) => setYear(parseInt(e.currentTarget.value))}
        />
        <datalist className="text-white bg-white" id="yearvalues">
          {[...Array(23).keys()].map((_, i) => (
            <option value={2000 + i} label={(2000 + i).toString()} />
          ))}
        </datalist>
      </div>

      {topology && <SvgMap sdgRows={data} topology={topology} year={year} />}

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
