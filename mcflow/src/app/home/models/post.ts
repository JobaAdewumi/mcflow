import { User } from '../../auth/models/user.model';

export interface SponsoredPost {
  id: number;
  postImagePath?: string;
  body: string;
  link: string;
  createdAt: Date;
  isActive: boolean;
  author: User;
}
