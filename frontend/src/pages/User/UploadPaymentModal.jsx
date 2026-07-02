import { FileText, X } from "lucide-react";

const UploadPaymentModal = ({ 
  booking, 
  onClose, 
  onSubmit, 
  metodeBayar, 
  setMetodeBayar, 
  fileBukti, 
  setFileBukti, 
  uploading 
}) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-100 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div>
          <h3 className="font-black text-slate-800 text-base uppercase tracking-tight">
            Kirim Bukti Pembayaran
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Sewa {booking.nama_lapangan} (ID: #BKS-{booking.id})
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Tujuan Rekening
            </label>
            <select
              value={metodeBayar}
              onChange={(e) => setMetodeBayar(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 transition-all"
            >
              <option value="Transfer BCA">
                Transfer BCA (Rek: 123456789 a/n BookingSpace)
              </option>
              <option value="Transfer Mandiri">
                Transfer Mandiri (Rek: 987654321 a/n BookingSpace)
              </option>
              <option value="Dana / OVO">
                E-Wallet Dana/OVO (08123456789)
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Unggah Struk (.jpg / .png)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50 relative hover:bg-slate-100 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFileBukti(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileText size={24} className="text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-600 truncate">
                {fileBukti ? fileBukti.name : "Pilih atau Seret Foto Struk"}
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                Pastikan file terlihat jelas
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-[#004ac6] text-white hover:bg-blue-700 disabled:bg-slate-300 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md font-bold cursor-pointer"
          >
            {uploading ? "Memproses Upload..." : "Kirim Pembayaran"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPaymentModal;