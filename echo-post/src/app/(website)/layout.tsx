import Navbar from "@/components/Navbar";
export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="website-layout">
      <Navbar />
      {children}
    </div>
  );
}
