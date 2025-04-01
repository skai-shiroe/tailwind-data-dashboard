
import axios from "axios";

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: "/api", // À changer selon l'URL de votre API backend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteurs pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services API pour les contribuables
export const contribuablesApi = {
  // Rechercher des contribuables avec filtres
  rechercher: async (params = {}) => {
    try {
      const response = await api.get("/contribuables", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la recherche des contribuables:", error);
      throw error;
    }
  },

  // Obtenir un contribuable par son ID ou NIF
  getById: async (id: string) => {
    try {
      const response = await api.get(`/contribuables/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du contribuable ${id}:`, error);
      throw error;
    }
  },

  // Mettre à jour un dossier contribuable
  updateDossier: async (id: string, data: any) => {
    try {
      const response = await api.put(`/contribuables/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du dossier ${id}:`, error);
      throw error;
    }
  },
};

// Services API pour l'historique
export const historiqueApi = {
  // Obtenir l'historique des modifications
  getHistorique: async (params = {}) => {
    try {
      const response = await api.get("/historique", { params });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      throw error;
    }
  },
};

// Services API pour l'importation de fichiers Excel
export const importApi = {
  // Importer un fichier Excel
  importerFichier: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'importation du fichier:", error);
      throw error;
    }
  },
};

// Services API pour les statistiques du tableau de bord
export const statistiquesApi = {
  // Obtenir les statistiques pour le tableau de bord
  getStatistiques: async () => {
    try {
      const response = await api.get("/statistiques");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  },
};

export default api;
