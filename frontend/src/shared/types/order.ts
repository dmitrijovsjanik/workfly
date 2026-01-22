export type Category = 'DEVELOPMENT' | 'DESIGN' | 'MARKETING' | 'COPYWRITING' | 'OTHER';
export type OrderStatus = 'DRAFT' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  customerId: string;
  title: string;
  description: string;
  budget: number | null;
  deadline: string | null;
  skillsRequired: string[];
  category: Category;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface CreateOrderInput {
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  skillsRequired?: string[];
  category: Category;
}
