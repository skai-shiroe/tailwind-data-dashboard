
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileEdit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export type Contribuable = {
  id: string;
  nif: string;
  nom: string;
  centreGestionnaire: string;
  dateArrivee: string;
  dateLivraison: string;
  joursTraitement: number;
  status: "En traitement" | "Livré" | "Rejeté";
};

type ContribuablesTableProps = {
  data: Contribuable[];
  isLoading?: boolean;
};

export const ContribuablesTable = ({ data, isLoading = false }: ContribuablesTableProps) => {
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate(`/edition/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/consultation/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Livré":
        return "bg-green-100 text-green-800";
      case "Rejeté":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="table-container animate-pulse">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIF</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Centre</TableHead>
              <TableHead>Date arrivée</TableHead>
              <TableHead>Date livraison</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 8 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <p className="text-muted-foreground">Aucun résultat trouvé</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NIF</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Centre</TableHead>
            <TableHead>Date arrivée</TableHead>
            <TableHead>Date livraison</TableHead>
            <TableHead>Jours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((contribuable) => (
            <TableRow key={contribuable.id}>
              <TableCell className="font-medium">{contribuable.nif}</TableCell>
              <TableCell>{contribuable.nom}</TableCell>
              <TableCell>{contribuable.centreGestionnaire}</TableCell>
              <TableCell>{contribuable.dateArrivee}</TableCell>
              <TableCell>{contribuable.dateLivraison || "-"}</TableCell>
              <TableCell>{contribuable.joursTraitement}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(contribuable.status)}`}>
                  {contribuable.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleView(contribuable.id)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(contribuable.id)}
                  >
                    <FileEdit size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
