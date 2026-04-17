import { Link } from "react-router-dom";
import Button from "./Button";

export default function ErrorState() {
  return (
    <div className="text-center py-10 space-y-4">
      <h2 className="text-xl font-semibold text-red-600">
        Something went wrong
      </h2>

      <p className="text-gray-500">
        We couldn't load the products. Try again.
      </p>

      <Link to="/products">
        <Button>Retry</Button>
      </Link>
    </div>
  );
}