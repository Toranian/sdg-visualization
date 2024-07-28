import { useEffect, useState } from "react";
import { getCSVFile } from "./utils";
import { SDGCol, SDGRow, Topology } from "./types";
import countriesURL from "./countries-50m.json?url";
import ScatterPage from "./pages/ScatterPage";
import { SDGMap } from "./components/SDGMap";
import LineChart from "./components/LineChart";

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
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.Scatter,
  );

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
    <div className="max-w-screen max-h-screen overflow-hidden">
      <div className="flex flex-row gap-2 z-[1000] fixed top-0 left-0 p-3">
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

      {displayMode === DisplayMode.Scatter && <ScatterPage data={data} />}

      {displayMode === DisplayMode.Chart && (
        <LineChart
          data={data}
          cols={[
            SDGCol.GOAL_3_SCORE,
            SDGCol.GOAL_6_SCORE,
            SDGCol.GOAL_9_SCORE,
            SDGCol.GOAL_5_SCORE,
          ]}
          country="Albania"
        />
      )}

      {data.length === 0 && <h1>Loading data...</h1>}
    </div>
  );
}

export default App;
