import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const topPerformers = [
  { name: "John Doe", sales: 150000, performance: 92 },
  { name: "Jane Smith", sales: 135000, performance: 88 },
  { name: "Bob Johnson", sales: 120000, performance: 85 },
  { name: "Alice Brown", sales: 110000, performance: 82 },
  { name: "Charlie Davis", sales: 105000, performance: 80 },
];

export default function PerformanceLeaderboard() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Sales</TableHead>
          <TableHead className="text-right">Performance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topPerformers.map((performer, index) => (
          <TableRow key={performer.name}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${performer.name.replace(
                      " ",
                      "-"
                    )}.png`}
                  />
                  <AvatarFallback>
                    {performer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {performer.name}
              </div>
            </TableCell>
            <TableCell>${performer.sales.toLocaleString()}</TableCell>
            <TableCell className="text-right">
              {performer.performance}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
