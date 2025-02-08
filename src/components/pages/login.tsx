import { useState } from "react";
import { loginUser } from "../../lib/Appwrite";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const res = loginUser(email, password);
    res
      .then((res: any) => {
        if (res === "HC") {
          alert("This email is used by HC Auth. Please login with HC Auth.");
        } else {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Invalid email or password");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full grow">
      <div className="flex flex-col items-center justify-center w-2/3 xl:w-1/3 lg:w-1/3 h-1/2">
        <form
          className="flex flex-col items-center justify-center w-full h-full gap-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-xl text-[--primaryText]">Login</h1>
          <input
            className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] border-0 focus-visible:outline-none rounded-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full h-10 p-2 text-[--primaryText] bg-[--secondary] border-0 focus-visible:outline-none rounded-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600">{error}</p>}
          <Link to="/register" className="text-[--accentText]">
            New user?
          </Link>
          <button
            className="w-2/3 h-10 p-2 text-[--primaryText] bg-gradient-to-r from-[--fourthly] via-[--primary] to-[--fourthly]"
            type="submit"
          >
            Login
          </button>
          <hr className="w-full mt-4 mb-4" />
          <Link
            to={(import.meta as any).env.VITE_HC_AUTH_ENDPOINT}
            className="flex items-center justify-center w-1/3 h-12 text-[--primaryText] border-2 rounded-md border-[--primary] bg-[--secondary]"
          >
            HC Auth
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
