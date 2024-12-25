import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Swal from "sweetalert2";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createPostValidate } from "@/utils/validation.ts";

import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import FileUploader from "@/components/FileUploader.tsx";
import uploadWidget from "@/utils/uploadWidget.ts";
import { uploadPost } from "@/services/postService.ts";
import { useNavigate } from "react-router-dom";
import { createCommunity, uploadPostInCommunity } from "@/services/communityService";
import { Input } from "./ui/input";
// import {Input} from "@/components/ui/input.tsx";

const PostForm = (props: any) => {
  const navigate = useNavigate();
  const communityId = props.communityId;

  const form = useForm<z.infer<typeof createPostValidate>>({
    resolver: zodResolver(createPostValidate),
    defaultValues: {
      caption: "",
      file: [],
      // location: '',
      tags: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createPostValidate>) => {
    const request = props.type === "community" ? {
        description: values.caption,
        profilePic: "",
        name: values.tags
    } : {
      caption: values.caption,
      postPic: "",
      tags: values.tags,
    };
    
    const file = values.file[0];
    try {
      request.postPic = await uploadWidget(file);
      if (communityId === "") {
        const response = props.type === "community" ? await createCommunity(request) : await uploadPost(request);
        if (response) {
          let timerInterval: any;
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
            },
          });
          navigate("/profile");
        }
      } else {
        const response = await uploadPostInCommunity(communityId, request);
        if (response) {
          let timerInterval: any;
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
            },
          });
          navigate(`/community/${communityId}`);
        }
      }
    } catch (error: any) {
      console.log(error);
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        footer:
          '<a href="https://stackoverflow.com/">Why do I have this issue?</a>',
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">{props.type === "community" ? "Description" : "Caption"}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="shad-textarea custom-scrollbar"
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">{props.type === "community" ? "Background Image" : "Add Photos"}</FormLabel>
              <FormControl>
                <FileUploader fielChange={field.onChange} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                {props.type === "community" ? "Name of community" : "Add Tags (seperated by comma ' , ')"}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder={props.type === "community" ? "" : "Happy, Intersted, Sad, ...."}
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            Upload post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
