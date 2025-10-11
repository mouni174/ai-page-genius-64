import { useState } from "react";
import { Hero } from "@/components/Hero";
import { GenerationInterface } from "@/components/GenerationInterface";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";

const Index = () => {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!showGenerator ? (
        <>
          <Hero onGetStarted={() => setShowGenerator(true)} />
          <Features />
          <Pricing />
        </>
      ) : (
        <GenerationInterface />
      )}
    </div>
  );
};

export default Index;
