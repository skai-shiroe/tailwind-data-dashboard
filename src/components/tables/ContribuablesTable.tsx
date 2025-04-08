import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/dateUtils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileDown, FileText } from "lucide-react";
import React from "react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

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
  nombreJoursTraitement: number;
  dateRejet?: string;
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
  // Fonction pour exporter en Excel
  const exportToExcel = () => {
    // Préparer les données pour l'export
    const exportData = data.map(item => ({
      NIF: item.nif,
      'Raison Sociale': item.raisonSociale,
      'Centre Gestionnaire': item.centreGestionnaire,
      'Date de Dépôt': formatDate(item.dateDepot),
      'Documents': item.documents,
      'Quantité': item.quantite,
      'Date arrivée Immatriculation': formatDate(item.dateArriveeImmat),
      'Date livraison': formatDate(item.dateLivraisonSG),
      'Date rejet': formatDate(item.dateRejet),
      'Observation': item.observation || '-',
      'Nombre de jours': item.nombreJoursTraitement
    }));

    // Créer un workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(wb, ws, "Contribuables");
    
    // Générer le fichier Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Télécharger le fichier
    saveAs(blob, `contribuables_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Fonction pour exporter en PDF
  const exportToPDF = () => {
    // Créer un document PDF en orientation paysage
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Titre du document
    doc.setFontSize(16);
    doc.text("Liste des Contribuables", 14, 15);
    doc.setFontSize(10);
    doc.text(`Exporté le ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Préparer les données pour le tableau avec tous les champs
    const tableColumn = [
      "NIF", 
      "Raison Sociale", 
      "Centre Gestionnaire", 
      "Date de Dépôt", 
      "Documents", 
      "Quantité",
      "Date arrivée Immat.",
      "Date livraison",
      "Date rejet",
      "Observation",
      "Jours"
    ];
    
    const tableRows = data.map(item => [
      item.nif,
      item.raisonSociale,
      item.centreGestionnaire,
      formatDate(item.dateDepot),
      item.documents,
      item.quantite,
      formatDate(item.dateArriveeImmat),
      formatDate(item.dateLivraisonSG),
      formatDate(item.dateRejet),
      item.observation || "-",
      item.nombreJoursTraitement
    ]);
    
    // Utiliser autoTable comme une fonction importée
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: {
        fontSize: 7, // Réduire la taille de police pour accommoder plus de colonnes
        cellPadding: 1,
        overflow: 'linebreak',
        halign: 'left'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { cellWidth: 20 }, // NIF
        1: { cellWidth: 30 }, // Raison Sociale
        2: { cellWidth: 25 }, // Centre Gestionnaire
        3: { cellWidth: 20 }, // Date de Dépôt
        4: { cellWidth: 20 }, // Documents
        5: { cellWidth: 15 }, // Quantité
        6: { cellWidth: 20 }, // Date arrivée Immat
        7: { cellWidth: 20 }, // Date livraison
        8: { cellWidth: 20 }, // Date rejet
        9: { cellWidth: 30 }, // Observation
        10: { cellWidth: 15 } // Jours
      },
      margin: { top: 30, right: 10, bottom: 10, left: 10 },
      didDrawPage: (data) => {
        // Ajouter un pied de page avec numéro de page
        doc.setFontSize(8);
        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    });
    
    // Télécharger le PDF
    doc.save(`contribuables_${new Date().toISOString().split('T')[0]}.pdf`);
  };

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
      {/* Boutons d'exportation */}
      <div className="flex justify-end space-x-2 mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToExcel}
          className="flex items-center gap-1"
        >
          <FileDown className="h-4 w-4" />
          Exporter Excel
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToPDF}
          className="flex items-center gap-1"
        >
          <FileText className="h-4 w-4" />
          Exporter PDF
        </Button>
      </div>

      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>NIF</TableHead>
              <TableHead>Raison Sociale</TableHead>
              <TableHead>Centre Gestionnaire</TableHead>
              <TableHead>Date de Dépôt</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Date arrivée Immatriculation</TableHead>
              <TableHead>Date livraison</TableHead>
              <TableHead>Date rejet</TableHead>
              <TableHead>Observation</TableHead>
              <TableHead>Nombre de jour</TableHead>
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
                <TableCell>{formatDate(contribuable.dateArriveeImmat)}</TableCell>
                <TableCell>{formatDate(contribuable.dateLivraisonSG)}</TableCell>
                <TableCell>{formatDate(contribuable.dateRejet)}</TableCell>
                <TableCell>{contribuable.observation || "-"}</TableCell>
                <TableCell>{contribuable.nombreJoursTraitement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 0 && pagination.page && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Affichage de <strong>{(pagination.page - 1) * pagination.pageSize + 1}</strong> à{" "}
              <strong>{Math.min(pagination.page * pagination.pageSize, pagination.total)}</strong> sur{" "}
              <strong>{pagination.total}</strong> entrées
            </p>
            <Select 
              value={String(pagination.pageSize)} 
              onValueChange={(value) => onPageSizeChange && onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={String(pagination.pageSize)} />
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