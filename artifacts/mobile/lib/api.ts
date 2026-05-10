import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const getBaseUrl = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (apiUrl) return apiUrl;

  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api`;

  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === "web") {
    return "http://localhost:8080/api";
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080/api";
  }

  return "http://localhost:8080/api";
};

const BASE_URL = getBaseUrl();
const TOKEN_KEY = "tf_auth_token";

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Request failed" }));
      throw new ApiError(res.status, body.error ?? "Request failed");
    }

    return res.json() as Promise<T>;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed";
    throw new ApiError(0, message);
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string; username?: string }) =>
      request<{ token: string; user: UserPublic }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: UserPublic }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    me: () => request<{ user: UserPublic }>("/auth/me"),

    updateProfile: (data: Partial<UserPublic>) =>
      request<{ user: UserPublic }>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    logout: () =>
      request<{ success: boolean }>("/auth/logout", { method: "POST" }),

    deleteAccount: () =>
      request<{ success: boolean }>("/auth/account", { method: "DELETE" }),
  },

  trips: {
    list: () => request<{ trips: TripWithMembers[] }>("/trips"),
    get: (id: string) => request<{ trip: TripWithMembers }>(`/trips/${id}`),
    create: (data: CreateTripInput) =>
      request<{ trip: TripWithMembers }>("/trips", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<CreateTripInput>) =>
      request<{ trip: TripWithMembers }>(`/trips/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/trips/${id}`, { method: "DELETE" }),
  },

  posts: {
    list: (params?: { limit?: number; offset?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.offset) searchParams.set("offset", params.offset.toString());
      return request<{ posts: PostWithCounts[] }>(`/posts?${searchParams.toString()}`);
    },
    get: (id: string) => request<{ post: PostWithDetails }>(`/posts/${id}`),
    create: (data: CreatePostInput) =>
      request<{ post: Post }>(`/posts`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    like: (id: string) =>
      request<{ liked: boolean }>(`/posts/${id}/like`, { method: "POST" }),
    addComment: (id: string, text: string) =>
      request<{ comment: PostCommentWithAuthor }>(`/posts/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
      }),
    getUserPosts: (userId: string, params?: { limit?: number; offset?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.offset) searchParams.set("offset", params.offset.toString());
      return request<{ posts: PostWithCounts[] }>(`/posts/user/${userId}?${searchParams.toString()}`);
    },
  },

  social: {
    follow: (userId: string) =>
      request<{ following: boolean }>(`/users/${userId}/follow`, { method: "POST" }),
    getUserStats: (userId: string) =>
      request<{ followers: number; following: number; posts: number; isFollowing: boolean }>(`/users/${userId}/stats`),
  },
};

export type UserPublic = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  preferredCurrency: string | null;
  language: string | null;
  timezone: string | null;
  profileVisibility: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TripMemberRow = {
  id: string;
  userId: string;
  role: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

export type TripWithMembers = {
  id: string;
  ownerId: string;
  title: string;
  destination: string;
  country: string | null;
  startDate: string;
  endDate: string;
  currency: string | null;
  estimatedBudget: number | null;
  accentColor: string | null;
  status: string | null;
  notes: string | null;
  shareToken: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  members: TripMemberRow[];
};

export type CreateTripInput = {
  title: string;
  destination: string;
  country?: string;
  startDate: string;
  endDate: string;
  currency?: string;
  estimatedBudget?: number;
  accentColor?: string;
  notes?: string;
  status?: string;
  coverImageUrl?: string;
};

export type Post = {
  id: string;
  authorId: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostComment = {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: string;
};

export type PostLike = {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
};

export type UserFollow = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
};

export type PostAuthor = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

export type PostWithCounts = Post & {
  author: PostAuthor;
  commentCount: number;
  likeCount: number;
  userLiked: boolean;
};

export type PostCommentWithAuthor = PostComment & {
  author: PostAuthor;
};

export type PostWithDetails = Post & {
  author: PostAuthor;
  commentCount: number;
  likeCount: number;
  userLiked: boolean;
  comments: PostCommentWithAuthor[];
};

export type CreatePostInput = {
  title: string;
  location: string;
  description: string;
  imageUrl?: string;
};
