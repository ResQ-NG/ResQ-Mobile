import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
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

const SNAP_POINTS = ['65%', '95%'];

export function WatchMeContactsBottomSheet() {
  const { isOpen, close } = useWatchMeContactsSheetStore();
  const {
    contacts,
    addContact: addContactToStore,
    removeContact: removeContactFromStore,
  } = useWatchMeContactsStore();

  const [view, setView] = useState<SheetView>('list');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<string | null>(null);

  const resetAddForm = useCallback(() => {
    setName('');
    setPhone('');
    setRelationship(null);
  }, []);

  const handleClose = useCallback(() => {
    setView('list');
    close();
  }, [close]);

  const handleCancel = useCallback(() => {
    if (view === 'add') {
      resetAddForm();
      setView('list');
    } else {
      close();
    }
  }, [view, close, resetAddForm]);

  const handleSubmitAddContact = useCallback(() => {
    if (!name.trim() || !phone.trim()) return;
    addContactToStore({
      name: name.trim(),
      phone: phone.trim(),
      ...(relationship ? { relationship } : {}),
    });
    resetAddForm();
    setView('list');
  }, [name, phone, relationship, addContactToStore, resetAddForm]);

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

  const handleLetsGo = useCallback(() => {
    close();
    setTimeout(() => router.push('/screens/start-watch-me'), 200);
  }, [close]);

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
