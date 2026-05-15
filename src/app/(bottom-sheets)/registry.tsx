import { WatchMeContactsBottomSheet } from './WatchMeContactsBottomSheet';
import EndWatchMeConfirmBottomSheet from './EndWatchMeConfirmBottomSheet';
import SosConfirmBottomSheet from './SosConfirmBottomSheet';
import EndSosConfirmBottomSheet from './EndSosConfirmBottomSheet';
import { IncomingCallBottomSheet } from './IncomingCallBottomSheet';
import ChatAgencyPickerBottomSheet from './ChatAgencyPickerBottomSheet';
import DeleteEmergencyContactConfirmBottomSheet from './DeleteEmergencyContactConfirmBottomSheet';
import AvatarPresetPickerBottomSheet from './AvatarPresetPickerBottomSheet';
import InviteContactBottomSheet from './InviteContactBottomSheet';
import LogoutConfirmBottomSheet from './LogoutConfirmBottomSheet';
import SessionExpiredBottomSheet from './SessionExpiredBottomSheet';

export default function BottomSheetRegistry() {
  return (
    <>
      <WatchMeContactsBottomSheet />
      <EndWatchMeConfirmBottomSheet />
      <SosConfirmBottomSheet />
      <EndSosConfirmBottomSheet />
      <IncomingCallBottomSheet />
      <ChatAgencyPickerBottomSheet />
      <DeleteEmergencyContactConfirmBottomSheet />
      <AvatarPresetPickerBottomSheet />
      <InviteContactBottomSheet />
      <LogoutConfirmBottomSheet />
      <SessionExpiredBottomSheet />
    </>
  );
}
