import { DataSource, Entity, Page, PagedDataSource } from "./api";
import { BusyLoopDetector } from "./busyLoopDetector";

export class HexPagedDataSource<T extends Entity> implements PagedDataSource<T> {
  private readonly source: MockedDatabase<T>;

  constructor(store: T[]) {
    this.source = new MockedDatabase(store);
  }

  /**
   * INTERVIEW PART ONE: Implement the `getNextPage` method. 
   * 
   * @param pageSize the number of items (projects) to return. If there are not pageSize items left, return up to pageSize items.
   * @param cursor the (optional) offset cursor from the previous page.
   * 
   * @returns a Page object with the results and a boolean indicating if there are more results. TIP: check out the Page interface for more information.
   */
  getNextPage(pageSize: number, cursor?: T): Page<T> {
    return {
      results: this.source.getItems(pageSize, cursor),
      hasMoreResults: false,
    };
  }

  /**
   * INTERVIEW PART TWO: Implement getNextPageWithFilter. This is similar to getNextPage, except we only want to return items that pass the filter callback.
   * 
   * @param filterCallback the filter callback function that will be used to filter the results.
   * @param pageSize the number of items (projects) to return. If there are not pageSize items left, return up to pageSize items.
   * @param cursor the (optional) offset from the previous page. 
   * 
   * @returns a Page object with the items filtered by the filter callback and a boolean indicating if there are more results. TIP: check out the Page interface for more information.
   */
  getNextPageWithPredicate(filterCallback: (item: T) => boolean, pageSize: number, cursor?: T): Page<T> {
    return this.getNextPage(pageSize, cursor);
  }
}

/**
 * Use the MockedDatabase to query for data. 
 * - You should not need to edit this code
 */
class MockedDatabase<T extends Entity> implements DataSource<T> {
  private readonly detector: BusyLoopDetector;

  constructor(private readonly store: T[]) {
    this.detector = new BusyLoopDetector();
  }

  getItems(pageSize: number, cursor?: T): T[] {
    this.detector.check();
    if (cursor == null) {
      return this.store.slice(0, pageSize);
    }

    const index = this.store.findIndex(item => item.id === cursor.id);
    if (index === -1) {
      throw new Error(`No element with id ${cursor.id}`);
    }

    // Skip over the matching cursor
    const startAtIndex = index + 1;
    return this.store.slice(startAtIndex, startAtIndex + pageSize);
  }
}
