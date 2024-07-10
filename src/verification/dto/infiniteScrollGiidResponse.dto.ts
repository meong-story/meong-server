import { VerificationPost } from '../entities/verificationPost.entity';

export class InfiniteScrollGridResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  items: VerificationPost[];
}
