import { Contact } from "src/contact/entity/contact.entity";
import { Link } from "src/link/entity/link.entity";
import { SectionDto } from "src/sections/dto/section.dto";
import { Theme } from "src/themes/entity/theme.entity";

export class CreatePageDto {
    size: string;
    max_view_count: number;
    view_count: number;
    start_date: string;
    max_edit_count: number;
    end_date: string;
    password: string;
    type: string;
    themeId: string;
    edited_count: number;
    userId: string;
    password_view: string;
    password_edit: string;
    comment: string;
    sections: SectionDto[];
    contact: Contact;
    links: Link[];
}
export class UserPage {
    sections: SectionDto[];
    contact: Contact;
    links: Link[];
    theme: Theme;
    url:string
    type:string;
    id:string
    has_password?:boolean
}
// {
//     "site_link": "https://example.com",
//     "site_name": "Example Site",
//     "logo": "https://example.com/logo.png",
//     "description": "This is an example site description.",
//     "qr_code": "https://example.com/qr-code.png",
//     "view_count": 0,
//     "start_date": "2024-03-09",
//     "end_date": "2024-03-31",
//     "password": "examplePassword",
//     "type": "site",
//     "themeId": "e4f4fad8-2139-4f44-bf41-42473ca546c6",
//     "userId": "793e2c69-0a69-47b5-bd2f-843213f07d01",
//     "sections": [
//         {
//             "type": "sliders",
//             "imageURL": "https://example.com/section-image.png",
//             "title": "Section Title",
//             "content": "Section Content",
//             "sliders": [
//                 {
//                     "imageURL": "https://example.com/slider-image1.png",
//                     "title": "Slider 1 Title"
//                 },
//                 {
//                     "imageURL": "https://example.com/slider-image2.png",
//                     "title": "Slider 2 Title"
//                 }
//             ]
//         }
//     ],
//     "contact": {
//         "fullname": "John Doe",
//         "email": "john@example.com",
//         "address": "123 Example St, City",
//         "map": "https://example.com/map.png",
//         "phoneNumber": "1234567890"
//     },
//     "links": [
//         {
//             "type": "instagram",
//             "link": "https://www.instagram.com/abdurakhmonov.fd/"
//         },
//         {
//             "type": "linkedin",
//             "link": "https://example.com/link2"
//         }
//     ]
// }
