import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "Unexpected error occurred";

  if (isRouteErrorResponse(error)) {
    title = `Error ${error.status}`;
    message = error.statusText;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-500">{message}</p>

      <Link to="/products">
        <Button>Back to Products</Button>
      </Link>
    </div>
  );
}