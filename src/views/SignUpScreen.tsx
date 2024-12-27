import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import {Calendar as CalendarIcon} from "lucide-react"
import {Input} from "@/components/ui/input"
import {signUpValidate} from "@/utils/validation.ts";
import Loader from "@/components/Loader.tsx";
import {Link, useNavigate} from "react-router-dom";
// import Swal from "sweetalert2";
import {cn} from "@/utils/utils.ts";
import {IconLeft, IconRight} from "react-day-picker";
import {registerUser} from "@/services/userService.ts";
import {useDispatch} from "react-redux";

import {useState} from "react";
import {toast} from "react-toastify";




const SignUpScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof signUpValidate>>({
        resolver: zodResolver(signUpValidate),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
            dob: new Date(),
        },
    })

    const onSubmit = async (values: z.infer<typeof signUpValidate>) => {
        setIsLoading(true);
        const response = await registerUser(values, dispatch, navigate);
        if (typeof response === "string") {
            setTimeout(()=>setIsLoading(false), 500);
            toast.error(response);
        } else {
            toast.success("Register successfully! Please sign in")
        }

    }
    return (
        <Form {...form}>
            <div className="sm:w-420 flex-col flex-center">
                <img src="/assets/images/logo-no-background.svg" alt="logo"/>
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Create a new account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    To use votta, please fill this form!
                </p>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="text-black flex flex-col gap-1 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-white">Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage className="text-red"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-white">Full name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage className="text-red"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem className="flex w-full justify-between">
                                <FormLabel className="text-white flex items-center">Date of birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal bg-white",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-light-1 bg-dark-4" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            components={{IconLeft, IconRight}}
                                            className="text-white"
                                        />
                                    </PopoverContent>
                                </Popover>

                                <FormMessage className="text-red" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormDescription>
                                </FormDescription>
                                <FormMessage className="text-red"/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-white">Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your password, please" type="password" {...field} />
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage className="text-red"/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isLoading ? (
                            <div className="flex-center gap-2"><Loader/> Loading...</div>
                        ) : (
                            "Register"
                        )}
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Sign in</Link>
                    </p>
                </form>

            </div>
        </Form>

    );
};

export default SignUpScreen;