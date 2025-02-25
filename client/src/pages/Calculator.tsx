import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/components/BackButton";
import { formulas, type Formula } from "@/lib/calculatorFormulas";

export default function Calculator() {
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    result: number;
    unit: string;
    steps: string[];
  } | null>(null);

  const calculateResult = () => {
    if (!selectedFormula) return;

    try {
      const calcResult = selectedFormula.calculate(variables);
      setResult(calcResult);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center relative">
      {/* Blueprint grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 tracking-tight">
        Architectural Calculator
      </h1>

      <Card className="w-full max-w-md bg-background/60 backdrop-blur border-primary/20">
        <CardContent className="pt-6">
          <Select
            onValueChange={(value) => {
              const formula = formulas.find(f => f.name === value);
              setSelectedFormula(formula || null);
              setVariables({});
              setResult(null);
            }}
          >
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select a formula" />
            </SelectTrigger>
            <SelectContent>
              {formulas.map((formula) => (
                <SelectItem key={formula.name} value={formula.name}>
                  {formula.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedFormula && (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">{selectedFormula.description}</p>

              <div className="grid gap-4">
                {selectedFormula.inputs.map((input) => (
                  <div key={input.name} className="space-y-2">
                    <label className="text-sm font-medium flex justify-between">
                      <span>{input.description}</span>
                      <span className="text-muted-foreground">{input.unit}</span>
                    </label>
                    <Input
                      type="number"
                      placeholder={`Enter ${input.name}`}
                      onChange={(e) => handleVariableChange(input.name, e.target.value)}
                      className="transition-all hover:border-primary/50 focus:border-primary"
                    />
                  </div>
                ))}
              </div>

              <Button 
                className="w-full transition-all hover:shadow-md" 
                onClick={calculateResult}
              >
                Calculate
              </Button>

              {result && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-4">
                  <p className="text-center font-medium">
                    Result: {result.result.toFixed(2)} {result.unit}
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium">Calculation Steps:</p>
                    {result.steps.map((step, index) => (
                      <p key={index}>{step}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <BackButton />
    </div>
  );
}