import { useQuery } from "react-query";
import { DateTime } from "luxon";
import axios from "axios";
import { keyBy, last, sortBy } from "lodash";

export interface Entry {
  date: DateTime,
  steps: number;
  meters: number;
}

interface RawEntry {
  date: string,
  steps: number;
  meters: number;
}

const dateFormat = "yyyy-MM-dd";

export function useData() {
  return useQuery("treadmill-data", fetchData);
}

function fillMissingEntries(entries: RawEntry[]): RawEntry[] {
  const indexed = keyBy(entries, entry => entry.date);
  const start = (entries.length === 0 ? DateTime.local() : DateTime.fromFormat(entries[0].date, dateFormat)).startOf("month");
  const lastDate = last(entries)?.date;
  const end = lastDate === undefined ? DateTime.local() : DateTime.fromFormat(lastDate, dateFormat);

  let currentDate = start;
  while(currentDate.toMillis() < end.toMillis()) {
    const formattedDate = currentDate.toFormat(dateFormat);
    if (indexed[formattedDate] === undefined) {
      indexed[formattedDate] = { date: formattedDate, meters: 0, steps: 0};
    }
    currentDate = currentDate.plus({days: 1});
  }

  return Object.values(indexed);
}

function mapEntries(entries: RawEntry[]): Entry[] {
  const mapped = entries.map(({steps, meters, date}) => ({
    steps, meters, date: DateTime.fromFormat(date, dateFormat)
  }));
  return sortBy(mapped, entry => entry.date.toMillis())
}

export async function fetchData(): Promise<Entry[]> {
  const { data } = await axios.get<{ date: string, steps: number, meters: number }[]>("http://localhost:4934/treadmill/workouts");
  return mapEntries(fillMissingEntries(data));
}
