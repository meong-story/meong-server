import { VerificationPost } from '../entities/verificationPost.entity';

export class InfiniteScrollSlideResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  items: VerificationPost[];
}
