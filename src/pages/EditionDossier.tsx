
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DossierForm } from "@/components/forms/DossierForm";
import { Button } from "@/components/ui/button";
import { FileSearch, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { contribuablesApi } from "@/utils/api";

const EditionDossier = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Dans une application réelle, appel API
      // await contribuablesApi.updateDossier(id || data.nif, data);
      
      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Dossier mis à jour avec succès", {
        description: `Les modifications du dossier ${data.nif} ont été enregistrées.`,
      });
      
      // Redirection vers la liste après succès
      if (id) {
        navigate("/consultation");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      
      toast.error("Échec de la mise à jour", {
        description: "Une erreur s'est produite lors de la mise à jour du dossier.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">
            {id ? "Modifier un dossier" : "Nouveau dossier"}
          </h1>
        </div>
        
        {id && (
          <Button
            variant="outline"
            onClick={() => navigate(`/consultation/${id}`)}
          >
            <FileSearch size={16} className="mr-2" />
            Voir les détails
          </Button>
        )}
      </div>
      
      <DossierForm 
        dossierId={id} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default EditionDossier;
