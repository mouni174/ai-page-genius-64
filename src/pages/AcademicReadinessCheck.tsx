import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, CheckCircle, Award } from "lucide-react";

const suggestions = {
  projectTitle: "Add a clear project title describing your work.",
  problemStatement: "Describe the problem your project addresses.",
  objectives: "List the main objectives of your project.",
  technologyStack: "Include the technologies used in your project.",
  methodology: "Explain your methodology or approach.",
  results: "Add results or expected outcomes of your project.",
};

// Extract content from generated HTML
const extractContentFromHTML = (html: string, prompt: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  // Try to extract title from h1, title tag, or first heading
  let projectTitle = "";
  const h1 = doc.querySelector("h1");
  const title = doc.querySelector("title");
  if (h1) projectTitle = h1.textContent?.trim() || "";
  else if (title) projectTitle = title.textContent?.trim() || "";
  
  // Try to extract problem statement from about/intro sections
  let problemStatement = "";
  const aboutSection = doc.querySelector('[class*="about"], [id*="about"], [class*="intro"], [id*="intro"]');
  if (aboutSection) {
    const p = aboutSection.querySelector("p");
    if (p) problemStatement = p.textContent?.trim() || "";
  }
  if (!problemStatement) {
    const firstP = doc.querySelector("p");
    if (firstP) problemStatement = firstP.textContent?.trim() || "";
  }
  
  // Try to extract objectives from lists or features sections
  let objectives = "";
  const featureSection = doc.querySelector('[class*="feature"], [id*="feature"], [class*="objective"], [id*="objective"]');
  if (featureSection) {
    const lis = featureSection.querySelectorAll("li");
    if (lis.length > 0) {
      objectives = Array.from(lis).map(li => li.textContent?.trim()).filter(Boolean).join("\n");
    }
  }
  if (!objectives) {
    const ul = doc.querySelector("ul");
    if (ul) {
      const lis = ul.querySelectorAll("li");
      objectives = Array.from(lis).map(li => li.textContent?.trim()).filter(Boolean).join("\n");
    }
  }
  
  // Try to extract technology stack
  let technologyStack = "";
  const techSection = doc.querySelector('[class*="tech"], [id*="tech"], [class*="skill"], [id*="skill"], [class*="stack"], [id*="stack"]');
  if (techSection) {
    const spans = techSection.querySelectorAll("span, li, .badge");
    if (spans.length > 0) {
      technologyStack = Array.from(spans).map(s => s.textContent?.trim()).filter(Boolean).join(", ");
    } else {
      technologyStack = techSection.textContent?.trim() || "";
    }
  }
  
  // Try to extract methodology from process/approach sections
  let methodology = "";
  const methodSection = doc.querySelector('[class*="method"], [id*="method"], [class*="approach"], [id*="approach"], [class*="process"], [id*="process"]');
  if (methodSection) {
    const p = methodSection.querySelector("p");
    if (p) methodology = p.textContent?.trim() || "";
    else methodology = methodSection.textContent?.trim().substring(0, 500) || "";
  }
  
  // Try to extract results from results/conclusion sections
  let results = "";
  const resultsSection = doc.querySelector('[class*="result"], [id*="result"], [class*="conclusion"], [id*="conclusion"], [class*="outcome"], [id*="outcome"]');
  if (resultsSection) {
    const p = resultsSection.querySelector("p");
    if (p) results = p.textContent?.trim() || "";
    else results = resultsSection.textContent?.trim().substring(0, 500) || "";
  }
  
  // Fallback: use parts of the prompt if content not found
  if (!projectTitle && prompt) {
    const firstLine = prompt.split("\n")[0];
    if (firstLine.length < 100) projectTitle = firstLine;
  }
  
  return {
    projectTitle,
    problemStatement,
    objectives,
    technologyStack,
    methodology,
    results,
  };
};

const AcademicReadinessCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { generatedContent?: string; prompt?: string; contentType?: string } | null;
  
  const [formData, setFormData] = useState({
    projectTitle: "",
    problemStatement: "",
    objectives: "",
    technologyStack: "",
    methodology: "",
    results: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill form with generated content
  useEffect(() => {
    if (state?.generatedContent) {
      const extracted = extractContentFromHTML(state.generatedContent, state.prompt || "");
      setFormData({
        projectTitle: extracted.projectTitle,
        problemStatement: extracted.problemStatement,
        objectives: extracted.objectives,
        technologyStack: extracted.technologyStack,
        methodology: extracted.methodology,
        results: extracted.results,
      });
    }
  }, [state]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log("Submitted data:", formData);
  };

  // Calculate readiness score (2 points per filled field, max 10)
  const readinessScore = useMemo(() => {
    let score = 0;
    if (formData.projectTitle.trim()) score += 2;
    if (formData.problemStatement.trim()) score += 2;
    if (formData.objectives.trim()) score += 2;
    if (formData.technologyStack.trim()) score += 2;
    if (formData.methodology.trim()) score += 2;
    // Results is the 6th field but we cap at 10 (5 fields * 2)
    // Actually there are 6 fields, so max should be 12, but user wants max 10
    // So we use 5 fields for scoring (excluding results for simplicity) or adjust
    // Let's use all 6 fields but cap at 10 by using different weighting
    // Actually user said "Each filled field gives 2 points, Maximum score = 10"
    // 10 / 2 = 5 fields. But there are 6 fields. 
    // I'll interpret as: 5 main fields give 2 points each = 10
    // Results is bonus or we just do 6 fields but show X/12 or cap at 10
    // Let's stick to user's spec: max 10, so we only count 5 fields
    return score; // This gives max 10 with 5 fields above
  }, [formData]);

  return (
    <div className="min-h-screen py-20 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Generator
        </Button>

        {isSubmitted && (
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-foreground font-bold text-lg">
                    Academic Readiness Score: {readinessScore} / 10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {readinessScore >= 8 ? "Excellent! Your project is well-documented." : 
                     readinessScore >= 6 ? "Good progress! Consider filling in missing sections." :
                     "Review the suggestions below to improve your score."}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" />
              <p className="text-foreground font-medium">
                Academic readiness check completed successfully.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Academic Readiness Check
          </h1>
          <p className="text-muted-foreground text-lg">
            {state?.generatedContent 
              ? "Form pre-filled with your generated content. Review and complete missing fields."
              : "Fill in the details below to validate your project structure"}
          </p>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                placeholder="Enter your project title"
                value={formData.projectTitle}
                onChange={(e) => handleChange("projectTitle", e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary/40"
              />
              <p className="text-xs text-muted-foreground">
                This becomes the main heading for your PPT, webpage hero section, or portfolio header.
              </p>
              {isSubmitted && !formData.projectTitle.trim() && (
                <p className="text-xs text-amber-500 mt-1">
                  💡 {suggestions.projectTitle}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemStatement">Problem Statement</Label>
              <Textarea
                id="problemStatement"
                placeholder="Describe the problem your project addresses"
                value={formData.problemStatement}
                onChange={(e) => handleChange("problemStatement", e.target.value)}
                className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/40"
              />
              <p className="text-xs text-muted-foreground">
                Used as the introduction slide, "About" section, or project overview in portfolios.
              </p>
              {isSubmitted && !formData.problemStatement.trim() && (
                <p className="text-xs text-amber-500 mt-1">
                  💡 {suggestions.problemStatement}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                placeholder="List the main objectives of your project"
                value={formData.objectives}
                onChange={(e) => handleChange("objectives", e.target.value)}
                className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/40"
              />
              <p className="text-xs text-muted-foreground">
                Becomes bullet points in PPTs, feature highlights on webpages, or goals in portfolios.
              </p>
              {isSubmitted && !formData.objectives.trim() && (
                <p className="text-xs text-amber-500 mt-1">
                  💡 {suggestions.objectives}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologyStack">Technology Stack</Label>
              <Input
                id="technologyStack"
                placeholder="E.g., React, Node.js, PostgreSQL, Python"
                value={formData.technologyStack}
                onChange={(e) => handleChange("technologyStack", e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary/40"
              />
              <p className="text-xs text-muted-foreground">
                Displayed as tech badges, skill icons, or tools section across all formats.
              </p>
              {isSubmitted && !formData.technologyStack.trim() && (
                <p className="text-xs text-amber-500 mt-1">
                  💡 {suggestions.technologyStack}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="methodology">Methodology / Approach</Label>
              <Textarea
                id="methodology"
                placeholder="Describe your methodology or approach"
                value={formData.methodology}
                onChange={(e) => handleChange("methodology", e.target.value)}
                className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/40"
              />
              <p className="text-xs text-muted-foreground">
                Forms the process flow slide, "How It Works" section, or approach details in portfolios.
              </p>
              {isSubmitted && !formData.methodology.trim() && (
                <p className="text-xs text-amber-500 mt-1">
                  💡 {suggestions.methodology}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="results">Results / Outcome</Label>
              <Textarea
                id="results"
                placeholder="Describe the expected or achieved results"
                value={formData.results}
                onChange={(e) => handleChange("results", e.target.value)}
                className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/40"
              />
              <p className="text-xs text-muted-foreground">
                Used for conclusion slides, results sections, or achievement highlights in portfolios.
              </p>
              {isSubmitted && !formData.results.trim() && (
                <p className="text-xs text-amber-500 mt-1">
                  💡 {suggestions.results}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 shadow-glow"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AcademicReadinessCheck;