import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ROUTES } from "@/config/routes";
import socketClient from "@/socketClient";
import {
  useGetMessagesQuery,
  useCreateMessageMutation,
  conversationsApi,
  useLazyGetMessagesQuery,
} from "@/store/api/conversationsApi";
import { getApiErrorMessage } from "@/utils/errors";
import {
  BackLink,
  ErrorAlert,
  MessageBubble,
  PageTitle,
  SubmitButton,
  Textarea,
} from "@/components/ui";
import toast from "react-hot-toast";

function Conversation() {
  const dispatch = useDispatch();
  const { id: conversationId } = useParams();
  const LIMIT = 30;
  //state
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsgCount, setNewMsgCount] = useState(0);

  //ref
  const messageEndRef = useRef(null);
  const listRef = useRef(null);
  const isFirstLoad = useRef(true);
  const isNearBottomRef = useRef(true);

  //innit
  const queryArg = { id: conversationId, limit: LIMIT };
  const [createMessage, { isLoading }] = useCreateMessageMutation();
  const { data: initialData } = useGetMessagesQuery(queryArg, {
    skip: !conversationId,
  });

  // lấy dữ liệu ban đầu
  useEffect(() => {
    if (initialData?.messages) {
      setMessages(initialData?.messages);
      setHasMore(initialData.hasMore);
    }
  }, [initialData]);
  // quận mess khi lần đầu ta chạy
  const [fetchOlder] = useLazyGetMessagesQuery();
  const loadMoreMessages = async () => {
    if (!hasMore || isFetchingOlder || messages.length === 0) return;
    const oldestMessageId = messages[0].id;
    setIsFetchingOlder(true);
    const scrollHeightBefore = listRef?.current.scrollHeight;
    try {
      const result = await fetchOlder({
        id: conversationId,
        limit: LIMIT,
        before: oldestMessageId, // Gửi ID này lên Server để lấy các tin TRƯỚC ĐÓ
      }).unwrap();
      if (result) {
        setMessages((prev) => [...result.messages, ...prev]);
        setHasMore(result.hasMore);

        // Sau khi setMessages xong. , giữ cho thanh quận đứng yên
        requestAnimationFrame(() => {
          const list = listRef.current;
          if (list) {
            list.scrollTop = list.scrollHeight - scrollHeightBefore;
          }
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi khi tải tin cũ:", error);
    } finally {
      setIsFetchingOlder(false);
    }
  };
  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;

    // Nếu cuộn lên sát đỉnh (ví dụ còn 10px nữa là kịch)
    if (list.scrollTop <= 10 && !isFetchingOlder && hasMore) {
      loadMoreMessages();
    }
    // Tính khoảng cách từ đáy (scrollHeight - scrollTop - clientHeight)
    const distanceFromBottom =
      list.scrollHeight - list.scrollTop - list.clientHeight;
    const nearBottom = distanceFromBottom < 150;
    isNearBottomRef.current = nearBottom;

    if (nearBottom) {
      return setNewMsgCount(0);
    }
  };
  // Đăng ký sự kiện scroll cho thẻ <ul>
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    list.addEventListener("scroll", handleScroll);
    return () => list.removeEventListener("scroll", handleScroll);
  }, [messages, hasMore, isFetchingOlder]);

  // Thêm reset isFirstLoad khi đổi conversation
  useEffect(() => {
    isFirstLoad.current = true;
  }, [conversationId]);

  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
      messageEndRef.current?.scrollIntoView({ behavior: "instant" });
      isFirstLoad.current = false;
    }
  }, [messages.length]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    const list = listRef.current;
    if (!list) return;
    const distance = list.scrollHeight - list.scrollTop - list.clientHeight;
    //50 bé quá lên em tăng nên 150 để nó quận rõ thấy hơn
    if (distance <= 150) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // realTime soketi
  useEffect(() => {
    if (!conversationId) return;
    const channel = socketClient.subscribe(`conversation-${conversationId}`);
    const handleCreated = (message) => {
      setMessages((prev) => [...prev, message]);
      dispatch(
        conversationsApi.util.updateQueryData(
          "getMessages",
          queryArg,
          (draft) => {
            // draft.push(message);
            draft.messages?.push(message);
          },
        ),
      );
      setNewMsgCount((prev) => prev + 1);
    };
    channel.bind("created", handleCreated);
    return () => channel.unbind("created", handleCreated);
  }, [conversationId, dispatch]);

  // submit gửi tin nhắn
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) {
      toast.error("Vui lòng nhập nội dung tin nhắn!");
      return; // Dừng hàm tại đây, không gọi API
    }
    setContent("");
    setError("");
    try {
      await createMessage({
        conversationId,
        type: "text",
        content: text,
      }).unwrap();
    } catch (err) {
      setContent(text);
      setError(
        getApiErrorMessage(err, "Không thể gửi tin nhắn. Vui lòng thử lại."),
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mb-4">
        <BackLink to={ROUTES.HOME} />
      </div>

      <PageTitle>Tin nhắn</PageTitle>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        {error && <ErrorAlert className="mb-4">{error}</ErrorAlert>}
        <ul
          className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2"
          ref={listRef}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id}>
              <div className="break-words whitespace-pre-wrap max-w-full">
                {message.content}
              </div>
            </MessageBubble>
          ))}
          <div ref={messageEndRef}></div>
        </ul>

        {newMsgCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setNewMsgCount(0);
              messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all animate-bounce flex items-center gap-2"
          >
            <span>{newMsgCount} tin nhắn mới</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13l-7 7-7-7"
              />
            </svg>
          </button>
        )}
        <div className="flex gap-2 shrink-0">
          <Textarea
            className="flex-1"
            rows={2}
            placeholder="Nhập tin nhắn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <SubmitButton loading={isLoading} loadingText="...">
            Gửi
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default Conversation;
