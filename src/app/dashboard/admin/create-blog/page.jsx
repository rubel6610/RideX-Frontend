"use client";

import { useState } from "react";
import { RefreshCw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";

export default function CreateBlogPage() {
  const [context, setContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [regenerationCount, setRegenerationCount] = useState(0);

  // Generate blog content using AI and automatically generate image
  const handleGenerate = async () => {
    if (!context.trim()) {
      toast.error("Please enter a topic context");
      return;
    }

    try {
      setIsLoading(true);
      setIsImageLoading(true);
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
      }, 1000);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Create Blog</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Blog Context</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="context" className="block text-sm font-medium mb-2 text-foreground">
                Topic Context
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Enter the topic or context for your blog post..."
                className="w-full h-40 p-4 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
            
            {error && (
              <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !context.trim()}
              className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg font-medium transition-colors ${
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
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Preview</h2>
          
          {generatedContent ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {generatedContent.title}
                </h3>
                <p className="text-foreground/80">
                  {generatedContent.description}
                </p>
              </div>
              
              {/* Image Display */}
              <div className="bg-muted rounded-lg overflow-hidden">
                {isImageLoading ? (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                      <p className="text-foreground font-medium">Generating image...</p>
                      <p className="text-muted-foreground text-sm mt-2">Please wait</p>
                    </div>
                  </div>
                ) : imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={generatedContent.imagePrompt}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                    <span className="text-muted-foreground">No image generated</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRegenerate}
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
                  onClick={handleSave}
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
                      <Save className="h-4 w-4" />
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