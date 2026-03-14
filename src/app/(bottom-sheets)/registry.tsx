import { WatchMeContactsBottomSheet } from './WatchMeContactsBottomSheet';
import EndWatchMeConfirmBottomSheet from './EndWatchMeConfirmBottomSheet';
import { RouteSafetyStatusSheet } from './RouteSafetySheet';
import CheckingSafetyBottomSheet from './CheckingSafetyBottomSheet';
import SosConfirmBottomSheet from './SosConfirmBottomSheet';
import EndSosConfirmBottomSheet from './EndSosConfirmBottomSheet';
import { IncomingCallBottomSheet } from './IncomingCallBottomSheet';
import ChatAgencyPickerBottomSheet from './ChatAgencyPickerBottomSheet';

export default function BottomSheetRegistry() {
  return (
    <>
      <WatchMeContactsBottomSheet />
      <EndWatchMeConfirmBottomSheet />
      <RouteSafetyStatusSheet />
      <CheckingSafetyBottomSheet />
      <SosConfirmBottomSheet />
      <EndSosConfirmBottomSheet />
      <IncomingCallBottomSheet />
      <ChatAgencyPickerBottomSheet />
    </>
  );
}
