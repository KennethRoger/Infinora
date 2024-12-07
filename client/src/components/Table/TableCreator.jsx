import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";

export default function TableCreator({
  tableHead,
  tableBody,
  actionsRenderer,
  extraActionRenderer,
}) {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderRows = (rows, level = 0) => {
    return rows.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        {level === 0 && row.children?.length > 0 ? (
          <>
            <TableRow className="text-lg bg-gray-300 font-semibold hover:bg-gray-400">
              {tableHead.map((head, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  
                  className={`text-black ${
                    head.field === "actions" ? "text-center" : ""
                  }`}
                >
                  {head.field === "name" ? (
                    <div className="cursor-pointer" onClick={() => toggleItem(row._id)}>
                      <div className="flex items-center gap-2">
                        <ChevronRight
                          className={`h-5 transition-transform flex-shrink-0 ${
                            openItems[row._id] ? "rotate-90" : ""
                          }`}
                        />
                        <span className="flex-1">{row[head.field]}</span>
                      </div>
                    </div>
                  ) : head.field === "image" ? (
                    <img
                      src={row[head.field]}
                      alt={row.name || "Image"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : head.field === "actions" && actionsRenderer ? (
                    actionsRenderer(row)
                  ) : head.field === "verificationId" && extraActionRenderer ? (
                    extraActionRenderer(row)
                  ) : (
                    row[head.field] || "N/A"
                  )}
                </TableCell>
              ))}
            </TableRow>
            {openItems[row._id] && row.children && (
              <TableRow>
                <TableCell colSpan={tableHead.length} className="p-0">
                  <div className="">
                    <Table>
                      <TableBody>
                        {renderRows(row.children, level + 1)}
                      </TableBody>
                    </Table>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </>
        ) : (
          <TableRow
            className={`text-lg ${
              level === 0
                ? "bg-gray-200 font-semibold hover:bg-gray-300"
                : "odd:bg-gray-100 even:bg-gray-50"
            }`}
          >
            {tableHead.map((head, cellIndex) => (
              <TableCell
                key={cellIndex}
                
                className={`${
                  level === 0 ? "text-black" : "text-gray-700"
                } pl-${level * 4} ${
                  head.field === "actions" ? "text-center" : ""
                }`}
              >
                {head.field === "image" ? (
                  <img
                    src={row[head.field]}
                    alt={row.name || "Image"}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : head.field === "actions" && actionsRenderer ? (
                  actionsRenderer(row)
                ) : head.field === "verificationId" && extraActionRenderer ? (
                  extraActionRenderer(row)
                ) : (
                  row[head.field] || "N/A"
                )}
              </TableCell>
            ))}
          </TableRow>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="pt-10">
      <Table className="w-full bg-white rounded-3xl shadow-lg">
        <TableHeader className="text-xl bg-black rounded-t-3xl">
          <TableRow>
            {tableHead.map((head, index) => (
              <TableHead
                key={index}
                
                className={`${head.styles} text-white font-bold`}
              >
                {head.heading}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows(tableBody)}</TableBody>
      </Table>
    </div>
  );
}
