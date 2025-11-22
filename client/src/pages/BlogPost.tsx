import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Clock, Eye, Tag, Calendar } from "lucide-react";
import { Link, useParams } from "wouter";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const { slug } = useParams();
  
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: slug! },
    { enabled: !!slug }
  );

  const { data: relatedPosts } = trpc.blog.getRelated.useQuery(
    { slug: slug!, category: post?.category || "", limit: 3 },
    { enabled: !!post }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[oklch(0.25_0.05_250)] text-white py-4 sticky top-0 z-50">
        <div className="container flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/pros-logo.png" alt="PROS Logo" className="h-10" />
              <div>
                <div className="font-bold text-lg">PROS</div>
                <div className="text-xs opacity-90">Precision Radiation Oncology Solutions</div>
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-blue-300 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-blue-300 transition-colors">About</Link>
            <Link href="/services" className="hover:text-blue-300 transition-colors">Services</Link>
            <Link href="/government" className="hover:text-blue-300 transition-colors">Government Contracting</Link>
            <Link href="/newsletter" className="hover:text-blue-300 transition-colors">Newsletter</Link>
            <Link href="/tools" className="hover:text-blue-300 transition-colors">Tools</Link>
            <Link href="/careers" className="hover:text-blue-300 transition-colors">Careers</Link>
            <Link href="/blog" className="hover:text-blue-300 transition-colors font-semibold">Blog</Link>
            <Link href="/contact">
              <Button variant="outline" size="sm" className="bg-transparent text-white border-white hover:bg-white hover:text-[oklch(0.25_0.05_250)]">
                Contact Us
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Back to Blog */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12 bg-gradient-to-br from-[oklch(0.25_0.05_250)] to-[oklch(0.20_0.04_250)] text-white">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 text-blue-200 mb-4">
            <Tag className="h-4 w-4" />
            <span>{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount} views</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-blue-800">
            <p className="text-lg">
              <span className="font-semibold">{post.authorName}</span>
              {post.authorCredentials && (
                <span className="text-blue-200 ml-2">{post.authorCredentials}</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 flex-1">
        <div className="container max-w-4xl">
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}
          
          <div className="prose prose-lg max-w-none">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {relatedPost.featuredImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                        <Tag className="h-4 w-4" />
                        <span>{relatedPost.category}</span>
                      </div>
                      <CardTitle className="line-clamp-2">{relatedPost.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{relatedPost.readTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{relatedPost.viewCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Looking for Radiation Oncology Professionals?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let PROS connect you with elite talent in medical physics, radiation therapy, and dosimetry.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[oklch(0.25_0.05_250)] text-white py-12">
        <div className="container grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About PROS</h3>
            <p className="text-sm text-blue-100">
              Veteran-owned staffing company specializing in radiation oncology professionals and AI-powered systems for VA, DoD, and civilian healthcare facilities.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-blue-100 hover:text-white">About Us</Link></li>
              <li><Link href="/services" className="text-blue-100 hover:text-white">Services</Link></li>
              <li><Link href="/government" className="text-blue-100 hover:text-white">Government Contracting</Link></li>
              <li><Link href="/newsletter" className="text-blue-100 hover:text-white">Newsletter</Link></li>
              <li><Link href="/tools" className="text-blue-100 hover:text-white">Tools</Link></li>
              <li><Link href="/careers" className="text-blue-100 hover:text-white">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Certifications</h3>
            <ul className="space-y-1 text-sm text-blue-100">
              <li>• Veteran-Owned Small Business (VOSB)</li>
              <li>• VA Schedule 621 I</li>
              <li>• CMMC Level 2 Compliant</li>
              <li>• NIST AI RMF Aligned</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>Email: info@pros-staffing.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>SAM.gov UEI: [Pending]</li>
              <li>CAGE Code: [Pending]</li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 pt-8 border-t border-blue-800 text-center text-sm text-blue-100">
          © 2025 Precision Radiation Oncology Solutions. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
