import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface Contribuable {
  id: string;
  nif: string;
  raisonSociale: string;
  aJour: string;
  dateDepot: string;
  centreGestionnaire: string;
  documents: string;
  quantite: number;
  rejet: string;
  observation: string | null;
  dateArriveeImmat?: string;
  dateLivraisonSG?: string;
}

interface ContribuablesTableProps {
  data: Contribuable[];
  isLoading: boolean;
}

export const ContribuablesTable: React.FC<ContribuablesTableProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-muted-foreground">Aucun résultat trouvé</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NIF</TableHead>
            <TableHead>Raison Sociale</TableHead>
            <TableHead>Centre Gestionnaire</TableHead>
            <TableHead>Date de Dépôt</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>À Jour</TableHead>
            <TableHead>Rejet</TableHead>
            <TableHead>Observation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((contribuable) => (
            <TableRow key={contribuable.id}>
              <TableCell className="font-medium">{contribuable.nif}</TableCell>
              <TableCell>{contribuable.raisonSociale}</TableCell>
              <TableCell>{contribuable.centreGestionnaire}</TableCell>
              <TableCell>{contribuable.dateDepot}</TableCell>
              <TableCell>{contribuable.documents}</TableCell>
              <TableCell>{contribuable.quantite}</TableCell>
              <TableCell>
                <Badge variant={contribuable.aJour === "Oui" ? "default" : "destructive"}>{contribuable.aJour}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={contribuable.rejet === "Non" ? "outline" : "destructive"}>{contribuable.rejet}</Badge>
              </TableCell>

              <TableCell>{contribuable.observation || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
