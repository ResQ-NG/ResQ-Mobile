import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import Button from '@/components/Button'
import Logo from '@/components/ui/Logo'
import { CustomInput } from '@/components/Input'
import { useRouter } from 'expo-router'
import { SignupFormData } from '@/types/form-input'



export default function CreateAccountScreen() {
  const router = useRouter()
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const password = watch('password')

  const onSubmit = (data: SignupFormData) => {
    console.log(data)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.formContainer}>
          <Logo />
          <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
          <ThemedText type="default" style={styles.subtitle}>Sign up to get started</ThemedText>

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

          <Controller
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            }}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                placeholder="Confirm Password"
                onChangeText={onChange}
                value={value}
                type="password"
                error={errors.confirmPassword?.message}
              />
            )}
            name="confirmPassword"
          />

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            style={styles.signupButton}
          />

          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText type="link">Sign in</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  )
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
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
    height: 52
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginText: {
    fontSize: 14
  }
})
