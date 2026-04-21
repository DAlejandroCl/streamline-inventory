import { useLoaderData, useNavigation, Link } from "react-router-dom";
import type { Product } from "../features/products/types/products";

import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ProductsTableSkeleton from "../components/ui/ProductsTableSkeleton";
import ProductsTable from "../features/products/components/ProductsTable";
import PageHeader from "../components/layout/PageHeader";

export default function ProductsPage() {
  const products = useLoaderData() as Product[];
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products yet"
        description="Start by creating your first product"
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Products"
        breadcrumbs={[{ label: "Dashboard", to: "/" }]}
        action={
          <Link to="/products/new">
            <Button>+ New Product</Button>
          </Link>
        }
      />

      <ProductsTable products={products} />
    </div>
  );
}
