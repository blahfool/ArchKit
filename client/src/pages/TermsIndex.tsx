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
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">
        Architecture Terms
      </h1>

      <div className="max-w-2xl mx-auto">
        <Input
          className="mb-4 sm:mb-6"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Tabs defaultValue={categories[0]}>
          <TabsList className="w-full flex-wrap h-auto mb-4">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="text-xs sm:text-sm py-1.5 px-2 sm:px-3"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="space-y-3 sm:space-y-4">
                {filteredTerms
                  ?.filter(term => term.category === category)
                  .map(term => (
                    <Card key={term.id}>
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                          {term.term}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
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