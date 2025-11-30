import { useState, useTransition } from 'react';
import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { toast } from 'sonner';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import useDebounce from '@/hooks/useDebounce';

import { Button } from '@/components/ui/Button';
import OtpInput from '@/components/form/OtpInput';
import ResendOtp from '@/features/authentication/components/account-verification/ResendOtp';

interface OtpVerificationProps {
  timeLeft: number;
  start: (duration: number) => void;
}

const OtpVerification = ({ timeLeft, start }: OtpVerificationProps) => {
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const [isPending, startTransition] = useTransition();
  const { isLoaded, signUp, setActive } = useSignUp();

  const handleOtpVerification = (code: string) => {
    if (!isLoaded || isPending) return;

    startTransition(async () => {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code
        });

        if (completeSignUp.status === 'complete') {
          toast.success('You have successfully verified your account and logged in.', {
            duration: 3000
          });
          await setActive({ session: completeSignUp.createdSessionId });
          navigate('/', { replace: true });
        }
      } catch (err: any) {
        setError(
          err.message || err.errors[0]?.message || 'Failed to verify OTP. Please try again.'
        );
      }
    });
  };

  const debounceCallback = useDebounce((value: string) => {
    handleOtpVerification(value);
  }, 500);

  const handleChange = (newValue: string) => {
    setOtp(newValue);

    if (newValue.length === 6) {
      if (error) setError(null);
      debounceCallback(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setError(null);
    handleOtpVerification(otp);
  };

  return (
    <Card sx={{ maxWidth: 440, width: '100%', mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" align="center" fontWeight="bold">
          Verify OTP
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Enter the 6-digit verification code
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <OtpInput
              TextFieldsProps={{ placeholder: '-', className: 'rounded-full' }}
              autoFocus
              length={6}
              value={otp}
              validateChar={(char) => /^\d$/.test(char)}
              onChange={handleChange}
            />

            <Button type="submit" fullWidth size="large" disabled={isPending}>
              {isPending ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Stack>
        </form>

        <ResendOtp timeLeft={timeLeft} start={start} setError={setError} />
      </CardContent>
    </Card>
  );
};

export default OtpVerification;
