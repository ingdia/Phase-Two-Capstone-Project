import {Home,PenSquare,FileText,BarChart2,Bookmark,User,Settings,} from "lucide-react";

export default function MediumSidebar() {
  const menu = [
    { name: "Home", icon: Home },
    { name: "Write a Story", icon: PenSquare },
    { name: "My Drafts", icon: FileText },
    { name: "Published", icon: FileText },
    { name: "Stats", icon: BarChart2 },
    { name: "Bookmarks", icon: Bookmark },
  ];

  const settingsMenu = [
    { name: "Profile", icon: User },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="h-screen w-[260px] hidden md:flex flex-col bg-white border-r shadow-sm fixed left-0 top-0 p-6">

      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-10">
        Echo Post
      </h1>

     
      <button className="w-full bg-black text-white py-3 rounded-full font-medium text-sm mb-8 hover:bg-gray-800 transition">
        + New Story
      </button>

      
      <div className="flex flex-col gap-3">
        <p className="text-gray-400 text-xs tracking-wide pl-2">MENU</p>

        {menu.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 hover:translate-x-1 transition-all cursor-pointer"
          >
            <item.icon size={22} className="text-gray-700" />
            <span className="text-gray-800 font-medium">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <p className="text-gray-400 text-xs tracking-wide pl-2">ACCOUNT</p>

        {settingsMenu.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 hover:translate-x-1 transition-all cursor-pointer"
          >
            <item.icon size={22} className="text-gray-700" />
            <span className="text-gray-800 font-medium">{item.name}</span>
          </div>
        ))}
      </div>

     
      <div className="mt-auto flex items-center gap-3 border-t pt-5">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Diane</p>
          <p className="text-xs text-gray-500">@writer123</p>
        </div>
      </div>
    </aside>
  );
}
