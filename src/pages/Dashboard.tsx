
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Calendar,
  Clock,
  FileSpreadsheet, 
  FileSearch, 
  FileEdit, 
  History,
  AlertTriangle
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickAccessCard } from "@/components/dashboard/QuickAccessCard";
import { statistiquesApi } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Statistiques = {
  totalDossiers: number;
  dossiersEnCours: number;
  dossiersLivres: number;
  dossiersRejetes: number;
  delaiMoyenTraitement: number;
  performanceMensuelle: {
    mois: string;
    traites: number;
    rejetes: number;
  }[];
};

const Dashboard = () => {
  const [stats, setStats] = useState<Statistiques | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Dans un environnement réel, nous utiliserions l'API
        // const response = await statistiquesApi.getStatistiques();
        // setStats(response);
        
        // Données simulées pour démonstration
        setStats({
          totalDossiers: 1258,
          dossiersEnCours: 47,
          dossiersLivres: 1156,
          dossiersRejetes: 55,
          delaiMoyenTraitement: 3.2,
          performanceMensuelle: [
            { mois: "Jan", traites: 125, rejetes: 8 },
            { mois: "Fév", traites: 110, rejetes: 5 },
            { mois: "Mar", traites: 145, rejetes: 7 },
            { mois: "Avr", traites: 132, rejetes: 9 },
            { mois: "Mai", traites: 168, rejetes: 12 },
            { mois: "Juin", traites: 142, rejetes: 6 },
          ],
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickAccessItems = [
    {
      title: "Importation Excel",
      description: "Importer des données depuis un fichier Excel",
      icon: <FileSpreadsheet size={24} />,
      to: "/importation",
    },
    {
      title: "Consultation",
      description: "Rechercher et consulter les contribuables",
      icon: <FileSearch size={24} />,
      to: "/consultation",
    },
    {
      title: "Édition Dossier",
      description: "Modifier les informations d'un dossier",
      icon: <FileEdit size={24} />,
      to: "/edition",
    },
    {
      title: "Historique",
      description: "Consulter l'historique des modifications",
      icon: <History size={24} />,
      to: "/historique",
    },
  ];

  // Rendu d'un état de chargement
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-32"></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total des dossiers"
          value={stats?.totalDossiers || 0}
          icon={<Users size={20} />}
          description="Nombre total de dossiers traités"
        />
        <StatCard
          title="Dossiers en cours"
          value={stats?.dossiersEnCours || 0}
          icon={<Clock size={20} />}
          description="Dossiers en attente de traitement"
          trend={{ value: 12, positive: false }}
        />
        <StatCard
          title="Dossiers livrés"
          value={stats?.dossiersLivres || 0}
          icon={<Calendar size={20} />}
          description="Dossiers traités et livrés"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Délai moyen"
          value={`${stats?.delaiMoyenTraitement || 0} jours`}
          icon={<BarChart3 size={20} />}
          description="Temps moyen de traitement"
          trend={{ value: 5, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Graphique de performance */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Performance mensuelle</CardTitle>
            <CardDescription>Dossiers traités par mois</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.performanceMensuelle || []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="traites" name="Dossiers traités" fill="#3b82f6" />
                <Bar dataKey="rejetes" name="Dossiers rejetés" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerte et notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Alertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <p className="font-medium">Dossiers en retard</p>
                <p className="text-sm text-muted-foreground">
                  5 dossiers ont dépassé le délai de traitement de 5 jours.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium">Nouveaux dossiers</p>
                <p className="text-sm text-muted-foreground">
                  12 nouveaux dossiers ont été reçus aujourd'hui.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-medium">Mise à jour système</p>
                <p className="text-sm text-muted-foreground">
                  Une mise à jour du système est prévue le 15/06/2023.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accès rapide */}
      <h2 className="text-xl font-semibold mt-8">Accès rapide</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickAccessItems.map((item, index) => (
          <QuickAccessCard
            key={index}
            title={item.title}
            icon={item.icon}
            to={item.to}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
