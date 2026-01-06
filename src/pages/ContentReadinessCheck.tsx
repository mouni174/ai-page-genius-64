import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, FileText, Globe, Briefcase } from "lucide-react";

type ContentType = "ppt" | "webpage" | "portfolio" | "";

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  suggestion: string;
  isTextarea?: boolean;
}

const formConfigs: Record<Exclude<ContentType, "">, FormField[]> = {
  ppt: [
    { key: "projectTitle", label: "Project Title", placeholder: "Enter your project title", suggestion: "Add a clear project title describing your work." },
    { key: "problemStatement", label: "Problem Statement", placeholder: "Describe the problem your project addresses", suggestion: "Describe the problem your project addresses.", isTextarea: true },
    { key: "objectives", label: "Objectives", placeholder: "List the main objectives of your project", suggestion: "List the main objectives of your project.", isTextarea: true },
    { key: "technologyStack", label: "Technology Stack", placeholder: "e.g., React, Node.js, PostgreSQL", suggestion: "Include the technologies used in your project." },
    { key: "methodology", label: "Methodology / Approach", placeholder: "Explain your methodology or approach", suggestion: "Explain your methodology or approach.", isTextarea: true },
    { key: "results", label: "Results / Outcome", placeholder: "Describe results or expected outcomes", suggestion: "Add results or expected outcomes of your project.", isTextarea: true },
  ],
  webpage: [
    { key: "pageTitle", label: "Page Title", placeholder: "Enter your page title", suggestion: "Add a clear and SEO-friendly page title." },
    { key: "purpose", label: "Purpose of the Website", placeholder: "Describe the main purpose of your website", suggestion: "Describe the main purpose of your website.", isTextarea: true },
    { key: "targetAudience", label: "Target Audience", placeholder: "Who is this website for?", suggestion: "Define your target audience clearly.", isTextarea: true },
    { key: "keyFeatures", label: "Key Features / Sections", placeholder: "List the key features or sections", suggestion: "List the key features or sections of your website.", isTextarea: true },
    { key: "technologyStack", label: "Technology Stack", placeholder: "e.g., React, Tailwind, Supabase", suggestion: "Include the technologies used for your website." },
  ],
  portfolio: [
    { key: "portfolioTitle", label: "Name / Portfolio Title", placeholder: "Enter your name or portfolio title", suggestion: "Add your name or a creative portfolio title." },
    { key: "aboutMe", label: "About Me Summary", placeholder: "Write a brief introduction about yourself", suggestion: "Write a compelling introduction about yourself.", isTextarea: true },
    { key: "skills", label: "Skills / Technologies", placeholder: "List your skills and technologies", suggestion: "List your key skills and technologies.", isTextarea: true },
    { key: "projects", label: "Projects Section", placeholder: "Describe your key projects", suggestion: "Add descriptions of your notable projects.", isTextarea: true },
    { key: "contact", label: "Contact Information", placeholder: "Email, LinkedIn, GitHub, etc.", suggestion: "Include your contact information for potential connections." },
  ],
};

const contentTypeLabels: Record<Exclude<ContentType, "">, { label: string; icon: React.ReactNode }> = {
  ppt: { label: "PPT / Academic Project", icon: <FileText className="w-4 h-4" /> },
  webpage: { label: "Webpage", icon: <Globe className="w-4 h-4" /> },
  portfolio: { label: "Portfolio", icon: <Briefcase className="w-4 h-4" /> },
};

const ContentReadinessCheck = () => {
  const [contentType, setContentType] = useState<ContentType>("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContentTypeChange = (value: ContentType) => {
    setContentType(value);
    setFormData({});
    setIsSubmitted(false);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({});
    setIsSubmitted(false);
  };

  const currentFields = contentType ? formConfigs[contentType] : [];
  
  const calculateScore = () => {
    if (!contentType) return 0;
    const filledCount = currentFields.filter((field) => formData[field.key]?.trim()).length;
    // Max 5 fields count toward score (2 points each = 10 max)
    return Math.min(filledCount, 5) * 2;
  };

  const score = calculateScore();
  const maxScore = 10;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Content Readiness Check</CardTitle>
            <p className="text-muted-foreground mt-2">
              Check if your content is ready for presentation, publication, or sharing.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="contentType">Select Content Type</Label>
              <Select value={contentType} onValueChange={handleContentTypeChange}>
                <SelectTrigger id="contentType">
                  <SelectValue placeholder="Choose your content type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ppt">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      PPT / Academic Project
                    </div>
                  </SelectItem>
                  <SelectItem value="webpage">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Webpage
                    </div>
                  </SelectItem>
                  <SelectItem value="portfolio">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Portfolio
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Score Display */}
            {isSubmitted && contentType && (
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                  <p className="text-lg font-semibold text-primary">
                    Content Readiness Score: {score} / {maxScore}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {score === maxScore
                      ? "Excellent! Your content is ready."
                      : score >= 6
                      ? "Good progress! Consider completing the missing sections."
                      : "Add more details to improve your content readiness."}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 text-sm">
                    Content readiness check completed successfully.
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic Form */}
            {contentType && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground border-b pb-3">
                  {contentTypeLabels[contentType].icon}
                  <span>Form for: {contentTypeLabels[contentType].label}</span>
                </div>

                {currentFields.map((field) => {
                  const value = formData[field.key] || "";
                  const isEmpty = !value.trim();
                  const showSuggestion = isSubmitted && isEmpty;

                  return (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      {field.isTextarea ? (
                        <Textarea
                          id={field.key}
                          placeholder={field.placeholder}
                          value={value}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <Input
                          id={field.key}
                          placeholder={field.placeholder}
                          value={value}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                        />
                      )}
                      {showSuggestion && (
                        <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{field.suggestion}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Check Readiness
                  </Button>
                  {isSubmitted && (
                    <Button type="button" variant="outline" onClick={handleReset}>
                      Reset Form
                    </Button>
                  )}
                </div>
              </form>
            )}

            {!contentType && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Select a content type above to begin the readiness check.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentReadinessCheck;
