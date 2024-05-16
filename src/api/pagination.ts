import { DataSource, Entity, Page, PagedDataSource } from "./api";

export class HexPagedDataSource<T extends Entity> implements PagedDataSource<T> {
  private readonly source: HexDataSource<T>;

  constructor(store: T[]) {
    this.source = new HexDataSource(store);
  }

  getNextPage(pageSize: number, start?: T): Page<T> {
    // TODO: Implement `hasMoreResults`.
    return {
      results: this.source.getItems(pageSize, start),
      hasMoreResults: false,
    };
  }

  getNextPageWithPredicate(predicate: (item: T) => boolean, pageSize: number, start?: T): Page<T> {
    // TODO: Implement predicates.
    return this.getNextPage(pageSize, start);
  }
}

class HexDataSource<T extends Entity> implements DataSource<T> {
  constructor(private readonly store: T[]) { }

  getItems(pageSize: number, start?: T): T[] {
    if (start == null) {
      return this.store.slice(0, pageSize);
    }

    const index = this.store.findIndex(item => item.id === start.id);
    if (index === -1) {
      throw new Error(`No element with id ${start.id}`);
    }

    // Skip over the matching entity.
    const startAt = index + 1;
    return this.store.slice(startAt, startAt + pageSize);
  }
}
