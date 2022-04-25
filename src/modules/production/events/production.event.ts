export class ProductionTaskTriggeredEvent {
  public specs: string[];
  public concurrency: number;

  constructor(specs: string[], concurrency: number) {
    this.specs = specs;
    this.concurrency = concurrency;
  }
}
