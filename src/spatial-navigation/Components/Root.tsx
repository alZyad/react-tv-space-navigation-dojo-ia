import { SpatialNavigatorContext } from '../Context/SpatialNavigatorContext';
import { ParentIdContext } from '../Context/ParentIdContext';
import { useBeforeMountEffect } from '../hooks/useBeforeMountEffect';
import { useCreateSpatialNavigator } from '../hooks/useCreateSpatialNavigator';
import React, { ReactNode } from 'react';

const ROOT_ID = 'root';

export const Root = ({ children }: { children: ReactNode }) => {
  const spatialNavigator = useCreateSpatialNavigator();
  useBeforeMountEffect(() => {
    spatialNavigator.registerNode(ROOT_ID, { orientation: 'vertical' });
    return () => spatialNavigator.unregisterNode(ROOT_ID);
  }, []);

  return (
    <SpatialNavigatorContext.Provider value={spatialNavigator}>
      <ParentIdContext.Provider value={ROOT_ID}>
        {children}
      </ParentIdContext.Provider>
    </SpatialNavigatorContext.Provider>
  );
};
