import { SDGRow } from "../types";
import Papa, { ParseResult } from "papaparse";

export async function getCSVFile() {
  let data: SDGRow[] = [];
  let error: string | null = null;

  await fetch("/data.csv")
    .then((response) => response.text())
    .then((csvText) => {
      Papa.parse<SDGRow>(csvText, {
        header: true,
        complete: (results: ParseResult<any>) => {
          data = results.data;
        },
        error: (error: any) => {
          error = error;
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching the CSV file:", error);
    });

  return { data, error };
}
