import Sidebar from "@/components/dash/Sidebar";

import Footer from "@/components/Footer";

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar/>
    <div className=" ml-58 px-6 bg-pink-50">
    
      {children}
      <Footer/>
    </div>
    </>
  );
}
