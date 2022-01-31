import { CardContent, Typography } from "@mui/material";
import { FC } from "react";
import { Entry } from "../../fetchData";
import { StyledCard, StyledDate, StyledTitle } from "./StatsBox.styled";

export type StatsBoxEntry = Omit<Entry, "date">;

interface Props {
  title: string;
  entry: StatsBoxEntry | undefined
  date: string | undefined;
}

export const StatsBox: FC<Props> = ({title, entry, date}) => {
  if (!entry) {
    return null;
  }
  return (<StyledCard variant="outlined">
      <CardContent>
        <StyledTitle gutterBottom variant="h6">
          { title }
        </StyledTitle>
        <StyledDate sx={{ mb: 1.5 }} color="text.secondary">
          {date ?? "" }
        </StyledDate>
        <div>
          <Typography variant="body2">{Math.round(entry.steps)} Steps</Typography>
          <Typography variant="body2">{Math.round(entry.meters)} Meters</Typography>
        </div>
      </CardContent>
  </StyledCard>
  )
}
