import { useState } from "react";
import { MessageSquare, Star, Send } from "lucide-react";
import api from "../../api/axiosConfig";

const Review = () => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!komentar.trim()) {
      alert("Silakan tulis isi ulasan Anda terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        field_id: 1, 
        rating: Number(rating),
        ulasan: komentar, 
      };

      await api.post("/reviews", payload); 
      alert("Terima kasih! Ulasan Anda berhasil disimpan dalam sistem.");
      setKomentar("");
      setRating(5);
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengirimkan ulasan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Beri Testimoni Layanan
        </h1>
        <p className="text-xs font-medium text-slate-400 mt-0.5">
          Ulasan tulus Anda sangat berharga bagi peningkatan fasilitas klan
          bersama kami
        </p>
      </div>

      <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmitReview} className="space-y-6">
          {/* INPUT SELEKSI RATING BINTANG */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Skor Penilaian Arena
            </label>
            <div className="flex items-center gap-1.5 select-none">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-amber-400 transition-transform active:scale-90 cursor-pointer p-0.5 outline-none"
                >
                  <Star
                    size={28}
                    fill={
                      (hoverRating || rating) >= star ? "currentColor" : "none"
                    }
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-400 ml-2">
                ({hoverRating || rating} dari 5 Bintang)
              </span>
            </div>
          </div>

          {/* INPUT AREA TEKS KOMENTAR */}
          <div className="space-y-2">
            <label
              className="text-xs font-black uppercase tracking-wider text-slate-500 block"
              htmlFor="komentar"
            >
              Tulis Ulasan Masukan
            </label>
            <textarea
              id="komentar"
              rows="5"
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              placeholder="Ceritakan pengalaman Anda mengenai kualitas lapangan, kebersihan kamar mandi, atau keramahan pelayanan staf kami..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-[#004ac6] text-slate-700 bg-white leading-relaxed resize-none"
              required
            ></textarea>
          </div>

          {/* TOMBOL ACTIONS SUBMIT */}
          <div className="pt-2 border-t border-slate-50">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#004ac6] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md shadow-blue-600/10 transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:bg-slate-400"
            >
              <span>
                {submitting ? "Mengirimkan..." : "Kirim Ulasan Sekarang"}
              </span>
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;