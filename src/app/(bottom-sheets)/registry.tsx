import { WatchMeContactsBottomSheet } from './WatchMeContactsBottomSheet';
import { EndWatchMeConfirmBottomSheet } from './EndWatchMeConfirmBottomSheet';
import { RouteSafetyStatusSheet } from './RouteSafetySheet';
import { CheckingSafetyBottomSheet } from './CheckingSafetyBottomSheet';

export const BottomSheetRegistry = () => {
  return (
    <>
      <WatchMeContactsBottomSheet />
      <EndWatchMeConfirmBottomSheet />
      <RouteSafetyStatusSheet />
      <CheckingSafetyBottomSheet />
    </>
  );
};
