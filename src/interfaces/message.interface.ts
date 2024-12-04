import { User } from "./user.interface";

export interface IMessageRequest {
    senderId: string; 
    receiverId: string; 
    text: string; 
    image: string; 
  }

  export interface IMessageRequestResponse {
    id: number; 
    senderId: string; 
    receiverId: string; 
    text: string; 
    image: string; 
    createdAt: Date; 
    updatedAt: Date; 
  }

  export interface IsendMessage {
    senderId:string;
    receiverId:string;
  }