import { useEffect, useState } from "react";
import Scatter from "../components/Scatter";
import { SDGCol, SDGRow } from "../types";

interface ScatterPageProps {
  data: SDGRow[];
}

export default function ScatterPage({ data }: ScatterPageProps) {
  const countries = Array.from(
    new Set(data.map((row: SDGRow) => row[SDGCol.COUNTRY])),
  ).sort((a, b) => a.localeCompare(b));

  const [goalOne, setGoalOne] = useState<SDGCol | undefined>();
  const [goalTwo, setGoalTwo] = useState<SDGCol | undefined>();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [year, setYear] = useState<number | undefined>(undefined);
  const colors = [
    "#F8766D80",
    "#00BA3880",
    "#619CFF80",
    "#eee020",
    "#ff00ff80",
    "#0fee0580",
  ];

  // useEffect(() => {
  //   console.log(selectedCountries);
  // }, [selectedCountries, goalOne]);

  return (
    <div className="w-screen h-screen grid flex flex-col md:grid-cols-4">
      {/* Left side with scatter plot*/}
      <div className="md:col-span-3 h-full w-full flex justify-center items-center">
        {goalOne && goalTwo && selectedCountries.length > 0 ? (
          <Scatter
            data={data}
            cols={[goalOne, goalTwo]}
            selectedCountries={selectedCountries}
            key={selectedCountries.toString() + goalOne + goalTwo + year} // Ensure rerender
            year={year}
          ></Scatter>
        ) : (
          <div className="">
            <h2 className="text-2xl font-semibold">
              Select a country and Sustainable Development Goals to compare.
            </h2>
          </div>
        )}
      </div>

      {/* Right side with options */}
      <div className="w-full md:col-span-1 border-solid border-l border-zinc-300 flex flex-col items-center ">
        <div className="max-w-xl mt-8">
          <h2 className="text-2xl font-semibold mb-2">Select SDG's</h2>
          <p className="mb-1">
            Select two different Sustainability Development Goals to see how
            countries compare.
          </p>

          <label htmlFor="goalinput" className="font-semibold">
            SDG Score 1
          </label>
          <div className="p-3 rounded-lg bg-white flexgap-3 border-solid border-zinc-300 border">
            <select
              id="goalinput"
              onChange={(e) => {
                setGoalOne(e.currentTarget.value as SDGCol);
              }}
            >
              <option value="sdg_index_score">Overall</option>
              <option value="goal_1_score">1. No Poverty</option>
              <option value="goal_2_score">2. Zero Hunger</option>
              <option value="goal_3_score">3. Good Health and Wellbeing</option>
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

          <label htmlFor="goalinput" className="font-semibold">
            SDG Score 2
          </label>
          <div className="p-3 rounded-lg bg-white flex gap-3 border-solid border-zinc-300 border mt-2 w-full">
            <select
              id="goalinput"
              onChange={(e) => {
                setGoalTwo(e.currentTarget.value as SDGCol);
              }}
            >
              <option value="sdg_index_score">Overall</option>
              <option value="goal_1_score">1. No Poverty</option>
              <option value="goal_2_score">2. Zero Hunger</option>
              <option value="goal_3_score">3. Good Health and Wellbeing</option>
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

          <div className="flex flex-col gap-2 mb-3 w-full">
            <h2 className="text-2xl font-semibold mt-4">Add New Country</h2>
            <div className="relative w-full">
              <select
                id="countries"
                name="country"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = event.target.value;
                  if (!countries.includes(value)) return;
                  setSelectedCountries([...selectedCountries, value]);
                }}
                className="border rounded-lg py-2 px-4 outline-none w-full max-h-40 overflow-y-auto pr-3"
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Selected Countries</h2>
            {selectedCountries.map((c: string, index: number) => (
              <div
                className="border-solid border px-3 py-2.5 rounded-lg flex flex-row justify-between items-center border-2"
                style={{ borderColor: colors[index] }}
              >
                {c}
                <p
                  className="text-red-600 cursor-pointer"
                  onClick={() => {
                    return setSelectedCountries(
                      selectedCountries.filter((country) => country !== c),
                    );
                  }}
                >
                  Remove
                </p>
              </div>
            ))}
          </div>

          <div className="my-3 flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-2xl font-semibold">
                Set Year - ({!year ? "2000-2023" : year})
              </h2>
              <button
                className=" px-2 py-1 border-solid border border-blue-300 bg-blue-200 rounded-lg   text-blue-700"
                onClick={() => setYear(undefined)}
              >
                Reset
              </button>
            </div>

            <input
              type="range"
              className=""
              step="1"
              min="2000"
              max="2022"
              onChange={(e) => setYear(+e.target.value)}
            />
          </div>

          <button
            className="w-full px-2.5 py-1.5 mt-3 border-solid border border-red-300 bg-red-200 rounded-lg font-semibold text-red-700"
            onClick={() => {
              setGoalOne(undefined);
              setGoalTwo(undefined);
              setSelectedCountries([]);
              setYear(undefined);
            }}
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}
