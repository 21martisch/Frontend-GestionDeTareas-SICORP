import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Input, Card } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import logoSicorp from "../../assets/sicorp-logo.png";
import { Visibility, VisibilityOff } from "@mui/icons-material"; 

const pastelBg = "linear-gradient(135deg, #A8E6CF 0%, #D0F0FD 50%, #D1C4E9 100%)";
const pastelBtn = "#A8E6CF";
const pastelBtnHover = "#D0F0FD";
const pastelText = "#2e5d6b";

const AuthForm = ({ type }) => {
  const isLogin = type === "login";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = yup.object({
    name: !isLogin
      ? yup
          .string()
          .required("El nombre es obligatorio")
          .min(3, "El nombre debe tener al menos 3 caracteres")
      : null,
    email: yup
      .string()
      .email("Debe ser un email válido")
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Debe ser un email válido con dominio .com")
      .required("El correo electrónico es obligatorio"),
    password: yup
      .string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .matches(/[0-9]/, "Debe contener al menos un número")
      .matches(/[\W]/, "Debe contener al menos un carácter especial"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setSubmitting(true);
      try {
        const endpoint = isLogin ? "/auth/login" : "/auth/register";
        const payload = isLogin
          ? { email: values.email, password: values.password }
          : { name: values.name, email: values.email, password: values.password };

        const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload);

        if (response.data && response.data.token) {
          if (isLogin) {
            const { token, ...user } = response.data;
            dispatch(login({ user, token }));
            navigate("/dashboard");
          } else {
            navigate("/login");
          }
        } else {
          setErrors({ submit: "Respuesta inesperada del servidor" });
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 400) {
            setErrors({ submit: "Correo electrónico o contraseña incorrectos" });
          } else {
            setErrors({ submit: "Error en la autenticación" });
          }
        } else {
          setErrors({ submit: "Error en la autenticación" });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ background: pastelBg }}
    >
      <Card
        className="w-full max-w-md p-8 rounded-2xl shadow-xl"
        style={{ background: "#fff", borderRadius: "2rem" }}
      >
        <img
          src={logoSicorp}
          alt="SICORP Logo"
          style={{ width: 110, margin: "0 auto 1.5rem auto", display: "block" }}
        />
        <h2
          className="text-center text-2xl font-semibold mb-5"
          style={{ color: pastelText }}
        >
          {isLogin ? "Iniciar Sesión" : "Registro"}
        </h2>

        {formik.errors.submit && (
          <p className="text-red-500 text-sm text-center mb-3">{formik.errors.submit}</p>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <Input
                type="text"
                label="Nombre"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                color="teal"
                style={{ background: "#F8FFFB" }}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
              )}
            </div>
          )}
          <div>
            <Input
              type="email"
              label="Correo Electrónico"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              color="teal"
              style={{ background: "#F8FFFB" }}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Contraseña"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              color="teal"
              style={{ background: "#F8FFFB" }}
              className="pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            fullWidth
            style={{
              background: pastelBtn,
              color: pastelText,
              fontWeight: "bold",
              marginTop: "1rem",
              transition: "background 0.2s",
            }}
            className="hover:bg-[#D0F0FD]"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Cargando..." : isLogin ? "Ingresar" : "Registrarse"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AuthForm;