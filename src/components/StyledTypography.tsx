import { Typography } from '@mui/material';
import styled from 'styled-components';
export const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
});

export const TruncatedParagraph = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
