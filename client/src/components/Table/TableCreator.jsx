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
          className={`text-lg odd:bg-gray-${200 + level * 50} even:bg-gray-${
            100 + level * 50
          }`}
        >
          {tableHead.map((head, cellIndex) => (
            <TableCell key={cellIndex} className={`pl-${level * 4}`}>
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
      <Table className="bg-white rounded-3xl">
        {/* <TableCaption>A list of your data.</TableCaption> */}
        <TableHeader className="text-xl bg-black">
          <TableRow className="hover:bg-black">
            {tableHead.map((head, index) => (
              <TableHead key={index} className={`${head.styles} text-white`}>
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
