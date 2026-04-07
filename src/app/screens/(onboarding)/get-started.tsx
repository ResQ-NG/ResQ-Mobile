import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedView,
  brandFadeIn,
} from '@/lib/animation';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { OnboardingHero } from '@/components/onboarding/OnboardingHero';
import { useAppColorScheme } from '@/theme/colorMode';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';
import { useGetStartedAuthFlow } from '@/hooks/useGetStartedAuthFlow';

export default function GetStartedScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();

  const flow = useGetStartedAuthFlow();
  const {
    contact,
    handleContactChange,
    showPhoneHint,
    keyboardType,
    textContentType,
    fieldLabel,
    placeholder,
    leftIconVariant,
    mode,
    phase,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    signupPassword,
    setSignupPassword,
    otp,
    setOtp,
    primaryLabel,
    canPrimary,
    primaryBusy,
    otpHint,
    goBackToIdentifier,
    submitCheckIdentifier,
    submitLogin,
    submitSignup,
    submitOtp,
  } = flow;

  const mailIcon = (
    <Ionicons name="mail-outline" size={22} color={theme.textMuted} />
  );
  const ngFlagIcon = (
    <Text style={{ fontSize: 22, lineHeight: 24 }} accessibilityLabel="Nigeria">
      🇳🇬
    </Text>
  );

  const leftIcon = leftIconVariant === 'ng-flag' ? ngFlagIcon : mailIcon;
  const lockIcon = (
    <Ionicons name="lock-closed-outline" size={22} color={theme.textMuted} />
  );
  const personIcon = (
    <Ionicons name="person-outline" size={22} color={theme.textMuted} />
  );
  const keyIcon = (
    <Ionicons name="keypad-outline" size={22} color={theme.textMuted} />
  );

  const handlePrimary = usePreventDoublePress(() => {
    switch (phase) {
      case 'identifier':
        submitCheckIdentifier();
        break;
      case 'active_password':
        submitLogin();
        break;
      case 'signup':
        submitSignup();
        break;
      case 'verify_otp':
        submitOtp();
        break;
    }
  });

  const subtitle =
    phase === 'identifier'
      ? 'Sign in with your email or Nigerian phone number.'
      : phase === 'active_password'
        ? 'Enter your password to continue.'
        : phase === 'signup'
          ? 'Tell us a bit about you to create your account.'
          : otpHint;

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      paddingSize="md"
      footer={
        <AppButton
          variant="primary"
          size="lg"
          className="w-full"
          onPress={handlePrimary}
          disabled={!canPrimary}
          loading={primaryBusy}
        >
          {primaryLabel}
        </AppButton>
      }
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 pt-6">
          <OnboardingHero showTitle={false} />
        </View>

        <AppAnimatedView entering={brandFadeIn} className=" mt-2">
          <AppHeading level={2} className="text-center">
            Get started
          </AppHeading>
          <AppText
            variant="body"
            className="text-captionDark dark:text-captionDark-dark mt-2 text-center"
          >
            {subtitle}
          </AppText>
        </AppAnimatedView>

        <View className="mt-8 gap-4">
          <FormField label={fieldLabel}>
            <AppInput
              value={contact}
              onChangeText={handleContactChange}
              placeholder={placeholder}
              keyboardType={keyboardType}
              autoCapitalize="none"
              autoCorrect={mode !== 'phone'}
              textContentType={textContentType}
              leftIcon={leftIcon}
            />
            {showPhoneHint ? (
              <AppText
                variant="caption"
                className="text-accent-red dark:text-accent-red-dark mt-2"
              >
                Use 10 digits after +234- (e.g. 803…).
              </AppText>
            ) : null}
          </FormField>

          {phase === 'active_password' ? (
            <FormField label="Password">
              <AppInput
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                secureTextEntry
                showPasswordToggle
                textContentType="password"
                autoCapitalize="none"
                leftIcon={lockIcon}
              />
            </FormField>
          ) : null}

          {phase === 'signup' ? (
            <>
              <FormField label="First name">
                <AppInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  textContentType="givenName"
                  autoCapitalize="words"
                  leftIcon={personIcon}
                />
              </FormField>
              <FormField label="Last name (optional)">
                <AppInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  textContentType="familyName"
                  autoCapitalize="words"
                  leftIcon={personIcon}
                />
              </FormField>
              <FormField label="Password">
                <AppInput
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  placeholder="Create a password"
                  secureTextEntry
                  showPasswordToggle
                  textContentType="newPassword"
                  autoCapitalize="none"
                  leftIcon={lockIcon}
                />
              </FormField>
            </>
          ) : null}

          {phase === 'verify_otp' ? (
            <FormField label="Verification code">
              <AppInput
                value={otp}
                onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                textContentType="oneTimeCode"
                leftIcon={keyIcon}
              />
            </FormField>
          ) : null}

          {phase !== 'identifier' ? (
            <Pressable
              onPress={goBackToIdentifier}
              className="self-center py-2 active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Use a different email or phone"
            >
              <AppText
                variant="body"
                className="text-primary-blue dark:text-primary-blue-dark font-metropolis-medium"
              >
                Use a different email or phone
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </AppAnimatedSafeAreaView>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <AppText className="font-metropolis-medium text-primaryDark dark:text-primaryDark-dark mb-3">
        {label}
      </AppText>
      {children}
    </View>
  );
}
