// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

import Errors from "./errors";
import type {
  User,
  UsersPage,
  ClientsPage,
  GroupsPage,
  Login,
  PageMetadata,
  Token,
  Response,
  ChannelsPage,
} from "./defs";

/**
 * @class Users
 * Handles interactions with the users API, including creating, updating, and managing users, creating and refreshing tokens.
 */
export default class Users {
  private readonly usersUrl: URL;

  private readonly clientsUrl?: URL;

  private readonly contentType: string;

  private readonly usersEndpoint: string;

  private readonly searchEndpoint: string;

  /**
   * @constructor
   * Initializes the Users API client.
   * @param {object} config - Configuration object.
   * @param {string} config.usersUrl - Base URL for the users API.
   * @param {string} [config.clientsUrl] - Optional URL for the clients API.
   */
  public constructor({
    usersUrl,
    clientsUrl,
  }: {
    usersUrl: string;
    clientsUrl?: string;
  }) {
    this.usersUrl = new URL(usersUrl);
    if (clientsUrl !== undefined) {
      this.clientsUrl = new URL(clientsUrl);
    } else {
      this.clientsUrl = new URL("");
    }
    this.contentType = "application/json";
    this.usersEndpoint = "users";
    this.searchEndpoint = "search";
  }

  /**
   * @method Create - Creates a new user.
   * @param {User} user - User object containing details like name, username and password.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The created user object.
   * @throws {Error} - If the user cannot be created.
   */
  public async Create(user: User, token?: string): Promise<User> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    };

    try {
      const response = await fetch(
        new URL(this.usersEndpoint, this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method CreateToken - Issue Access and Refresh Token used for authenticating into the system. A user can use either their email or username to login.
   * @param {Login} login - Login object with username and password. The username can either be the email or the username of the user to be logged in.
   * @returns {Promise<Token>} token - The created token object.
   * @throws {Error} - If the token cannot be created.
   */
  public async CreateToken(login: Login): Promise<Token> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
      },
      body: JSON.stringify(login),
    };
    try {
      const response = await fetch(
        new URL(`${this.usersEndpoint}/tokens/issue`, this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const tokenData: Token = await response.json();
      return tokenData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method RefreshToken - Provides a new access token and refresh token.
   * @param {string} refreshToken - refresh_token which is gotten from the token struct and used to get a new access token.
   * @returns {Promise<Token>} token - The created token object.
   * @throws {Error} - If the token cannot be created.
   */
  public async RefreshToken(refreshToken: string): Promise<Token> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/tokens/refresh`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const tokenData: Token = await response.json();
      return tokenData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Update - Updates a user's firstName, lastName and metadata.
   * @param {User} user - User object.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The updated user object.
   * @throws {Error} - If the user cannot be updated.
   */
  public async Update(user: User, token: string): Promise<User> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    };

    try {
      const response = await fetch(
        new URL(`${this.usersEndpoint}/${user.id}`, this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UpdateEmail - Update a user email for a currently logged in user.
   * @param {User} user - User object with updated email.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The user object with the updated email.
   * @throws {Error} - If the user email cannot be updated.
   */
  public async UpdateEmail(user: User, token: string): Promise<User> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: user.email }),
    };
    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/${user.id}/email`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UpdateUsername - Updates a user's username.
   * @param {User} user - User object with updated username.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The user object with the updated username.
   * @throws {Error} - If the user username cannot be updated.
   */
  public async UpdateUsername(user: User, token: string): Promise<User> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: user.credentials?.username }),
    };
    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/${user.id}/username`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UpdateProfilePicture - Updates the profile picture of a user.
   * @param {User} user - User object with the updated profile picture.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The user object with the updated profile picture.
   * @throws {Error} - If the user profile picture cannot be updated.
   */
  public async UpdateProfilePicture(user: User, token: string): Promise<User> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ profile_picture: user.profile_picture }),
    };
    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/${user.id}/picture`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UpdateUserTags - Update a user's tags.
   * @param {User} user - User object with the updated tags.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The user object with the updated tags.
   * @throws {Error} - If the user tags cannot be updated.
   */
  public async UpdateUserTags(user: User, token: string): Promise<User> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/${user.id}/tags`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UpdateUserPassword - Update a user's password.
   * @param {string} oldSecret - Old password.
   * @param {string} newSecret - New password.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The user object.
   * @throws {Error} - If the user password cannot be updated.
   */
  public async UpdateUserPassword(
    oldSecret: string,
    newSecret: string,
    token: string
  ): Promise<User> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ old_secret: oldSecret, new_secret: newSecret }),
    };

    try {
      const response = await fetch(
        new URL(`${this.usersEndpoint}/secret`, this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UpdateUserRole - Update a user's role.
   * @param {User} user - User object with the updated role.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The user object with the updated role.
   * @throws {Error} - If the user role cannot be updated.
   */
  public async UpdateUserRole(user: User, token: string): Promise<User> {
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    };

    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/${user.id}/role`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method User - Gets a user.
   * @param {string} userId - User ID.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The user object.
   * @throws {Error} - If the user cannot be fetched.
   */
  public async User(userId: string, token: string): Promise<User> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(`${this.usersEndpoint}/${userId}`, this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method UserProfile - Gets a user's Profile.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The user's profile.
   * @throws {Error} - If the user's profile cannot be fetched.
   */
  public async UserProfile(token: string): Promise<User> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(`${this.usersEndpoint}/profile`, this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Users -Retrieves all users matching the provided query parameters.
   * @param {PageMetadata} queryParams - Metadata for pagination or filters.
   * @param {string} token - Authorization token.
   * @returns {Promise<UsersPage>} usersPage - A page of users.
   * @throws {Error} - If the users cannot be fetched.
   */
  public async Users(
    queryParams: PageMetadata,
    token: string
  ): Promise<UsersPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const usersData: UsersPage = await response.json();
      return usersData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Disable - Disable a user.
   * @param {string} userId - The unique identifier of the user to disable.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The disabled user object.
   * @throws {Error} - If the user cannot be disabled.
   */
  public async Disable(userId: string, token: string): Promise<User> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/${userId}/disable`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method Enable - Enable a user.
   * @param {string} userId - The unique identifier of the user to enable.
   * @param {string} token - Authorization token.
   * @returns {Promise<User>} user - The enabled user object.
   * @throws {Error} - If the user cannot be enabled.
   */
  public async Enable(userId: string, token: string): Promise<User> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/${userId}/enable`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const userData: User = await response.json();
      return userData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method ListUserGroups - Get memberships of a user.
   * @param {string} userId - The unique identifier of the member.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {PageMetadata} queryParams - Query parameters for example offset and limit.
   * @param {string} token - Authorization token.
   * @returns {Promise<GroupsPage>} groupsPage - A paginated list of groups.
   * @throws {Error} - If the groups cannot be retrieved.
   */
  public async ListUserGroups(
    domainId: string,
    userId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<GroupsPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${
            this.usersEndpoint
          }/${userId}/groups?${new URLSearchParams(stringParams).toString()}`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const groupsData: GroupsPage = await response.json();
      return groupsData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method ListUserClients - Get memberships of a user.
   * @param {string} userId - The unique identifier of the member.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {PageMetadata} queryParams - Query parameters for example offset and limit.
   * @param {string} token - Authorization token.
   * @returns {Promise<ClientsPage>} clientsPage - A page of clients.
   * @throws {Error} - If the clients cannot be fetched.
   */
  public async ListUserClients(
    userId: string,
    domainId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<ClientsPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${
            this.usersEndpoint
          }/${userId}/clients?${new URLSearchParams(stringParams).toString()}`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const clientsData: ClientsPage = await response.json();
      return clientsData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method ListUserChannels - Retrieves the various channels a user owns.
   * @param {string} userId - The unique identifier of the member.
   * @param {string} domainId - The unique identifier of the domain.
   * @param {PageMetadata} queryParams - Query parameters for example offset and limit.
   * @param {string} token - Authorization token.
   * @returns {Promise<ChannelsPage>} channelsPage - A page of channels.
   * @throws {Error} - If the channels cannot be fetched.
   */

  public async ListUserChannels(
    domainId: string,
    userId: string,
    queryParams: PageMetadata,
    token: string
  ): Promise<ChannelsPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${domainId}/${
            this.usersEndpoint
          }/${userId}/channels?${new URLSearchParams(stringParams).toString()}`,
          this.clientsUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const channelsPage: ChannelsPage = await response.json();
      return channelsPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method ResetPasswordRequest - Sends a request to reset the password to the given email.
   * @param {string} email - User email.
   * @param {string} hostUrl - URL of the host UI.
   * @returns {Promise<Response>} response - A promise that resolves when the email is sent.
   * @throws {Error} - If the reset request email cannot be sent.
   */
  public async ResetPasswordRequest(
    email: string,
    hostUrl: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Referer: hostUrl,
      },
      body: JSON.stringify({ email }),
    };
    try {
      const response = await fetch(
        new URL("/password/reset-request", this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const resetRequestResponse: Response = {
        status: response.status,
        message: "Email with reset link sent successfully",
      };
      return resetRequestResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method ResetPassword - Resets a user's password.
   * @param {string} password - updated user password.
   * @param {string} confPass - Confirmation password.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves when the password is reset.
   * @throws {Error} - If the password cannot be reset.
   */
  public async ResetPassword(
    password: string,
    confPass: string,
    token: string
  ): Promise<Response> {
    const options: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password, confirm_password: confPass }),
    };
    try {
      const response = await fetch(
        new URL("/password/reset", this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const resetResponse: Response = {
        status: response.status,
        message: "Password reset successfully",
      };
      return resetResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method DeleteUser - Deletes a user.
   * @param {string} userId - The unique identifier of the user to enable.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} response - A promise that resolves when the user is deleted.
   * @throws {Error} - If the user cannot be deleted.
   */
  public async DeleteUser(userId: string, token: string): Promise<Response> {
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        new URL(`${this.usersEndpoint}/${userId}`, this.usersUrl).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const deleteResponse: Response = {
        status: response.status,
        message: "User deleted successfully",
      };
      return deleteResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method SearchUsers - Search for users.
   * @param {PageMetadata} queryParams - Query parameters for the request.
   * @param {string} token - Authorization token.
   * @returns {Promise<UsersPage>} usersPage - A page of users.
   * @throws {Error} - If the users cannot be fetched.
   */
  public async SearchUsers(
    queryParams: PageMetadata,
    token: string
  ): Promise<UsersPage> {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    );

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/${this.searchEndpoint}?${new URLSearchParams(
            stringParams
          ).toString()}`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const usersData: UsersPage = await response.json();
      return usersData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method SendVerification - Sends a verification email to the authenticated user.
   * @param {string} token - Authorization token.
   * @returns {Promise<Response>} sendVerificationResponse - A promise that resolves when the verification email is sent.
   * @throws {Error} - If the verification email cannot be sent.
   */
  public async SendVerification(token: string): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": this.contentType,
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `${this.usersEndpoint}/send-verification`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const sendVerificationResponse: Response = {
        status: response.status,
        message: "Verification email sent successfully",
      };
      return sendVerificationResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method VerifyEmail - Verifies a user's email address using a verification token.
   * @param {string} token - Email verification token received by the user.
   * @returns {Promise<Response>} verifyEmailResponse - A promise that resolves when the user's email has been verified.
   * @throws {Error} - If the email verification fails.
   */
  public async VerifyEmail(token: string): Promise<Response> {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": this.contentType,
      },
    };
    try {
      const response = await fetch(
        new URL(
          `/verify-email?token=${token}`,
          this.usersUrl
        ).toString(),
        options
      );
      if (!response.ok) {
        const errorRes = await response.json();
        throw Errors.HandleError(errorRes.message, response.status);
      }
      const verifyEmailResponse: Response = {
        status: response.status,
        message: "Email verified successfully",
      };
      return verifyEmailResponse;
    } catch (error) {
      throw error;
    }
  }
}
