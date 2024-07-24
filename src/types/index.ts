import { GeometryObject, GeometryCollection } from "geojson";

export interface SDGRow {
  country_code: string;
  country: string;
  year: number;
  sdg_index_score: number;
  goal_1_score: number;
  goal_2_score: number;
  goal_3_score: number;
  goal_4_score: number;
  goal_5_score: number;
  goal_6_score: number;
  goal_7_score: number;
  goal_8_score: number;
  goal_9_score: number;
  goal_10_score: number;
  goal_11_score: number;
  goal_12_score: number;
  goal_13_score: number;
  goal_14_score: number;
  goal_15_score: number;
  goal_16_score: number;
  goal_17_score: number;
}

/**
 * Enum representing the Sustainable Development Goals (SDGs) columns.
 */
export enum SDGCol {
  /** The country code of the respective country. */
  COUNTRY_CODE = "country_code",
  /** The name of the country. */
  COUNTRY = "country",
  /** The year of the data. */
  YEAR = "year",
  /** The overall sustainability (SDG index) score of the country. */
  SDG_INDEX_SCORE = "sdg_index_score",
  /** Goal 1: No Poverty. */
  GOAL_1_SCORE = "goal_1_score",
  /** Goal 2: Zero Hunger. */
  GOAL_2_SCORE = "goal_2_score",
  /** Goal 3: Good Health and Wellbeing. */
  GOAL_3_SCORE = "goal_3_score",
  /** Goal 4: Quality Education. */
  GOAL_4_SCORE = "goal_4_score",
  /** Goal 5: Gender Equality. */
  GOAL_5_SCORE = "goal_5_score",
  /** Goal 6: Clean Water and Sanitation. */
  GOAL_6_SCORE = "goal_6_score",
  /** Goal 7: Affordable and Clean Energy. */
  GOAL_7_SCORE = "goal_7_score",
  /** Goal 8: Decent Work and Economic Growth. */
  GOAL_8_SCORE = "goal_8_score",
  /** Goal 9: Industry, Innovation and Infrastructure. */
  GOAL_9_SCORE = "goal_9_score",
  /** Goal 10: Reduced Inequalities. */
  GOAL_10_SCORE = "goal_10_score",
  /** Goal 11: Sustainable Cities and Communities. */
  GOAL_11_SCORE = "goal_11_score",
  /** Goal 12: Responsible Consumption and Production. */
  GOAL_12_SCORE = "goal_12_score",
  /** Goal 13: Climate Action. */
  GOAL_13_SCORE = "goal_13_score",
  /** Goal 14: Life Below Water. */
  GOAL_14_SCORE = "goal_14_score",
  /** Goal 15: Life on Land. */
  GOAL_15_SCORE = "goal_15_score",
  /** Goal 16: Peace, Justice and Strong Institutions. */
  GOAL_16_SCORE = "goal_16_score",
  /** Goal 17: Partnerships for the Goals. */
  GOAL_17_SCORE = "goal_17_score",
}

export const SDGColDescriptions: { [key in SDGCol]: string } = {
  [SDGCol.COUNTRY_CODE]: "The country code of the respective country.",
  [SDGCol.COUNTRY]: "The name of the country",
  [SDGCol.GOAL_1_SCORE]: "No Poverty",
  [SDGCol.GOAL_2_SCORE]: "Zero Hunger",
  [SDGCol.GOAL_3_SCORE]: "Health and Wellbeing",
  [SDGCol.GOAL_4_SCORE]: "Education",
  [SDGCol.GOAL_5_SCORE]: "Equality",
  [SDGCol.GOAL_6_SCORE]: "Water and Sanitation",
  [SDGCol.GOAL_7_SCORE]: "Affordable and Clean Energy",
  [SDGCol.GOAL_8_SCORE]: "Decent Work and Economic Growth",
  [SDGCol.GOAL_9_SCORE]: "Industry, Innovation and Infrastructure",
  [SDGCol.GOAL_10_SCORE]: "Inequalities",
  [SDGCol.GOAL_11_SCORE]: "Cities and Communities",
  [SDGCol.GOAL_12_SCORE]: "Consumption and Production",
  [SDGCol.GOAL_13_SCORE]: "Action",
  [SDGCol.GOAL_14_SCORE]: "LifeBelow Water",
  [SDGCol.GOAL_15_SCORE]: "Life on Land",
  [SDGCol.GOAL_16_SCORE]: "Peace, Justice and Strong Institutions",
  [SDGCol.GOAL_17_SCORE]: "Partnerships for the Goals",
  [SDGCol.YEAR]: "Year",
  [SDGCol.SDG_INDEX_SCORE]: "SDG Index Score",
};

export interface Topology {
  type: "Topology";
  objects: Objects;
  arcs: Array<Array<number[]>>;
  transform: Transform;
}

export interface Transform {
  scale: [number, number];
  translate: [number, number];
}

export interface Objects {
  countries: Countries;
  land: Land;
  [id: string]: any;
}

export type Countries = GeometryCollection<
  GeometryObject & { name: string } & any
>;

export type Land = GeometryCollection;
