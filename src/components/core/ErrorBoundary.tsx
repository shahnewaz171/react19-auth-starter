import { isRouteErrorResponse, useRouteError } from 'react-router';

const ErrorBoundary = () => {
  const error: unknown = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Oops!</h1>
      <p className="mb-2">Sorry, an unexpected error has occurred.</p>

      {/* error details */}
      {(() => {
        if (isRouteErrorResponse(error)) {
          return (
            <p className="text-gray-600">
              <i>{error?.statusText}</i>
              <i>{error.data}</i>
            </p>
          );
        }
        if (error instanceof Error) {
          return (
            <p className="text-gray-600">
              <i>{error.name || 'Unknown Error'}</i>
              <i>{error.message}</i>
            </p>
          );
        }
        return <p className="text-gray-600">An unknown error occurred.</p>;
      })()}

      <button
        type="button"
        onClick={() => window.history.back()}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorBoundary;
