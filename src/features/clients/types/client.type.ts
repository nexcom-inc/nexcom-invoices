interface Client {
  id: string;
  gender: "UNSPECIFIED";
  type: "INDIVIDUAL";
  displayName: string;
  status: "ACTIVE";
  firstName: string;
  lastName: string;
  companyName: string;
  currency: string;
  email: string;
  phone: string;
  businessNumber: string;
  organizationId: string;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
}
