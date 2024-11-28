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
}) {
  return (
    <Table>
      {/* <TableCaption>A list of your products.</TableCaption> */}
      <TableHeader>
        <TableRow>
          {tableHead.map((head, index) => (
            <TableHead key={index} className={head.styles}>
              {head.heading}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableBody.map((body, rowIndex) => (
          <TableRow key={rowIndex}>
            {tableHead.map((head, cellIndex) => (
              <TableCell key={cellIndex}>
                {head.field === "image" ? (
                  <img
                    src={body[head.field]}
                    alt={body.name}
                    className="h-12 w-12"
                  />
                ) : head.field === "actions" ? (
                  actionsRenderer ? (
                    actionsRenderer(body)
                  ) : (
                    "N/A"
                  )
                ) : (
                  body[head.field] || "N/A"
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
