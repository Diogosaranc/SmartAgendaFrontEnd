import { Organization } from "../api/organizations";

export interface OrganizationDTO {
  _id: { value: string };
  props: {
    name: string;
    createdAt: string;
    updatedAt: string | null;
    members: unknown[];
    ownerId: { value: string };
  };


}

export function mapOrganizationToDTO(organization: OrganizationDTO): Organization {
  return {
    id: organization._id.value,
    name: organization.props.name,
    createdAt: organization.props.createdAt,
    updatedAt: organization.props.updatedAt,
    members: organization.props.members,
    ownerId: organization.props.ownerId.value,
  };
}
