// App Principal
function App() {
    const [user, setUser] = React.useState(null);
    const [rol, setRol] = React.useState(null);

    React.useEffect(() => {
        window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                cargarRol(session.user.id);
            }
        });
    }, []);

    const cargarRol = async (userId) => {
        const { data } = await window.supabaseClient
            .from('perfiles_usuarios')
            .select('rol')
            .eq('id', userId)
            .single();
        if (data) setRol(data.rol);
    };

    const handleLogout = async () => {
        await window.supabaseClient.auth.signOut();
        setUser(null);
        setRol(null);
    };

    if (!user) {
        return React.createElement(LoginComponent, { onLogin: (u) => { setUser(u); cargarRol(u.id); } });
    }
    
    if (rol === 'directora') {
        return React.createElement(DashboardDirectoraComponent, { user: user, onLogout: handleLogout });
    }
    
    return React.createElement(DashboardProfesorComponent, { user: user, onLogout: handleLogout });
}

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));