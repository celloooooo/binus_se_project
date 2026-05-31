import React, { forwardRef } from 'react';
import MapView from 'react-native-maps';

const MapViewComponent = forwardRef((props: any, ref) => {
  return (
    <MapView
      ref={ref}
      {...props}
    />
  );
});

export default MapViewComponent;
