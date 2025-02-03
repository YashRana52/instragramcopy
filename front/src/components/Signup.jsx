import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import store from "@/redux/store";

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth)
  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const SignupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate('/login')
        toast.success(res.data.success);
        setInput({
          username: "",
          email: "",
          password: "",
        });

      }
    } catch (error) {
      console.log(error);
      // Corrected error handling
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/")

    }
  }, [])

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={SignupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="flex flex-col items-center my-4">
          <img src="/instagram.png" alt="Instagram Logo" className="h-12 mb-3" />
          <p className="text-center text-gray-700 text-base font-medium">Connect with your friends and share your moments.</p>
        </div>
        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {
          loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>

          ) : (
            <Button type="submit">Signup</Button>

          )
        }

        <span className="text-center">Already have an account?<Link to='/login' className="text-blue-600">Login</Link></span>
      </form>
    </div>
  );
}

export default Signup;
