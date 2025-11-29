import { Box, Button } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const RouterError = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <p className="text-gray-600">
        <i>{error.statusText}</i>
        <i>{error.data}</i>
      </p>
    );
  }

  if (error instanceof Error) {
    return (
      <p className="text-gray-600">
        <i>{`${error.name || 'Unknown Error'}: `}</i>
        <i>{error.message}</i>
      </p>
    );
  }

  return <p className="text-gray-600">An unknown route error occurred.</p>;
};

const AppErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const hasOutsideRouteError = error instanceof Error;

  const handleGoToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Oops!</h1>
      <p className="mb-2">Sorry, an unexpected error has occurred.</p>

      {/* error reason */}
      {hasOutsideRouteError ? (
        <p className="text-gray-600">
          <i>{`${error.name || 'Unknown Error'}: `}</i>
          <i>{error.message}</i>
        </p>
      ) : (
        <RouterError />
      )}

      {/* buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined" onClick={handleGoToHome}>
          Go Home
        </Button>
        {hasOutsideRouteError && (
          <Button variant="contained" onClick={resetErrorBoundary}>
            Try Again
          </Button>
        )}
      </Box>
    </div>
  );
};

export default AppErrorFallback;
