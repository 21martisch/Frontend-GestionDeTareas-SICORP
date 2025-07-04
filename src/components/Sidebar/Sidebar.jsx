import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Assignment, Group, Business, Settings, AccessTime, HourglassBottom } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';

const Sidebar = ({ setFilter, isMenuOpen, toggleMenu, filter }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);

    const adminOptions = [
        { label: "Todos los Tickets", icon: <Assignment fontSize="small" />, action: () => { setFilter("all"); navigate("/dashboard"); } },
        { label: "Tickets asignados", icon: <Assignment fontSize="small" />, action: () => { setFilter("assigned"); navigate("/dashboard"); } },
        { label: "Historial Tickets", icon: <AccessTime fontSize="small" />, action: () => { navigate("/historial"); } },
        { label: "Usuarios", icon: <Group fontSize="small" />, action: () => { navigate("/usuarios"); } },
        { label: "Clientes", icon: <Business fontSize="small" />, action: () => { navigate("/clientes"); } },
        { label: "Sistemas", icon: <Settings fontSize="small" />, action: () => { navigate("/sistemas"); } },
        { label: "Horas Consumidas", icon: <HourglassBottom fontSize="small" />, action: () => { navigate("/horas-contrato"); } },
    ];
    const clienteOptions = [
        { label: "Tickets", icon: <Assignment fontSize="small" />, action: () => { setFilter("all"); navigate("/dashboard"); } },
        { label: "Horas Consumidas", icon: <HourglassBottom fontSize="small" />, action: () => { navigate("/horas-contrato"); } },
        { label: "Historial Tickets", icon: <AccessTime fontSize="small" />, action: () => { navigate("/historial"); } },
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
            fixed left-0 z-40
            bg-[#fafafa] border-r border-gray-200 shadow-sm p-4
            flex flex-col
            transition-transform duration-300
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `} style={{
            top: 65,
            height: 'calc(100vh - 65px)',
            width: '210px', 
        }}>
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