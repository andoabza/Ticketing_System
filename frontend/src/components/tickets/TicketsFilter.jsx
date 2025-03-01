export default function TicketFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    dateRange: null,
  });

  const applyFilters = () => {
    const query = {};
    if (filters.status.length) query.status = filters.status;
    if (filters.priority.length) query.priority = filters.priority;
    if (filters.dateRange) {
      query.createdAfter = filters.dateRange[0].toISOString();
      query.createdBefore = filters.dateRange[1].toISOString();
    }
    onFilter(query);
  };

  return (
    <div className="filters-panel">
      <MultiSelect
        options={["open", "in_progress", "closed"]}
        selected={filters.status}
        onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
        label="Status"
      />

      <DateRangePicker
        value={filters.dateRange}
        onChange={(date) =>
          setFilters((prev) => ({ ...prev, dateRange: date }))
        }
      />

      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
}

// Usage in TicketListPage
const [activeFilters, setActiveFilters] = useState({});

const filteredTickets = useMemo(() => {
  return tickets.filter((ticket) => {
    return (
      !activeFilters.status || activeFilters.status.includes(ticket.status)
    );
  });
}, [tickets, activeFilters]);
