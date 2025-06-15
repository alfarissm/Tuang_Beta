import React from 'react';
import { User } from '@/app/admin/types/index';
import { UserModal } from './modals/UserModal';

interface UserManagementProps {
  penjualList: User[];
  userModal: { mode: "add" | "edit"; role: "pembeli" | "penjual"; data?: { id?: number; nama: string; nip: string; role: "pembeli" | "penjual"; } } | null;
  onOpenAddUser: (role: "pembeli" | "penjual") => void;
  onOpenEditUser: (role: "pembeli" | "penjual", user: User) => void;
  onDeleteUser: (id: number) => void;
  onCloseModal: () => void;
  onSaveUser: (user: { id?: number; nama: string; nip: string; role: "pembeli" | "penjual"; }) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  penjualList,
  userModal,
  onOpenAddUser,
  onOpenEditUser,
  onDeleteUser,
  onCloseModal,
  onSaveUser
}) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="font-bold text-lg">Akun Penjual</h2>
        <button 
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          onClick={() => onOpenAddUser("penjual")}
        >
          + Tambah Penjual
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3 border">Nama</th>
              <th className="py-2 px-3 border">NIP</th>
              <th className="py-2 px-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {penjualList.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-gray-400 text-center">Tidak ada akun penjual.</td>
              </tr>
            )}
            {penjualList.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-3 border">{u.nama}</td>
                <td className="py-2 px-3 border">{u.nip}</td>
                <td className="py-2 px-3 border">
                  <button 
                    className="text-blue-600 hover:underline mr-2" 
                    onClick={() => onOpenEditUser("penjual", u)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:underline" 
                    onClick={() => onDeleteUser(u.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {userModal && (
        <UserModal
          mode={userModal.mode}
          data={userModal.data}
          role={userModal.role}
          onClose={onCloseModal}
          onSave={onSaveUser}
        />
      )}
    </div>
  );
};