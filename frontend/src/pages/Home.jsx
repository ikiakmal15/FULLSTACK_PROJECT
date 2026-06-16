const Home = () => {
    
    // Memanggil objek data user asli hasil respon Consume API login sebelumnya
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center py-20">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase inline-block mb-3">
                Koneksi API Sukses
            </span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
                SELAMAT DATANG, {user.nama || 'SOBAT OLAHRAGA'}!
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
                Autentikasi frontend terhubung lancar. Akun Anda berhasil dipanggil dan diverifikasi oleh sistem basis data MyField.
            </p>
        </div>
    );
};

export default Home;