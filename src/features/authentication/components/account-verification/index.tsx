import { useState } from 'react';
import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { toast } from 'sonner';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router';
import useDebounce from '@/hooks/useDebounce';

import { Button } from '@/components/ui/Button';
import OtpInput from '@/components/form/OtpInput';

interface OtpVerificationProps {
  timeLeft: number;
  start: (duration: number) => void;
}

const OtpVerification = ({ timeLeft, start }: OtpVerificationProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState({ otp: false, resendOtp: false });
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const { isLoaded, signUp, setActive } = useSignUp();

  const debounceCallback = useDebounce(async (value: string) => {
    await handleOtpVerification(value);
  }, 500);

  const handleOtpVerification = async (code: string) => {
    if (!isLoaded) return;

    try {
      setIsPending((prev) => ({ ...prev, otp: true }));
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
      setError(err.message || err.errors[0]?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsPending((prev) => ({ ...prev, otp: false }));
    }
  };

  const handleChange = (newValue: string) => {
    setOtp(newValue);

    if (newValue.length === 6) {
      if (error) setError(null);
      debounceCallback(newValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setError(null);
    await handleOtpVerification(otp);
  };

  const handleResend = async () => {
    if (!isLoaded || isPending.resendOtp) return;

    try {
      setIsPending((prev) => ({ ...prev, resendOtp: true }));
      await signUp?.prepareEmailAddressVerification({
        strategy: 'email_code'
      });

      toast.success('A new OTP has been sent to your email address.', { duration: 3000 });
      start(120);
    } catch (err: any) {
      setError(
        err.message || err.errors[0]?.long_message || 'Failed to resend OTP. Please try again.'
      );
    } finally {
      setIsPending((prev) => ({ ...prev, resendOtp: false }));
    }
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

            <Button type="submit" fullWidth size="large" disabled={isPending.otp}>
              {isPending.otp ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Stack>
        </form>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          {timeLeft ? (
            <p>Time remaining: {timeLeft} seconds</p>
          ) : (
            <Button
              variant="outlined"
              size="small"
              disabled={isPending.resendOtp}
              onClick={handleResend}
            >
              {isPending.resendOtp ? 'Resending...' : 'Resend OTP'}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OtpVerification;
