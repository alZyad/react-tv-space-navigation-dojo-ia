import { MutableRefObject } from 'react';
import { Box } from '@DS/components/Box';
import { Spacer } from '@DS/components/Spacer';
import { Typography } from '@DS/components/Typography';
import { ProgramsRow } from './ProgramList';
import { SpatialNavigationVirtualizedListRef } from '../../../../../lib/src/spatial-navigation/types/SpatialNavigationVirtualizedListRef';

type Props = {
  title: string;
  listSize?: number;
  parentRef?: MutableRefObject<SpatialNavigationVirtualizedListRef | null>;
};

export const ProgramListWithTitle = ({ title, parentRef, listSize }: Props) => {
  return (
    <Box direction="vertical">
      <Typography variant="body" fontWeight="strong">
        {title}
      </Typography>
      <Spacer direction="vertical" gap="$2" />
      <ProgramsRow parentRef={parentRef} listSize={listSize} />
    </Box>
  );
};

export const ProgramListWithTitleAndVariableSizes = ({ title, listSize }: Props) => {
  return (
    <Box direction="vertical">
      <Typography variant="body" fontWeight="strong">
        {title}
      </Typography>
      <Spacer direction="vertical" gap="$2" />
      <ProgramsRow variant="variable-size" listSize={listSize} />
    </Box>
  );
};
