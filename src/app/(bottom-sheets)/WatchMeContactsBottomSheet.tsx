import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { BaseBottomSheet } from '@/components/bottom-sheet';
import { AppButton } from '@/components/ui/AppButton';
import {
  WatchMeSheetHeader,
  WatchMeSheetContactList,
  WatchMeSheetAddForm,
  type SheetView,
} from '@/components/watchme';
import { useWatchMeContactsSheetStore } from '@/stores/watch-me-contacts-sheet-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useDeleteEmergencyContactConfirmStore } from '@/stores/delete-emergency-contact-confirm-store';
import {
  useCreateEmergencyContact,
  useGetEmergencyContacts,
  useGetAvailableRelationships,
  useUpdateEmergencyContact,
} from '@/network/modules/emergency-contacts/queries';
import {
  emergencyContactIdentifierPrefill,
  inviteReachabilityPayloadFromUiContact,
} from '@/network/modules/emergency-contacts/utils';
import {
  applyContactIdentifierInputChange,
  detectContactMode,
  GET_STARTED_NG_E164_PREFIX,
  isValidGetStartedEmail,
  isValidNgMobileNational,
  nationalFromStoredPhone,
} from '@/hooks/useGetStartedContact';
import { showToast } from '@/lib/utils/app-toast';
import { useInviteContactSheetStore } from '@/stores/invite-contact-sheet-store';
import { useAppColorScheme } from '@/theme/colorMode';

const SNAP_POINTS = ['65%', '95%'];

export function WatchMeContactsBottomSheet() {
  const { theme } = useAppColorScheme();
  const pathname = usePathname();
  const contactListAppearance = useMemo(
    () => (pathname === '/screens/watchme' ? 'watchMap' : 'default'),
    [pathname]
  );
  const {
    isOpen,
    close,
    openForEdit,
    openWithAddView,
    clearOpenWithAddView,
    openWithEditContact,
    clearOpenWithEditContact,
  } = useWatchMeContactsSheetStore();
  const { data: contacts = [] } = useGetEmergencyContacts();
  const openDeleteConfirm = useDeleteEmergencyContactConfirmStore(
    (s) => s.open
  );
  const openInviteSheet = useInviteContactSheetStore((s) => s.open);
  const createContact = useCreateEmergencyContact();
  const updateContact = useUpdateEmergencyContact();
  const relationshipsQuery = useGetAvailableRelationships();
  const relationshipOptions = useMemo(
    () =>
      (relationshipsQuery.data ?? []).map((r) => ({
        value: String(r.id),
        label: r.name,
      })),
    [relationshipsQuery.data]
  );

  const [view, setView] = useState<SheetView>('list');
  const [editingContactId, setEditingContactId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [relationship, setRelationship] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setName('');
    setContact('');
    setRelationship(null);
    setEditingContactId(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setView('list');
      resetForm();
    }
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (relationshipOptions.length > 0 && relationship == null) {
      setRelationship(relationshipOptions[0].value);
    }
  }, [relationshipOptions, relationship]);

  useEffect(() => {
    if (isOpen && openWithAddView) {
      resetForm();
      setView('add');
      clearOpenWithAddView();
    }
  }, [isOpen, openWithAddView, clearOpenWithAddView, resetForm]);

  useEffect(() => {
    if (!isOpen || !openWithEditContact || relationshipOptions.length === 0) {
      return;
    }
    setView('edit');
    setName(openWithEditContact.name);
    setContact(emergencyContactIdentifierPrefill(openWithEditContact));
    const rid = openWithEditContact.relationshipId;
    const match =
      rid != null && relationshipOptions.some((o) => o.value === String(rid));
    setRelationship(match ? String(rid) : relationshipOptions[0].value);
    setEditingContactId(Number(openWithEditContact.id));
    clearOpenWithEditContact();
  }, [
    isOpen,
    openWithEditContact,
    relationshipOptions,
    clearOpenWithEditContact,
  ]);

  const mode = useMemo(() => detectContactMode(contact), [contact]);
  const national = useMemo(
    () => (mode === 'phone' ? nationalFromStoredPhone(contact) : ''),
    [contact, mode]
  );

  const canSubmitContact = useMemo(() => {
    if (mode === 'phone') return isValidNgMobileNational(national);
    if (mode === 'email') return isValidGetStartedEmail(contact);
    return false;
  }, [contact, mode, national]);

  const contactHint = useMemo(() => {
    if (canSubmitContact || contact.trim().length === 0) return null;
    if (mode === 'phone') {
      return national.length > 0
        ? 'Enter a valid Nigerian mobile number (10 digits after +234-). Must start with 7, 8, or 9.'
        : null;
    }
    if (mode === 'email') {
      return 'Enter a valid email address.';
    }
    return 'Enter an email or a Nigerian phone number.';
  }, [canSubmitContact, contact, mode, national.length]);

  const isPhoneMode = mode === 'phone';
  const contactFieldLabel = isPhoneMode ? 'Phone number' : 'Email or phone';
  const contactPlaceholder = isPhoneMode ? '8012345678' : 'you@example.com';

  const canSubmitForm = useMemo(
    () =>
      name.trim().length > 0 &&
      canSubmitContact &&
      relationship != null &&
      Number.isFinite(Number(relationship)),
    [name, canSubmitContact, relationship]
  );

  const handleContactChange = useCallback((text: string) => {
    setContact(applyContactIdentifierInputChange(text));
  }, []);

  const mailIcon = (
    <Ionicons name="mail-outline" size={22} color={theme.textMuted} />
  );
  const ngFlagIcon = (
    <Text style={{ fontSize: 22, lineHeight: 24 }} accessibilityLabel="Nigeria">
      🇳🇬
    </Text>
  );
  const contactLeftIcon = isPhoneMode ? ngFlagIcon : mailIcon;

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
      if (view === 'add' || view === 'edit') {
        resetForm();
        setView('list');
      } else {
        close();
      }
    }, [view, close, resetForm, pathname])
  );

  const submitInvalidToast = useCallback(() => {
    showToast({
      message:
        mode === 'email'
          ? 'Enter a valid email address.'
          : mode === 'phone'
            ? 'Enter a valid Nigerian mobile number (10 digits after +234-).'
            : 'Enter an email or a Nigerian phone number.',
      variant: 'error',
    });
  }, [mode]);

  const handleSubmitAddContact = usePreventDoublePress(
    useCallback(() => {
      if (!name.trim()) return;
      if (!canSubmitContact) {
        submitInvalidToast();
        return;
      }
      const relationshipId = Number(relationship);
      if (!Number.isFinite(relationshipId)) return;

      const base = {
        full_name: name.trim(),
        relationship_id: relationshipId,
      };

      if (mode === 'phone') {
        const phone_number = `${GET_STARTED_NG_E164_PREFIX}${national}`;
        createContact.mutate(
          { ...base, phone_number },
          {
            onSuccess: () => {
              resetForm();
              close();
            },
          }
        );
        return;
      }

      createContact.mutate(
        { ...base, email: contact.trim().toLowerCase() },
        {
          onSuccess: () => {
            resetForm();
            close();
          },
        }
      );
    }, [
      name,
      canSubmitContact,
      mode,
      national,
      contact,
      relationship,
      resetForm,
      close,
      createContact,
      submitInvalidToast,
    ])
  );

  const handleSubmitEditContact = usePreventDoublePress(
    useCallback(() => {
      if (editingContactId == null || !Number.isFinite(editingContactId)) return;
      if (!name.trim()) return;
      if (!canSubmitContact) {
        submitInvalidToast();
        return;
      }
      const relationshipId = Number(relationship);
      if (!Number.isFinite(relationshipId)) return;

      const base = {
        full_name: name.trim(),
        relationship_id: relationshipId,
      };

      if (mode === 'phone') {
        const phone_number = `${GET_STARTED_NG_E164_PREFIX}${national}`;
        updateContact.mutate(
          { contactId: editingContactId, body: { ...base, phone_number } },
          {
            onSuccess: () => {
              resetForm();
              close();
            },
          }
        );
        return;
      }

      updateContact.mutate(
        {
          contactId: editingContactId,
          body: { ...base, email: contact.trim().toLowerCase() },
        },
        {
          onSuccess: () => {
            resetForm();
            close();
          },
        }
      );
    }, [
      editingContactId,
      name,
      canSubmitContact,
      mode,
      national,
      contact,
      relationship,
      resetForm,
      close,
      updateContact,
      submitInvalidToast,
    ])
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
          onPress={() => {
            resetForm();
            setView('add');
          }}
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
    ) : view === 'edit' ? (
      <View className="px-4 w-full">
        <AppButton
          variant="primary"
          size="lg"
          className="w-full"
          onPress={handleSubmitEditContact}
          loading={updateContact.isPending}
          disabled={!canSubmitForm || updateContact.isPending}
        >
          Save changes
        </AppButton>
      </View>
    ) : (
      <View className="px-4 w-full">
        <AppButton
          variant="primary"
          size="lg"
          className="w-full"
          onPress={handleSubmitAddContact}
          loading={createContact.isPending}
          disabled={!canSubmitForm || createContact.isPending}
        >
          Add contact
        </AppButton>
      </View>
    );

  const isFormView = view === 'add' || view === 'edit';

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
          listAppearance={contactListAppearance}
          onRequestEdit={openForEdit}
          onRequestRemove={(c) =>
            openDeleteConfirm({
              id: c.id,
              name: c.name,
              avatarUrl: c.avatarUrl,
            })
          }
          onInviteContact={(c) =>
            openInviteSheet({
              id: c.id,
              name: c.name,
              avatarUrl: c.avatarUrl,
              phone: inviteReachabilityPayloadFromUiContact(c),
            })
          }
        />
      ) : isFormView ? (
        <WatchMeSheetAddForm
          name={name}
          contact={contact}
          relationship={relationship}
          onChangeName={setName}
          onChangeContact={handleContactChange}
          onChangeRelationship={setRelationship}
          relationshipOptions={relationshipOptions}
          relationshipsLoading={relationshipsQuery.isLoading}
          contactFieldLabel={contactFieldLabel}
          contactPlaceholder={contactPlaceholder}
          contactKeyboardType={isPhoneMode ? 'phone-pad' : 'email-address'}
          contactTextContentType={
            isPhoneMode ? 'telephoneNumber' : 'emailAddress'
          }
          contactAutoCorrect={!isPhoneMode}
          contactHint={contactHint}
          contactLeftIcon={contactLeftIcon}
        />
      ) : null}
    </BaseBottomSheet>
  );
}

export default function _WatchMeContactsBottomSheetRoute() {
  return null;
}
