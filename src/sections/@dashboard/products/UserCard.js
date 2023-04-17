import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

UserCard.propTypes = {
  user: PropTypes.object,
  deleteContestant: PropTypes.func,
};

export default function UserCard({ user, deleteContestant }) {
  const { name, imageUrl, nickname, results, vote, contestantId } = user;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {!results && (
          <Label
            variant="filled"
            color={'error'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
            onClick={() => deleteContestant(contestantId)}
          >
            <Iconify icon="eva:trash-fill" />
          </Label>
        )}
        <StyledProductImg alt={name} src={imageUrl} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {results ? (
            <>
              <Typography variant="subtitle1">{nickname}</Typography>
              <Typography variant="subtitle1">&nbsp; {vote || 0} vote{(vote || 0) > 1 &&"s" }</Typography>
            </>
          ) : (
            <Typography variant="subtitle1">
              <Typography
                component="span"
                variant="body1"
                sx={{
                  color: 'text.disabled',
                }}
              >
                {nickname}
              </Typography>
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
