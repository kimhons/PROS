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
import { Search, Download, Eye, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminApplications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const utils = trpc.useUtils();
  const { data: applications, isLoading } = trpc.admin.getAllApplications.useQuery();
  const { data: jobs } = trpc.admin.getAllJobs.useQuery();

  const updateApplicationStatus = trpc.applications.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Application status updated");
      utils.admin.getAllApplications.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = (applicationId: number, newStatus: string) => {
    updateApplicationStatus.mutate({
      id: applicationId,
      status: newStatus as "new" | "reviewing" | "interview" | "offer" | "rejected" | "hired",
    });
  };

  const getJobTitle = (jobId: number) => {
    const job = jobs?.find((j) => j.id === jobId);
    return job?.title || "Unknown Position";
  };

  const filteredApplications = applications?.filter((app: NonNullable<typeof applications>[number]) => {
    const matchesSearch =
      searchQuery === "" ||
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getJobTitle(app.jobId).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "secondary",
      reviewing: "outline",
      interview: "default",
      offer: "default",
      rejected: "destructive",
      hired: "default",
    };
    return <Badge variant={variants[status] || "secondary"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Review and manage job applications
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
              {filteredApplications?.length || 0} total applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or job title..."
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Experience</TableHead>
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
                  ) : filteredApplications && filteredApplications.length > 0 ? (
                    filteredApplications.map((app: NonNullable<typeof applications>[number]) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {app.firstName} {app.lastName}
                        </TableCell>
                        <TableCell>{getJobTitle(app.jobId)}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.phone}</TableCell>
                        <TableCell>
                          {app.yearsExperience ? `${app.yearsExperience} years` : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            onValueChange={(value) => handleStatusChange(app.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              {getStatusBadge(app.status)}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="reviewing">Reviewing</SelectItem>
                              <SelectItem value="interview">Interview</SelectItem>
                              <SelectItem value="offer">Offer</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="hired">Hired</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(app)}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {app.resumeUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(app.resumeUrl, "_blank")}
                                title="Download resume"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Full details for {selectedApplication?.firstName} {selectedApplication?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                  <p className="text-sm">
                    {selectedApplication.firstName} {selectedApplication.lastName}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Position</h4>
                  <p className="text-sm">{getJobTitle(selectedApplication.jobId)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                  <p className="text-sm">{selectedApplication.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                  <p className="text-sm">{selectedApplication.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Years of Experience</h4>
                  <p className="text-sm">
                    {selectedApplication.yearsExperience ? `${selectedApplication.yearsExperience} years` : "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Clearance</h4>
                  <p className="text-sm">
                    {selectedApplication.currentClearance || "Not specified"}
                  </p>
                </div>
              </div>

              {selectedApplication.certifications && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Certifications</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedApplication.certifications}</p>
                </div>
              )}

              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Cover Letter</h4>
                  <p className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Resume</h4>
                {selectedApplication.resumeUrl ? (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedApplication.resumeUrl, "_blank")}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">No resume uploaded</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Submitted</h4>
                <p className="text-sm">
                  {new Date(selectedApplication.submittedAt).toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Update Status</h4>
                <Select
                  value={selectedApplication.status}
                  onValueChange={(value) => {
                    handleStatusChange(selectedApplication.id, value);
                    setSelectedApplication({ ...selectedApplication, status: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
