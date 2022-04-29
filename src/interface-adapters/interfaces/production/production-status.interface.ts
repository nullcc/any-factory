export interface Summary {
  ok: number;
  error: number;
  running: number;
  pending: number;
}

export interface Spec {
  name: string;
  count: number;
}

export interface ProductionStatus {
  summary: Summary;
  concurrency: number;
  specs: Spec[];
}
