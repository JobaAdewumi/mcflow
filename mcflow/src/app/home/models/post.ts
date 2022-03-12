export interface SponsoredPost {
  id: number;
  postImagePath?: string;
  body: string;
  link: string;
  createdAt: Date;
  isActive: boolean;
}
