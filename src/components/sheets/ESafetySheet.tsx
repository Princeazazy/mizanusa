import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  octoberInspections, 
  novemberInspections, 
  decemberInspections,
  inspectionsSummary,
  SALVAGE_INSPECTION_FEE,
  Inspection
} from "@/data/esafetyInspections";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

interface InspectionTableProps {
  inspections: Inspection[];
  month: string;
}

const InspectionTable = ({ inspections, month }: InspectionTableProps) => {
  const [search, setSearch] = useState("");
  
  const filteredInspections = inspections.filter(i => 
    i.customerName.toLowerCase().includes(search.toLowerCase()) ||
    i.vin.toLowerCase().includes(search.toLowerCase()) ||
    i.stickerNumber.toLowerCase().includes(search.toLowerCase()) ||
    i.workOrder.toLowerCase().includes(search.toLowerCase())
  );

  // Group by customer for summary
  const byCustomer = inspections.reduce((acc, i) => {
    acc[i.customerName] = (acc[i.customerName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {/* Customer Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(byCustomer).slice(0, 4).map(([customer, count]) => (
          <div key={customer} className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground truncate">{customer}</p>
            <p className="text-lg font-bold">{count} inspections</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer, VIN, sticker, or work order..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-28">Date</TableHead>
              <TableHead className="w-32">Sticker #</TableHead>
              <TableHead className="w-20">W/O #</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead className="text-right w-24">Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInspections.slice(0, 50).map((inspection, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm">{inspection.date}</TableCell>
                <TableCell className="font-mono text-sm">{inspection.stickerNumber}</TableCell>
                <TableCell className="font-mono text-sm">{inspection.workOrder}</TableCell>
                <TableCell className="font-medium">{inspection.customerName}</TableCell>
                <TableCell className="font-mono text-xs">{inspection.vin}</TableCell>
                <TableCell className="text-right text-income font-medium">
                  {formatCurrency(inspection.fee)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredInspections.length > 50 && (
          <div className="bg-muted/30 p-3 text-center text-sm text-muted-foreground">
            Showing 50 of {filteredInspections.length} inspections
          </div>
        )}
      </div>

      {/* Month Total */}
      <div className="flex justify-between items-center bg-income/15 rounded-lg p-4">
        <div>
          <p className="text-sm text-muted-foreground">{month} Total</p>
          <p className="text-lg font-bold">{inspections.length} Inspections</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-2xl font-bold text-income">
            {formatCurrency(inspections.length * SALVAGE_INSPECTION_FEE)}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ESafetySheet = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">PA eSafety Salvage Inspections</h2>
        <p className="text-muted-foreground">
          Complete inspection records for Q4 2025 | COA Code: 4200 - Salvage Inspection Fees
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">October 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspectionsSummary.october.count}</div>
            <p className="text-sm text-income">{formatCurrency(inspectionsSummary.october.revenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">November 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspectionsSummary.november.count}</div>
            <p className="text-sm text-income">{formatCurrency(inspectionsSummary.november.revenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">December 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspectionsSummary.december.count}</div>
            <p className="text-sm text-income">{formatCurrency(inspectionsSummary.december.revenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Q4 Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inspectionsSummary.total.count}</div>
            <p className="text-sm font-semibold text-income">{formatCurrency(inspectionsSummary.total.revenue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Tabs */}
      <Card>
        <CardHeader className="bg-info/15 border-b">
          <CardTitle className="flex items-center gap-2 text-info">
            <Car className="h-5 w-5" />
            Inspection Records by Month
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="october">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="october">October 2025</TabsTrigger>
              <TabsTrigger value="november">November 2025</TabsTrigger>
              <TabsTrigger value="december">December 2025</TabsTrigger>
            </TabsList>
            <TabsContent value="october" className="mt-4">
              <InspectionTable inspections={octoberInspections} month="October 2025" />
            </TabsContent>
            <TabsContent value="november" className="mt-4">
              <InspectionTable inspections={novemberInspections} month="November 2025" />
            </TabsContent>
            <TabsContent value="december" className="mt-4">
              <InspectionTable inspections={decemberInspections} month="December 2025" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Fee Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Fee Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Service Type</TableHead>
                <TableHead>COA Code</TableHead>
                <TableHead className="text-right">Fee per Inspection</TableHead>
                <TableHead className="text-right">Q4 Volume</TableHead>
                <TableHead className="text-right">Q4 Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">PA eSafety Salvage Inspection</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">4200</Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(SALVAGE_INSPECTION_FEE)}</TableCell>
                <TableCell className="text-right font-medium">{inspectionsSummary.total.count}</TableCell>
                <TableCell className="text-right font-bold text-income">
                  {formatCurrency(inspectionsSummary.total.revenue)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
