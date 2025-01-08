import { FaAngleRight } from "react-icons/fa6";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SidebarMenu({ menuItems }) {
  const [openSections, setOpenSections] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const newOpenSections = [];
    menuItems.forEach((item) => {
      if (item.collapse) {
        item.collapse.forEach((subItem) => {
          if (location.pathname === subItem?.subPath && !openSections.includes(item.id)) {
            newOpenSections.push(item.id);
          }
        });
      }
    });
    if (newOpenSections.length > 0) {
      setOpenSections(prev => [...new Set([...prev, ...newOpenSections])]);
    }
  }, [location.pathname, menuItems]);

  const toggleSection = (id) => {
    setOpenSections(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleLogout = async (onClick) => {
    await onClick(navigate);
  };

  return (
    <nav>
      <ul className="text-black whitespace-nowrap no-scrollbar overflow-y-auto max-h-[calc(100vh-200px)]">
        {menuItems.map((item) =>
          item?.collapse ? (
            <li key={item.id}>
              <Collapsible open={openSections.includes(item.id)}>
                <CollapsibleTrigger
                  onClick={() => toggleSection(item.id)}
                  className="w-full pl-5 pr-3 py-4 justify-between flex items-center text-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p>{item.label}</p>
                  </div>
                  <FaAngleRight className={`transition-transform duration-200 ${
                    openSections.includes(item.id) ? 'rotate-90' : ''
                  }`} />
                </CollapsibleTrigger>
                {item.collapse.map((subItem) => (
                  <CollapsibleContent key={subItem.subId}>
                    <NavLink
                      to={subItem?.subPath}
                      className={({ isActive }) =>
                        `pl-16 py-3 text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 [&>svg]:text-gray-600 [&>svg]:hover:text-[#ff9500] hover:text-[#ff9500] [&>svg]:transition-colors ${
                          isActive ? "bg-orange-100" : ""
                        }`
                      }
                    >
                      {subItem.icon}
                      <p>{subItem.subLabel}</p>
                    </NavLink>
                  </CollapsibleContent>
                ))}
              </Collapsible>
            </li>
          ) : (
            <li key={item.id}>
              {item.onClick ? (
                <button
                  onClick={() => handleLogout(item.onClick)}
                  className="w-full pl-5 pr-3 py-4 flex items-center text-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p>{item.label}</p>
                  </div>
                </button>
              ) : (
                <NavLink
                  to={item?.path}
                  className={({ isActive }) =>
                    `w-full pl-5 pr-3 py-4 flex items-center text-xl hover:bg-gray-100 transition-colors ${
                      location.pathname === item.path ? "bg-orange-100" : ""
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p>{item.label}</p>
                  </div>
                </NavLink>
              )}
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
