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

      const { data } = await api.get<ContribuablesApiResponse>("/contribuables", {
        params: queryParams,
      });
      return data;
    } catch (error) {
      console.error("Error fetching contribuables:", error);
      throw error;
    }
  },
};
