import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { isToday, format, isYesterday, startOfWeek, subDays } from 'date-fns';
import { downloadMessageFile } from '../api/actions';

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export const getImageUrl = (imageName) => {
  return `http://localhost:3000/images/${imageName}`;
};

export function formatDateUtils(date) {
  if (!date) return;
  if (isToday(date)) {
    return format(date, 'h:mm a');
  } else if (isYesterday(date)) {
    return 'yestrday';
  } else {
    const now = new Date();
    const endOfLastWeek = startOfWeek(subDays(now, 6));
    if (date > endOfLastWeek) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'dd MMM');
    }
  }
}

export async function handleDownloadFile(id, fileName) {
  try {
    const fileData = await downloadMessageFile(id);
    const blob = new Blob([fileData], { type: 'application/octet-stream' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Error downloading file. Please try again.');
  }
}

export function updateChatNotificationAndEmitSeenMessages(
  id,
  isGroup,
  queryClient,
  socket
) {
  if (!isGroup) {
    queryClient.setQueryData(['chats'], (prevData) => {
      if (!prevData) return;
      // updating recent chat based on id and setting unreaded messages to 0
      const updatedPages = prevData.pages.map((page) => {
        const updatedData = page.data.map((recentChat) =>
          recentChat._id === id
            ? { ...recentChat, unreadedMessages: 0 }
            : recentChat
        );
        return { ...page, data: updatedData };
      });

      return {
        ...prevData,
        pages: [...updatedPages],
      };
    });
  } else {
    queryClient.setQueryData(['groupChats'], (prevData) => {
      if (!prevData) return;

      const updatedData = prevData.data.map((groupChat) =>
        groupChat._id === id ? { ...groupChat, unreadedMessages: 0 } : groupChat
      );

      return { ...prevData, updatedData };
    });
  }

  socket.emit('openChat', { isGroup: isGroup, id: id });
}
