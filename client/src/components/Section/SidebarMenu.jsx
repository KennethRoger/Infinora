import { FaAngleRight } from "react-icons/fa6";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SidebarMenu({ menuItems }) {
  const [openSections, setOpenSections] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const newOpenSections = {};
    menuItems.forEach((item) => {
      if (item.collapse) {
        item.collapse.forEach((subItem) => {
          if (location.pathname.startsWith(subItem?.subPath)) {
            newOpenSections[item.id] = true;
          }
        });
      }
    });
    setOpenSections(newOpenSections);
  }, [location.pathname, menuItems]);

  const toggleSection = (id) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleLogout = async (onClick) => {
    await onClick();
    navigate("/home");
  };

  return (
    <nav>
      <ul
        className="text-black whitespace-nowrap no-scrollbar
                   overflow-y-auto max-h-[calc(100vh-200px)]"
      >
        {menuItems.map((item) =>
          item?.collapse ? (
            <li key={item.id}>
              <Collapsible open={openSections[item.id]}>
                <CollapsibleTrigger
                  onClick={() => toggleSection(item.id)}
                  className={`w-full pl-5 pr-3 py-5  justify-between flex items-center text-xl hover:bg-gray-200`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p>{item.label}</p>
                  </div>
                  <FaAngleRight />
                </CollapsibleTrigger>
                {item.collapse.map((subItem) => (
                  <CollapsibleContent
                    key={subItem.subId}
                    className={`text-xl pl-16 hover:bg-gray-200 py-2 cursor-pointer ${
                      location.pathname === subItem.subPath
                        ? "bg-orange-200 hover:bg-yellow-200"
                        : "bg-white"
                    }`}
                  >
                    <NavLink to={subItem?.subPath}>{subItem.subLabel}</NavLink>
                  </CollapsibleContent>
                ))}
              </Collapsible>
            </li>
          ) : (
            <li key={item.id}>
              {item.onClick ? (
                <button
                  onClick={() => handleLogout(item.onClick)}
                  className="w-full pl-5 pr-3 py-5 flex items-center text-xl hover:bg-gray-200"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p>{item.label}</p>
                  </div>
                </button>
              ) : (
                <NavLink
                  to={item?.path}
                  className={`w-full pl-5 pr-3 py-5 flex items-center text-xl hover:bg-gray-200 ${
                    location.pathname === item?.path
                      ? "bg-orange-200"
                      : "bg-white"
                  }`}
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
