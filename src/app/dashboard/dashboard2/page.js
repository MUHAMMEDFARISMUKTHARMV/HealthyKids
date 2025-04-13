// app/page.js or any route
import ShowTable from "@/components/ShowTable";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Database Table View</h1>
      <ShowTable />
    </main>
  );
}
