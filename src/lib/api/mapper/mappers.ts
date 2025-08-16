import { Organization } from '../organizations';
import { SpaceOfService } from '../space-of-services';
import { User } from '../users';

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

export function mapOrganizationFromDTO(
  organization: OrganizationDTO
): Organization {
  return {
    id: organization._id.value,
    name: organization.props.name,
    createdAt: organization.props.createdAt,
    updatedAt: organization.props.updatedAt,
    members: organization.props.members,
    ownerId: organization.props.ownerId.value,
  };
}

export interface UserDTO {
  _id: { value: string };
  props: {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string | null;
  };
}

export function mapUserFromDTO(user: UserDTO): User {
  return {
    id: user._id.value,
    name: user.props.name,
    email: user.props.email,
    createdAt: user.props.createdAt,
    updatedAt: user.props.updatedAt,
  };
}

export interface SpaceOfServiceDTO {
  _id: { value: string };
  props: {
    name: string;
    organizationId: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
  };
}

export function mapSpaceOfServiceFromDTO(
  spaceOfService: SpaceOfServiceDTO
): SpaceOfService {
  return {
    id: spaceOfService._id.value,
    organizationId: spaceOfService.props.organizationId,
    name: spaceOfService.props.name,
    description: spaceOfService.props.description,
    createdAt: spaceOfService.props.createdAt,
    updatedAt: spaceOfService.props.updatedAt,
  };
}
