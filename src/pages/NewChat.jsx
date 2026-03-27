import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    useCreateConversationMutation,
    useCreateMessageMutation,
} from "@/store/api/conversationsApi";
import { getApiErrorMessage } from "@/utils/errors";
import { ROUTES, conversationUrl } from "@/config/routes";
import {
    BackLink,
    ErrorAlert,
    PageTitle,
    SubmitButton,
    Textarea,
} from "@/components/ui";

function NewChat() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = parseInt(searchParams.get("userId"));
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const [createConversation, { isLoading: createLoading }] = useCreateConversationMutation();
    const [createMessage, { isLoading: messageLoading }] = useCreateMessageMutation();

    const isLoading = createLoading || messageLoading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const conversation = await createConversation({
                type: "dm",
                user_ids: [userId],
            }).unwrap();
            await createMessage({
                conversationId: conversation.id,
                type: "text",
                content,
            }).unwrap();
            navigate(conversationUrl(conversation.id));
        } catch (err) {
            setError(
                getApiErrorMessage(err, "Không thể tạo cuộc trò chuyện. Vui lòng thử lại.")
            );
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-4">
                <BackLink to={ROUTES.HOME} />
            </div>

            <PageTitle>Tin nhắn mới</PageTitle>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorAlert>{error}</ErrorAlert>}
                <div className="flex gap-2">
                    <Textarea
                        className="flex-1"
                        rows={3}
                        placeholder="Nhập tin nhắn..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <SubmitButton loading={isLoading} loadingText="Đang gửi...">
                        Gửi
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

export default NewChat;
