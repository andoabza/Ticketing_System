import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateTicketPDF = (ticket) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text(`Ticket #${ticket._id}`, 15, 20);

  // Details
  const details = [
    ["Title", ticket.title],
    ["Status", ticket.status],
    ["Priority", ticket.priority],
    ["Created", new Date(ticket.createdAt).toLocaleDateString()],
  ];

  doc.autoTable({
    startY: 30,
    head: [["Field", "Value"]],
    body: details,
  });

  // Comments
  doc.text("Comments:", 15, doc.lastAutoTable.finalY + 10);
  const commentsData = ticket.comments.map((c) => [
    c.text,
    c.author.name,
    new Date(c.createdAt).toLocaleString(),
  ]);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Comment", "Author", "Date"]],
    body: commentsData,
  });

  doc.save(`ticket-${ticket._id}.pdf`);
};

// Usage in TicketDetailPage
<button onClick={() => generateTicketPDF(ticket)}>Export as PDF</button>;
