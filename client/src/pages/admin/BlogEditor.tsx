import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import MarkdownEditor from "@/components/MarkdownEditor";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye } from "lucide-react";

export default function BlogEditor() {
  const [, params] = useRoute("/admin/blog/edit/:id");
  const [, setLocation] = useLocation();
  const isEditing = !!params?.id;
  const postId = params?.id ? parseInt(params.id) : undefined;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("clinical-practice");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorCredentials, setAuthorCredentials] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isPublished, setIsPublished] = useState(0);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);

  const utils = trpc.useUtils();

  // Fetch post data if editing
  const { data: existingPost, isLoading: loadingPost } = trpc.blog.getById.useQuery(
    { id: postId! },
    { enabled: isEditing && !!postId }
  );

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt);
      setContent(existingPost.content);
      setCategory(existingPost.category);
      setTags(existingPost.tags || "");
      setAuthorName(existingPost.authorName);
      setAuthorCredentials(existingPost.authorCredentials || "");
      setFeaturedImage(existingPost.featuredImage || "");
      setIsPublished(existingPost.isPublished);
    }
  }, [existingPost]);

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      utils.admin.getAllBlogPosts.invalidate();
      setLocation("/admin/blog");
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      utils.admin.getAllBlogPosts.invalidate();
      setLocation("/admin/blog");
    },
    onError: (error) => {
      toast.error(`Failed to update post: ${error.message}`);
    },
  });

  const uploadImage = trpc.blog.uploadImage.useMutation({
    onSuccess: (data) => {
      toast.success("Image uploaded successfully");
      return data.url;
    },
    onError: (error) => {
      toast.error(`Failed to upload image: ${error.message}`);
    },
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEditing && !slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleImageInsert = (url: string, altText: string) => {
    const markdownImage = `![${altText}](${url})`;
    setContent(content + "\n\n" + markdownImage);
  };

  const handleImageUploadClick = () => {
    setImageUploadOpen(true);
  };

  const handleSave = (publish: boolean = false) => {
    if (!title || !slug || !excerpt || !content || !authorName) {
      toast.error("Please fill in all required fields");
      return;
    }

    const readTime = calculateReadTime(content);

    const postData = {
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tags || undefined,
      authorName,
      authorCredentials: authorCredentials || undefined,
      featuredImage: featuredImage || undefined,
      readTime,
      isPublished: publish ? 1 : 0,
    };

    if (isEditing && postId) {
      updatePost.mutate({ id: postId, ...postData });
    } else {
      createPost.mutate(postData);
    }
  };

  const handleImageUpload = async (file: File, altText: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = await uploadImage.mutateAsync({
            imageData: reader.result as string,
            fileName: file.name,
            mimeType: file.type,
          });
          resolve(result.url);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (loadingPost) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading post...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/admin/blog")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? "Update your blog post" : "Write and publish a new article"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={createPost.isPending || updatePost.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={createPost.isPending || updatePost.isPending}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPublished ? "Update & Publish" : "Publish"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>
              Basic information about your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="url-friendly-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinical-practice">Clinical Practice</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="quality-assurance">Quality Assurance</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="industry-news">Industry News</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Input
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the post..."
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {excerpt.length}/200 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name *</Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorCredentials">Author Credentials</Label>
                <Input
                  id="authorCredentials"
                  value={authorCredentials}
                  onChange={(e) => setAuthorCredentials(e.target.value)}
                  placeholder="MD, PhD, DABR"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="radiation oncology, treatment planning, quality assurance"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content *</CardTitle>
            <CardDescription>
              Write your blog post in markdown format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              onImageUpload={handleImageUploadClick}
              minHeight="600px"
            />
          </CardContent>
        </Card>

        <ImageUpload
          open={imageUploadOpen}
          onClose={() => setImageUploadOpen(false)}
          onImageInsert={handleImageInsert}
          uploadEndpoint="/api/upload/blog-image"
        />
      </div>
    </DashboardLayout>
  );
}
