import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import Swal from "sweetalert2"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {createPostValidate} from "@/utils/validation.ts";

import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import FileUploader from "@/components/FileUploader.tsx";
import uploadWidget from "@/utils/uploadWidget.ts";
import {editPost} from "@/services/postService.ts";
import {useNavigate} from "react-router-dom";
import { Input } from "./ui/input"
// import {Input} from "@/components/ui/input.tsx";


const EditForm = (props:any) => {
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof createPostValidate>>({
        resolver: zodResolver(createPostValidate),
        defaultValues: {
            caption: '',
            file: [],
            tags: '',
            // location: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof createPostValidate>) => {
        const request = {
            caption: values.caption || props.post.caption,
            postPic: "",
            tags: values.tags || props.post.tags
        }
        const file = values.file[0]
        try {
            if (values.file.length > 0) {
                request.postPic = await uploadWidget(file)
            } else {
                request.postPic = props.post.postPic
            }
            const response = await editPost(props.post.id, request)
            if (typeof response !== "string") {
                let timerInterval:any;
                await Swal.fire({
                    title: "Upload successfully!",
                    html: "I will close in <b></b> milliseconds.",
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        // @ts-expect-error
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                            // @ts-expect-error
                            timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                })
                navigate(`/profile/${props.post.postedBy.username}`)
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response,
                    footer: '<a href="https://stackoverflow.com/">Why do I have this issue?</a>'
                });
            }
        } catch (error:any) {
            console.log(error)
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
                footer: '<a href="https://stackoverflow.com/">Why do I have this issue?</a>'
            });
        }
    }

    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-9 w-full max-w-5xl">
                <FormField
                    control={form.control}
                    name="caption"
                    defaultValue={props.post?.caption}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="text-white">Caption</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="shad-textarea custom-scrollbar"/>
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage className="shad-form_message"/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="text-white">Add Photos</FormLabel>
                            <FormControl>
                                <FileUploader fielChange={field.onChange} value={props.post?.postPic} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {/*<FormField*/}
                {/*    control={form.control}*/}
                {/*    name="location"*/}
                {/*    render={({field}) => (*/}
                {/*        <FormItem>*/}
                {/*            <FormLabel className="shad-form_label">Add Location</FormLabel>*/}
                {/*            <FormControl>*/}
                {/*                <Input type="text" className="shad-input" {...field} />*/}
                {/*            </FormControl>*/}
                {/*            <FormMessage className="shad-form_message"/>*/}
                {/*        </FormItem>*/}
                {/*    )}*/}
                {/*/>*/}
                <FormField
                    control={form.control}
                    name="tags"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Add Tags (seperated by comma " , ")</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input"
                                       placeholder="Happy, Intersted, Sad, ...." {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message"/>
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap">Upload post</Button>
                </div>
            </form>


        </Form>

    );
};

export default EditForm;