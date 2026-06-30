import { ImageIcon } from "lucide-react";

const FieldForm = ({ formData, setFormData, onSubmit, editId, onCancel }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      gambar: file // Menyimpan berkas file mentah ke dalam state gambar
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-200"
    >
      <input
        type="text"
        placeholder="Nama Lapangan"
        value={formData.nama_lapangan}
        onChange={(e) => setFormData({ ...formData, nama_lapangan: e.target.value })}
        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <select
        value={formData.tipe}
        onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Pilih Tipe Lapangan</option>
        <option value="Futsal">Futsal</option>
        <option value="Basketball">Basketball</option>
        <option value="Badminton">Badminton</option>
        <option value="Tenis">Tenis</option>
        <option value="Volleyball">Volleyball</option>
        <option value="Sepak Bola">Sepak Bola</option>
        <option value="Lainnya">Lainnya</option>
      </select>
      <input
        type="text"
        placeholder="Deskripsi"
        value={formData.deskripsi}
        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Jam Buka (contoh: 08:00)"
        value={formData.jam_buka}
        onChange={(e) => setFormData({ ...formData, jam_buka: e.target.value })}
        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Jam Tutup (contoh: 22:00)"
        value={formData.jam_tutup}
        onChange={(e) => setFormData({ ...formData, jam_tutup: e.target.value })}
        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="number"
        placeholder="Harga Sewa per Jam (Rp)"
        value={formData.harga_per_jam}
        onChange={(e) => setFormData({ ...formData, harga_per_jam: e.target.value })}
        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <div className="relative flex items-center group">
        <ImageIcon
          size={16}
          className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 pointer-events-none"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:cursor-pointer"
          required={!editId} 
        />
      </div>

      {/* Sektor Aksi Tombol */}
      <div className="md:col-span-3 pt-2 text-right space-x-2">
        {/* 🔥 Tambah tombol Cancel opsional agar interaksi form fleksibel */}
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          {editId ? "Update Field Info" : "Save Field to Database"}
        </button>
      </div>
    </form>
  );
};

export default FieldForm