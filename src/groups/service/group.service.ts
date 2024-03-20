import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groups } from '../entity/group.entity';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Groups)
        private groupsRepository: Repository<Groups>,
    ) { }

    async findAll(): Promise<Groups[]> {
        return this.groupsRepository.find({ order: { created_at: "ASC" } });
    }
    async findOne(id: string): Promise<Groups> {
        return this.groupsRepository.findOne({ where: { id } });
    }

    async create(groupData: Partial<Groups>): Promise<Groups> {
        const group = this.groupsRepository.create(groupData);
        return this.groupsRepository.save(group);
    }

    async update(id: string, groupData: Partial<Groups>): Promise<Groups> {
        await this.groupsRepository.update(id, groupData);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.groupsRepository.delete(id);
    }
}
