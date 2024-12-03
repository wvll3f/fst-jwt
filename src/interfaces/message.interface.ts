import { User } from "./user.interface";

export interface IMessage {
    id: number; 
    senderId: string; 
    receiverId: string; 
    sender: User; 
    receiver: User; 
    text: string; 
    image: string; 
    createdAt: Date; 
    updatedAt: Date; 
  }

  export interface IMessageResponse {
    id: number; 
    senderId: string; 
    receiverId: string; 
    text: string; 
    image: string; 
    createdAt: Date; 
    updatedAt: Date; 
  }