// Dashboard de Directora
function DashboardDirectora({ user, onLogout }) {
    const [alumnos, setAlumnos] = React.useState([]);
    const [cuotas, setCuotas] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState('alumnos');
    const [showForm, setShowForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
        nombre: '', apellido: '', dni: '', direccion: '',
        padre_nombre: '', padre_apellido: '', padre_telefono: '',
        madre_nombre: '', madre_apellido: '', madre_telefono: '',
        nivel: 'inferior', tiene_descuento_familiar: false
    });

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

    const registrarAlumno = async (e) => {
        e.preventDefault();
        const { error } = await window.supabaseClient.from('alumnos').insert([{
            ...formData,
            registrado_por: user.id
        }]);
        if (!error) {
            setShowForm(false);
            cargarAlumnos();
            setFormData({
                nombre: '', apellido: '', dni: '', direccion: '',
                padre_nombre: '', padre_apellido: '', padre_telefono: '',
                madre_nombre: '', madre_apellido: '', madre_telefono: '',
                nivel: 'inferior', tiene_descuento_familiar: false
            });
        } else {
            alert('Error: ' + error.message);
        }
    };

    const marcarPago = async (cuotaId) => {
        const { error } = await window.supabaseClient.rpc('marcar_cuota_pagada', {
            p_cuota_id: cuotaId,
            p_fecha_pago: new Date().toISOString().split('T')[0]
        });
        if (!error) cargarCuotas();
    };

    const totalPendiente = cuotas.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + parseFloat(c.monto_final), 0);
    const totalPagado = cuotas.filter(c => c.estado === 'pagado').reduce((sum, c) => sum + parseFloat(c.monto_final), 0);

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
                            <p className="text-xs text-gray-500">Panel de Directora</p>
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
                {/* Tarjetas de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white card-hover">
                        <p className="text-sm opacity-90">Total Alumnos</p>
                        <p className="text-3xl font-bold">{alumnos.length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white card-hover">
                        <p className="text-sm opacity-90">Pendiente de pago</p>
                        <p className="text-3xl font-bold">${totalPendiente.toFixed(2)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white card-hover">
                        <p className="text-sm opacity-90">Recaudado</p>
                        <p className="text-3xl font-bold">${totalPagado.toFixed(2)}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-xl inline-flex">
                    <button 
                        onClick={() => setActiveTab('alumnos')} 
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'alumnos' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                        📋 Alumnos
                    </button>
                    <button 
                        onClick={() => setActiveTab('cuotas')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'cuotas' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                        💰 Cuotas
                    </button>
                </div>

                {activeTab === 'alumnos' && (
                    <div>
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary text-white px-5 py-2.5 rounded-xl mb-4 font-medium flex items-center gap-2">
                            <span>+</span> Nuevo Alumno
                        </button>

                        {showForm && (
                            <form onSubmit={registrarAlumno} className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-purple-100 fade-in">
                                <h2 className="text-xl font-bold mb-4 text-purple-800">Registrar Nuevo Alumno</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Nombre *" className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                                    <input placeholder="Apellido *" className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} required />
                                    <input placeholder="DNI *" className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} required />
                                    <input placeholder="Dirección *" className="border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} required />
                                    <input placeholder="Padre Nombre" className="border border-gray-200 p-3 rounded-xl" value={formData.padre_nombre} onChange={e => setFormData({...formData, padre_nombre: e.target.value})} />
                                    <input placeholder="Padre Apellido" className="border border-gray-200 p-3 rounded-xl" value={formData.padre_apellido} onChange={e => setFormData({...formData, padre_apellido: e.target.value})} />
                                    <input placeholder="Padre Teléfono" className="border border-gray-200 p-3 rounded-xl" value={formData.padre_telefono} onChange={e => setFormData({...formData, padre_telefono: e.target.value})} />
                                    <input placeholder="Madre Nombre" className="border border-gray-200 p-3 rounded-xl" value={formData.madre_nombre} onChange={e => setFormData({...formData, madre_nombre: e.target.value})} />
                                    <input placeholder="Madre Apellido" className="border border-gray-200 p-3 rounded-xl" value={formData.madre_apellido} onChange={e => setFormData({...formData, madre_apellido: e.target.value})} />
                                    <input placeholder="Madre Teléfono" className="border border-gray-200 p-3 rounded-xl" value={formData.madre_telefono} onChange={e => setFormData({...formData, madre_telefono: e.target.value})} />
                                    <select className="border border-gray-200 p-3 rounded-xl" value={formData.nivel} onChange={e => setFormData({...formData, nivel: e.target.value})}>
                                        <option value="inferior">🎨 Inferior ($50/mes)</option>
                                        <option value="superior">📚 Superior ($75/mes)</option>
                                    </select>
                                    <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                        <input type="checkbox" checked={formData.tiene_descuento_familiar} onChange={e => setFormData({...formData, tiene_descuento_familiar: e.target.checked})} />
                                        <span>Descuento familiar (10%)</span>
                                    </label>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="submit" className="btn-primary text-white px-6 py-2.5 rounded-xl font-medium">Guardar Alumno</button>
                                    <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium">Cancelar</button>
                                </div>
                            </form>
                        )}

                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-gray-700">Nombre</th>
                                        <th className="p-4 text-left font-semibold text-gray-700">DNI</th>
                                        <th className="p-4 text-left font-semibold text-gray-700">Nivel</th>
                                        <th className="p-4 text-left font-semibold text-gray-700">Descuento</th>
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
                                            <td className="p-4">{a.tiene_descuento_familiar ? '✅ Sí' : '❌ No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'cuotas' && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-gray-700">Alumno</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Mes/Año</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Monto</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Estado</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cuotas.map(c => (
                                    <tr key={c.id} className="border-t border-gray-100 table-row-hover">
                                        <td className="p-4 font-medium">{c.alumnos?.nombre} {c.alumnos?.apellido}</td>
                                        <td className="p-4">{c.mes}/{c.año}</td>
                                        <td className="p-4 font-semibold text-purple-700">${parseFloat(c.monto_final).toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.estado === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {c.estado === 'pagado' ? '✅ Pagado' : '⏳ Pendiente'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {c.estado === 'pendiente' && (
                                                <button onClick={() => marcarPago(c.id)} className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 transition-all">
                                                    Marcar Pagado
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

window.DashboardDirectoraComponent = DashboardDirectora;