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
  const [secondYear, setSecondYear] = useState<number | null>(null);

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
    <div className="max-w-screen max-h-screen overflow-hidden">
      <div className="absolute z-10 right-3 top-3">
        <button
          className="bg-white  border-blue-500 border-2 border-solid px-3 py-2.5 rounded-lg text-bold text-blue-800 cursor-pointer"
          onClick={() =>
            displayMode === DisplayMode.Map
              ? setDisplayMode(DisplayMode.Scatter)
              : setDisplayMode(DisplayMode.Map)
          }
        >
          {displayMode === DisplayMode.Map ? "Compare Countries" : "View Map"}
        </button>
      </div>

      <div className="flex flex-row gap-2 z-[1000] fixed top-0 left-0 p-3">
        <h2 className="text-xl text-semibold">
          Sustainability Development Goals
        </h2>
      </div>
      {displayMode === DisplayMode.Map && topology !== null && (
        <SDGMap
          {...{
            year,
            setYear,
            goal,
            setGoal,
            data,
            topology,
            secondYear,
            setSecondYear,
          }}
        />
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
