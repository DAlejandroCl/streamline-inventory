import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function ErrorPage() {
  const error = useRouteError();

  let status = 500;
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again later.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.data || error.statusText;

    if (status === 404) {
      title = "Page not found";
      message = "The page you are looking for does not exist or has been moved.";
    } else if (status === 400) {
      title = "Bad request";
    }
  }

  const is404 = status === 404;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5 text-center px-4 bg-gray-50">
      {/* ICON */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${is404 ? "bg-indigo-50" : "bg-red-50"}`}>
        {is404 ? (
          <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        )}
      </div>

      {/* TEXT */}
      <div className="space-y-2">
        <p className={`text-5xl font-bold ${is404 ? "text-indigo-600" : "text-red-500"}`}>
          {status}
        </p>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 max-w-sm">{message}</p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="secondary">Go to Dashboard</Button>
        </Link>
        <Link to="/products">
          <Button>View Products</Button>
        </Link>
      </div>
    </div>
  );
}
