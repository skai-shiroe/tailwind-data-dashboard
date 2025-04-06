import api from "@/utils/axios-instance";

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

export interface ContribuablesApiResponse {
  success: boolean;
  filters: {
    dateField: string;
    limit: string;
  };
  data: Contribuable[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ImportResponse {
  success: boolean;
  importedCount: number;
  totalCount: number;
  message: string;
}

export interface ContribuablesSearchParams {
  page?: number;
  pageSize?: number;
  nif?: string;
  raisonSociale?: string;
  centreGestionnaire?: string;
  documents?: string;
  aJour?: string;
  rejet?: string;
  quantiteMin?: number;
  quantiteMax?: number;
  dateType?: string;
  dateDebut?: string;
  dateFin?: string;
}

export const ContribuablesService = {
  async getContribuables(params: ContribuablesSearchParams = {}) {
    try {
      // Set default values if not provided
      const queryParams = {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        dateType: params.dateType || "dateDepot",
        ...params,
      };

      const { data } = await api.get<ContribuablesApiResponse>("/api/contribuables", {
        params: queryParams,
      });
      return data;
    } catch (error) {
      console.error("Error fetching contribuables:", error);
      throw error;
    }
  },
  async importFile(file: File): Promise<ImportResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending file import request with file:", file.name, file.size, file.type);

      const { data } = await api.post<ImportResponse>("/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      console.error("Error importing file details:", error);
      // Réacheminement de l'erreur avec plus de contexte
      if (error && typeof error === "object" && "response" in error) {
        const responseError = error as { response?: { status?: number; data?: unknown; statusText?: string } };
        console.error("API Error Status:", responseError.response?.status);
        console.error("API Error Data:", responseError.response?.data);
        console.error("API Error Text:", responseError.response?.statusText);
      }
      throw error;
    }
  },
};
