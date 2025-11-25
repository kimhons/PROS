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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Search, Eye, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminContacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const utils = trpc.useUtils();
  const { data: contacts, isLoading } = trpc.admin.getAllContacts.useQuery();

  const updateContactStatus = trpc.contacts.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Contact status updated");
      utils.admin.getAllContacts.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const handleViewDetails = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = (contactId: number, newStatus: string) => {
    updateContactStatus.mutate({
      id: contactId,
      status: newStatus as "new" | "contacted" | "resolved",
    });
  };

  const filteredContacts = contacts?.filter((contact: NonNullable<typeof contacts>[number]) => {
    const matchesSearch =
      searchQuery === "" ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.organization && contact.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    const matchesType = typeFilter === "all" || contact.inquiryType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "secondary",
      contacted: "outline",
      resolved: "default",
    };
    return <Badge variant={variants[status] || "secondary"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      staffing: "Staffing",
      technology: "Technology",
      partnership: "Partnership",
      general: "General",
    };
    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
          <p className="text-muted-foreground">
            Manage and respond to contact form submissions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Inquiries</CardTitle>
            <CardDescription>
              {filteredContacts?.length || 0} total inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, organization, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="staffing">Staffing</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredContacts && filteredContacts.length > 0 ? (
                    filteredContacts.map((contact: NonNullable<typeof contacts>[number]) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.organization || "—"}</TableCell>
                        <TableCell>{getTypeBadge(contact.inquiryType)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{contact.subject}</TableCell>
                        <TableCell>
                          <Select
                            value={contact.status}
                            onValueChange={(value) => handleStatusChange(contact.id, value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              {getStatusBadge(contact.status)}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(contact.submittedAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(contact)}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.location.href = `mailto:${contact.email}`}
                              title="Send email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No inquiries found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Inquiry Details</DialogTitle>
            <DialogDescription>
              Full details for {selectedContact?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                  <p className="text-sm">{selectedContact.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                  <p className="text-sm">
                    <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">
                      {selectedContact.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Organization</h4>
                  <p className="text-sm">{selectedContact.organization || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                  <p className="text-sm">{selectedContact.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Inquiry Type</h4>
                  {getTypeBadge(selectedContact.inquiryType)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  {getStatusBadge(selectedContact.status)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Subject</h4>
                <p className="text-sm font-medium">{selectedContact.subject}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Message</h4>
                <p className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
                  {selectedContact.message}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Submitted</h4>
                <p className="text-sm">
                  {new Date(selectedContact.submittedAt).toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Update Status</h4>
                <Select
                  value={selectedContact.status}
                  onValueChange={(value) => {
                    handleStatusChange(selectedContact.id, value);
                    setSelectedContact({ ...selectedContact, status: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
