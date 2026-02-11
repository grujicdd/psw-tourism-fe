export interface TourProblem {
  id: number;
  tourId: number;
  touristId: number;
  title: string;
  description: string;
  status: number;
  statusName: string;
  reportedAt: Date;
  resolvedAt?: Date;
  reviewRequestedAt?: Date;
  rejectedAt?: Date;
  tourName: string;
  touristName?: string;
}

export interface CreateTourProblem {
  tourId: number;
  title: string;
  description: string;
}

export enum TourProblemStatus {
  Pending = 0,
  Resolved = 1,
  UnderReview = 2,
  Rejected = 3
}