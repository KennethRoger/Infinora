import React from "react";
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

export default function TableCreator({
  tableHead,
  tableBody,
  actionsRenderer,
  extraActionRenderer,
}) {
  const renderRows = (rows, level = 0) => {
    return rows.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        <TableRow
          className={`text-lg ${
            level === 0
              ? "bg-gray-300 font-semibold hover:bg-gray-400"
              : "odd:bg-gray-100 even:bg-gray-50"
          }`}
        >
          {tableHead.map((head, cellIndex) => (
            <TableCell
              key={cellIndex}
              className={`${
                level === 0 ? "text-black" : "text-gray-700"
              } pl-${level * 4}`}
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

        {row.children && renderRows(row.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="pt-10">
      <Table className="bg-white rounded-3xl shadow-lg">
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
