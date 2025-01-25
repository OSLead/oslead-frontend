import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React, { useState, ChangeEvent,useEffect, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCookie } from "cookies-next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [adminLoginSuccess, setAdminLoginSuccess] = useState(false); // Track login success
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://oslead-backend.vercel.app/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        }
      );

      // Check response status
      if (response.ok) {
        const result = await response.json();
        setAdminLoginSuccess(true);
        setCookie("user-data", JSON.stringify(result), { maxAge: 60 * 60 * 24 }); // 1 day expiry
        toast.success("Login successful");
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred while logging in.");
    }
  };

  useEffect(() => {
      if (adminLoginSuccess) {
        router.push("/admin/dashboard/view/pa");
      }
    }, [adminLoginSuccess]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin}>
            <div className="flex flex-col gap-6">
              {/* Username Field */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username" // Ensure this matches handleChange logic
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password" // Ensure this matches handleChange logic
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </CardContent>
      </Card>
    </div>
  );
}
