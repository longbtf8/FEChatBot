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
            query: (id) => `conversations/${id}/messages`,
            transformResponse: (response) => response?.data ?? response ?? [],
        }),
        createMessage: builder.mutation({
            query: ({ conversationId, ...body }) => ({
                url: `conversations/${conversationId}/messages`,
                method: "POST",
                body,
            }),
            transformResponse: (response) => response?.data ?? response,
        }),
    }),
});

export const {
    useCreateConversationMutation,
    useGetMessagesQuery,
    useCreateMessageMutation,
} = conversationsApi;
