"use client";

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn} from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {}

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(52, "Password must be less than 52 characters"),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const Signin: React.FC<Props> = (props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    const res: any = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (res.error) {
      return toast.error(res.error);
    } else {
      return router.push("/");
    }
  };

  return (
    <>
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className="m-auto max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
            Sign in
          </h2>
          <form
            className="flex max-w-md flex-col gap-4 m-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Your email" />
              </div>
              <TextInput
                color={errors.email?.message ? "failure" : ""}
                helperText={
                  errors.email?.message && (
                    <span className="font-medium">{errors.email.message}</span>
                  )
                }
                id="email1"
                placeholder="name@flowbite.com"
                type="email"
                {...register("email")}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput
                color={errors.password?.message ? "failure" : ""}
                helperText={
                  errors.password?.message && (
                    <span className="font-medium">
                      {errors.password.message}
                    </span>
                  )
                }
                id="password"
                type="password"
                {...register("password")}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Signin;
