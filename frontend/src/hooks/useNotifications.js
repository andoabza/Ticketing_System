import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useSnackbar } from 'notistack';

export function useTicketNotifications() {
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    socket?.on('ticketAssigned', (ticket) => {
      enqueueSnackbar(`New ticket assigned: ${ticket.title}`, {
        variant: 'info'
      });
    });

    socket?.on('commentAdded', (comment) => {
      enqueueSnackbar(`New comment on ticket: ${comment.text}`, {
        variant: 'info'
      });
    });

    return () => {
      socket?.off('ticketAssigned');
      socket?.off('commentAdded');
    };
  }, [socket, enqueueSnackbar]);
}