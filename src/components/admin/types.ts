import type { Availability } from "@prisma/client";

export interface AdminSystem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  performanceClass: string;
  priceCents: number;
  currency: string;
  availability: Availability;
  imagePath: string | null;
  highlights: string[];
  orderIndex: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  budget: string;
  usage: string;
  resolution: string;
  notes: string | null;
  createdAt: string;
}
