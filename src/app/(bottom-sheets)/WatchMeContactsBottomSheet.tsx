import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import { showToast } from '@/lib/utils/app-toast';
import {
  WatchMeSheetHeader,
  WatchMeSheetContactList,
  WatchMeSheetAddForm,
  type SheetView,
} from '@/components/watchme';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { useWatchMeContactsStore } from '@/stores/watch-me-contacts-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

const SNAP_POINTS = ['65%', '95%'];

export function WatchMeContactsBottomSheet() {
  const pathname = usePathname();
  const { isOpen, close, openWithAddView, clearOpenWithAddView } =
    useWatchMeContactsSheetStore();
  const {
    contacts,
    addContact: addContactToStore,
    removeContact: removeContactFromStore,
  } = useWatchMeContactsStore();

  const [view, setView] = useState<SheetView>('list');

  // When opened with openForAdd (e.g. from contacts page), show add form
  useEffect(() => {
    if (isOpen && openWithAddView) {
      setView('add');
      clearOpenWithAddView();
    }
  }, [isOpen, openWithAddView, clearOpenWithAddView]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<string | null>(null);

  const resetAddForm = useCallback(() => {
    setName('');
    setPhone('');
    setRelationship(null);
  }, []);

  const handleClose = usePreventDoublePress(
    useCallback(() => {
      setView('list');
      close();
    }, [close])
  );

  const handleCancel = usePreventDoublePress(
    useCallback(() => {
      if (pathname === '/screens/start-watch-me/contacts') {
        close();
      }
      if (view === 'add') {
        resetAddForm();
        setView('list');
      } else {
        close();
      }
    }, [view, close, resetAddForm, pathname])
  );

  const handleSubmitAddContact = usePreventDoublePress(
    useCallback(() => {
      if (!name.trim() || !phone.trim()) return;
      addContactToStore({
        name: name.trim(),
        phone: phone.trim(),
        ...(relationship ? { relationship } : {}),
      });
      resetAddForm();

      if (pathname === '/screens/start-watch-me/contacts') {
        close();
        return;
      } else {
        close();
      }
    }, [
      name,
      phone,
      relationship,
      addContactToStore,
      resetAddForm,
      pathname,
      close,
    ])
  );

  const handleRemoveContact = useCallback(
    (id: string) => {
      removeContactFromStore(id);
      showToast({
        message: 'Contact removed.',
        variant: 'success',
      });
    },
    [removeContactFromStore]
  );

  const handleLetsGo = usePreventDoublePress(
    useCallback(() => {
      close();
      setTimeout(() => router.push('/screens/start-watch-me'), 200);
    }, [close])
  );

  const footer =
    view === 'list' ? (
      <View className="px-4 gap-3 w-full">
        <AppButton
          variant="outline"
          size="lg"
          className="w-full te"
          onPress={() => setView('add')}
        >
          Add contact
        </AppButton>
        <AppButton
          variant="primary"
          size="lg"
          className="w-full"
          onPress={handleLetsGo}
        >
          {`Let's go`}
        </AppButton>
      </View>
    ) : (
      <View className="px-4 w-full">
        <AppButton
          variant="primary"
          size="lg"
          className="w-full"
          onPress={handleSubmitAddContact}
        >
          Add contact
        </AppButton>
      </View>
    );

  return (
    <BaseBottomSheet
      snapPoints={SNAP_POINTS}
      isOpen={isOpen}
      onClose={handleClose}
      hideCloseButton
      customHeader={<WatchMeSheetHeader view={view} onCancel={handleCancel} />}
      footer={footer}
      contentPadding={{ horizontal: 0, top: 0, bottom: 16 }}
    >
      {view === 'list' ? (
        <WatchMeSheetContactList
          contacts={contacts}
          onRemove={handleRemoveContact}
        />
      ) : (
        <WatchMeSheetAddForm
          name={name}
          phone={phone}
          relationship={relationship}
          onChangeName={setName}
          onChangePhone={setPhone}
          onChangeRelationship={setRelationship}
        />
      )}
    </BaseBottomSheet>
  );
}

export default function _WatchMeContactsBottomSheetRoute() {
  return null;
}
