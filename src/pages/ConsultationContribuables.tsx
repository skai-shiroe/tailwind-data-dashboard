import { ContribuablesTable } from "@/components/tables/ContribuablesTable";
import { useToast } from "@/hooks/use-toast";
import { Contribuable, ContribuablesService } from "@/services/contribuables.service";
import { useEffect, useState } from "react";

const ConsultationContribuables = () => {
  const [contribuables, setContribuables] = useState<Contribuable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContribuables = async () => {
      try {
        setIsLoading(true);

        const response = await ContribuablesService.getContribuables();
        console.log("API Response:", response); // Debug the response

        if (response && response.data) {
          setContribuables(response.data);
        } else {
          console.error("Invalid response format:", response);
          toast({
            title: "Erreur de format",
            description: "Le format de réponse de l'API est incorrect",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Une erreur est survenue lors de la récupération des données",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContribuables();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Consultation des contribuables</h1>
      </div>
      <div className="container mx-auto py-4">
        <ContribuablesTable data={contribuables} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ConsultationContribuables;
