import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/components/BackButton";
import { evaluate } from "mathjs";
import type { Formula } from "@shared/schema";

export default function Calculator() {
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [result, setResult] = useState<number | null>(null);

  const { data: formulas } = useQuery<Formula[]>({ 
    queryKey: ["/api/formulas"]
  });

  const calculateResult = () => {
    if (!selectedFormula) return;
    
    try {
      const scope = variables;
      const result = evaluate(selectedFormula.formula, scope);
      setResult(Number(result));
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: Number(value)
    }));
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Architectural Calculator</h1>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Select
            onValueChange={(value) => {
              const formula = formulas?.find(f => f.id === Number(value));
              setSelectedFormula(formula || null);
              setVariables({});
              setResult(null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a formula" />
            </SelectTrigger>
            <SelectContent>
              {formulas?.map((formula) => (
                <SelectItem key={formula.id} value={formula.id.toString()}>
                  {formula.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedFormula && (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">{selectedFormula.description}</p>
              
              {selectedFormula.variables.split(",").map((variable) => (
                <div key={variable} className="space-y-2">
                  <label className="text-sm font-medium">{variable.trim()}</label>
                  <Input
                    type="number"
                    placeholder={`Enter ${variable.trim()}`}
                    onChange={(e) => handleVariableChange(variable.trim(), e.target.value)}
                  />
                </div>
              ))}

              <Button 
                className="w-full" 
                onClick={calculateResult}
              >
                Calculate
              </Button>

              {result !== null && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-center font-medium">
                    Result: {result.toFixed(2)}
                  </p>
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
