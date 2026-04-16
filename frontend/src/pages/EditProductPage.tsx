import { useParams } from "react-router-dom";

export default function EditProductPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <p className="text-slate-400">
        Editando producto con ID: <span className="text-white">{id}</span>
      </p>
    </div>
  );
}