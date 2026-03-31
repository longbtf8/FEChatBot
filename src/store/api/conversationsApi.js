import { apiSlice } from "@/store/api/apiSlice";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation({
      query: (body) => ({
        url: "conversations",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data ?? response,
    }),
    getMessages: builder.query({
      query: ({ id, limit = 30, before }) =>
        `conversations/${id}/messages?limit=${limit}${before ? `&before=${before}` : ""}`,
      transformResponse: (response) => response?.data ?? response ?? {},
    }),
    findConversation: builder.query({
      query: (id) => `conversations/dm/${id}`,
      transformResponse: (response) => response?.data ?? response,
    }),
    createMessage: builder.mutation({
      query: ({ conversationId, ...body }) => ({
        url: `conversations/${conversationId}/messages`,
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data ?? response,
    }),
    getConversation: builder.query({
      query: () => `conversations`,
      transformResponse: (response) => response?.data ?? response,
    }),
  }),
});

export const {
  useCreateConversationMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useCreateMessageMutation,
  useFindConversationQuery,
  useLazyFindConversationQuery,
  useGetConversationQuery,
} = conversationsApi;
