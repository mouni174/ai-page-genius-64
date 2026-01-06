import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ContentType = "ppt" | "webpage" | "portfolio" | "";

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  suggestion: string;
  isTextarea?: boolean;
}

const formFields: Record<Exclude<ContentType, "">, FormField[]> = {
  ppt: [
    { key: "projectTitle", label: "Project Title", placeholder: "Enter your project title", suggestion: "Add a clear project title describing your work.", isTextarea: false },
    { key: "problemStatement", label: "Problem Statement", placeholder: "What problem does your project solve?", suggestion: "Describe the problem your project addresses.", isTextarea: true },
    { key: "objectives", label: "Objectives", placeholder: "List your project objectives", suggestion: "List the main objectives of your project.", isTextarea: true },
    { key: "technologyStack", label: "Technology Stack", placeholder: "e.g., React, Node.js, PostgreSQL", suggestion: "Include the technologies used in your project.", isTextarea: false },
    { key: "methodology", label: "Methodology / Approach", placeholder: "Describe your methodology", suggestion: "Explain your methodology or approach.", isTextarea: true },
    { key: "results", label: "Results / Outcome", placeholder: "What were the results?", suggestion: "Add results or expected outcomes of your project.", isTextarea: true },
  ],
  webpage: [
    { key: "pageTitle", label: "Page Title", placeholder: "Enter your page title", suggestion: "Add a clear and descriptive page title.", isTextarea: false },
    { key: "purpose", label: "Purpose of the Website", placeholder: "What is the main purpose?", suggestion: "Describe the main purpose of your website.", isTextarea: true },
    { key: "targetAudience", label: "Target Audience", placeholder: "Who is your target audience?", suggestion: "Define your target audience clearly.", isTextarea: true },
    { key: "keyFeatures", label: "Key Features / Sections", placeholder: "List main features or sections", suggestion: "List the key features or sections of your website.", isTextarea: true },
    { key: "technologyStack", label: "Technology Stack", placeholder: "e.g., React, Tailwind, Supabase", suggestion: "Include the technologies used for your website.", isTextarea: false },
  ],
  portfolio: [
    { key: "portfolioTitle", label: "Name / Portfolio Title", placeholder: "Enter your name or portfolio title", suggestion: "Add your name or a clear portfolio title.", isTextarea: false },
    { key: "aboutMe", label: "About Me Summary", placeholder: "Write a brief about yourself", suggestion: "Write a brief summary about yourself.", isTextarea: true },
    { key: "skills", label: "Skills / Technologies", placeholder: "List your skills and technologies", suggestion: "List your key skills and technologies.", isTextarea: true },
    { key: "projects", label: "Projects Section", placeholder: "Describe your notable projects", suggestion: "Add descriptions of your notable projects.", isTextarea: true },
    { key: "contact", label: "Contact Information", placeholder: "Email, LinkedIn, GitHub, etc.", suggestion: "Include your contact information.", isTextarea: false },
  ],
};

const contentTypeLabels: Record<Exclude<ContentType, "">, string> = {
  ppt: "PPT / Academic Project",
  webpage: "Webpage",
  portfolio: "Portfolio",
};

const AcademicReadinessCheck = () => {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState<ContentType>("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentFields = contentType ? formFields[contentType] : [];

  const handleContentTypeChange = (value: ContentType) => {
    setContentType(value);
    setFormData({});
    setIsSubmitted(false);
  };

  const handleChange = (key: string, value: string) => {
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

  const readinessScore = useMemo(() => {
    if (!contentType) return 0;
    const filledFields = currentFields.filter((field) => formData[field.key]?.trim()).length;
    return Math.min(filledFields * 2, 10);
  }, [formData, currentFields, contentType]);

  const getScoreColor = () => {
    if (readinessScore >= 8) return "text-green-600";
    if (readinessScore >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    if (readinessScore >= 8) return "Great! Your content is well-prepared.";
    if (readinessScore >= 6) return "Good progress! Consider filling in the missing fields.";
    return "More details needed. Please complete the missing fields.";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generator
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Academic Readiness Check
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Evaluate your academic and professional readiness with guided suggestions
            </p>
          </CardHeader>

          <CardContent>
            {/* Content Type Selection */}
            <div className="mb-6">
              <Label htmlFor="contentType" className="text-base font-medium">
                Select Content Type
              </Label>
              <Select value={contentType} onValueChange={handleContentTypeChange}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a content type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ppt">PPT / Academic Project</SelectItem>
                  <SelectItem value="webpage">Webpage</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    Academic readiness check completed successfully.
                  </span>
                </div>
                <div className={`text-lg font-bold ${getScoreColor()}`}>
                  Readiness Score: {readinessScore} / 10
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {getScoreMessage()}
                </p>
              </div>
            )}

            {/* Dynamic Form */}
            {contentType && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted rounded-lg">
                  Filling out: <strong>{contentTypeLabels[contentType]}</strong>
                </div>

                {currentFields.map((field) => {
                  const value = formData[field.key] || "";
                  const isEmpty = isSubmitted && !value.trim();

                  return (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-sm font-medium">
                        {field.label}
                      </Label>
                      {field.isTextarea ? (
                        <Textarea
                          id={field.key}
                          value={value}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <Input
                          id={field.key}
                          value={value}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      )}
                      {isEmpty && (
                        <div className="flex items-start gap-2 text-amber-600 text-sm bg-amber-50 p-2 rounded">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{field.suggestion}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Submit
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
                Please select a content type to begin the readiness check.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcademicReadinessCheck;
