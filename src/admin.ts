import axios from 'axios';
import { Response } from './models/responses';
import { User } from './models/user';

/**
 * Admin of a SeaTable server
 * @see https://api.seatable.io/#fbbe2e93-53a6-4ff6-81f2-499ac6283d3c
 */
export class Admin {
  private _token?: string;

  public get token(): string | undefined {
    return this._token;
  }

  private _serverUrl: string;

  public get serverUrl(): string {
    return this._serverUrl;
  }

  private _username?: string;
  private _password?: string;

  /**
   * General headers to access admin resources
   * @returns The headers needed to access admin resources on a SeaTable server
   */
  get generalHeaders(): object {
    return this.token !== undefined
      ? {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + this.token,
        }
      : this.noAuthHeaders;
  }

  /**
   * No auth headers to access public resources
   * @returns The headers needed to access public resources on a SeaTable server
   */
  get noAuthHeaders(): object {
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Creates a new admin with token
   * @param token The token of the admin
   * @param serverUrl The url of the SeaTable server
   */
  constructor(serverUrl: string, token: string) {
    if (serverUrl.endsWith('/')) serverUrl = serverUrl.slice(0, -1);
    this._serverUrl = serverUrl;
    this._token = token;
  }

  public static async withUsernameAndPassword(serverUrl: string, username: string, password: string): Promise<Admin> {
    if (serverUrl.endsWith('/')) serverUrl = serverUrl.slice(0, -1);
    return new Promise<Admin>(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'post',
          url: serverUrl + '/api2/auth-token/',
          data: {
            username: username,
            password: password,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // console.log(result.data);
        if (result.status >= 300) reject(new Error('Failed'));
        else if (!Response.confirmsTo(result.data)) reject(new Error('data does not confirm to SomeResponse'));
        else resolve(new Admin(serverUrl, (result.data as Response.AuthToken).token));
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getUserInfo(userId: string): Promise<User> {
    return new Promise<User>(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'get',
          url: `${this.serverUrl}/api/v2.1/user-common-info/${userId}/`,
          headers: this.generalHeaders,
        });
        // console.log(result.data);
        if (result.status >= 300) reject(new Error('Failed'));
        else if (!Response.confirmsTo<Response.UserInfo>(result.data))
          reject(new Error('data does not confirm to Response.UserInfo'));
        else resolve(Response.toUser(result.data as Response.UserInfo));
      } catch (e) {
        reject(e);
      }
    });
  }
}
