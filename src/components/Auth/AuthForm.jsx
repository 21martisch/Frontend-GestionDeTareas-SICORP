import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Input, Card } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";

const AuthForm = ({ type }) => {
  const isLogin = type === "login";
  const navigate = useNavigate();

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

        if (response.data) {
          if (isLogin) {
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate("/dashboard");
          } else {
            navigate("/login");
          }
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-300 to-purple-700">
      <Card className="w-96 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-5">
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
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <Input
              type="password"
              label="Contraseña"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            fullWidth
            className="bg-purple-600 hover:bg-purple-700 transition-all duration-200"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Cargando..." : isLogin ? "Ingresar" : "Registrarse"}
          </Button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <span
            className="text-purple-600 cursor-pointer hover:underline"
            onClick={() => navigate(isLogin ? "/register" : "/login")}
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </span>
        </p>
      </Card>
    </div>
  );
};

export default AuthForm;