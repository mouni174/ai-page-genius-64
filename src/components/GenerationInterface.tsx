import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Wand2, Download, Code } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const GenerationInterface = () => {
  const [prompt, setPrompt] = useState("");
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
        body: { prompt },
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      setGeneratedCode(data.code);
      toast.success("Page generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate page. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!generatedCode) return;

    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Page exported successfully!");
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
                  Describe your page
                </label>
                <Textarea
                  placeholder="E.g., Create a personal portfolio page with a hero section, about me, and contact form..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[300px] bg-background/50 border-primary/20 focus:border-primary/40"
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
                    Generate Page
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
                      Copy Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExport}
                      className="border-primary/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
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
