import { FaAngleRight } from "react-icons/fa6";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavLink } from "react-router-dom";

export default function SidebarMenu({ menuItems }) {
  return (
    <nav>
      <ul
        className="text-black border-r-2 whitespace-nowrap no-scrollbar
                   overflow-y-auto h-[calc(100vh-80px)]" // Adjust height as needed
      >
        {menuItems.map((item) =>
          item?.collapse ? (
            <li key={item.id}>
              <Collapsible>
                <CollapsibleTrigger className="w-full pl-5 pr-3 py-5 border-b-[1px] border-black border-opacity-50 justify-between flex items-center text-xl hover:bg-gray-200">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <p>{item.label}</p>
                  </div>
                  <FaAngleRight />
                </CollapsibleTrigger>
                {item.collapse.map((subItem) => (
                  <CollapsibleContent
                    key={subItem.subId}
                    className="text-xl pl-16 hover:bg-[#FF9500]/50 py-2 cursor-pointer"
                  >
                    <NavLink to={subItem?.subPath}>{subItem.subLabel}</NavLink>
                  </CollapsibleContent>
                ))}
              </Collapsible>
            </li>
          ) : (
            <li key={item.id}>
              <NavLink
                to={item?.path}
                className={
                  "w-full pl-5 pr-3 py-5 border-b-[1px] border-black border-opacity-50 justify-between flex items-center text-xl hover:bg-gray-200"
                }
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <p>{item.label}</p>
                </div>
              </NavLink>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
