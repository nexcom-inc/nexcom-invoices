import { useOrganizationStore } from "@/store/organization.store";

export const buildUrlWithOrg = (path: string, orgId?: string) => {
  const { currentOrganization } = useOrganizationStore.getState();
  const organizationId = orgId || currentOrganization?.id;

  if (!organizationId) {
    return path;
  }

  // Si le path commence déjà par /app/[orgId], le retourner tel quel
  if (path.match(/^\/app\/[^\/]+/)) {
    return path;
  }

  // Si le path commence par /, l'ajouter après l'orgId
  if (path.startsWith("/")) {
    return `/app/${organizationId}${path}`;
  }

  // Sinon, construire le chemin complet
  return `/app/${organizationId}/${path}`;
};
