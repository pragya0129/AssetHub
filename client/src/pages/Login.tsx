import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Box,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import axios from "axios";

import api from "../api/api";

import {
  useAuth,
} from "../context/AuthContext";


const Login = () => {

  const navigate =
    useNavigate();


  const {
    login,
  } = useAuth();


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const handleSubmit =
    async (
      event:
        React.FormEvent,
    ) => {

      event.preventDefault();


      setError("");


      setLoading(true);


      try {

        const response =
          await api.post(
            "/auth/login",

            {
              email,

              password,
            },
          );


        const {
          user,

          token,
        } =
          response.data.data;


        login(
          user,

          token,
        );


        navigate(
          "/dashboard",
        );

      } catch (error) {

        if (
          axios.isAxiosError(
            error,
          )
        ) {

          setError(
            error.response
              ?.data
              ?.message

            ||

            "Unable to log in",
          );

        } else {

          setError(
            "Something went wrong",
          );
        }

      } finally {

        setLoading(
          false,
        );
      }
    };


  return (
    <main
      className="
        grid
        min-h-screen
        lg:grid-cols-2
      "
    >

      {/* LEFT PANEL */}

      <section
        className="
          hidden
          flex-col
          justify-between
          overflow-hidden
          bg-slate-950
          p-12
          text-white
          lg:flex
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-blue-600
            "
          >

            <Box
              size={25}
            />

          </div>


          <div>

            <h1
              className="
                text-2xl
                font-bold
              "
            >
              AssetFlow
            </h1>


            <p
              className="
                text-xs
                text-slate-400
              "
            >
              Enterprise Asset Management
            </p>

          </div>

        </div>


        <div
          className="
            max-w-xl
          "
        >

          <p
            className="
              mb-5
              text-sm
              font-semibold
              uppercase
              tracking-[0.2em]
              text-blue-400
            "
          >
            One intelligent workspace
          </p>


          <h2
            className="
              text-5xl
              font-bold
              leading-tight
            "
          >
            Every asset.
            <br />

            Every employee.
            <br />

            <span
              className="
                text-blue-400
              "
            >
              One clear view.
            </span>
          </h2>


          <p
            className="
              mt-7
              max-w-lg
              text-lg
              leading-8
              text-slate-400
            "
          >
            Track ownership,
            availability,
            condition and asset
            movement from one
            centralized platform.
          </p>

        </div>


        <p
          className="
            text-sm
            text-slate-500
          "
        >
          © 2026 AssetFlow
        </p>

      </section>


      {/* LOGIN FORM */}

      <section
        className="
          flex
          items-center
          justify-center
          bg-slate-50
          px-6
          py-12
        "
      >

        <div
          className="
            w-full
            max-w-md
          "
        >

          <div
            className="
              mb-9
              lg:hidden
            "
          >

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900
              "
            >
              AssetFlow
            </h1>

          </div>


          <h2
            className="
              text-4xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            Welcome back
          </h2>


          <p
            className="
              mt-3
              text-slate-500
            "
          >
            Enter your credentials
            to access your workspace.
          </p>


          <form
            onSubmit={
              handleSubmit
            }

            className="
              mt-9
              space-y-5
            "
          >

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Email address
              </label>


              <div
                className="
                  relative
                "
              >

                <Mail
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "

                  size={19}
                />


                <input
                  type="email"

                  value={
                    email
                  }

                  onChange={
                    (
                      event,
                    ) =>
                      setEmail(
                        event
                          .target
                          .value,
                      )
                  }

                  placeholder="
                    name@company.com
                  "

                  required

                  className="
                    h-13
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    pl-12
                    pr-4
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>

            </div>


            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Password
              </label>


              <div
                className="
                  relative
                "
              >

                <LockKeyhole
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "

                  size={19}
                />


                <input
                  type={
                    showPassword

                      ? "text"

                      : "password"
                  }

                  value={
                    password
                  }

                  onChange={
                    (
                      event,
                    ) =>
                      setPassword(
                        event
                          .target
                          .value,
                      )
                  }

                  placeholder="
                    Enter password
                  "

                  required

                  className="
                    h-13
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    pl-12
                    pr-12
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />


                <button
                  type="button"

                  onClick={
                    () =>
                      setShowPassword(
                        !showPassword,
                      )
                  }

                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >

                  {
                    showPassword

                      ? (
                        <EyeOff
                          size={19}
                        />
                      )

                      : (
                        <Eye
                          size={19}
                        />
                      )
                  }

                </button>

              </div>

            </div>


            {
              error

              &&

              (
                <div
                  className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                  "
                >
                  {error}
                </div>
              )
            }


            <button
              type="submit"

              disabled={
                loading
              }

              className="
                flex
                h-13
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {
                loading

                  ? "Signing in..."

                  : "Sign in"
              }


              {
                !loading

                &&

                (
                  <ArrowRight
                    size={19}
                  />
                )
              }

            </button>

          </form>


          <p
            className="
              mt-7
              text-center
              text-sm
              text-slate-500
            "
          >
            New to AssetFlow?{" "}

            <Link
              to="/signup"

              className="
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              Create an account
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
};


export default Login;