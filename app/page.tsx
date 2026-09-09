export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Personal Page WYSIWYG</h1>
        <p className="text-neutral-400">
          Your minimalist alternative to Carrd. Build and customize your space.
        </p>
        <div className="pt-4">
          <a
            href="/builder"
            className="px-5 py-2.5 rounded-lg bg-neutral-100 text-neutral-950 font-medium hover:bg-neutral-200 transition"
          >
            Open Builder
          </a>
        </div>
      </div>
    </main>
  );
}