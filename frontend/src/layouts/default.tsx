import { Link } from "@heroui/link";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://icodelakshay.tech"
          title="icodelakshay.tech"
        >
          <span className="text-default-600">Created by</span>
          <p className="text-primary">Lakshay</p>
        </Link>
      </footer>
    </div>
  );
}
