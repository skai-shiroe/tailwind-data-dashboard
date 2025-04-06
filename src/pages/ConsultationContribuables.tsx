import { ContribuableSearchForm } from "@/components/forms/ContribuableSearchForm";
import { ContribuablesTable } from "@/components/tables/ContribuablesTable";
import { useToast } from "@/components/ui/use-toast";
import { ContribuablesApiResponse, ContribuablesSearchParams, ContribuablesService } from "@/services/contribuables.service";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const ConsultationContribuables = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert URL parameters to search params object
  const getSearchParamsObject = (): ContribuablesSearchParams => {
    const params: ContribuablesSearchParams = {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
    };

    // Add other search parameters if they exist in URL
    const nif = searchParams.get("nif");
    if (nif) params.nif = nif;

    const raisonSociale = searchParams.get("raisonSociale");
    if (raisonSociale) params.raisonSociale = raisonSociale;

    const centreGestionnaire = searchParams.get("centreGestionnaire");
    if (centreGestionnaire) params.centreGestionnaire = centreGestionnaire;

    const dateDebut = searchParams.get("dateDebut");
    if (dateDebut) params.dateDebut = dateDebut;

    const dateFin = searchParams.get("dateFin");
    if (dateFin) params.dateFin = dateFin;

    const aJour = searchParams.get("aJour");
    if (aJour) params.aJour = aJour;

    const rejet = searchParams.get("rejet");
    if (rejet) params.rejet = rejet;

    return params;
  };

  // Get the current search params from URL
  const currentSearchParams = getSearchParamsObject();

  // Fetch data with React Query

  const { data, isLoading, isError, error } = useQuery<ContribuablesApiResponse, Error>({
    queryKey: ["contribuables", currentSearchParams],
    queryFn: () => ContribuablesService.getContribuables(currentSearchParams),
  });

  // Handle search form submission
  const handleSearch = (params: ContribuablesSearchParams) => {
    // Create a new URLSearchParams object
    const newSearchParams = new URLSearchParams();

    // Set the page to 1 when performing a new search
    newSearchParams.set("page", "1");
    newSearchParams.set("pageSize", String(currentSearchParams.pageSize));

    // Add other search parameters
    if (params.nif) newSearchParams.set("nif", params.nif);
    if (params.raisonSociale) newSearchParams.set("raisonSociale", params.raisonSociale);
    if (params.centreGestionnaire) newSearchParams.set("centreGestionnaire", params.centreGestionnaire);
    if (params.dateDebut) newSearchParams.set("dateDebut", params.dateDebut);
    if (params.dateFin) newSearchParams.set("dateFin", params.dateFin);
    if (params.aJour) newSearchParams.set("aJour", params.aJour);
    if (params.rejet) newSearchParams.set("rejet", params.rejet);

    // Update the URL
    setSearchParams(newSearchParams);
  };

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", String(page));
    setSearchParams(newSearchParams);
  };

  // Handle page size changes
  const handlePageSizeChange = (pageSize: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1"); // Reset to page 1
    newSearchParams.set("pageSize", String(pageSize));
    setSearchParams(newSearchParams);
  };

  // Show error toast if there's an error

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la récupération des données",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Calculate pagination info
  const pagination = data?.pagination || {
    total: 0,

    page: currentSearchParams.page,
    pageSize: currentSearchParams.pageSize,
    totalPages: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Consultation des contribuables</h1>
      </div>
      <ContribuableSearchForm onSearch={handleSearch} initialValues={currentSearchParams} />

      <div className="container mx-auto py-4">
        <ContribuablesTable
          data={data?.data || []}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};
export default ConsultationContribuables;
