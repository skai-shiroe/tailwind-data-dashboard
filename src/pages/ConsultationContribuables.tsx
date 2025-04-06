import { SearchForm } from "@/components/forms/SearchForm";
import { Contribuable, ContribuablesTable } from "@/components/tables/ContribuablesTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ContribuablesService } from "@/services/contribuables.service";
import { useEffect, useState } from "react";

interface SearchParams {
  page: number;
  pageSize: number;
  nif?: string;
  centreGestionnaire?: string;
  dateDebut?: string;
  dateFin?: string;
}

interface SearchFormValues {
  nif?: string;
  centreGestionnaire?: string;
  dateDebut?: string;
  dateFin?: string;
}

const ConsultationContribuables = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contribuables, setContribuables] = useState<Contribuable[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    pageSize: 10,
  });

  // Then replace the initial useEffect with:
  useEffect(() => {
    // This flag prevents the effect from running on every render
    const isInitialLoad =
      searchParams.page === 1 &&
      searchParams.pageSize === 10 &&
      !searchParams.nif &&
      !searchParams.centreGestionnaire &&
      !searchParams.dateDebut &&
      !searchParams.dateFin;

    if (isInitialLoad) {
      loadContribuables(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array for initial load only

  // Function to load contribuables data
  const loadContribuables = async (params: SearchParams) => {
    setIsLoading(true);

    try {
      const response = await ContribuablesService.getContribuables(params);
      setContribuables(response.data);
      setPagination(response.pagination);
      setHasSearched(true);
    } catch (error) {
      console.error("Erreur lors du chargement des contribuables:", error);
      setContribuables([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page };
    setSearchParams(newParams);
    loadContribuables(newParams);
  };

  // Handle search

  const handleSearch = async (data: SearchFormValues) => {
    const formattedParams: SearchParams = {
      page: 1, // Reset to first page on new search
      pageSize: searchParams.pageSize,
      ...data,
    };

    setSearchParams(formattedParams);
    loadContribuables(formattedParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Consultation des contribuables</h1>
      </div>

      {/* Formulaire de recherche */}
      <SearchForm onSearch={handleSearch} />

      {/* Résultats ou message initial */}
      {!hasSearched ? (
        <div className="text-center py-12 border rounded-md bg-white">
          <p className="text-muted-foreground">Utilisez le formulaire ci-dessus pour rechercher des contribuables</p>
        </div>
      ) : (
        <>
          {/* Tableau des résultats */}
          <div className="bg-white rounded-md p-4 border">
            <h2 className="text-lg font-semibold mb-4">Résultats de recherche</h2>
            <ContribuablesTable data={contribuables} isLoading={isLoading} />

            {/* Pagination (seulement si des résultats sont présents) */}
            {!isLoading && contribuables.length > 0 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {pagination.page > 1 ? (
                        <PaginationPrevious onClick={() => handlePageChange(pagination.page - 1)} />
                      ) : (
                        <PaginationPrevious className="pointer-events-none opacity-50" />
                      )}
                    </PaginationItem>

                    {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                      const pageNumber = pagination.page > 3 ? pagination.page - 3 + idx + 1 : idx + 1;

                      if (pageNumber <= pagination.totalPages) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink onClick={() => handlePageChange(pageNumber)} isActive={pageNumber === pagination.page}>
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      {pagination.page < pagination.totalPages ? (
                        <PaginationNext onClick={() => handlePageChange(pagination.page + 1)} />
                      ) : (
                        <PaginationNext className="pointer-events-none opacity-50" />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default ConsultationContribuables;
