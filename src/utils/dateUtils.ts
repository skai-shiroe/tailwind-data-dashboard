
import { format, parseISO, differenceInDays, differenceInBusinessDays } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formater une date au format français
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "-";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "dd/MM/yyyy", { locale: fr });
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return "-";
  }
};

/**
 * Formater une date au format français avec l'heure
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return "-";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "dd/MM/yyyy HH:mm", { locale: fr });
  } catch (error) {
    console.error("Erreur lors du formatage de la date et heure:", error);
    return "-";
  }
};

/**
 * Calculer la différence en jours entre deux dates
 */
export const calculateDaysDifference = (
  startDate: Date | null | undefined, 
  endDate: Date | null | undefined,
  excludeWeekends = false
): number => {
  if (!startDate || !endDate) return 0;
  
  try {
    if (excludeWeekends) {
      return differenceInBusinessDays(endDate, startDate);
    } else {
      return differenceInDays(endDate, startDate);
    }
  } catch (error) {
    console.error("Erreur lors du calcul de la différence de jours:", error);
    return 0;
  }
};

/**
 * Vérifier si une date est valide
 */
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  
  try {
    if (typeof date === "string") {
      // Essayer de parser la date
      const parsed = parseISO(date);
      return !isNaN(parsed.getTime());
    }
    
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    
    return false;
  } catch (error) {
    console.error("Erreur lors de la vérification de la date:", error);
    return false;
  }
};

/**
 * Obtenir le mois en format texte
 */
export const getMoisTexte = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "MMMM yyyy", { locale: fr });
  } catch (error) {
    console.error("Erreur lors de l'obtention du mois en texte:", error);
    return "";
  }
};
