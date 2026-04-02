import apiClient from "../lib/apiClient";

const SUBSCRIPTIONS_URL = `${import.meta.env.VITE_API_BASE_URL}/subscriptions`;

export interface ApiSubscription {
  id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  subscription_plan: string;
  price: number;
  start_date: string;
  end_date: string;
  remaining_days: number;
  status: string;
  payment_status: string;
  device_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionsPagination {
  current_page: number;
  total_pages: number;
  total_records: number;
}

export interface SubscriptionsResponse {
  data: ApiSubscription[];
  pagination: SubscriptionsPagination;
}

export async function fetchSubscriptions(page = 1, limit = 10): Promise<SubscriptionsResponse> {
  const { data } = await apiClient.get(SUBSCRIPTIONS_URL, { params: { page, limit } });
  return { data: data.data, pagination: data.pagination };
}
