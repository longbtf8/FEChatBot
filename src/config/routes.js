export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY_EMAIL: "/verify-email",
    NEW_CHAT: "/new-chat",
    CONVERSATION: "/conversations/:id",
};

export function newChatUrl(userId) {
    return `${ROUTES.NEW_CHAT}?userId=${userId}`;
}

export function conversationUrl(id) {
    return `/conversations/${id}`;
}
