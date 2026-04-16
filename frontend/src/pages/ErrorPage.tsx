import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    message = error.statusText || message;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}