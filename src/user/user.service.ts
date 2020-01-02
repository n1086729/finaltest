import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto, UserUpdateDto } from './dto/user.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }
    // Get all
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    // Get one
    async findOne(id): Promise<User> {
        return this.userRepository.findOne(id);
    }
    // Create one
    async createOne(userCreateDto: UserCreateDto) {
        this.checkId(userCreateDto.userId);
        return await this.userRepository.save(userCreateDto);
    }
    // Update one
    async updateOne(id: number, userUpdateDto: UserUpdateDto) {
        return await this.userRepository.update(id, userUpdateDto);
    }
    // Delete one
    async deleteOne(id: number) {
        return await this.userRepository.delete(id);
    }
    checkId(id) {
        let tab = "ABCDEFGHJKLMNPQRSTUVXYWZIO"
        let A1 = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3);
        let A2 = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5);
        let Mx = new Array(9, 8, 7, 6, 5, 4, 3, 2, 1, 1);
        let sum = 0;
        let v;
        // 檢查英文字
        let i = tab.indexOf(id.charAt(0));
        if (i == -1) {
            throw new HttpException('第一個字要為英文字', HttpStatus.BAD_REQUEST);
        }
        sum = A1[i] + A2[i] * 9;
        for (i = 1; i < 10; i++) {
            v = parseInt(id.charAt(i));
            // 檢查第一個字是英文，其餘為數字
            if (isNaN(v)) {
                throw new HttpException('身分證2~10碼要為數字', HttpStatus.BAD_REQUEST);
            }
            sum = sum + v * Mx[i];
        }
        if (sum % 10 !== 0) {
            console.log("不合法");
            throw new HttpException('身分證不合法', HttpStatus.BAD_REQUEST);
        } else {
            console.log("合法");
        }
    }
}