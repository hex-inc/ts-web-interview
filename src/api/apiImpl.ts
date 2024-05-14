import { cloneDeep } from "lodash";
import { ServerApi, CellData, Subscription } from "./api";
import { v4 as uuid } from "uuid";

class DefaultServer implements ServerApi {
  private cellData: CellData[] = [
    {
      id: uuid(),
      text: "hello world",
    },
  ];

  private subscriptions: Subscription[] = [];

  private static FAILURE_PERCENT = 0.2;
  private static SERVER_DELAY = 200;

  getCells(): Promise<CellData[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > DefaultServer.FAILURE_PERCENT) {
          resolve(cloneDeep(this.cellData));
        } else {
          reject("Server error");
        }
      }, DefaultServer.SERVER_DELAY);
    });
  }

  updateCells(newCells: CellData[]): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > DefaultServer.FAILURE_PERCENT) {
          this.cellData = cloneDeep(newCells);
          this.subscriptions.forEach((subscription) =>
            subscription(this.cellData)
          );
          resolve();
        } else {
          reject("Server error");
        }
      }, DefaultServer.SERVER_DELAY);
    });
  }

  subscribe(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  unsubscribe(subscription: Subscription): void {
    this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
  }
}

export const SERVER = new DefaultServer();
