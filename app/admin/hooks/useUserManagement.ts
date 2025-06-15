import { useState } from 'react';
import { User, UserPP } from '@/app/admin/types/index';
import { initialUsers } from '@/app/admin/data/mockData';

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userModal, setUserModal] = useState<null | { 
    mode: "add" | "edit"; 
    role: "pembeli" | "penjual"; 
    data?: UserPP 
  }>(null);
  
  const penjualList = users.filter(u => u.role === "penjual");
  
  const handleDeleteUser = (id: number, username: string, logAction: (message: string) => void) => {
    if (confirm("Hapus akun ini?")) {
      setUsers(users => users.filter(u => u.id !== id));
      logAction(`Admin menghapus user id=${id} (${username})`);
      return true;
    }
    return false;
  };
  
  const handleOpenAddUser = (role: "pembeli" | "penjual") => 
    setUserModal({ mode: "add", role });
    
  const handleOpenEditUser = (role: "pembeli" | "penjual", u: User) =>
    setUserModal({
      mode: "edit",
      role,
      data: {
        id: u.id,
        nama: u.nama,
        nip: u.nip,
        role: u.role as "pembeli" | "penjual",
      }
    });
    
  const handleSaveUser = (u: UserPP, logAction: (message: string) => void) => {
    if (userModal?.mode === "add") {
      const newId = Date.now();
      setUsers(users => [...users, { ...u, id: newId }]);
      logAction(`Admin menambah user '${u.nama}'`);
    } else if (userModal?.mode === "edit") {
      setUsers(users => users.map(us => us.id === u.id ? { ...us, ...u } : us));
      logAction(`Admin mengedit user '${u.nama}'`);
    }
    setUserModal(null);
  };
  
  return {
    users,
    setUsers,
    penjualList,
    userModal,
    setUserModal,
    handleDeleteUser,
    handleOpenAddUser,
    handleOpenEditUser,
    handleSaveUser,
  };
}