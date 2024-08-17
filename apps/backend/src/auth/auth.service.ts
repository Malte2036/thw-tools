import { Injectable } from '@nestjs/common';
import { KindeUser } from './schemas/kindeUser.schema';

@Injectable()
export class AuthService {
  private getHeader(accessToken: string) {
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
  }

  async getUser(accessToken: string): Promise<KindeUser> {
    try {
      const res = await fetch(
        `${process.env.KINDE_DOMAIN}/oauth2/user_profile`,
        {
          method: 'GET',
          headers: this.getHeader(accessToken),
        },
      );
      const data = await res.json();

      return data;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch user from kinde');
    }
  }
}
