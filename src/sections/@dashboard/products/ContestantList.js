import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import UserCard from './UserCard';

// ----------------------------------------------------------------------

ContestantsList.propTypes = {
    contestants: PropTypes.array.isRequired,
    deleteContestant: PropTypes.func
};

export default function ContestantsList({ contestants,deleteContestant,  ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {contestants.map((contestant) => (
        <Grid key={contestant.id} item xs={12} sm={6} md={3}>
          <UserCard user={contestant} deleteContestant={deleteContestant}/>
        </Grid>
      ))}
    </Grid>
  );
}
