import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContribuablesSearchParams } from "@/services/contribuables.service";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface ContribuableSearchFormProps {
  onSearch: (params: ContribuablesSearchParams) => void;
  initialValues?: ContribuablesSearchParams;
}

export const ContribuableSearchForm: React.FC<ContribuableSearchFormProps> = ({ onSearch, initialValues = {} }) => {
  const [nif, setNif] = useState(initialValues.nif || "");
  const [raisonSociale, setRaisonSociale] = useState(initialValues.raisonSociale || "");
  const [centreGestionnaire, setCentreGestionnaire] = useState(initialValues.centreGestionnaire || "");
  const [documents, setDocuments] = useState(initialValues.documents || "");
  const [aJour, setAJour] = useState(initialValues.aJour || "all");
  const [rejet, setRejet] = useState(initialValues.rejet || "all");
  const [quantiteMin, setQuantiteMin] = useState(initialValues.quantiteMin?.toString() || "");
  const [quantiteMax, setQuantiteMax] = useState(initialValues.quantiteMax?.toString() || "");
  const [dateType, setDateType] = useState(initialValues.dateType || "dateDepot");
  const [dateDebut, setDateDebut] = useState<Date | undefined>(
    initialValues.dateDebut ? new Date(initialValues.dateDebut) : undefined
  );
  const [dateFin, setDateFin] = useState<Date | undefined>(initialValues.dateFin ? new Date(initialValues.dateFin) : undefined);

  // Update form values when initialValues change (e.g., from URL params)
  useEffect(() => {
    // When initialValues change from URL params, update the form fields
    setNif(initialValues.nif || "");
    setRaisonSociale(initialValues.raisonSociale || "");
    setCentreGestionnaire(initialValues.centreGestionnaire || "");
    setDocuments(initialValues.documents || "");
    setAJour(initialValues.aJour || "all");
    setRejet(initialValues.rejet || "all");
    setQuantiteMin(initialValues.quantiteMin?.toString() || "");
    setQuantiteMax(initialValues.quantiteMax?.toString() || "");
    setDateType(initialValues.dateType || "dateDepot");
    setDateDebut(initialValues.dateDebut ? new Date(initialValues.dateDebut) : undefined);
    setDateFin(initialValues.dateFin ? new Date(initialValues.dateFin) : undefined);
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const searchParams: ContribuablesSearchParams = {
      nif: nif || undefined,
      raisonSociale: raisonSociale || undefined,
      centreGestionnaire: centreGestionnaire || undefined,
      documents: documents || undefined,
      aJour: aJour !== "all" ? aJour : undefined,
      rejet: rejet !== "all" ? rejet : undefined,
      quantiteMin: quantiteMin ? Number(quantiteMin) : undefined,
      quantiteMax: quantiteMax ? Number(quantiteMax) : undefined,
      dateType,
      dateDebut: dateDebut ? format(dateDebut, "yyyy-MM-dd") : undefined,
      dateFin: dateFin ? format(dateFin, "yyyy-MM-dd") : undefined,
    };

    onSearch(searchParams);
  };

  const handleReset = () => {
    setNif("");
    setRaisonSociale("");
    setCentreGestionnaire("");
    setDocuments("");
    setAJour("all");
    setRejet("all");
    setQuantiteMin("");
    setQuantiteMax("");
    setDateType("dateDepot");
    setDateDebut(undefined);
    setDateFin(undefined);

    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      {/* Form content remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* NIF */}
        <div className="space-y-2">
          <Label htmlFor="nif">NIF</Label>
          <Input id="nif" placeholder="Numéro d'Identification Fiscale" value={nif} onChange={(e) => setNif(e.target.value)} />
        </div>

        {/* Raison Sociale */}
        <div className="space-y-2">
          <Label htmlFor="raisonSociale">Raison Sociale</Label>
          <Input
            id="raisonSociale"
            placeholder="Raison sociale"
            value={raisonSociale}
            onChange={(e) => setRaisonSociale(e.target.value)}
          />
        </div>

        {/* Centre Gestionnaire */}
        <div className="space-y-2">
          <Label htmlFor="centreGestionnaire">Centre Gestionnaire</Label>
          <Input
            id="centreGestionnaire"
            placeholder="Centre gestionnaire"
            value={centreGestionnaire}
            onChange={(e) => setCentreGestionnaire(e.target.value)}
          />
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <Label htmlFor="documents">Documents</Label>
          <Input id="documents" placeholder="Type de documents" value={documents} onChange={(e) => setDocuments(e.target.value)} />
        </div>

        {/* À Jour */}
        <div className="space-y-2">
          <Label htmlFor="aJour">À Jour</Label>
          <Select value={aJour} onValueChange={setAJour}>
            <SelectTrigger id="aJour">
              <SelectValue placeholder="Sélectionner une option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Oui">Oui</SelectItem>
              <SelectItem value="Non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rejet */}
        <div className="space-y-2">
          <Label htmlFor="rejet">Rejet</Label>
          <Select value={rejet} onValueChange={setRejet}>
            <SelectTrigger id="rejet">
              <SelectValue placeholder="Sélectionner une option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Oui">Oui</SelectItem>
              <SelectItem value="Non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantité Min */}
        <div className="space-y-2">
          <Label htmlFor="quantiteMin">Quantité Min</Label>
          <Input
            id="quantiteMin"
            type="number"
            placeholder="Quantité minimale"
            value={quantiteMin}
            onChange={(e) => setQuantiteMin(e.target.value)}
          />
        </div>

        {/* Quantité Max */}
        <div className="space-y-2">
          <Label htmlFor="quantiteMax">Quantité Max</Label>
          <Input
            id="quantiteMax"
            type="number"
            placeholder="Quantité maximale"
            value={quantiteMax}
            onChange={(e) => setQuantiteMax(e.target.value)}
          />
        </div>

        {/* Date Type */}
        <div className="space-y-2">
          <Label htmlFor="dateType">Type de Date</Label>
          <Select value={dateType} onValueChange={setDateType}>
            <SelectTrigger id="dateType">
              <SelectValue placeholder="Sélectionner un type de date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateDepot">Date de Dépôt</SelectItem>
              <SelectItem value="dateArriveeImmat">Date d'Arrivée Immat</SelectItem>
              <SelectItem value="dateLivraisonSG">Date de Livraison SG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Début */}
        <div className="space-y-2">
          <Label htmlFor="dateDebut">Date Début</Label>
          <DatePicker selected={dateDebut} onSelect={setDateDebut} placeholder="Sélectionner une date" />
        </div>

        {/* Date Fin */}
        <div className="space-y-2">
          <Label htmlFor="dateFin">Date Fin</Label>
          <DatePicker selected={dateFin} onSelect={setDateFin} placeholder="Sélectionner une date" />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button type="submit">Rechercher</Button>
      </div>
    </form>
  );
};
