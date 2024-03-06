import { Contact } from "src/contact/entity/contact.entity";
import { SectionDto } from "src/sections/dto/section.dto";

export class CreatePageDto {
    site_link: string;
    site_name: string;
    logo: string;
    description: string;
    qr_code: string;
    view_count: number;
    start_date: string;
    end_date: string;
    password: string;
    type: string;
    themeId: string;
    userId: string;
    sections: SectionDto[];
    contact: Contact
}
