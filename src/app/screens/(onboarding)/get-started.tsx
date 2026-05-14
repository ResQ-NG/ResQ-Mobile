import { Pressable, ScrollView, Text, View } from 'react-native';
import { useMemo } from 'react';
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
import {
  GetStartedFormField,
  GetStartedRememberMeRow,
  OnboardingHero,
} from '@/components/onboarding';
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
    submitResendOtp,
    resendCooldownSec,
    signupFieldErrors,
    rememberMe,
    setRememberMe,
  } = flow;

  const signupContactError =
    phase === 'signup'
      ? (signupFieldErrors.email ?? signupFieldErrors.phone_number ?? '')
      : '';

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

  const passwordStrength = useMemo(() => {
    const p = signupPassword;
    if (!p) return null;
    const len = p.length;
    const hasLower = /[a-z]/.test(p);
    const hasUpper = /[A-Z]/.test(p);
    const hasNum = /\d/.test(p);
    const hasSym = /[^a-zA-Z0-9]/.test(p);
    let score = 0;
    if (len >= 12) score++;
    if (len >= 16) score++;
    if (hasLower && hasUpper) score++;
    if (hasNum) score++;
    if (hasSym) score++;
    score = Math.min(4, Math.max(0, score - 1)); // normalize to 0..4

    const label =
      score <= 1 ? 'Weak' : score === 2 ? 'Okay' : score === 3 ? 'Good' : 'Strong';
    const color =
      score <= 1
        ? 'bg-accent-red dark:bg-accent-red-dark'
        : score === 2
          ? 'bg-[#f59e0b]'
          : score === 3
            ? 'bg-success-green dark:bg-success-green-dark'
            : 'bg-primary-blue dark:bg-primary-blue-dark';
    return { score, label, color };
  }, [signupPassword]);

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
        <View className="px-6 pt-6 items-center">
          <OnboardingHero showTitle={false} logoClassName="h-14 w-28" />
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
          <GetStartedFormField label={fieldLabel}>
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
            {signupContactError ? (
              <AppText
                variant="caption"
                className="text-accent-red dark:text-accent-red-dark mt-2"
              >
                {signupContactError}
              </AppText>
            ) : showPhoneHint ? (
              <AppText
                variant="caption"
                className="text-accent-red dark:text-accent-red-dark mt-2"
              >
                Use 10 digits after +234- (e.g. 803…).
              </AppText>
            ) : null}
          </GetStartedFormField>

          {phase === 'active_password' ? (
            <>
              <GetStartedFormField label="Password">
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
              </GetStartedFormField>
              <GetStartedRememberMeRow
                value={rememberMe}
                onValueChange={setRememberMe}
                theme={theme}
              />
            </>
          ) : null}

          {phase === 'signup' ? (
            <>
              <GetStartedFormField
                label="First name"
                errorMessage={signupFieldErrors.first_name}
              >
                <AppInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  textContentType="givenName"
                  autoCapitalize="words"
                  leftIcon={personIcon}
                />
              </GetStartedFormField>
              <GetStartedFormField
                label="Last name (optional)"
                errorMessage={signupFieldErrors.last_name}
              >
                <AppInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  textContentType="familyName"
                  autoCapitalize="words"
                  leftIcon={personIcon}
                />
              </GetStartedFormField>
              <GetStartedFormField
                label="Password"
                errorMessage={signupFieldErrors.password}
              >
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
                {passwordStrength ? (
                  <View className="mt-3">
                    <View className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <View
                        className={`h-2 ${passwordStrength.color}`}
                        style={{ width: `${((passwordStrength.score + 1) / 5) * 100}%` }}
                      />
                    </View>
                    <AppText
                      variant="caption"
                      className="text-captionDark dark:text-captionDark-dark mt-2"
                    >
                      Strength: {passwordStrength.label}
                    </AppText>
                  </View>
                ) : null}
              </GetStartedFormField>
            </>
          ) : null}

          {phase === 'verify_otp' ? (
            <>
              <GetStartedFormField label="Verification code">
                <AppInput
                  value={otp}
                  onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                  textContentType="oneTimeCode"
                  leftIcon={keyIcon}
                />
                <Pressable
                  onPress={submitResendOtp}
                  disabled={resendCooldownSec > 0}
                  className={`self-start mt-3 ${resendCooldownSec > 0 ? 'opacity-50' : 'active:opacity-70'}`}
                  accessibilityRole="button"
                  accessibilityLabel="Resend verification code"
                >
                  <AppText
                    variant="body"
                    className="text-primary-blue dark:text-primary-blue-dark font-metropolis-medium"
                  >
                    {resendCooldownSec > 0
                      ? `Resend in 0:${String(resendCooldownSec).padStart(2, '0')}`
                      : 'Resend code'}
                  </AppText>
                </Pressable>
              </GetStartedFormField>
              <GetStartedRememberMeRow
                value={rememberMe}
                onValueChange={setRememberMe}
                theme={theme}
              />
            </>
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
