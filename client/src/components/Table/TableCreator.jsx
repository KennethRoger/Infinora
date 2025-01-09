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
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleItem(row._id)}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight
                          className={`h-5 transition-transform flex-shrink-0 ${
                            openItems[row._id] ? "rotate-90" : ""
                          }`}
                        />
                        <span className="flex-1">{row[head.field]}</span>
                      </div>
                    </div>
                  ) : head.field === "profileImagePath" || head.field === "image" ? (
                    <div className="flex items-center justify-center">
                      {row[head.field] ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img
                            src={row[head.field]}
                            alt={row.name || "Profile"}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
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
                {head.field === "profileImagePath" || head.field === "image" ? (
                  <div className="flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img
                        src={row[head.field]}
                        alt={row.name || "Image"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/48";
                        }}
                      />
                    </div>
                  </div>
                ) : head.field === "actions" && actionsRenderer ? (
                  actionsRenderer(row)
                ) : head.field === "verificationId" && extraActionRenderer ? (
                  typeof extraActionRenderer === 'function' ? extraActionRenderer(row) : null
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
        <TableBody>
          {tableBody.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHead.length}
                className="text-center py-8"
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-lg font-medium">No data found</p>
                  <p className="text-sm">
                    There are no records to display at the moment.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            renderRows(tableBody, 0)
          )}
        </TableBody>
      </Table>
    </div>
  );
}