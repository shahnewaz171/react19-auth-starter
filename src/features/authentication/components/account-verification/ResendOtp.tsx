import { Stack } from '@mui/material';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useSignUp } from '@clerk/clerk-react';
import { Button } from '@/components/ui/Button';

interface ResendOtpProps {
  timeLeft: number;
  start: (duration: number) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ResendOtp = ({ timeLeft, start, setError }: ResendOtpProps) => {
  const [isPending, startTransition] = useTransition();

  const { isLoaded, signUp } = useSignUp();

  const handleResend = () => {
    if (!isLoaded || isPending) return;

    startTransition(async () => {
      try {
        await signUp?.prepareEmailAddressVerification({
          strategy: 'email_code'
        });

        toast.success('A new OTP has been sent to your email address.', { duration: 3000 });
        start(120);
      } catch (err: any) {
        setError(
          err.message || err.errors[0]?.long_message || 'Failed to resend OTP. Please try again.'
        );
      }
    });
  };

  return (
    <Stack alignItems="center" sx={{ mt: 3 }}>
      {timeLeft ? (
        <p>Time remaining: {timeLeft} seconds</p>
      ) : (
        <Button variant="outlined" size="small" disabled={isPending} onClick={handleResend}>
          {isPending ? 'Resending...' : 'Resend OTP'}
        </Button>
      )}
    </Stack>
  );
};
export default ResendOtp;
