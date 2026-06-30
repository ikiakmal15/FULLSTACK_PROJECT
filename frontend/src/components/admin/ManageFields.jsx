import { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, MapPin } from "lucide-react";
import api from "../../api/axiosConfig";
import FieldForm from "../../components/Admin/FieldForm"; 

const ManageFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_lapangan: "",
    tipe: "",
    deskripsi: "",
    jam_buka: "",
    jam_tutup: "",
    harga_per_jam: "",
    gambar: null, 
  });

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await api.get("/fields");
      setFields(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat lapangan:", error);
      setLoading(false);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataPayload = new FormData();
    dataPayload.append("nama_lapangan", formData.nama_lapangan);
    dataPayload.append("tipe", formData.tipe);
    dataPayload.append("deskripsi", formData.deskripsi);
    dataPayload.append("jam_buka", formData.jam_buka);
    dataPayload.append("jam_tutup", formData.jam_tutup);
    dataPayload.append("harga_per_jam", formData.harga_per_jam);
    
    
    if (formData.gambar) {
      dataPayload.append("gambar", formData.gambar); 
    }

    try {
      const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
      if (editId) {
        
        await api.put(`/fields/${editId}`, dataPayload, config);
        alert("Lapangan berhasil diperbarui!");
      } else {
        await api.post("/fields", dataPayload, config);
        alert("Lapangan baru berhasil ditambahkan!");
      }
      resetForm();
      fetchFields();
    } catch (error) {
      console.error("Error saving field:", error);
      alert("Gagal menyimpan perubahan data lapangan.");
    }
  };

  const handleEdit = (field) => {
    setEditId(field.id);
    setFormData({
      nama_lapangan: field.nama_lapangan,
      tipe: field.tipe,
      deskripsi: field.deskripsi || "",
      jam_buka: field.jam_buka,
      jam_tutup: field.jam_tutup,
      harga_per_jam: field.harga_per_jam || "",
      gambar: null, 
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus lapangan ini secara permanen dari database?")) {
      try {
        await api.delete(`/fields/${id}`);
        alert("Lapangan berhasil dihapus.");
        fetchFields();
      } catch (error) {
        alert("Gagal menghapus lapangan.");
      }
    }
  };

  
  const resetForm = () => {
    setFormData({
      nama_lapangan: "",
      tipe: "",
      deskripsi: "",
      jam_buka: "",
      jam_tutup: "",
      harga_per_jam: "",
      gambar: null, 
    });
    setIsFormOpen(false);
    setEditId(null);
  };

  if (loading)
    return (
      <p className="text-center text-xs font-bold text-slate-400 uppercase py-12">
        Memuat Master Lapangan...
      </p>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Manage Fields
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Tambah dan modifikasi daftar arena olahraga milik klan ekosistem Anda
          </p>
        </div>
        <button
          onClick={() => {
            if (isFormOpen) resetForm();
            else setIsFormOpen(true);
          }}
          className="bg-[#004ac6] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle size={14} />{" "}
          <span>{isFormOpen ? "Close Form" : "Add New Field"}</span>
        </button>
      </div>

      {isFormOpen && (
        <FieldForm 
          formData={formData} 
          setFormData={setFormData} 
          onSubmit={handleSubmit} 
          editId={editId} 
          onCancel={resetForm}
        />
      )}

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <th className="p-4 pl-6">Nama Lapangan</th>
              <th className="p-4">Tipe</th>
              <th className="p-4">Jam Operasional</th>
              <th className="p-4">Tarif</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
            {fields.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 pl-6 font-extrabold text-slate-800">
                  <div>{f.nama_lapangan}</div>
                  <div className="text-[10px] font-medium text-slate-400 flex items-center gap-0.5 mt-0.5">
                    <MapPin size={10} />
                    <span>Gelora Bung Karno, Jakarta</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                    {f.tipe}
                  </span>
                </td>
                <td className="p-4 text-slate-500 font-mono">
                  {f.jam_buka} - {f.jam_tutup}
                </td>
                <td className="p-4 text-[#004ac6] font-bold">
                  Rp {Number(f.harga_per_jam || 0).toLocaleString()}
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(f)}
                    className="p-2 bg-blue-50 text-[#004ac6] rounded-xl hover:bg-[#004ac6] hover:text-white transition-all cursor-pointer"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFields;