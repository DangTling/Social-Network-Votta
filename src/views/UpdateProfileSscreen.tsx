import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate} from "react-router-dom";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Textarea} from "../components/ui/textarea"
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import Loader from "../components/Loader";
import {updateProfileValidate} from "../utils/validation.ts";
import ProfileUploader from "@/components/ProfileUploader.tsx";
import {useEffect, useState} from "react";
import uploadWidget from "@/utils/uploadWidget.ts";
import {checkSessionLogin, updateProfile} from "@/services/userService.ts";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";

const UpdateProfile = () => {
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect( ()=>{
        checkSessionLogin(dispatch)
            .then(response => {
                if (response.name) {
                    console.log("You have enough permission")
                }
            })
            .catch(error => {
                console.error('Error checking session login:', error);
            });
    }, [dispatch])

    const currentUser = useSelector((state:any)=>state.auth.login.currentUser);

    const form = useForm<z.infer<typeof updateProfileValidate>>({
        resolver: zodResolver(updateProfileValidate),
        defaultValues: {
            profilePic: [],
            username: "",
            password: "",
            bio: "",
        },
    });

    const handleUpdate = async (value: z.infer<typeof updateProfileValidate>) => {
        setIsLoadingUpdate(true)
        const request = {
            username: value.username,
            password: value.password,
            bio: value.bio,
            profilePic: "",
            name: currentUser.name,
            email: currentUser.email,
            dob: currentUser.dob,
        }
        const file = value.profilePic[0]
        try {
            request.profilePic = await uploadWidget(file)
            const response = await updateProfile(currentUser.id, request, dispatch, navigate)
            if (response) {
                toast.success("Update profile success")
            }
        } catch (err:any) {
            console.log(err)
            toast.error(err.message)
        }
        setIsLoadingUpdate(false)
    };

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="flex-start gap-3 justify-start w-full max-w-5xl">
                    <img
                        src="/assets/icons/edit.svg"
                        width={36}
                        height={36}
                        alt="edit"
                        className="invert-white"
                    />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleUpdate)}
                        className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
                        <FormField
                            control={form.control}
                            name="profilePic"
                            render={({ field }) => (
                                <FormItem className="flex">
                                    <FormControl>
                                        <ProfileUploader
                                            fieldChange={field.onChange}
                                            mediaUrl={"public/assets/images/defaultImage.png"}
                                        />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="shad-input"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="shad-input"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="shad-textarea custom-scrollbar"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4 items-center justify-end">
                            <Button
                                type="button"
                                className="shad-button_dark_4"
                                onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="shad-button_primary whitespace-nowrap"
                                disabled={isLoadingUpdate}>
                                {isLoadingUpdate && <Loader />}
                                Update Profile
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default UpdateProfile;