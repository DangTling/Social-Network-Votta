import { findUserById } from "@/services/userService";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file:File) => URL.createObjectURL(file);

export const convertTime = (isoTime:any) => {
  const date = new Date(isoTime)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export const convertHour = (isoTime:any) => {
  const date = new Date(isoTime)
  const options = {
    hour: 'numeric',
    minute: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export const timeAgo = (isoTime:any) => {
  const date = new Date(isoTime)
  const today = new Date()
  const diff = (today.getTime() - date.getTime())/1000

  if (diff < 60) {
    return 'just now'
  }

  if (diff < 3600) {
    return Math.floor(diff/60) + ' minutes ago'
  }

  if (diff < 86400) {
    return Math.floor(diff/3600) + ' hours ago'
  }

  if (diff < 604800) {
    return Math.floor(diff/86400) + ' days ago'
  }

  if (diff < 2592000) {
    return Math.floor(diff/604800) + ' weeks ago'
  }

  if (diff < 31536000) {
    return Math.floor(diff/2592000) + ' months ago'
  }

  return Math.floor(diff/31536000) + ' years ago'

}
