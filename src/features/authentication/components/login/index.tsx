import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router';
import { z } from 'zod';
import { useSignIn } from '@clerk/clerk-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/form/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const { isLoaded, signIn, setActive } = useSignIn();
  const onSubmit = (data: LoginFormData) => {
    if (!isLoaded || isPending) return;

    setError(null);

    startTransition(async () => {
      try {
        const result = await signIn.create({
          identifier: data.email,
          password: data.password
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          navigate('/', { replace: true });
        } else {
          console.error(JSON.stringify(result, null, 2));
        }
      } catch (err: any) {
        setError(
          err.message || err?.errors[0]?.long_message || 'Failed to sign in. Please try again.'
        );
      }
    });
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
      <Card sx={{ maxWidth: 440, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sign in to your account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
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
                placeholder="Enter your password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" fullWidth size="large" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover" fontWeight="medium">
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
