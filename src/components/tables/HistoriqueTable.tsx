
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type HistoriqueEntree = {
  id: string;
  nif: string;
  nomContribuable: string;
  dateModification: string;
  utilisateur: string;
  champModifie: string;
  ancienneValeur: string;
  nouvelleValeur: string;
};

type HistoriqueTableProps = {
  data: HistoriqueEntree[];
  isLoading?: boolean;
};

export const HistoriqueTable = ({
  data,
  isLoading = false,
}: HistoriqueTableProps) => {
  if (isLoading) {
    return (
      <div className="table-container animate-pulse">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIF</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Date modification</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Champ modifié</TableHead>
              <TableHead>Ancienne valeur</TableHead>
              <TableHead>Nouvelle valeur</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 7 }).map((_, cellIndex) => (
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
        <p className="text-muted-foreground">Aucun historique trouvé</p>
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
            <TableHead>Date modification</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Champ modifié</TableHead>
            <TableHead>Ancienne valeur</TableHead>
            <TableHead>Nouvelle valeur</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entree) => (
            <TableRow key={entree.id}>
              <TableCell className="font-medium">{entree.nif}</TableCell>
              <TableCell>{entree.nomContribuable}</TableCell>
              <TableCell>{entree.dateModification}</TableCell>
              <TableCell>{entree.utilisateur}</TableCell>
              <TableCell>{entree.champModifie}</TableCell>
              <TableCell>{entree.ancienneValeur || "-"}</TableCell>
              <TableCell>{entree.nouvelleValeur || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
