"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  github_repo_link: z.string(),
  assignedProjectAdmin: z.string(),
});

export default function AddProject() {
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState(["self"]); // Initialize admins as a state

  useEffect(() => {
    let isMounted = true;
    const router = useRouter()
    const token = getCookie("user-data");
    if(!token) {
      router.push('/admin');
    };
    interface Maintainer {
      username: string;
    }
    const fetchAdmins = async () => {
      try {
        const response = await fetch(
          "https://oslead-backend.vercel.app/api/maintainer/get-all-maintainers?fetch=all",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: `${JSON.parse(token as string).token}`,
            }),
          }
        );
        if (response.ok && isMounted) {
          const data = await response.json();
          setAdmins((prevAdmins) => [
            ...prevAdmins,
            ...data.maintainers.map((item: Maintainer) => item.username),
          ]);
        }
      } catch (error) {
        console.error("Error fetching project admins", error);
        toast.error("Failed to fetch project admins.");
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter((admin) =>
    admin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const token = getCookie("user-data");
      const data = { ...values, token: JSON.parse(token as string).token };
      const submitProjectFrm = async (data: object) => {
        try {
          const response = await fetch(
            "https://oslead-backend.vercel.app/api/projects/create-project-by-admin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            toast.error("Failed to submit");
          }

          const responseData = await response.json();

          toast.success("Project submitted successfully!");
        } catch (error) {
          console.error("API Error:", error);
          toast.error("Failed to submit the form. Please try again.");
        }
      };

      submitProjectFrm(data);
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="github_repo_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Repo Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter GitHub Repo Link"
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedProjectAdmin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Project Admin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project Admin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Add Search Input here */}
                    <input
                      type="text"
                      placeholder="Search Admin"
                      value={searchTerm}
                      style={{ backgroundColor: "white" }}
                      onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                      className="p-1 w-full border rounded"
                    />
                    {/* Display filtered admins */}
                    {filteredAdmins.length > 0 ? (
                      filteredAdmins.map((admin, index) => (
                        <SelectItem key={`${admin}-${index}`} value={admin}>
                          {admin}
                        </SelectItem>
                      ))
                    ) : (
                      <p className="p-2">No matching results</p>
                    )}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
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
    </div>
  );
}
