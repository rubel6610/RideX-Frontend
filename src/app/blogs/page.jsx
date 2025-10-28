"use client";
import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import gsap from "gsap";

const ButtonPrimary = ({ children, onClick, disabled, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="
      px-6 py-3 font-semibold transition duration-200 hover:opacity-90
      bg-primary text-primary-foreground
      rounded-lg w-full sm:w-auto flex-shrink-0 disabled:opacity-50
      sm:rounded-none sm:rounded-r-lg sm:border sm:border-border
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
    "
  >
    {children}
  </button>
);

const InputStyle = (props) => (
  <input
    {...props}
    className="
      px-4 py-3 w-full outline-none border border-border
      bg-muted text-foreground
      rounded-lg focus:ring-2 focus:ring-primary
      placeholder:text-muted-foreground/70
      sm:rounded-none sm:rounded-l-lg
    "
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
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const postsPerPage = 6;

  // Fetch all blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/blogs");
        if (response.data.success) {
          const blogData = response.data.data;
          const formattedBlogs = blogData.map((blog) => ({
            ...blog,
            _id: blog._id,
            featured: false,
            image: blog.image,
            author: blog.addedBy || "Admin",
            date: new Date(blog.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            title: blog.title,
            excerpt: blog.description,
          }));

          setBlogs(formattedBlogs);

          if (formattedBlogs.length > 0) {
            const sortedBlogs = [...formattedBlogs].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setFeaturedPost(sortedBlogs[0]);

            const otherPosts = sortedBlogs.slice(1);
            const totalPagesCount = Math.ceil(
              otherPosts.length / (postsPerPage - 1)
            );
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

  // Animation effect for content
  useEffect(() => {
    if (!loading && (featuredPost || (isSearching && searchResults.length > 0))) {
      gsap.fromTo(
        ".featured-post",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        ".side-post",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading, featuredPost, sidePosts, isSearching, searchResults]);

  // Search functionality with priority: title first, then description
  const performSearch = (query) => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    
    // First, find posts where title matches
    const titleMatches = blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm)
    );
    
    // Then, find posts where description matches but title doesn't
    const descriptionMatches = blogs.filter(blog => 
      !blog.title.toLowerCase().includes(searchTerm) && 
      blog.excerpt.toLowerCase().includes(searchTerm)
    );
    
    // Combine results: title matches first, then description matches
    return [...titleMatches, ...descriptionMatches];
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    // Perform search
    setIsSearching(true);
    const results = performSearch(searchQuery);
    
    setSearchResults(results);
    
    // Calculate pagination for search results
    const totalPagesCount = Math.ceil(results.length / (postsPerPage - 1));
    setTotalPages(totalPagesCount);
    
    // Reset to first page when searching
    setCurrentPage(1);
    
    // Set search results in the UI
    if (results.length > 0) {
      setFeaturedPost(results[0]);
      
      const otherPosts = results.slice(1);
      const startIndex = 0; // (1 - 1) * (postsPerPage - 1) = 0 for first page
      const endIndex = startIndex + (postsPerPage - 1);
      setSidePosts(otherPosts.slice(startIndex, endIndex));
    } else {
      setFeaturedPost(null);
      setSidePosts([]);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
    setCurrentPage(1);
    
    // Reset to original blog view
    if (blogs.length > 0) {
      const sortedBlogs = [...blogs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setFeaturedPost(sortedBlogs[0]);
      
      const otherPosts = sortedBlogs.slice(1);
      const totalPagesCount = Math.ceil(
        otherPosts.length / (postsPerPage - 1)
      );
      setTotalPages(totalPagesCount);
      
      const startIndex = 0; // (1 - 1) * (postsPerPage - 1) = 0 for first page
      const endIndex = startIndex + (postsPerPage - 1);
      setSidePosts(otherPosts.slice(startIndex, endIndex));
    }
  };

  const handlePostClick = (clickedPost) => {
    if (featuredPost) {
      gsap.to(".featured-post", { opacity: 0, y: -20, duration: 0.3 });
      gsap.to(".side-post", { opacity: 0, y: -20, duration: 0.3 });

      setTimeout(() => {
        const newFeaturedPost = clickedPost;
        const newClickedPost = featuredPost;

        setFeaturedPost(newFeaturedPost);

        // Update side posts based on current view (search or normal)
        if (isSearching) {
          const updatedSidePosts = searchResults.map((post) =>
            post._id === clickedPost._id ? newClickedPost : post._id === newFeaturedPost._id ? null : post
          ).filter(post => post !== null && post._id !== newFeaturedPost._id);
          
          setSidePosts(updatedSidePosts.slice(0, postsPerPage - 1));
        } else {
          const updatedSidePosts = sidePosts.map((post) =>
            post._id === clickedPost._id ? newClickedPost : post
          );
          
          setSidePosts(updatedSidePosts);
        }
      }, 300);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      gsap.to(".blog-content", { opacity: 0, y: 20, duration: 0.3 });
      setTimeout(() => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // Update content based on current view (search or normal)
        if (isSearching) {
          const otherPosts = searchResults.slice(1);
          const startIndex = (newPage - 1) * (postsPerPage - 1);
          const endIndex = startIndex + (postsPerPage - 1);
          setSidePosts(otherPosts.slice(startIndex, endIndex));
        } else {
          if (blogs.length > 0) {
            const sortedBlogs = [...blogs].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            
            const otherPosts = sortedBlogs.slice(1);
            const startIndex = (newPage - 1) * (postsPerPage - 1);
            const endIndex = startIndex + (postsPerPage - 1);
            setSidePosts(otherPosts.slice(startIndex, endIndex));
          }
        }
      }, 300);
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
    <div className="min-h-screen mt-10 lg:mt-14 p-4 sm:p-8 bg-background text-foreground">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto text-center pb-10 pt-16 space-y-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Ridex Blog: Stories and Insights
        </h1>

        {/* Responsive Search Box */}
        <div className="flex justify-center mt-4 lg:mt-6">
          <form
            onSubmit={isSearching ? handleClearSearch : handleSearch}
            className="
              flex flex-col sm:flex-row gap-1 sm:gap-0 w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]
              sm:border border-border rounded-lg sm:rounded-lg
              overflow-hidden shadow-md sm:shadow
            "
          >
            <InputStyle
              type="text"
              placeholder="Find blog by title or content"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // If user clears the search input, automatically reset the view
                if (!e.target.value.trim()) {
                  handleClearSearch();
                }
              }}
            />
            <ButtonPrimary type="submit" className='cursor-pointer'>
              {isSearching ? 'Clear' : 'Search'}
            </ButtonPrimary>
          </form>
        </div>
      </header>

       {/* Separator */}
      <hr className="max-w-6xl mx-auto border-border lg:mt-6" />

      {/* Blog Posts Section */}
      <main className="max-w-7xl mx-auto py-12 blog-content">
        <h2 className="text-2xl sm:text-4xl lg:text-3xl font-bold uppercase mb-6 text-foreground">
          {isSearching ? (
            searchResults.length > 0 ? (
              <span>Search Results for "<span className="text-primary">{searchQuery}</span>"</span>
            ) : (
              <span>No results found for "<span className="text-primary">{searchQuery}</span>"</span>
            )
          ) : (
            <>
              Recent <span className="text-primary">blog</span> posts
            </>
          )}
        </h2>

        {(isSearching && searchResults.length === 0 && searchQuery) ? (
          <div className="text-center py-30">
            <p className="text-muted-foreground">No blogs found matching your search criteria.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 sm:gap-8">
            {/* Featured Post - Narrower column but taller image */}
            {(featuredPost || (isSearching && searchResults.length > 0)) && (
              <div className="w-full lg:w-[60%] featured-post">
                <article>
                  <div className="w-full h-[360] sm:h-[440px] lg:h-[460px] xl:h-[520px] overflow-hidden mb-6 rounded-xl">
                    {featuredPost?.image ? (
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                        <span className="text-muted-foreground">No Image Available</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase text-primary mb-1">
                      {featuredPost?.author} • {featuredPost?.date}
                    </p>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-extrabold mb-4 text-foreground">
                      <a href="#" className="hover:underline">
                        {featuredPost?.title}
                      </a>
                    </h3>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-xl text-muted-foreground leading-5 sm:leading-6 md:leading-7.5 lg:leading-6">
                      {featuredPost?.excerpt}
                    </p>
                  </div>
                </article>
              </div>
            )}

            {/* Side Posts - Wider column */}
            <div className="w-full lg:w-[40%] space-y-6 sm:space-y-3 lg:space-y-2 xl:space-y-4">
              {isSearching ? (
                searchResults.slice(1 + (currentPage - 1) * (postsPerPage - 1), 1 + currentPage * (postsPerPage - 1)).map((post) => (
                  <article 
                    key={post._id} 
                    className="flex flex-col sm:flex-row space-x-4 cursor-pointer hover:bg-muted/50 sm:p-2 rounded-lg transition side-post"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="flex-shrink-0 w-full h-full sm:w-40 sm:h-40 md:w-50 md:h-50 lg:w-40 lg:h-40 xl:w-40 xl:h-40 overflow-hidden rounded-lg">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">No Image</span>
                        </div>
                      )}
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
                ))
              ) : (
                sidePosts.map((post) => (
                  <article 
                    key={post._id} 
                    className="flex flex-col sm:flex-row space-x-4 cursor-pointer hover:bg-muted/50 sm:p-2 rounded-lg transition side-post"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="flex-shrink-0 w-full h-full sm:w-40 sm:h-40 md:w-50 md:h-50 lg:w-40 lg:h-40 xl:w-40 xl:h-40 overflow-hidden rounded-lg">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">No Image</span>
                        </div>
                      )}
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
                ))
              )}
            </div>
          </div>
        )}

        {/* Pagination - now shown for both search and normal results */}
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