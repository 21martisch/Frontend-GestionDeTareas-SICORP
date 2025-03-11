import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = ({ setFilter, isMenuOpen, toggleMenu }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.name) {
            setUsername(user.name);
        }
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro de cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate("/login");
                toast.success('Sesión cerrada con éxito');
            }
        });
    };

    const handleFilterClick = (value) => {
        setFilter(value);
        toggleMenu();
    };

    return (
        <aside className={`fixed top-0 left-0 h-full bg-gray-200 p-4 shadow-md flex flex-col justify-between transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64 md:w-48 sm:w-40 xs:w-32 z-50`}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center text-white text-lg font-semibold">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-4 text-lg font-semibold hidden lg:block">{username}</span>
                </div>
                <button
                    className="lg:hidden block text-gray-700 focus:outline-none"
                    onClick={toggleMenu}
                >
                    <CloseIcon />
                </button>
            </div>
            <ul className="flex flex-col mt-30 space-y-2">
                {[
                    { label: "Todas las tareas", value: "all" },
                    { label: "⭐ Importantes", value: "favorites" },
                    { label: "✅ Finalizadas", value: "completed" },
                    { label: "⏳ Pendientes", value: "incomplete" }
                ].map((filter) => (
                    <li
                        key={filter.value}
                        className="cursor-pointer py-2 hover:text-blue-500 transition"
                        onClick={() => handleFilterClick(filter.value)}
                    >
                        {filter.label}
                    </li>
                ))}
            </ul>
            <button
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full"
            >
                Cerrar sesión
            </button>
        </aside>
    );
};

export default Sidebar;