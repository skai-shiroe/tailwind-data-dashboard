import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}
export const ContribuablesTable: React.FC<ContribuablesTableProps> = ({
  data,
  isLoading,
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
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
    <div className="space-y-4">
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
                <TableCell>{formatDate(contribuable.dateDepot)}</TableCell>
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

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Affichage de <strong>{(pagination.page - 1) * pagination.pageSize + 1}</strong> à{" "}
              <strong>{Math.min(pagination.page * pagination.pageSize, pagination.total)}</strong> sur{" "}
              <strong>{pagination.total}</strong> entrées
            </p>
            <Select value={String(pagination.pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={pagination.page <= 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                let pageNumber;
                if (pagination.totalPages <= 5) {
                  pageNumber = idx + 1;
                } else if (pagination.page <= 3) {
                  pageNumber = idx + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNumber = pagination.totalPages - 4 + idx;
                } else {
                  pageNumber = pagination.page - 2 + idx;
                }

                return (
                  <Button
                    key={idx}
                    variant={pagination.page === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className="w-8 h-8"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
