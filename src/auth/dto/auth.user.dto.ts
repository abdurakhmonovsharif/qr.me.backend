export class CreateUserDto {
    email: string;
    password?: string;
    name: string;
    url: string;
    last_online: string;
    planId: string;
}
export class SignInUserDto {
    url: string;
    password: string;
}