// Dashboard de Profesor (vista limitada)
function DashboardProfesor({ user, onLogout }) {
    const [alumnos, setAlumnos] = React.useState([]);
    const [cuotas, setCuotas] = React.useState([]);

    React.useEffect(() => {
        cargarAlumnos();
        cargarCuotas();
    }, []);

    const cargarAlumnos = async () => {
        const { data } = await window.supabaseClient.from('alumnos').select('*').order('apellido');
        if (data) setAlumnos(data);
    };

    const cargarCuotas = async () => {
        const { data } = await window.supabaseClient
            .from('cuotas')
            .select('*, alumnos(nombre, apellido)')
            .order('año', { ascending: false })
            .order('mes', { ascending: false });
        if (data) setCuotas(data);
    };

    return (
        <div>
            <header className="bg-white shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">🎨</div>
                        <div>
                            <h1 className="text-xl font-title font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                L A Lenguas y Artes
                            </h1>
                            <p className="text-xs text-gray-500">Panel de Profesor</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <button onClick={onLogout} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all">
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white card-hover">
                        <p className="text-sm opacity-90">Total Alumnos</p>
                        <p className="text-3xl font-bold">{alumnos.length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white card-hover">
                        <p className="text-sm opacity-90">Total Cuotas</p>
                        <p className="text-3xl font-bold">{cuotas.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
                    <h2 className="text-xl font-bold p-4 bg-gradient-to-r from-purple-50 to-pink-50">📋 Lista de Alumnos</h2>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left font-semibold text-gray-700">Nombre</th>
                                <th className="p-4 text-left font-semibold text-gray-700">DNI</th>
                                <th className="p-4 text-left font-semibold text-gray-700">Nivel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnos.map(a => (
                                <tr key={a.id} className="border-t border-gray-100 table-row-hover">
                                    <td className="p-4 font-medium">{a.nombre} {a.apellido}</td>
                                    <td className="p-4 text-gray-600">{a.dni}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.nivel === 'inferior' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                                            {a.nivel === 'inferior' ? '🎨 Inferior' : '📚 Superior'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

window.DashboardProfesorComponent = DashboardProfesor;