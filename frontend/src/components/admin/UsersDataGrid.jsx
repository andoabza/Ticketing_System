import { DataGrid } from '@mui/x-data-grid';
import RoleSelect from './RoleSelect';
import { useUsers } from '../../hooks/useUsers';

const columns = [
  { field: 'name', headerName: 'Name', flex: 2 },
  { field: 'email', headerName: 'Email', flex: 3 },
  { 
    field: 'role', 
    headerName: 'Role', 
    flex: 2,
    renderCell: (params) => <RoleSelect user={params.row} />
  },
];

export default function UsersDataGrid() {
  const { users, loading } = useUsers();

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        loading={loading}
        disableSelectionOnClick
      />
    </div>
  );
}