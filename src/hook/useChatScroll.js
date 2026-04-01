import { useLazyGetMessagesQuery } from "@/store/api/conversationsApi";
import { useEffect, useRef, useState } from "react";

const useChatScroll = (conversationId, initialData) => {
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const messageEndRef = useRef(null);
  const listRef = useRef(null);
  const isFirstLoad = useRef(true);
  const isNearBottomRef = useRef(true);
  const LIMIT = 30;
  const [messages, setMessages] = useState([]);

  const [newMsgCount, setNewMsgCount] = useState(0);

  const [fetchOlder] = useLazyGetMessagesQuery();

  // lấy dữ liệu ban đầu
  useEffect(() => {
    if (initialData?.messages) {
      setMessages(initialData?.messages);
      setHasMore(initialData.hasMore);
    }
  }, [initialData]);
  // quận mess khi lần đầu ta chạy
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
    setMessages([]);
    setHasMore(true);
    setNewMsgCount(0);
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

  return {
    newMsgCount,
    messages,
    messageEndRef,
    isNearBottomRef,
    setNewMsgCount,
    listRef,
    isFetchingOlder,
    setMessages,
  };
};
export default useChatScroll;
