export type Post = {
  company_name: string;
  created_at: Date;
  description: string | undefined;
  external_id: string | null;
  id: number | undefined;
  published_at: Date | null;
  thumbnail: string | null | undefined;
  title: string | undefined;
}
