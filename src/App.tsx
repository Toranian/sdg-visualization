import { useEffect, useState } from "react";
import { getCSVFile } from "./utils";
import { SDGCol, SDGRow, Topology } from "./types";
import countriesURL from "./countries-50m.json?url";
import Scatter from "./components/Scatter";
import { SDGMap } from "./components/SDGMap";

enum DisplayMode {
  Map,
  Chart,
  Scatter,
}

function App() {
  const [year, setYear] = useState(2022);
  const [goal, setGoal] = useState<SDGCol>(SDGCol.SDG_INDEX_SCORE);

  const [data, setData] = useState<SDGRow[]>([]);
  const [topology, setTopology] = useState<null | Topology>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.Map);

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
      <div className="flex flex-row gap-2">
        <button className="" onClick={() => setDisplayMode(DisplayMode.Map)}>
          Map
        </button>
        <button onClick={() => setDisplayMode(DisplayMode.Scatter)}>
          Scatter
        </button>
        <button onClick={() => setDisplayMode(DisplayMode.Chart)}>Chart</button>
      </div>

      {displayMode === DisplayMode.Map && topology !== null && (
        <SDGMap {...{ year, setYear, goal, setGoal, data, topology }} />
      )}

      {displayMode === DisplayMode.Scatter && (
        <Scatter
          data={data}
          cols={[SDGCol.GOAL_1_SCORE, SDGCol.GOAL_4_SCORE]}
        />
      )}

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
