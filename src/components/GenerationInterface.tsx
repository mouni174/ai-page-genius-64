import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Wand2, Download, Code, FileText, Presentation, Globe, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ContentType = "webpage" | "portfolio" | "presentation";

export const GenerationInterface = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState<ContentType>("webpage");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what you want to create");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");
    setGeneratedCode("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-page", {
        body: { prompt, type: contentType },
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      setGeneratedCode(data.code);
      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} generated successfully!`);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: "html" | "pdf") => {
    if (!generatedCode) return;

    if (format === "html") {
      const blob = new Blob([generatedCode], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-${contentType}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Exported as HTML successfully!");
    } else if (format === "pdf") {
      // For PDF export, open in new window so user can print to PDF
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(generatedCode);
        newWindow.document.close();
        toast.success("Opening in new window - Use Print to save as PDF");
      }
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Create Your Page
          </h2>
          <p className="text-muted-foreground text-lg">
            Describe what you want to build, and AI will create it for you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Content Type
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button
                    variant={contentType === "webpage" ? "default" : "outline"}
                    onClick={() => setContentType("webpage")}
                    className="w-full"
                    disabled={isGenerating}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Webpage
                  </Button>
                  <Button
                    variant={contentType === "portfolio" ? "default" : "outline"}
                    onClick={() => setContentType("portfolio")}
                    className="w-full"
                    disabled={isGenerating}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Portfolio
                  </Button>
                  <Button
                    variant={contentType === "presentation" ? "default" : "outline"}
                    onClick={() => setContentType("presentation")}
                    className="w-full"
                    disabled={isGenerating}
                  >
                    <Presentation className="w-4 h-4 mr-2" />
                    Slides
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe what you want to create
                </label>
                <Textarea
                  placeholder={
                    contentType === "portfolio"
                      ? "E.g., John Doe, Full-stack Developer specializing in React and Node.js..."
                      : contentType === "presentation"
                      ? "E.g., Climate Change Impact - 5 slides covering causes, effects, and solutions..."
                      : "E.g., Create a landing page for a fitness app with hero section and features..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[240px] bg-background/50 border-primary/20 focus:border-primary/40"
                  disabled={isGenerating}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90 shadow-glow"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Preview Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Preview</label>
                {generatedCode && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      className="border-primary/20"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("html")}
                      className="border-primary/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      HTML
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate("/academic-readiness", { 
                        state: { 
                          generatedContent: generatedCode,
                          prompt: prompt,
                          contentType: contentType
                        } 
                      })}
                      className="bg-accent hover:bg-accent/90"
                    >
                      <ClipboardCheck className="w-4 h-4 mr-2" />
                      Academic Check
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/content-readiness", { 
                        state: { 
                          generatedContent: generatedCode,
                          prompt: prompt,
                          contentType: contentType
                        } 
                      })}
                      className="border-primary/20"
                    >
                      <ClipboardCheck className="w-4 h-4 mr-2" />
                      Content Check
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("pdf")}
                      className="border-primary/20"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                )}
              </div>

              <div className="min-h-[300px] bg-background/50 border border-primary/20 rounded-lg p-6 overflow-auto">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Creating your page...</p>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedContent }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Your generated page will appear here
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
