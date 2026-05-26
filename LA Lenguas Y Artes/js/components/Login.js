// Componente de Login
function Login({ onLogin }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({ 
            email, 
            password 
        });
        
        if (error) {
            setError(error.message);
        } else {
            onLogin(data.user);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-purple-100 fade-in">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🎨📚</div>
                    <h1 className="text-3xl font-title font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        L A Lenguas y Artes
                    </h1>
                    <p className="text-gray-500 mt-2">Sistema de Gestión</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="directora@colegio.com"
                            required 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium">Contraseña</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full text-white py-3 rounded-xl font-semibold disabled:opacity-50">
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 text-center">Acceso de prueba</p>
                    <p className="text-sm text-gray-600 text-center font-mono">directora@colegio.com</p>
                </div>
            </div>
        </div>
    );
}

// Exportar para usar en otros archivos
window.LoginComponent = Login;