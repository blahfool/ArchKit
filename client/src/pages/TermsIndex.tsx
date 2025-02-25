import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, Trash2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import AddCustomTerm from "@/components/AddCustomTerm";
import type { Term } from "@shared/schema";
import { fallbackTerms } from "@shared/schema";
import { getCustomTerms, deleteCustomTerm } from "@/lib/offlineStorage";
import { useToast } from "@/hooks/use-toast";

interface CustomTerm extends Term {
  isCustom: boolean;
  createdAt: string;
}

export default function TermsIndex() {
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTerms, setCustomTerms] = useState<CustomTerm[]>([]);
  const { toast } = useToast();

  const { data: apiTerms } = useQuery<Term[]>({ 
    queryKey: ["/api/terms"]
  });

  useEffect(() => {
    // Load custom terms from IndexedDB
    const loadCustomTerms = async () => {
      const terms = await getCustomTerms();
      setCustomTerms(terms as CustomTerm[]);
    };
    loadCustomTerms();
  }, []);

  // Combine API terms, fallback terms, and custom terms
  const systemTerms = apiTerms 
    ? [...apiTerms, ...fallbackTerms.map((t, i) => ({ ...t, id: 1000 + i }))]
    : fallbackTerms.map((t, i) => ({ ...t, id: 1000 + i }));

  const allTerms = [...systemTerms, ...customTerms];

  const filteredTerms = allTerms.filter(term => 
    term.term.toLowerCase().includes(search.toLowerCase()) ||
    term.definition.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomTerm(id);
      setCustomTerms(prev => prev.filter(term => term.id !== id));
      toast({
        title: "Term Deleted",
        description: "Custom term has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the term. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">
        Architectural Terms Dictionary
      </h1>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Input
            className="flex-1"
            placeholder="Search terms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant={showAddForm ? "destructive" : "default"}
            size="icon"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <AddCustomTerm />
            </CardContent>
          </Card>
        )}

        <div className="space-y-3 sm:space-y-4">
          {filteredTerms
            .sort((a, b) => a.term.localeCompare(b.term))
            .map(term => (
              <Card key={term.id}>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                        {term.term}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {term.definition}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Category: {term.category}
                        {term.isCustom && " • Custom Term"}
                      </p>
                    </div>
                    {term.isCustom && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(term.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      <BackButton />
    </div>
  );
}