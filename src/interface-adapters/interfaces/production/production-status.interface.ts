interface Summary {
  ok: number;
  error: number;
  running: number;
  pending: number;
}

export interface ProductionStatus {
  summary: Summary;
  concurrency: number;
  specs: string[];
}
