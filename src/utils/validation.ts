import {z} from "zod"

export const signInValidate = z.object({
    email: z.string().min(8, "Not define email address").email("Please enter a valid email address"),
    password: z.string().min(8, "The password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
})

export const signUpValidate = z.object({
    username: z.string().min(5, "The username must be at least 5 characters").max(20, "Your username is too long!"),
    name: z.string({required_error: "Please enter your real name."}),
    email: z.string().min(8, "Not define email address").email("Please enter a valid email address"),
    password: z.string().min(8, "The password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    dob: z.date({required_error: "Don't leave it empty"})
})

export const createCommunityValidate = z.object({
    description: z.string().min(0).max(3000, "Your caption is too long for other to attract this post"),
    profilePic: z.custom<File[]>(),
    // location: z.string().min(1, "This field is required to protect you").max(1000, "Maximum 1000 characters"),
    name: z.string(),
})

export const createPostValidate = z.object({
    caption: z.string().min(0).max(10000, "Your caption is too long for other to attract this post"),
    file: z.custom<File[]>(),
    // location: z.string().min(1, "This field is required to protect you").max(1000, "Maximum 1000 characters"),
    tags: z.string().min(0),
})

export const updateProfileValidate = z.object({
    username: z.string().min(5, "The username must be at least 5 characters").max(20, "Your username is too long!"),
    bio:z.string().min(0, "You shouldn't left it empty"),
    password: z.string().min(8, "The password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    profilePic: z.custom<File[]>(),
})