import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Search, Clock, Eye, Tag } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const categories = [
  "All",
  "Staffing Solutions",
  "Quality Assurance",
  "Technology & Automation",
  "Clinical Optimization",
  "Financial & Operational",
  "Compliance & Regulatory",
  "Workflow & Process Improvement",
  "Training & Professional Development",
  "Emerging Technologies",
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: allPosts } = trpc.blog.list.useQuery();
  const { data: searchResults } = trpc.blog.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 2 }
  );
  const { data: categoryPosts } = trpc.blog.getByCategory.useQuery(
    { category: selectedCategory },
    { enabled: selectedCategory !== "All" }
  );

  // Determine which posts to display
  const displayPosts = searchQuery.length > 2
    ? searchResults
    : selectedCategory !== "All"
    ? categoryPosts
    : allPosts;

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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[oklch(0.25_0.05_250)] to-[oklch(0.20_0.04_250)] text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Radiation Oncology Insights
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Technical articles, best practices, and actionable solutions for radiation oncology professionals. 
            Stay informed with evidence-based insights from industry experts.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-gray-50 py-8 border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery("");
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 flex-1">
        <div className="container">
          {!displayPosts || displayPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No articles found. Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {post.featuredImage && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                        <Tag className="h-4 w-4" />
                        <span>{post.category}</span>
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime} min read</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.viewCount}</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700">
                          {post.authorName}
                          {post.authorCredentials && (
                            <span className="text-gray-500 ml-1">
                              {post.authorCredentials}
                            </span>
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
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
