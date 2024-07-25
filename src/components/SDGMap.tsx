import { Dispatch, SetStateAction } from "react";
import { SDGCol, SDGRow, Topology } from "../types";
import * as d3 from "d3";
import { SvgMap } from "./SvgMap";

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
          <option value={2000 + i} label={(2000 + i).toString()} />
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
          9. Industry, Innovation, and Infrastrucure
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

      {topology && (
        <SvgMap
          sdgRows={data}
          topology={topology}
          year={year}
          goal={goal as any}
        />
      )}
    </>
  );
}
