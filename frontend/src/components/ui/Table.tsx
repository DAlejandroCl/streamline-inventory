type Props = {
  headers: string[];
  children: React.ReactNode;
};

export default function Table({ headers, children }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-left text-sm text-gray-600">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-sm">{children}</tbody>
      </table>
    </div>
  );
}