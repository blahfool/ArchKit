import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";
import type { Term } from "@shared/schema";

export default function TermsIndex() {
  const [search, setSearch] = useState("");
  const { data: terms } = useQuery<Term[]>({ 
    queryKey: ["/api/terms"]
  });

  const categories = terms ? [...new Set(terms.map(term => term.category))] : [];

  const filteredTerms = terms?.filter(term => 
    term.term.toLowerCase().includes(search.toLowerCase()) ||
    term.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Architecture Terms</h1>

      <div className="max-w-2xl mx-auto">
        <Input
          className="mb-6"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Tabs defaultValue={categories[0]}>
          <TabsList className="w-full flex-wrap h-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {filteredTerms
                  ?.filter(term => term.category === category)
                  .map(term => (
                    <Card key={term.id}>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold">{term.term}</h3>
                        <p className="mt-2 text-muted-foreground">
                          {term.definition}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BackButton />
    </div>
  );
}
