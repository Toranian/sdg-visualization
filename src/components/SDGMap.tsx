import { Dispatch, SetStateAction, useState } from "react";
import { SDGCol, SDGColDescriptions, SDGRow, Topology } from "../types";
import * as d3 from "d3";
import { SvgMap } from "./SvgMap";
import { Legend } from "./Legend";
import LineChart from "./LineChart";
import ClickAwayListener from "react-click-away-listener";

type SDGMapProps = {
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  goal: SDGCol;
  setGoal: Dispatch<SetStateAction<SDGCol>>;
  data: SDGRow[];
  topology: Topology;
};

export function SDGMap({
  year,
  setYear,
  goal,
  setGoal,
  data,
  topology,
}: SDGMapProps) {
  const yearInput = (
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
          <option key={i} value={2000 + i} label={(2000 + i).toString()} />
        ))}
      </datalist>
    </div>
  );

  const goalInput = (
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
        <option value="goal_3_score">3. Good Health and Wellbeing</option>
        <option value="goal_4_score">4. Quality Education</option>
        <option value="goal_5_score">5. Gender Equality</option>
        <option value="goal_6_score">6. Clean Water and Sanitation</option>
        <option value="goal_7_score">7. Affordable and Clean Energy</option>
        <option value="goal_8_score">8. Decent Work and Economic Growth</option>
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
        <option value="goal_17_score">17. Partnerships for the Goals</option>
      </select>
    </div>
  );

  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [additionalSDGs, setAdditionalSDGs] = useState<SDGCol[]>([]);
  const colors = [
    "#F8766D80",
    "#00BA3880",
    "#619CFF80",
    "#ff00ff80",
    "#0fee0580",
    "#eee020",
  ];

  return (
    <>
      <div className="absolute bottom-10 left-10 right-10 z-10 flex flex-row gap-10 justify-between">
        <div className="h-auto items-end flex flex-row gap-10">
          {yearInput}
          {goalInput}
        </div>

        <div className="h-auto px-4 py-2 rounded-lg bg-white flex flex-row gap-3">
          {/* @ts-ignore */}
          <Legend
            color={d3.scaleSequential([0, 100], d3.interpolateYlGn) as any}
            title="SDG Goal Progress"
          />
        </div>
      </div>

      {selectedCountry && (
        <div className="w-full h-full flex items-center justify-center z-[100] fixed">
          <ClickAwayListener
            onClickAway={() => {
              setSelectedCountry(undefined);
              setAdditionalSDGs([]);
            }}
          >
            <div className="border border-slate-800 border-solid bg-white p-4 rounded-lg flex flex-col gap-2 items-center">
              <h2 className="text-lg text-semibold">
                {SDGColDescriptions[goal]} from 2002 to 2022 for{" "}
                {selectedCountry}
              </h2>
              <div className="flex flex-row">
                <LineChart
                  cols={[goal, ...additionalSDGs]}
                  data={data}
                  country={selectedCountry}
                />

                <div className="flex flex-col gap-2 border-l-2 border-solid border-zinc-300 px-3">
                  <h2>Select Additional SDG's for {selectedCountry}</h2>

                  <div className="p-3 rounded-lg bg-white flex gap-3 border-solid border-zinc-300 border mt-2 w-full">
                    <select
                      id="goalinput"
                      onChange={(e) => {
                        setAdditionalSDGs([
                          ...additionalSDGs,
                          e.currentTarget.value as SDGCol,
                        ]);
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
                      <option value="goal_10_score">
                        10. Reduced Inequalities
                      </option>
                      <option value="goal_11_score">
                        11. Sustainable Cities and Communities
                      </option>
                      <option value="goal_12_score">
                        12. Responsible Consumption and Production
                      </option>
                      <option value="goal_13_score">13. Climate Action</option>
                      <option value="goal_14_score">
                        14. Life Below Water
                      </option>
                      <option value="goal_15_score">15. Life on Land</option>
                      <option value="goal_16_score">
                        16. Peace, Justice, and Strong Institutions
                      </option>
                      <option value="goal_17_score">
                        17. Partnerships for the Goals
                      </option>
                    </select>
                  </div>

                  {additionalSDGs.map((asdg: SDGCol, index: number) => (
                    <div
                      className="border-solid px-3 py-2.5 rounded-lg flex flex-row justify-between items-center border-2"
                      style={{ borderColor: colors[index] }}
                    >
                      {SDGColDescriptions[asdg]}
                      <p
                        className="text-red-600 cursor-pointer"
                        onClick={() => {
                          return setAdditionalSDGs(
                            additionalSDGs.filter((country) => country !== asdg)
                          );
                        }}
                      >
                        Remove
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ClickAwayListener>
        </div>
      )}

      {topology && (
        <SvgMap
          sdgRows={data}
          topology={topology}
          year={year}
          goal={goal as any}
          onClickHandler={(name) => setSelectedCountry(name)}
        />
      )}
    </>
  );
}
