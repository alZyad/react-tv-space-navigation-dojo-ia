import {
  DefaultFocus,
  SpatialNavigationNode,
  SpatialNavigationScrollView,
  SpatialNavigationView,
  SpatialNavigationVirtualizedListRef,
} from 'react-tv-space-navigation';
import { Page } from '../components/Page';
import { programInfos } from '../modules/program/infra/programInfos';
import styled from '@emotion/native';
import { scaledPixels } from '@DS/helpers/scaledPixels';
import { ProgramNode } from '../modules/program/view/ProgramNode';
import { theme } from '@DS/theme/theme';
import { MutableRefObject, forwardRef, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '@DS/components/Button';
import { SpatialNavigationNodeRef } from '../../../lib/src/spatial-navigation/types/SpatialNavigationNodeRef';
import { Spacer } from '@DS/components/Spacer';
import { ProgramListWithTitle } from '../modules/program/view/ProgramListWithTitle';
import { BottomArrow, TopArrow } from '@DS/components/Arrows';

const HEADER_SIZE = scaledPixels(400);

export const GridWithLongNodesPage = () => {
  const firstItemRef = useRef<SpatialNavigationNodeRef | null>(null);
  const lastItemRef = useRef<SpatialNavigationNodeRef | null>(null);
  const parentRef = useRef<SpatialNavigationVirtualizedListRef | null>(null);

  return (
    <Page>
      <CenteringView>
        <GridContainer>
          <SpatialNavigationScrollView
            offsetFromStart={HEADER_SIZE + 20}
            ascendingArrow={<BottomArrow />}
            ascendingArrowContainerStyle={styles.bottomArrowContainer}
            descendingArrow={<TopArrow />}
            descendingArrowContainerStyle={styles.topArrowContainer}
          >
            <SpatialNavigationNode alignInGrid>
              <DefaultFocus>
                <>
                  <FirstRow ref={firstItemRef} />
                  <SecondRow ref={lastItemRef} />
                  <ButtonRow firstItemRef={firstItemRef} lastItemRef={lastItemRef} />
                </>
              </DefaultFocus>
            </SpatialNavigationNode>
            <Spacer gap="$6" />
            <ProgramListWithTitle
              title="Imperative focus on virtualized list"
              parentRef={parentRef}
            />
            <Row direction="horizontal">
              <Button
                label="Go to first"
                onSelect={() => {
                  parentRef.current?.focus(0);
                }}
              />
              <Button
                label="Go to last"
                onSelect={() => {
                  parentRef.current?.focus(999);
                }}
              />
            </Row>
            <Spacer gap="$20" />
          </SpatialNavigationScrollView>
        </GridContainer>
      </CenteringView>
    </Page>
  );
};

const FirstRow = forwardRef<SpatialNavigationNodeRef>((_, ref) => {
  return (
    <SpatialNavigationNode orientation="horizontal">
      <ListContainer>
        <ProgramNode
          variant="landscape"
          programInfo={programInfos[0]}
          indexRange={[0, 1]}
          ref={ref}
        />
        <ProgramNode programInfo={programInfos[1]} indexRange={[2, 2]} />
        <ProgramNode programInfo={programInfos[2]} indexRange={[3, 3]} />
        <ProgramNode variant="landscape" programInfo={programInfos[3]} indexRange={[4, 5]} />
        <ProgramNode programInfo={programInfos[4]} indexRange={[6, 6]} />
      </ListContainer>
    </SpatialNavigationNode>
  );
});
FirstRow.displayName = 'FirstRow';

const SecondRow = forwardRef<SpatialNavigationNodeRef>((_, ref) => {
  const programs = programInfos.slice(6, 13);
  return (
    <SpatialNavigationNode orientation="horizontal">
      <ListContainer>
        {programs.map((program, index) => {
          return (
            <ProgramNode
              programInfo={program}
              key={program.id}
              ref={index === programs.length - 1 ? ref : null}
            />
          );
        })}
      </ListContainer>
    </SpatialNavigationNode>
  );
});
SecondRow.displayName = 'SecondRow';

const ButtonRow = ({
  firstItemRef,
  lastItemRef,
}: {
  firstItemRef: MutableRefObject<SpatialNavigationNodeRef | null>;
  lastItemRef: MutableRefObject<SpatialNavigationNodeRef | null>;
}) => {
  return (
    <SpatialNavigationNode orientation="horizontal">
      <ListContainer>
        <Button label="Go to first item" onSelect={() => firstItemRef.current?.focus()} />
        <Button label="Go to last item" onSelect={() => lastItemRef.current?.focus()} />
      </ListContainer>
    </SpatialNavigationNode>
  );
};

const ListContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacings.$4,
  padding: theme.spacings.$4,
}));

const GridContainer = styled.View({
  backgroundColor: theme.colors.background.mainHover,
  margin: 'auto',
  height: '95%',
  width: '88%',
  borderRadius: scaledPixels(20),
  padding: scaledPixels(30),
});

const CenteringView = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Row = styled(SpatialNavigationView)({
  flexDirection: 'row',
  gap: theme.spacings.$4,
  padding: theme.spacings.$4,
});

const styles = StyleSheet.create({
  topArrowContainer: {
    width: '100%',
    height: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 20,
    left: 0,
  },
  bottomArrowContainer: {
    width: '100%',
    height: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -15,
    left: 0,
  },
});
