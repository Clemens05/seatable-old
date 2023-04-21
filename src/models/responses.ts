import { User } from './user';

export namespace Response {
  interface SomeResponse {}

  export interface AuthToken extends SomeResponse {
    token: string;
  }

  export interface UserInfo extends SomeResponse {
    email: string;
    name: string;
    avatar_url: string;
    contact_email?: string;
  }

  export function confirmsTo<T extends SomeResponse>(object: T): object is T {
    return true;
  }

  export function toUser(object: UserInfo): User {
    return {
      email: object.email,
      name: object.name,
      avatarUrl: object.avatar_url,
      contactEmail: object.contact_email,
    };
  }
}
