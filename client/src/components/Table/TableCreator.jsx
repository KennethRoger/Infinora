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
        <TableBody>
          {tableBody.map((body, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="text-lg odd:bg-gray-200 even:bg-gray-100"
            >
              {tableHead.map((head, cellIndex) => (
                <TableCell key={cellIndex}>
                  {head.field === "image" ? (
                    <img
                      src={body[head.field]}
                      alt={body.name || "Image"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : head.field === "actions" && actionsRenderer ? (
                    actionsRenderer(body)
                  ) : head.field === "verificationId" && extraActionRenderer ? (
                    extraActionRenderer(body)
                  ) : (
                    body[head.field] || "N/A"
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
