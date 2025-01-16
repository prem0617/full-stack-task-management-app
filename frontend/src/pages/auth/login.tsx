import { LunchDining } from "@mui/icons-material";
import { Button, Card, CircularProgress, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router";

interface LoginUser {
  username: string;
  password: string;
}

const LoginPage = () => {
  // const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<LoginUser>();

  const { mutate: userLogin, isPending } = useMutation({
    mutationFn: async ({ username, password }: LoginUser) => {
      try {
        const response = await axios.post(
          "https://full-stack-task-management-app-zlja.onrender.com/auth/login",
          { username, password },
          { withCredentials: true }
        );

        if (response.data.error) {
          response.data.error;
          throw new Error(response.data.error);
        }
        response;
        return response.data;
      } catch (error: any) {
        error.response.data.error;
        throw new Error(error.response.data.error);
      }
    },
    onSuccess: (data) => {
      const token = data.token;
      token;
      localStorage.setItem("foodApp", token);
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      //    (error.message);
      toast.error(error.message);
    },
  });

  const LoginUser: SubmitHandler<LoginUser> = (data) => {
    userLogin(data);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card
        variant="outlined"
        className="py-10 px-20 flex flex-col justify items-center gap-5"
      >
        <LunchDining className="text-blue-500" fontSize="large" />

        <h1 className="text-2xl font-semibold">Login to FoodExpress</h1>
        <form
          action=""
          className="space-y-4 w-full"
          onSubmit={handleSubmit(LoginUser)}
        >
          <div className="flex items-center">
            <TextField
              id="outlined-basic"
              label="Username"
              className="w-full"
              variant="outlined"
              {...register("username")}
            />
          </div>
          <div className="flex items-center">
            <TextField
              id="outlined-basic"
              label="Password"
              type="password"
              variant="outlined"
              className="w-full"
              {...register("password")}
            />
          </div>
          <div className="w-full">
            {isPending ? (
              <Button
                type="submit"
                disabled
                variant="outlined"
                className="w-full gap-4"
              >
                <CircularProgress size={20} /> Loading
              </Button>
            ) : (
              <Button type="submit" variant="outlined" className="w-full">
                Login
              </Button>
            )}
          </div>
          <p className="text-gray-500 text-sm w-full">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-500">
              Sign up
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
