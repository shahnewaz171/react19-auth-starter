import { Activity, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSignUp } from '@clerk/clerk-react';
import { Link as RouterLink } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { useOtpTimer } from '@/features/authentication/hooks/useOtpTimer';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/form/Input';
import OtpVerification from '@/features/authentication/components/account-verification';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);

  const { isLoaded, signUp } = useSignUp();

  const { timeLeft, start } = useOtpTimer(0);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!isLoaded) return;

    setError(null);

    try {
      setIsLoading(true);

      await signUp?.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      });
      await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });

      toast.success(
        'We have sent a verification code to your email. Please verify to create your account.',
        { duration: 5000 }
      );

      start(120);
      setIsPendingVerification(true);
    } catch (err: any) {
      setError(err.message || err.errors[0]?.long_message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        py: 4
      }}
    >
      <Activity mode={isPendingVerification ? 'visible' : 'hidden'}>
        <OtpVerification timeLeft={timeLeft} start={start} />
      </Activity>

      <Activity mode={isPendingVerification ? 'hidden' : 'visible'}>
        <Card sx={{ maxWidth: 440, width: '100%', mx: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Sign up to get started with template
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <div className="flex justify-between gap-2">
                  <Input
                    label="First Name"
                    type="text"
                    placeholder="Enter your first name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    placeholder="Enter your last name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    {...register('lastName')}
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register('password')}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />

                {/* Clerk's CAPTCHA widget */}
                <div id="clerk-captcha" />

                <Button type="submit" fullWidth size="large" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover" fontWeight="medium">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Activity>
    </Box>
  );
};

export default Register;
