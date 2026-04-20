import { Link } from "react-router-dom";
import type { Product } from "../types/products";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{product.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge variant={product.availability ? "success" : "danger"}>
          {product.availability ? "Available" : "Out"}
        </Badge>

        <Link
          to={`/products/${product.id}/edit`}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          Edit
        </Link>
      </div>
    </Card>
  );
}
