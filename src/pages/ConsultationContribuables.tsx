
import { useState } from "react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SearchForm } from "@/components/forms/SearchForm";
import { ContribuablesTable, Contribuable } from "@/components/tables/ContribuablesTable";

// Données simulées pour la démonstration
const mockContribuables: Contribuable[] = [
  {
    id: "1",
    nif: "123456789",
    nom: "SARL EXEMPLE",
    centreGestionnaire: "DGE",
    dateArrivee: "10/05/2023",
    dateLivraison: "12/05/2023",
    joursTraitement: 2,
    status: "Livré",
  },
  {
    id: "2",
    nif: "987654321",
    nom: "ETS COMMERCIAL",
    centreGestionnaire: "CIME EST",
    dateArrivee: "15/05/2023",
    dateLivraison: "18/05/2023",
    joursTraitement: 3,
    status: "Livré",
  },
  {
    id: "3",
    nif: "456789123",
    nom: "COMPAGNIE GÉNÉRALE",
    centreGestionnaire: "CIME OUEST",
    dateArrivee: "20/05/2023",
    dateLivraison: "",
    joursTraitement: 5,
    status: "En traitement",
  },
  {
    id: "4",
    nif: "789123456",
    nom: "SOCIÉTÉ ANONYME",
    centreGestionnaire: "DGE",
    dateArrivee: "05/05/2023",
    dateLivraison: "10/05/2023",
    joursTraitement: 5,
    status: "Livré",
  },
  {
    id: "5",
    nif: "321654987",
    nom: "ENTREPRISE INDIVIDUELLE",
    centreGestionnaire: "CIME SUD",
    dateArrivee: "12/05/2023",
    dateLivraison: "",
    joursTraitement: 3,
    status: "Rejeté",
  },
];

const ConsultationContribuables = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Contribuable[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Fonction pour gérer la recherche
  const handleSearch = async (data: any) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Dans une application réelle, appel API
      // const results = await contribuablesApi.rechercher(data);
      
      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Filtrage simulé
      let results = [...mockContribuables];
      
      if (data.nif) {
        results = results.filter(c => c.nif.includes(data.nif));
      }
      
      if (data.centreGestionnaire && data.centreGestionnaire !== "Tous les centres") {
        results = results.filter(c => c.centreGestionnaire === data.centreGestionnaire);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-muted-foreground">
            Utilisez le formulaire ci-dessus pour rechercher des contribuables
          </p>
        </div>
      ) : (
        <>
          {/* Tableau des résultats */}
          <div className="bg-white rounded-md p-4 border">
            <h2 className="text-lg font-semibold mb-4">Résultats de recherche</h2>
            <ContribuablesTable data={searchResults} isLoading={isLoading} />
            
            {/* Pagination (seulement si des résultats sont présents) */}
            {!isLoading && searchResults.length > 0 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
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
