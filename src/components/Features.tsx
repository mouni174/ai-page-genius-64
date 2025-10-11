import { Card } from "@/components/ui/card";
import { Zap, Layout, FileText, Download, Sparkles, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Advanced AI creates beautiful, functional pages from simple descriptions",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate complete pages in seconds, not hours or days",
  },
  {
    icon: Layout,
    title: "Professional Templates",
    description: "Choose from dozens of professionally designed templates and styles",
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "Export to HTML, React, PDF, Word, or PowerPoint formats",
  },
  {
    icon: Download,
    title: "Easy Export",
    description: "Download your creation with a single click, ready to use anywhere",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and never shared with third parties",
  },
];

export const Features = () => {
  return (
    <div className="py-20 px-6 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features to help you create stunning pages and documents effortlessly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
