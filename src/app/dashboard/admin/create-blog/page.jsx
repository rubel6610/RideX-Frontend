"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw, Save, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";
import gsap from "gsap";

export default function CreateBlogPage() {
  const [context, setContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  
  // Refs for animation
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const fileInputRef = useRef(null);

  // Animation effect
  useEffect(() => {
    if (pageRef.current) {
      // Initial animation for the whole page
      gsap.fromTo(pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  // Animate content when generated
  useEffect(() => {
    if (generatedContent && titleRef.current && contentRef.current) {
      gsap.fromTo([titleRef.current, contentRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, [generatedContent]);

  // Animate buttons on interaction
  const animateButton = (e) => {
    const button = e.currentTarget;
    gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" });
  };

  // Toggle description expansion
  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle image upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload to ImgBB
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setImageUrl(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.message || "Failed to upload image");
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Generate blog content using AI (without image generation)
  const handleGenerate = async () => {
    if (!context.trim()) {
      toast.error("Please enter a topic context");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setGeneratedContent(null);
      
      // Add a timestamp to the context to ensure different results on regeneration
      const contextWithTimestamp = regenerationCount > 0
        ? `${context} (attempt ${regenerationCount + 1})`
        : context;
      
      // Generate blog content (title and description only)
      const response = await api.post("/generate-blog", { context: contextWithTimestamp });
      
      if (response.data.success) {
        setGeneratedContent(response.data.data);
      } else {
        // Show toast error when AI fails
        toast.error(response.data.message || "Failed to generate content with AI");
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error(err.response?.data?.message || "Failed to generate content");
    } finally {
      setIsLoading(false);
    }
  };

  // Save the generated blog to database
  const handleSave = async () => {
    if (!generatedContent) {
      toast.error("No content to save");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // Save blog with title, description, and manually uploaded image
      const response = await api.post("/save-blog", {
        title: generatedContent.title,
        description: generatedContent.description,
        imageUrl: imageUrl,
        context
      });
      
      if (response.data.success) {
        toast.success("Blog created successfully!");
        // Reset form
        setContext("");
        setGeneratedContent(null);
        setImageUrl(null);
        setRegenerationCount(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(response.data.message || "Failed to save blog");
        toast.error("Failed to save blog");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "Failed to save blog");
      toast.error("Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle regeneration
  const handleRegenerate = () => {
    setRegenerationCount(prev => prev + 1);
    handleGenerate();
  };

  // Truncate description for preview
  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return "";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  return (
    <div ref={pageRef} className="space-y-6 xl:mt-4">
      <div className="flex items-center space-x-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Create Blog</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-4 xl:gap-6">
        {/* Left Column - Input */}
        <div className="h-fit bg-card rounded-xl border border-border py-6 px-3 sm:px-6 md:px-3 lg:px-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Blog Context</h2>

          <div className="space-y-2 sm:space-y-4">
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm sm:text-base font-medium mb-2 text-foreground">
                Blog Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                    isUploading
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </label>
                {imageUrl && (
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                )}
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img 
                    src={imageUrl} 
                    alt="Uploaded preview" 
                    className="h-16 w-16 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="context" className="block text-sm sm:text-base font-medium mb-2 text-foreground">
                Topic Context
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Enter the topic or context for your blog post..."
                className="w-full h-40 lg:h-60 p-2 sm:p-4 leading-4.5 rounded-lg border border-border bg-background text-foreground focus:outline-primary"
              />
            </div>
            
            {error && (
              <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}
            
            <button
              ref={buttonRef}
              onClick={(e) => { animateButton(e); handleGenerate(); }}
              disabled={isLoading || !context.trim()}
              className={`flex items-center justify-center gap-2 w-full py-3 px-4 md:-mt-2 rounded-lg font-medium transition-colors ${
                isLoading || !context.trim()
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Preview (without image preview) */}
        <div className="h-fit bg-card rounded-xl border border-border py-6 px-3 sm:px-6 md:px-3 lg:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 xl:mb-4 text-foreground">Preview</h2>
          
          {generatedContent ? (
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div>
                <h3 ref={titleRef} className="text-xl sm:text-3xl md:text-2xl xl:text-4xl font-bold text-foreground leading-5.5 sm:leading-7 md:leading-6 xl:leading-8.5 mb-2 sm:mb-3 xl:mb-4">
                  {generatedContent.title}
                </h3>
                <div className="relative">
                  <p ref={contentRef} className="text-sm sm:text-lg md:text-base xl:text-lg text-foreground/80 leading-4 sm:leading-4.5 xl:leading-5">
                    {expandedDescriptions.content 
                      ? generatedContent.description 
                      : truncateDescription(generatedContent.description)}
                  </p>
                  {generatedContent.description.length > 150 && (
                    <button 
                      onClick={() => toggleDescription('content')}
                      className="mt-2 text-sm font-medium text-primary hover:underline focus:outline-none"
                    >
                      {expandedDescriptions.content ? 'See Less' : 'See More'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <button
                  onClick={(e) => { animateButton(e); handleRegenerate(); }}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isLoading
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  }`}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Regenerate
                </button>
                
                <button
                  onClick={(e) => { animateButton(e); handleSave(); }}
                  disabled={isSaving || !imageUrl}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors flex-1 ${
                    isSaving || !imageUrl
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="sm:hidden h-4 w-4" />
                      Confirm & Save
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4 border-2 border-dashed border-border rounded-lg">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Generate Blog Content
              </h3>
              <p className="text-muted-foreground">
                Upload an image and enter a topic context, then click "Generate Content" to create your blog post.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}