import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import Button from '@/components/Button'
import Logo from '@/components/ui/Logo'
import { CustomInput } from '@/components/Input'
import { LoginFormData } from '@/types/form-input'
import { Link } from 'expo-router'
import { useRouter } from 'expo-router'


export default function AuthLoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });
const router = useRouter()
  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.formContainer}>
          <Logo />
          <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
          <ThemedText type="default" style={styles.subtitle}>Sign in to continue</ThemedText>
          <Controller
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="Email"
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="Password"
                onChangeText={onChange}
                value={value}
                type="password"
                error={errors.password?.message}
              />
            )}
            name="password"
          />

          <Button
            title="Sign in"
            onPress={handleSubmit(onSubmit)}
            style={styles.loginButton}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <ThemedText style={styles.dividerText}>OR</ThemedText>
            <View style={styles.divider} />
          </View>

          <Button
            title="Continue as Guest"
            onPress={() => {router.replace("/permission")}}
            variant="secondary"
            style={styles.guestButton}
          />

          <View style={styles.signupContainer}>
            <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
            <TouchableOpacity>
              <ThemedText type="link"><Link href="/(auth)/create-account">Sign up</Link></ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%'
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 24,
    paddingVertical: 32,
    elevation: 5
  },
  title: {
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.8
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    height: 52
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold'
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 24
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    opacity: 0.8
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    opacity: 0.6
  },
  guestButton: {
    marginBottom: 24,
    height: 52
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signupText: {
    fontSize: 14
  }
})
