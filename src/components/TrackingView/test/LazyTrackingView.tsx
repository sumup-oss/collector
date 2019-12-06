import React from 'react';
import TrackingView from '../TrackingView';

interface LazyTrackingView {
  name: string;
  children: any;
}

const LazyTrackingView = ({ name, children }: LazyTrackingView) => {
  return <TrackingView name={name}>{children}</TrackingView>;
};

export default LazyTrackingView;
