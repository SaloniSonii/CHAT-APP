import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up"); // "Sign up" or "Login"
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [step, setStep] = useState(1); // step 1: basic details, step 2: bio for signup

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currState === "Sign up" && step === 1) {
      // Move to bio step
      if (!fullName || !email || !password) return;
      setStep(2);
      return;
    }

    // Final submit payload
    const payload =
      currState === "Sign up"
        ? { fullName, email, password, bio }
        : { email, password };

    login(currState === "Sign up" ? "signup" : "login", payload);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

      {/* Left side logo */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />

      {/* Form */}
      <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
        </h2>

        {/* Full Name for Sign up step 1 */}
        {currState === "Sign up" && step === 1 && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
          />
        )}

        {/* Email & Password */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {/* Bio for Sign up step 2 */}
        {currState === "Sign up" && step === 2 && (
          <textarea
            rows={4}
            placeholder="Provide a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Sign up"
            ? step === 1
              ? "Next"
              : "Create Account"
            : "Login Now"}
        </button>

        {/* Terms checkbox */}
        {currState === "Sign up" && step === 2 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" required />
            <p>Agree to the terms of use & privacy policy</p>
          </div>
        )}

        {/* Switch between login and signup */}
        <div className="flex flex-col gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => { setCurrState("Login"); setStep(1); }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                onClick={() => { setCurrState("Sign up"); setStep(1); }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
