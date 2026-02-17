import { Request } from "express"


export type User = {
    id: number;
    username: string;
    admin: boolean;
    token?: string;
    disabled: boolean
    recommendations?: RecommendationType[],
    user?: User,
    favouriteRecommendations?: RecommendationType[],

}

export type Favourite = {
    userId: number;
    recommendationId: number;

}

export type Credentials = {
    username: string;
    password: string
}


export type NewNotification = {
    text: string,
    type: "error" | "success" | null
}

export interface RecommendationType {
    id: number,
    title: string,
    service: string,
    url: string | null,
    likes: number
    user?: User,
}



export interface Service {
    service: string,
    recommendations: number,
    likes: number
}

export interface CustomRequest extends Request {
  token?: string | null
  user?: User | null
}

export interface Comment {
    id: number
    comment: string
    userId: number
    recommendationId: number
}

export type AddFavourite = Omit<Favourite, "id">

export type AddRecommendation = Omit<RecommendationType, "id" | "likes" | "comments" | "user" >







