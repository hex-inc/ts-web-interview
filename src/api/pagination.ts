import { Entity } from "./types";
import { BusyLoopDetector } from "./busyLoopDetector";

export interface Page<T> {
  results: T[];

  /**
   * If `hasMoreResults` is true, it is guaranteed that a call starting from the
   * last element of this page will yield at least one more result.
   */
  hasMoreResults: boolean;
}

export class Paginator<T extends Entity> {
  private readonly source: Database<T>;

  constructor(store: T[]) {
    this.source = new Database(store);
  }

  /**
   * Retrieves up to the next `pageSize` elements. If a `startAfter` value is
   * specified the elements starting _after_ `startAfter` are returned.
   * Otherwise the 1st page is returned.
   */
  getNextPage(pageSize: number, startAfter?: T): Page<T> {
    // PART ONE
    // Implement `hasMoreResults`, as it returns `false` for all queries.

    return {
      results: this.source.getItems(pageSize, startAfter),
      hasMoreResults: false, // TODO
    };
  }

  /**
   * Retrieves up to the next `pageSize` elements that satisfy the provided
   * `filterCallback`. If a `startAfter` value is specified the elements
   * starting _after_ `startAfter` are returned.  Otherwise the 1st page is
   * returned.
   *
   * Returns only array of items rather than Page data structure.
   */
  private getItemsWithFilter(filterCallback: (item: T) => boolean, pageSize: number, startAfter?: T): T[] {
    // PART TWO
    // Implement filtering of relevant items from store.

    return this.source.getItems(pageSize, startAfter); // TODO
  }

  /**
   * Retrieves up to the next `pageSize` elements that satisfy the provided
   * `filterCallback`. If a `startAfter` value is specified the elements
   * starting _after_ `startAfter` are returned.  Otherwise the 1st page is
   * returned.
   */
  getNextPageWithFilter(filterCallback: (item: T) => boolean, pageSize: number, startAfter?: T): Page<T> {
    // PART THREE
    // Implement hasMoreResults for filtered pages.

    return {
      results: this.getItemsWithFilter(filterCallback, pageSize, startAfter),
      hasMoreResults: false, // TODO
    };
  }
}

/**
 * YOU WILL NOT NEED TO EDIT THIS CODE.
 * 
 * This is strictly here to provide a simple mechanism to retrieve a list of
 * `pageSize` items, optionally starting after a given `startAfter`.
 */
class Database<T extends Entity> {
  private readonly detector: BusyLoopDetector;

  constructor(private readonly store: T[]) {
    this.detector = new BusyLoopDetector();
  }

  /**
   * Retrieves up to the next `pageSize` elements. The results will be
   * consistently ordered and if a `startAfter` value is specified the next
   * elements starting _after_ `startAfter` are returned.  Otherwise the 1st
   * page is returned.
   */
  getItems(pageSize: number, startAfter?: T): T[] {
    this.detector.check();
    if (startAfter == null) {
      return this.store.slice(0, pageSize);
    }

    const index = this.store.findIndex(item => item.id === startAfter.id);
    if (index === -1) {
      throw new Error(`No element with id ${startAfter.id}`);
    }

    // Skip over the matching startAfter
    const startAtIndex = index + 1;
    return this.store.slice(startAtIndex, startAtIndex + pageSize);
  }
}
