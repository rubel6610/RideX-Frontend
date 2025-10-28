"use client";
import React, { useState, useEffect } from "react";
import api from "@/utils/api";

const ButtonPrimary = ({ children, onClick, disabled }) => (
  <button
    className="px-6 py-3 font-semibold transition hover:opacity-90 
               bg-primary text-primary-foreground rounded-lg 
               w-full sm:w-auto flex-shrink-0 disabled:opacity-50"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const InputStyle = (props) => (
  <input
    {...props}
    className="px-4 py-3 w-full outline-none border 
               bg-muted border-border rounded-lg 
               focus:ring-2 focus:ring-primary 
               placeholder:text-muted-foreground/70"
  />
);

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [sidePosts, setSidePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6; // 1 featured + 5 side posts per page

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/blogs");
        
        if (response.data.success) {
          const blogData = response.data.data;
          
          // Format dates and prepare blog data
          const formattedBlogs = blogData.map(blog => ({
            ...blog,
            id: blog._id,
            featured: false, // We'll determine featured post separately
            image_url: blog.image || "https://placehold.co/600x400/cccccc/333333.png?text=No+Image",
            author: blog.addedBy || "Admin",
            date: new Date(blog.createdAt).toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            }),
            title: blog.title,
            excerpt: blog.description
          }));
          
          setBlogs(formattedBlogs);
          
          // Set featured post (most recent) and side posts
          if (formattedBlogs.length > 0) {
            const sortedBlogs = [...formattedBlogs].sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
            
            setFeaturedPost(sortedBlogs[0]);
            
            // For side posts, exclude the featured one and paginate
            const otherPosts = sortedBlogs.slice(1);
            const totalPagesCount = Math.ceil(otherPosts.length / (postsPerPage - 1));
            setTotalPages(totalPagesCount);
            
            const startIndex = (currentPage - 1) * (postsPerPage - 1);
            const endIndex = startIndex + (postsPerPage - 1);
            setSidePosts(otherPosts.slice(startIndex, endIndex));
          }
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, you would filter the blogs based on searchQuery
    // For now, we'll just log it
    console.log("Searching for:", searchQuery);
  };

  // Handle post click to swap featured and clicked post
  const handlePostClick = (clickedPost) => {
    if (featuredPost) {
      // Swap the featured post with the clicked post
      const newFeaturedPost = clickedPost;
      const newClickedPost = featuredPost;
      
      setFeaturedPost(newFeaturedPost);
      
      // Update side posts to include the previous featured post
      const updatedSidePosts = sidePosts.map(post => 
        post.id === clickedPost.id ? newClickedPost : post
      );
      
      setSidePosts(updatedSidePosts);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-10 p-4 sm:p-8 bg-background text-foreground">
        <div className="max-w-6xl mx-auto py-26 sm:py-30 md:py-40 lg:py-50 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-10 p-4 sm:p-8 bg-background text-foreground">
        <div className="max-w-6xl mx-auto py-16 text-center">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 lg:mt-14 p-4 sm:p-8 lg:gap-6 xl:gap-8 bg-background text-foreground">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto text-center pb-10 lg:pb-14 pt-16 space-y-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-8">
          Ridex Blog: Stories and Insights
        </h1>

        {/* Responsive Search Box */}
        <div className="flex justify-center mt-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full sm:w-[400px] shadow-sm gap-2 sm:gap-0">
            <InputStyle 
              type="text" 
              placeholder="Find blog by title" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ButtonPrimary type="submit">Search</ButtonPrimary>
          </form>
        </div>
      </header>

      {/* Separator */}
      <hr className="max-w-6xl mx-auto border-border" />

      {/* Blog Posts Section */}
      <main className="max-w-7xl mx-auto py-12">
        <h2 className="text-2xl sm:text-4xl lg:text-3xl font-bold uppercase mb-6 text-foreground">
          Recent <span className="text-primary">blog</span> posts
        </h2>

        {blogs.length === 0 ? (
          <div className="text-center py-30">
            <p className="text-muted-foreground">No blogs found.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 sm:gap-8">
            {/* Featured Post - Narrower column but taller image */}
            {featuredPost && (
              <div className="w-full lg:w-[60%]">
                <article>
                  <div className="w-full h-[360] sm:h-[440px] lg:h-[460px] xl:h-[520px] overflow-hidden mb-6 rounded-xl">
                    <img
                      src={featuredPost.image_url}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase text-primary mb-1">
                      {featuredPost.author} • {featuredPost.date}
                    </p>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-extrabold mb-4 text-foreground">
                      <a href="#" className="hover:underline">
                        {featuredPost.title}
                      </a>
                    </h3>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-muted-foreground leading-5 sm:leading-6 md:leading-7.5 lg:leading-6 xl:leading-7.5">
                      {featuredPost.excerpt}
                    </p>
                  </div>
                </article>
              </div>
            )}

            {/* Side Posts - Wider column */}
            <div className="w-full lg:w-[40%] space-y-6 sm:space-y-3 lg:space-y-2 xl:space-y-4">
              {sidePosts.map((post) => (
                <article 
                  key={post.id} 
                  className="flex flex-col sm:flex-row space-x-4 cursor-pointer hover:bg-muted/50 sm:p-2 rounded-lg transition"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex-shrink-0 w-full h-full sm:w-40 sm:h-40 md:w-50 md:h-50 lg:w-40 lg:h-40 xl:w-40 xl:h-40 overflow-hidden rounded-lg">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs font-bold uppercase text-primary my-1 sm:mt-0">
                      {post.author} • {post.date}
                    </p>
                    <h4 className="text-2xl lg:text-base xl:text-xl font-bold mb-2 text-foreground leading-5.5 md:leading-7.5 lg:leading-4 xl:leading-5">
                      <a href="#" className="hover:underline">
                        {post.title}
                      </a>
                    </h4>
                    <p className="text-base lg:text-xs xl:text-base line-clamp-4 text-muted-foreground leading-4 lg:leading-3 xl:leading-4">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-muted text-foreground disabled:opacity-50"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-muted text-foreground disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}