import { SearchForm } from "@/components/forms/SearchForm";
import { HistoriqueEntree, HistoriqueTable } from "@/components/tables/HistoriqueTable";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";

// Define proper type for search form data
interface HistoriqueSearchParams {
  nif?: string;
  dateDebut?: string;
  dateFin?: string;
  utilisateur?: string;
}

// Données simulées pour la démonstration
const mockHistorique: HistoriqueEntree[] = [
  {
    id: "1",
    nif: "123456789",
    nomContribuable: "SARL EXEMPLE",
    dateModification: "15/05/2023 14:30",
    utilisateur: "Jean Dupont",
    champModifie: "Date de livraison",
    ancienneValeur: "-",
    nouvelleValeur: "15/05/2023",
  },
  {
    id: "2",
    nif: "123456789",
    nomContribuable: "SARL EXEMPLE",
    dateModification: "15/05/2023 14:45",
    utilisateur: "Jean Dupont",
    champModifie: "Observation",
    ancienneValeur: "-",
    nouvelleValeur: "Dossier complet",
  },
  {
    id: "3",
    nif: "987654321",
    nomContribuable: "ETS COMMERCIAL",
    dateModification: "16/05/2023 09:15",
    utilisateur: "Marie Martin",
    champModifie: "Date d'arrivée",
    ancienneValeur: "10/05/2023",
    nouvelleValeur: "12/05/2023",
  },
  {
    id: "4",
    nif: "456789123",
    nomContribuable: "COMPAGNIE GÉNÉRALE",
    dateModification: "18/05/2023 11:22",
    utilisateur: "Paul Bernard",
    champModifie: "Rejet",
    ancienneValeur: "Non",
    nouvelleValeur: "Oui",
  },
  {
    id: "5",
    nif: "456789123",
    nomContribuable: "COMPAGNIE GÉNÉRALE",
    dateModification: "18/05/2023 11:23",
    utilisateur: "Paul Bernard",
    champModifie: "Motif de rejet",
    ancienneValeur: "-",
    nouvelleValeur: "Documents incomplets",
  },
];

const Historique = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<HistoriqueEntree[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fonction pour gérer la recherche
  const handleSearch = async (data: HistoriqueSearchParams) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      // Dans une application réelle, appel API
      // const results = await historiqueApi.getHistorique(data);

      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filtrage simulé
      let results = [...mockHistorique];

      if (data.nif) {
        results = results.filter((h) => h.nif.includes(data.nif));
      }

      setHistoryData(results);
      setTotalPages(Math.ceil(results.length / 10));
      setCurrentPage(1);
    } catch (error) {
      console.error("Erreur lors de la recherche d'historique:", error);
      setHistoryData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you would fetch the data for the new page here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historique des modifications</h1>
      </div>

      {/* Formulaire de recherche */}
      <SearchForm onSearch={handleSearch} />

      {/* Résultats ou message initial */}
      {!hasSearched ? (
        <div className="text-center py-12 border rounded-md bg-white">
          <p className="text-muted-foreground">Utilisez le formulaire ci-dessus pour rechercher l'historique des modifications</p>
        </div>
      ) : (
        <>
          {/* Tableau des résultats */}
          <div className="bg-white rounded-md p-4 border">
            <h2 className="text-lg font-semibold mb-4">Résultats de recherche</h2>
            <HistoriqueTable data={historyData} isLoading={isLoading} />

            {/* Pagination (seulement si des résultats sont présents) */}
            {!isLoading && historyData.length > 0 && (
              <div className="mt-4">
                <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} siblings={1} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default Historique;
