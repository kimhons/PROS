import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, Clock, Eye, Tag, User } from "lucide-react";

import { Link, useParams } from "wouter";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const { slug } = useParams();
  const { user } = useAuth();

  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: relatedPosts } = trpc.blog.getRelated.useQuery(
    { slug: slug || "", category: post?.category || "", limit: 3 },
    { enabled: !!post }
  );

  // View tracking is handled automatically in the getBySlug query

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="container max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="space-y-2 pt-8">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="container max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-slate-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white py-8">
        <div className="container max-w-4xl">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-white/90 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.authorName}{post.authorCredentials && `, ${post.authorCredentials}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount} views</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.split(',').map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs"
                >
                  <Tag className="h-3 w-3" />
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="container max-w-4xl py-12">
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            {/* Author Bio */}
            <div className="mb-8 p-6 bg-slate-50 border-l-4 border-[#1e3a5f] rounded-r">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>About the Author:</strong> {post.authorName}{post.authorCredentials && `, ${post.authorCredentials}`} is a board-certified medical physicist specializing in radiation oncology.
              </p>
            </div>

            {/* Article Body with Publication Styling */}
            <article className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-[#1e3a5f]
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-[#2563eb] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-slate-700 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-[#2563eb] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
              prose-code:text-sm prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[#1e3a5f]
              prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-table:border-collapse prose-table:w-full prose-table:my-6
              prose-th:bg-slate-100 prose-th:border prose-th:border-slate-300 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-slate-900
              prose-td:border prose-td:border-slate-300 prose-td:p-3 prose-td:text-slate-700
              prose-hr:border-slate-200 prose-hr:my-8
              prose-img:rounded-lg prose-img:shadow-md">
              <Streamdown>{post.content}</Streamdown>
            </article>

            {/* Citation Notice */}
            <div className="mt-12 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Citation Information</h3>
              <p className="text-sm text-amber-800 mb-3">
                If you reference this article in your work, please cite as:
              </p>
              <div className="p-3 bg-white rounded border border-amber-200 font-mono text-xs text-slate-700">
                {post.authorName}. ({new Date(post.publishedAt).getFullYear()}). {post.title}. 
                Precision Radiation Oncology Solutions Blog. Retrieved from https://precisionradiotherapysolutions.com/blog/{post.slug}
              </div>
            </div>

            {/* Share Section */}
            <Separator className="my-8" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Found this article helpful? Share it with your colleagues.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="mb-3">
                        <span className="text-xs font-medium text-[#2563eb] bg-blue-50 px-2 py-1 rounded">
                          {related.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-slate-900 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                        {related.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(related.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {related.viewCount}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Latest Insights</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for biweekly updates on radiation oncology best practices, 
              latest research, and practical clinical recommendations.
            </p>
            <Link href="/">
              <Button size="lg" variant="secondary">
                Subscribe to Newsletter
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
