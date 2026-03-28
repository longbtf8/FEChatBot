import { conversationUrl, newChatUrl } from "@/config/routes";
import { useLazyFindConversationQuery } from "@/store/api/conversationsApi";
import { useNavigate } from "react-router-dom";

export const useChangeToConversation = () => {
  const [trigger, { isFetching }] = useLazyFindConversationQuery();
  const navigate = useNavigate();

  const handleClick = async (e, userId) => {
    e.preventDefault();
    if (!userId) {
      return;
    }
    try {
      const result = await trigger(userId, false).unwrap();
      if (result?.id) {
        navigate(conversationUrl(result.id));
      } else {
        navigate(newChatUrl(userId));
      }
      console.log(result);
    } catch (error) {
      navigate(newChatUrl(userId));
    }
  };
  return { handleClick, isChecking: isFetching };
};
