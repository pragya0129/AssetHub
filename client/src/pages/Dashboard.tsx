import {
  useAuth,
} from "../context/AuthContext";


const Dashboard = () => {

  const {
    user,

    logout,
  } = useAuth();


  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-100
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-xl
          rounded-3xl
          bg-white
          p-10
          shadow-sm
        "
      >

        <p
          className="
            font-semibold
            text-blue-600
          "
        >
          AssetFlow
        </p>


        <h1
          className="
            mt-3
            text-4xl
            font-bold
            text-slate-950
          "
        >
          Welcome,
          {" "}
          {
            user?.name
          }
        </h1>


        <p
          className="
            mt-4
            text-slate-500
          "
        >
          Your role:
          {" "}

          <strong>
            {
              user?.role
            }
          </strong>
        </p>


        <button
          onClick={
            logout
          }

          className="
            mt-8
            rounded-xl
            bg-slate-900
            px-5
            py-3
            font-semibold
            text-white
          "
        >
          Log out
        </button>

      </div>

    </main>
  );
};


export default Dashboard;