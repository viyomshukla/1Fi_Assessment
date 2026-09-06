/** Transport-level shapes shared by the mock API routes and the client. */

export interface Paginated<T> {
  items: T[];
  /** Opaque cursor for the next page, or null when the list is exhausted. */
  nextCursor: string | null;
  total: number;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
