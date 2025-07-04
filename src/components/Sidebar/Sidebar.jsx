import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';

const Sidebar = ({ setFilter, isMenuOpen, toggleMenu, filter }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);

    const adminOptions = [
        { label: "Todos los Tickets", icon: <AssignmentIcon fontSize="small" />, action: () => { setFilter("all"); navigate("/dashboard"); } },
        { label: "Tickets asignados", icon: <AssignmentIcon fontSize="small" />, action: () => { setFilter("assigned"); navigate("/dashboard"); } },
        { label: "Usuarios", icon: <GroupIcon fontSize="small" />, action: () => { navigate("/usuarios"); } },
        { label: "Clientes", icon: <BusinessIcon fontSize="small" />, action: () => { navigate("/clientes"); } },
        { label: "Sistemas", icon: <SettingsIcon fontSize="small" />, action: () => { navigate("/sistemas"); } },
        { label: "Horas Consumidas", icon: <AccessTimeIcon fontSize="small" />, action: () => { navigate("/horas-contrato"); } },
    ];
    const clienteOptions = [
        { label: "Tickets", icon: <AssignmentIcon fontSize="small" />, action: () => { setFilter("all"); navigate("/dashboard"); } },
        { label: "Horas Consumidas", icon: <AccessTimeIcon fontSize="small" />, action: () => { navigate("/horas-contrato"); } },
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
        <aside className={`
            fixed top-0 left-0 h-full w-50 z-40
            bg-[#fafafa] border-r border-gray-200 shadow-sm p-4
            flex flex-col
            transition-transform duration-300
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `} style={{ marginTop: 65 }}>
            <div className="flex justify-end items-center mb-6">
                <button onClick={toggleMenu} className="text-gray-500 focus:outline-none text-base">
                    ✕
                </button>
            </div>
            <div className="flex-1">
                <ul className="space-y-1 mt-2">
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
                                onClick={opt.action}
                                className={`
                                    flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md text-sm font-normal
                                    transition-colors
                                    ${isActive
                                        ? "bg-[#e0f2f1] text-[#2e5d6b]"
                                        : "hover:bg-[#e0f7fa] hover:text-[#2e5d6b] text-gray-700"
                                    }
                                `}
                            >
                                {opt.icon}
                                {opt.label}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;