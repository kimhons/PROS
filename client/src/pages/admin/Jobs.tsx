import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
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
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  const utils = trpc.useUtils();
  const { data: jobs, isLoading } = trpc.admin.getAllJobs.useQuery();

  const createJob = trpc.jobs.create.useMutation({
    onSuccess: () => {
      toast.success("Job created successfully");
      setIsCreateDialogOpen(false);
      utils.admin.getAllJobs.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create job: ${error.message}`);
    },
  });

  const updateJob = trpc.jobs.update.useMutation({
    onSuccess: () => {
      toast.success("Job updated successfully");
      setIsEditDialogOpen(false);
      setEditingJob(null);
      utils.admin.getAllJobs.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to update job: ${error.message}`);
    },
  });

  const deleteJob = trpc.jobs.delete.useMutation({
    onSuccess: () => {
      toast.success("Job deleted successfully");
      utils.admin.getAllJobs.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete job: ${error.message}`);
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    employmentType: "full-time" as "full-time" | "part-time" | "contract" | "locum-tenens",
    clearanceRequired: "none" as "none" | "public-trust" | "secret" | "top-secret",
    description: "",
    requirements: "",
    benefits: "",
    salaryRange: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      employmentType: "full-time",
      clearanceRequired: "none",
      description: "",
      requirements: "",
      benefits: "",
      salaryRange: "",
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.department || !formData.location || !formData.description || !formData.requirements) {
      toast.error("Please fill in all required fields");
      return;
    }

    createJob.mutate(formData);
  };

  const handleEdit = (job: NonNullable<typeof jobs>[number]) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      clearanceRequired: job.clearanceRequired,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits || "",
      salaryRange: job.salaryRange || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingJob) return;

    updateJob.mutate({
      id: editingJob.id,
      ...formData,
    });
  };

  const handleToggleActive = (job: NonNullable<typeof jobs>[number]) => {
    updateJob.mutate({
      id: job.id,
      isActive: job.isActive ? 0 : 1,
    });
  };

  const handleDelete = (jobId: number) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      deleteJob.mutate({ id: jobId });
    }
  };

  const filteredJobs = jobs?.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
            <p className="text-muted-foreground">
              Manage job postings and track applications
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Job Postings</CardTitle>
            <CardDescription>
              {filteredJobs?.length || 0} total positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, department, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredJobs && filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell className="capitalize">
                          {job.employmentType.replace("-", " ")}
                        </TableCell>
                        <TableCell>
                          {job.isActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleActive(job)}
                              title={job.isActive ? "Deactivate" : "Activate"}
                            >
                              {job.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(job)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(job.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No jobs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Job Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job Posting</DialogTitle>
            <DialogDescription>
              Fill in the details for the new job posting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Medical Physicist"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Medical Physics"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Washington, DC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Input
                  id="salaryRange"
                  value={formData.salaryRange}
                  onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                  placeholder="e.g., $120,000 - $160,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value: any) => setFormData({ ...formData, employmentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="locum-tenens">Locum Tenens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clearanceRequired">Clearance Required</Label>
                <Select
                  value={formData.clearanceRequired}
                  onValueChange={(value: any) => setFormData({ ...formData, clearanceRequired: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="public-trust">Public Trust</SelectItem>
                    <SelectItem value="secret">Secret</SelectItem>
                    <SelectItem value="top-secret">Top Secret</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role and responsibilities..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="List the qualifications and requirements..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="List the benefits and perks..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createJob.isPending}>
              {createJob.isPending ? "Creating..." : "Create Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>
              Update the job posting details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-salaryRange">Salary Range</Label>
                <Input
                  id="edit-salaryRange"
                  value={formData.salaryRange}
                  onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-employmentType">Employment Type *</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value: any) => setFormData({ ...formData, employmentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="locum-tenens">Locum Tenens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-clearanceRequired">Clearance Required</Label>
                <Select
                  value={formData.clearanceRequired}
                  onValueChange={(value: any) => setFormData({ ...formData, clearanceRequired: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="public-trust">Public Trust</SelectItem>
                    <SelectItem value="secret">Secret</SelectItem>
                    <SelectItem value="top-secret">Top Secret</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Job Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-requirements">Requirements *</Label>
              <Textarea
                id="edit-requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-benefits">Benefits</Label>
              <Textarea
                id="edit-benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingJob(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateJob.isPending}>
              {updateJob.isPending ? "Updating..." : "Update Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
