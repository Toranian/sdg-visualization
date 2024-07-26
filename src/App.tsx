import { useEffect, useState } from "react";
import { getCSVFile } from "./utils";
import { SDGCol, SDGRow, Topology } from "./types";
import countriesURL from "./countries-50m.json?url";
import { SvgMap } from "./components/SvgMap";
import { Legend } from "./components/Legend";
import * as d3 from "d3";
import ScatterPage from "./pages/ScatterPage";

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

      {displayMode === DisplayMode.Map && (
        <>
          <div className="absolute bottom-10 left-10 z-10 flex flex-row gap-10">
            <div className="p-3 rounded-lg bg-white flex flex-row gap-3">
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
            <div className="p-3 rounded-lg bg-white flex flex-row gap-3">
              <label htmlFor="goalinput" className="font-bold">
                Score
              </label>
              <select
                id="goalinput"
                onChange={(e) => {
                  setGoal(e.currentTarget.value as unknown as SDGCol);
                }}
              >
                <option value="sdg_index_score">Overall</option>
                <option value="goal_1_score">1. No Poverty</option>
                <option value="goal_2_score">2. Zero Hunger</option>
                <option value="goal_3_score">
                  3. Good Health and Wellbeing
                </option>
                <option value="goal_4_score">4. Quality Education</option>
                <option value="goal_5_score">5. Gender Equality</option>
                <option value="goal_6_score">
                  6. Clean Water and Sanitation
                </option>
                <option value="goal_7_score">
                  7. Affordable and Clean Energy
                </option>
                <option value="goal_8_score">
                  8. Decent Work and Economic Growth
                </option>
                <option value="goal_9_score">
                  9. Industry, Innovation, and Infrastructure
                </option>
                <option value="goal_10_score">10. Reduced Inequalities</option>
                <option value="goal_11_score">
                  11. Sustainable Cities and Communities
                </option>
                <option value="goal_12_score">
                  12. Responsible Consumption and Production
                </option>
                <option value="goal_13_score">13. Climate Action</option>
                <option value="goal_14_score">14. Life Below Water</option>
                <option value="goal_15_score">15. Life on Land</option>
                <option value="goal_16_score">
                  16. Peace, Justice, and Strong Institutions
                </option>
                <option value="goal_17_score">
                  17. Partnerships for the Goals
                </option>
              </select>
            </div>

            {/* @ts-ignore */}
            <Legend
              color={d3.scaleSequential([0, 100], d3.interpolateYlGn) as any}
              title="SDG Goal Progress"
            />
          </div>

          {topology && (
            <SvgMap
              sdgRows={data}
              topology={topology}
              year={year}
              goal={goal as any}
            />
          )}
        </>
      )}

      {displayMode === DisplayMode.Scatter && <ScatterPage data={data} />}

      {data.length === 0 && <h1>Loading data...</h1>}
    </div>
  );
}

export default App;
