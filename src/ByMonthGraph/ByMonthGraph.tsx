import { groupBy, mapValues, maxBy, sortBy } from "lodash";
import { DateTime } from "luxon";
import { FC, useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Entry } from "../fetchData";
import { sumFor } from "../utils/sumFor";

export interface Props {
  data: Entry[]
}

interface ViewableEntry {
  totalSteps: number;
  averageSteps: number;
  topSteps: number;
  month: string;
}

export const ByMonthGraph: FC<Props> = ({ data }) => {
  const viewableEntries: ViewableEntry[] = useMemo(() => {
    const minDate = DateTime.now().minus({ month: 13 });
    const relevantData = data.filter(entry => entry.date.toMillis() > minDate.toMillis())
      .map(entry => ( { ...entry, month: entry.date.toFormat("yyyy-MM") } ));
    const groups = groupBy(relevantData, data => data.month);
    const mappedGroups = mapValues(groups, group => {
      const total = sumFor(group);
      const maxEntry = maxBy(group, entry => entry.steps);
      return ( {
        totalSteps: total.steps,
        averageSteps: group.length > 0 ? Math.round(total.steps / group.length) : 0,
        topSteps: maxEntry?.steps ?? 0,
      } );
    })
    const allEntries = Object.entries(mappedGroups).map(([month, result]) => ( { ...result, month } ))
    return sortBy(allEntries, entry => entry.month);
  }, [data])

  return (
    <ResponsiveContainer height={ 300 }>
      <LineChart
        data={ viewableEntries }
        margin={ {
          top: 15,
          right: 5,
          left: 30,
          bottom: 5,
        } }
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis tick={ { fontSize: 12 } } dataKey="month"/>
        <YAxis tick={ { fontSize: 10 } } width={ 18 } />
        <Legend/>
        <Tooltip formatter={ (value: number) => `${ Math.round(value) }` }/>
        <Line name="Total Steps" type="monotone" dataKey="totalSteps" stroke="#2a801d"/>
        <Line name="Average Steps" type="monotone" dataKey="averageSteps" stroke="#8884d8"/>
        <Line name="Maximum Steps" type="monotone" dataKey="topSteps" stroke="#eb673b"/>
      </LineChart>
    </ResponsiveContainer>
  )
}
