import Breadcrumb from '../components/Breadcrumb';
import UsersTable from '../components/UsersTable';


const AdminUsers = () => {
  return (
    <>
      <Breadcrumb pageName="Users" />
      <div className="flex flex-col gap-10">
        <UsersTable />
      </div>
    </>
  );
};

export default AdminUsers;
