import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

const AcademicReadinessCheck = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectTitle: "",
    problemStatement: "",
    objectives: "",
    technologyStack: "",
    methodology: "",
    results: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Form submitted successfully!");
    console.log("Submitted data:", formData);
  };

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

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Academic Readiness Check
          </h1>
          <p className="text-muted-foreground text-lg">
            Fill in the details below to validate your project structure
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
