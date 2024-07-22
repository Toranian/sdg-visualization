import { GeometryObject, GeometryCollection } from "geojson"


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

export type Countries = GeometryCollection<GeometryObject & { name: string } & any>


export type Land = GeometryCollection;
