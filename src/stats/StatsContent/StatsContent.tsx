import { maxBy } from "lodash";
import { DateTime } from "luxon";
import { FC, useMemo } from "react";
import { Entry } from "../../fetchData";
import { AverageStatsBox } from "../statsBoxes/AverageStepsBox/AverageStatsBox";
import { DistanceStatsBox} from "../statsBoxes/DistanceStatsBox/DistanceStatsBox";
import { ByDayGraph } from "../../ByDayGraph/ByDayGraph";
import { StatsBar } from "../StatsBar/StatsBar";
import { DistanceStatsBoxEntry } from "../../utils/DistanceStatsBoxEntry";
import { TopDayStatsBox } from "../statsBoxes/TopDayStatsBox/TopDayStatsBox";
import { TotalStatsBox } from "../statsBoxes/TotalStatsBox/TotalStatsBox";
import { StatsGroup } from "../StatsGroup/StatsGroup";
import { ByMonthGraph } from "../../ByMonthGraph/ByMonthGraph";

export interface Props {
  data: Entry[]
  month: DateTime
}


function sumFor(date: DateTime | undefined, data: Entry[]): DistanceStatsBoxEntry & { date: DateTime | undefined } {
  return data.reduce((prev, cur) => ( {
    ...prev,
    meters: prev.meters + cur.meters,
    steps: prev.steps + cur.steps
  } ), { date, meters: 0, steps: 0 })
}

export const StatsContent: FC<Props> = ({ data, month: selectedMonth }) => {
  const monthData = useMemo(() =>
      data.filter(entry => entry.date.year === selectedMonth.year && entry.date.month === selectedMonth.month),
    [data, selectedMonth]
  );

  const yearData = useMemo(() => data.filter(entry => entry.date.year === selectedMonth.year), [selectedMonth, data]);

  const overallYear = useMemo(() => sumFor(selectedMonth.startOf("year"), yearData), [yearData, selectedMonth]);
  const overallMonth = useMemo(() => sumFor(selectedMonth, monthData), [monthData, selectedMonth]);
  const overall = useMemo(() => sumFor(undefined, data), [data]);
  const thirtyDaysAgo = DateTime.now().minus({days: 30});
  const last30Days = data.filter(({date}) => date.toMillis() > thirtyDaysAgo.toMillis());

  const year = selectedMonth.year;
  const month = selectedMonth.toFormat("yyyy-MM");


  return (
    <div>
      <StatsGroup title="Top Day">
        <StatsBar>
          <TopDayStatsBox title="Overall" data={data} />
          <TopDayStatsBox title={ `${ year }` } data={ yearData } />
          <TopDayStatsBox title={ month } data={ monthData } />
        </StatsBar>
      </StatsGroup>

      <StatsGroup title="Total">
        <StatsBar>
          <TotalStatsBox title="Overall" data={ data }/>
          <TotalStatsBox title={ `${ year }` } data={ yearData }/>
          <TotalStatsBox title={ month } data={ monthData }/>
        </StatsBar>
      </StatsGroup>

      <StatsGroup title="Average">
        <StatsBar>
          <AverageStatsBox title="Overall" data={ data }/>
          <AverageStatsBox title={ `${ year }` } data={ yearData } />
          <AverageStatsBox title={ month } data={ monthData } />
        </StatsBar>
      </StatsGroup>

      <StatsGroup title="Last 12 months">
        <ByMonthGraph data={ data }/>
      </StatsGroup>

      <StatsGroup title="Last 30 days">
        <ByDayGraph data={ last30Days }/>
      </StatsGroup>
    </div>
  );
}
