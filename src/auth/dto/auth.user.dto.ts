import { Plan } from "src/plan/enitity/plan.entity";

export class CreateUserDto {
    password?: string;
    name: string;
    url: string;
    planId: string;
}
export class SignInUserDto {
    url: string;
    password: string;
}
export class ResponseSignInUser {
    user_id: string;
    page_id: string | null;
    token: string;
    plan: Plan;
}
