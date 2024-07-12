import { Entity, Page } from "./types";
import { BusyLoopDetector } from "./busyLoopDetector";

export class Paginator<T extends Entity> {
  private readonly source: Database<T>;

  constructor(store: T[]) {
    this.source = new Database(store);
  }

  /**
   * Retrieves up to the next `pageSize` elements. If a `cursor` value is
   * specified the elements starting _after_ `cursor` are returned.  Otherwise
   * the 1st page is returned.
   */
  getNextPage(pageSize: number, cursor?: T): Page<T> {
    // PART ONE
    // Implement `hasMoreResults`, as it is presently only returning `false` for all queries.

    return {
      results: this.source.getItems(pageSize, cursor),
      hasMoreResults: false, // TODO
    };
  }

  /**
   * Retrieves up to the next `pageSize` elements that satisfy the provided
   * `filterCallback`. If a `cursor` value is specified the elements starting
   * _after_ `cursor` are returned.  Otherwise the 1st page is returned.
   */
  getNextPageWithFilter(filterCallback: (item: T) => boolean, pageSize: number, cursor?: T): Page<T> {
    // PART TWO 
    // Implement routine to accurately return filtered pages.

    return this.getNextPage(pageSize, cursor); // TODO
  }
}

/**
 * YOU WILL NOT NEED TO EDIT THIS CODE.
 * 
 * This is strictly here to provide a simple mechanism to retrieve a list of
 * `pageSize` items, optionally starting after a given `cursor`. 
 */
class Database<T extends Entity> {
  private readonly detector: BusyLoopDetector;

  constructor(private readonly store: T[]) {
    this.detector = new BusyLoopDetector();
  }

  /**
   * Retrieves up to the next `pageSize` elements. The results will be
   * consistently ordered and if a `cursor` value is specified the next elements
   * starting _after_ `cursor` are returned.  Otherwise the 1st page is
   * returned.
   */
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
