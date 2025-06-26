import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import React from "react";

const Sidebar = ({ setFilter, isMenuOpen, toggleMenu, filter }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro de cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#A8E6CF',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(logout());
                navigate("/login");
                toast.success('Sesión cerrada con éxito');
            }
        });
    };

    const adminOptions = [
        { label: "Todos los Tickets", action: () => { setFilter("all"); navigate("/dashboard"); } },
        { label: "Tickets asignados", action: () => { setFilter("assigned"); navigate("/dashboard"); } },
        { label: "Usuarios", action: () => { navigate("/usuarios"); } },
        { label: "Clientes", action: () => { navigate("/clientes"); } },
        { label: "Sistemas", action: () => { navigate("/sistemas"); } },
    ];
    const clienteOptions = [
        { label: "Tickets", action: () => { setFilter("all"); navigate("/dashboard"); } }
    ];

    const options = user?.user.rol === "admin" ? adminOptions : clienteOptions;

    const routeMap = {
        "Todos los Tickets": "/dashboard",
        "Tickets asignados": "/dashboard",
        "Usuarios": "/usuarios",
        "Clientes": "/clientes",
        "Sistemas": "/sistemas",
        "Tickets": "/dashboard"
    };

    return (
        <>
            <aside className={`
                fixed top-0 left-0 h-full w-64 z-50
                bg-white shadow-md p-4
                flex flex-col justify-between
                transition-transform duration-300
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#2e5d6b]">SICORP</span>
                    <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
                        <CloseIcon />
                    </button>
                </div>

                {/* Menú */}
                <ul className="mt-10 space-y-2">
                    {options.map((opt, idx) => {
                        let isActive = false;
                        if (opt.label === "Todos los Tickets") {
                            isActive = location.pathname === "/dashboard" && filter === "all";
                        } else if (opt.label === "Tickets asignados") {
                            isActive = location.pathname === "/dashboard" && filter === "assigned";
                        } else {
                            isActive = location.pathname === routeMap[opt.label];
                        }

                        return (
                            <li
                                key={idx}
                                onClick={() => {
                                    opt.action();
                                }}
                                className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium
                        ${isActive
                                        ? "bg-[#A8E6CF] text-[#2e5d6b]"
                                        : "hover:bg-[#A8E6CF] hover:text-[#2e5d6b] text-gray-700"
                                    }`}
                            >
                                {opt.label}
                            </li>
                        );
                    })}
                </ul>

                <button
                    onClick={handleLogout}
                    className="mt-4 w-full py-2 rounded-md text-sm font-semibold"
                    style={{
                        backgroundColor: '#FFBABA',
                        color: '#B22222',
                    }}
                >
                    Cerrar sesión
                </button>
            </aside>
        </>
    );
};

export default Sidebar;