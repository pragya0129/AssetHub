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
  Building2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import axios from "axios";

import api from "../api/api";

import {
  useAuth,
} from "../context/AuthContext";


const Signup = () => {

  const navigate =
    useNavigate();


  const {
    login,
  } = useAuth();


  const [
    form,
    setForm,
  ] = useState({

    name: "",

    email: "",

    password: "",

    departmentId: "",

  });


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const updateField = (
    event:
      React.ChangeEvent<
        HTMLInputElement
        | HTMLSelectElement
      >,
  ) => {

    setForm({

      ...form,

      [
        event.target.name
      ]:
        event.target.value,

    });
  };


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
            "/auth/signup",

            {
              name:
                form.name,

              email:
                form.email,

              password:
                form.password,

              departmentId:
                form.departmentId

                  ? Number(
                      form.departmentId,
                    )

                  : null,
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

            "Unable to create account",
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
        lg:grid-cols-[0.85fr_1.15fr]
      "
    >

      <section
        className="
          hidden
          flex-col
          justify-between
          bg-blue-700
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
              bg-white/15
            "
          >

            <Box
              size={25}
            />

          </div>


          <h1
            className="
              text-2xl
              font-bold
            "
          >
            AssetFlow
          </h1>

        </div>


        <div>

          <h2
            className="
              text-5xl
              font-bold
              leading-tight
            "
          >
            Start managing
            <br />

            smarter today.
          </h2>


          <p
            className="
              mt-6
              max-w-md
              text-lg
              leading-8
              text-blue-100
            "
          >
            Join your organization
            and get a complete view
            of every asset assigned
            to you.
          </p>

        </div>


        <p
          className="
            text-sm
            text-blue-200
          "
        >
          Secure role-based access
        </p>

      </section>


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
            max-w-lg
          "
        >

          <h2
            className="
              text-4xl
              font-bold
              text-slate-950
            "
          >
            Create your account
          </h2>


          <p
            className="
              mt-3
              text-slate-500
            "
          >
            New accounts are created
            with Employee access.
          </p>


          <form
            onSubmit={
              handleSubmit
            }

            className="
              mt-8
              space-y-5
            "
          >

            <FormField
              label="Full name"

              icon={
                <UserRound
                  size={19}
                />
              }
            >

              <input
                name="name"

                value={
                  form.name
                }

                onChange={
                  updateField
                }

                placeholder="
                  Enter your full name
                "

                required

                className={
                  inputClass
                }
              />

            </FormField>


            <FormField
              label="Work email"

              icon={
                <Mail
                  size={19}
                />
              }
            >

              <input
                name="email"

                type="email"

                value={
                  form.email
                }

                onChange={
                  updateField
                }

                placeholder="
                  name@company.com
                "

                required

                className={
                  inputClass
                }
              />

            </FormField>


            <FormField
              label="Password"

              icon={
                <LockKeyhole
                  size={19}
                />
              }
            >

              <input
                name="password"

                type="password"

                value={
                  form.password
                }

                onChange={
                  updateField
                }

                placeholder="
                  Minimum 6 characters
                "

                minLength={6}

                required

                className={
                  inputClass
                }
              />

            </FormField>


            <FormField
              label="Department"

              icon={
                <Building2
                  size={19}
                />
              }
            >

              <select
                name="
                  departmentId
                "

                value={
                  form.departmentId
                }

                onChange={
                  updateField
                }

                className={
                  inputClass
                }
              >

                <option
                  value=""
                >
                  Select department
                </option>


                <option
                  value="1"
                >
                  Information Technology
                </option>


                <option
                  value="2"
                >
                  Human Resources
                </option>


                <option
                  value="3"
                >
                  Finance
                </option>


                <option
                  value="4"
                >
                  Operations
                </option>

              </select>

            </FormField>


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
                disabled:opacity-60
              "
            >

              {
                loading

                  ? "Creating account..."

                  : "Create account"
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
            Already have an account?{" "}

            <Link
              to="/login"

              className="
                font-semibold
                text-blue-600
              "
            >
              Sign in
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
};


const inputClass = `
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
`;


interface FormFieldProps {

  label:
    string;

  icon:
    React.ReactNode;

  children:
    React.ReactNode;
}


const FormField = ({
  label,

  icon,

  children,
}: FormFieldProps) => {

  return (
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
        {label}
      </label>


      <div
        className="
          relative
        "
      >

        <div
          className="
            absolute
            left-4
            top-1/2
            z-10
            -translate-y-1/2
            text-slate-400
          "
        >
          {icon}
        </div>


        {children}

      </div>

    </div>
  );
};


export default Signup;