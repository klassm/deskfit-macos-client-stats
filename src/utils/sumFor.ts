import { Entry } from "../fetchData";
import { DistanceStatsBoxEntry } from "./DistanceStatsBoxEntry";

export function sumFor(data: Entry[]): DistanceStatsBoxEntry {
  return data.reduce((prev, cur) => ( {
    ...prev,
    meters: prev.meters + cur.meters,
    steps: prev.steps + cur.steps
  } ), { meters: 0, steps: 0 })
}
