"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";
import gsap from "gsap";

export default function CreateBlogPage() {
  const [context, setContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  
  // Refs for animation
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

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

  // Animate image when loaded
  useEffect(() => {
    if (imageUrl && imageRef.current) {
      gsap.fromTo(imageRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [imageUrl]);

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

  // Generate blog content using AI and automatically generate image
  const handleGenerate = async () => {
    if (!context.trim()) {
      toast.error("Please enter a topic context");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setImageUrl(null);
      setGeneratedContent(null);
      
      // Add a timestamp to the context to ensure different results on regeneration
      const contextWithTimestamp = regenerationCount > 0
        ? `${context} (attempt ${regenerationCount + 1})`
        : context;
      
      // Generate blog content
      const response = await api.post("/generate-blog", { context: contextWithTimestamp });
      
      if (response.data.success) {
        setGeneratedContent(response.data.data);
        
        // Automatically generate image after content is generated
        await generateImageForContent(response.data.data.imagePrompt);
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

  // Generate image automatically based on content
  const generateImageForContent = async (imagePrompt) => {
    try {
      setIsImageLoading(true);
      
      // Add ride-sharing specific terms to make images more relevant
      const rideSharingTerms = [
        "ride sharing", "ridex", "transportation", "passenger", "driver",
        "vehicle", "taxi", "cab", "car service", "urban transport"
      ];
      
      // Check if prompt already contains ride-sharing terms
      const hasRideTerms = rideSharingTerms.some(term =>
        imagePrompt.toLowerCase().includes(term)
      );
      
      // If not, add relevant terms
      const enhancedPrompt = hasRideTerms
        ? imagePrompt
        : `${imagePrompt} ${rideSharingTerms[Math.floor(Math.random() * rideSharingTerms.length)]}`;
      
      // Generate image using the enhanced prompt
      const imageResponse = await api.post("/generate-image", {
        prompt: enhancedPrompt
      });
      
      if (imageResponse.data.success) {
        setImageUrl(imageResponse.data.imageUrl);
      }
    } catch (err) {
      console.error("Image generation error:", err);
      // Don't show error to user since this is automatic
    } finally {
      // Keep loading state for a brief moment to show the loader
      setTimeout(() => {
        setIsImageLoading(false);
      }, 500);
    }
  };

  // Save the generated blog to database
  const handleSave = async () => {
    if (!generatedContent) {
      toast.error("No content to save");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // Use the already generated image URL
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
            <div>
              <label htmlFor="context" className="block text-sm sm:text-base font-medium mb-2 text-foreground">
                Topic Context
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Enter the topic or context for your blog post..."
                className="w-full h-40 lg:h-60 p-2 sm:p-4 leading-4.5 rounded-lg border border-border  bg-background text-foreground focus:outline-primary"
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

        {/* Right Column - Preview */}
        <div className="bg-card rounded-xl border border-border py-6 px-3 sm:px-6 md:px-3 lg:px-6">
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
              
              {/* Image Display */}
              <div className="bg-muted rounded-lg overflow-hidden">
                {isImageLoading ? (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-[20%] sm:h-90 md:h-60 lg:h-64 xl:h-90 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-2"></div>
                      <p className="text-muted-foreground text-sm">Generating image...</p>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt={generatedContent.imagePrompt}
                    className="w-full h-[20%] sm:h-90 md:h-60 lg:h-64 xl:h-90 object-cover"
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-[20%] sm:h-90 md:h-60 lg:h-64 xl:h-90 flex items-center justify-center">
                    <span className="text-muted-foreground">No image generated</span>
                  </div>
                )}
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
                  disabled={isSaving}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors flex-1 ${
                    isSaving
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
                Enter a topic context and click "Generate Content" to create your blog post.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}