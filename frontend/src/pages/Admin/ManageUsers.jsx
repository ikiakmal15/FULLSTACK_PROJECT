import { useState, useEffect } from "react";
import { Users, Trash2, ShieldCheck, Search } from "lucide-react";
import api from "../../api/axiosConfig";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mengambil semua user dari tabel users database MySQL
      const response = await api.get("/admin/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat data pengguna dari database:", error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun ${name}?`)) {
      try {
        // Menghapus data user berdasarkan ID di MySQL
        await api.delete(`/admin/users/${id}`);
        alert("Pengguna berhasil dihapus dari database.");
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || "Gagal menghapus pengguna.");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.nama &&
        user.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (loading)
    return (
      <p className="text-center text-xs font-bold text-slate-400 uppercase py-12">
        Sinkronisasi Database Users...
      </p>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Manage Users
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Data pengguna real-time langsung dari tabel MySQL
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            size={14}
            className="absolute left-3.5 top-3 text-slate-400"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Nama Pengguna</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 pl-6 font-extrabold text-slate-800">
                      {u.nama}
                    </td>
                    <td className="p-4 text-slate-500 font-mono">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide border ${
                          u.role === "admin"
                            ? "bg-blue-50 text-[#004ac6] border-blue-100"
                            : "bg-slate-50 text-slate-600 border-slate-100"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <ShieldCheck size={12} />
                        ) : (
                          <Users size={12} />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.nama)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-slate-400 text-xs font-bold uppercase"
                  >
                    Tidak ada user ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageUsers;