import { maxBy } from "lodash";
import { DateTime } from "luxon";
import { FC, useMemo } from "react";
import { Entry } from "../../fetchData";
import { EntryGraph } from "../EntryGraph";
import { StatsBar } from "../StatsBar/StatsBar";
import { StatsBox, StatsBoxEntry } from "../StatsBox/StatsBox";
import { StatsGroup } from "../StatsGroup/StatsGroup";

export interface Props {
  data: Entry[]
  month: DateTime
}


function sumFor(date: DateTime | undefined, data: Entry[]): StatsBoxEntry & { date: DateTime | undefined } {
  return data.reduce((prev, cur) => ( {
    ...prev,
    meters: prev.meters + cur.meters,
    steps: prev.steps + cur.steps
  } ), { date, meters: 0, steps: 0 })
}

function formatDate(entry: { date: DateTime | undefined } | undefined): string | undefined {
  return entry?.date?.toLocaleString(DateTime.DATE_MED)
}


export const StatsContent: FC<Props> = ({ data, month: selectedMonth }) => {
  const monthData = useMemo(() =>
      data.filter(entry => entry.date.year === selectedMonth.year && entry.date.month === selectedMonth.month),
    [data, selectedMonth]
  );

  const yearData = useMemo(() => data.filter(entry => entry.date.year === selectedMonth.year), [selectedMonth, data]);

  const maxYearEntry = useMemo(() => maxBy(yearData, entry => entry.steps), [yearData])
  const maxMonthEntry = useMemo(() => maxBy(monthData, entry => entry.steps), [monthData])
  const maxEntry = useMemo(() => maxBy(data, entry => entry.steps), [data]);
  const overallYear = useMemo(() => sumFor(selectedMonth.startOf("year"), yearData), [yearData, selectedMonth]);
  const overallMonth = useMemo(() => sumFor(selectedMonth, monthData), [monthData, selectedMonth]);
  const overall = useMemo(() => sumFor(undefined, data), [data]);

  const year = selectedMonth.year;
  const month = selectedMonth.toFormat("yyyy-MM");


  return (
    <div>
      <StatsGroup title="Top Day">
        <StatsBar>
          <StatsBox title="Overall" entry={ maxEntry } date={ formatDate(maxEntry) }/>
          <StatsBox title={ `${ year }` } entry={ maxYearEntry } date={ formatDate(maxMonthEntry) }/>
          <StatsBox title={ month } entry={ maxMonthEntry } date={ formatDate(maxMonthEntry) }/>
        </StatsBar>
      </StatsGroup>
      <StatsGroup title="Total">
        <StatsBar>
          <StatsBox title="Overall" entry={ overall } date={ undefined }/>
          <StatsBox title={ `${ year }` } entry={ overallYear } date={ undefined }/>
          <StatsBox title={ month } entry={ overallMonth } date={ undefined }/>
        </StatsBar>
      </StatsGroup>

      <StatsGroup title="Daily">
        <EntryGraph data={ monthData } month={ selectedMonth }/>
      </StatsGroup>
    </div>
  );
}
