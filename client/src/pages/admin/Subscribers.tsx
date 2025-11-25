import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Search, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminSubscribers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: subscribers, isLoading } = trpc.admin.getAllSubscribers.useQuery();

  const filteredSubscribers = subscribers?.filter((sub: NonNullable<typeof subscribers>[number]) => {
    const matchesSearch =
      searchQuery === "" ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && sub.isActive === 1) ||
      (statusFilter === "unsubscribed" && sub.isActive === 0);

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    if (!filteredSubscribers || filteredSubscribers.length === 0) {
      toast.error("No subscribers to export");
      return;
    }

    const csvContent = [
      ["Email", "Subscribed Date", "Status"].join(","),
      ...filteredSubscribers.map((sub: NonNullable<typeof subscribers>[number]) =>
        [
          sub.email,
          new Date(sub.subscribedAt).toISOString(),
          sub.isActive ? "Active" : "Unsubscribed"
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Subscriber list exported");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
            <p className="text-muted-foreground">
              Manage newsletter email subscribers
            </p>
          </div>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Subscribers</CardTitle>
            <CardDescription>
              {filteredSubscribers?.length || 0} total subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscribers</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscribed Date</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredSubscribers && filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((sub: NonNullable<typeof subscribers>[number]) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.email}</TableCell>
                        <TableCell>
                          {sub.isActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Unsubscribed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(sub.subscribedAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Website</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No subscribers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
