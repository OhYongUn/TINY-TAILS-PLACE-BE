import {flatten, Injectable, Logger} from '@nestjs/common';
import {PrismaService} from "@app/common/prisma/prisma.service";
import {Admin, Prisma} from "@prisma/client";
import {UserNotFoundException} from "@app/common/auth/authException/authExceptions";
import {AdminResponseDto, AdminSearchDto, PaginatedAdminResponseDto} from "@apps/rest/admin/dto/admion-search.dto";

@Injectable()
export class AdminUsersService {
    private readonly logger = new Logger(AdminUsersService.name);

    constructor(private readonly prisma: PrismaService) {
    }


    async getAdmin(filter: Prisma.AdminWhereUniqueInput): Promise<Admin> {
        this.logger.log(`사용자 검색 시도: ${JSON.stringify(filter)}`);
        const admin = await this.prisma.admin.findUnique({
            where: filter,
            include: {
                department: true,
                AdminRole: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!admin) {
            this.logger.warn(`사용자를 찾을 수 없음: ${JSON.stringify(filter)}`);
            throw new UserNotFoundException();
        }
        return admin;


    }

    async findAll(searchDto: AdminSearchDto): Promise<PaginatedAdminResponseDto> {
        const {department, isActive, search, sortBy, sortOrder, page, limit} = searchDto;

        const where: Prisma.AdminWhereInput = {};
        if (department) {
            where.department = department;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (search) {
            where.OR = [
                {name: {contains: search, mode: 'insensitive'}},
                {email: {contains: search, mode: 'insensitive'}},
            ];
        }

        const [admins, total] = await Promise.all([
            this.prisma.admin.findMany({
                where,
                orderBy: {[sortBy]: sortOrder},
                skip: (page - 1) * limit,
                take: limit,
                include: {AdminRole: {include: {role: true}}},
            }),
            this.prisma.admin.count({where}),
        ]);
        const data: AdminResponseDto[] = admins.map(admin => ({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            department: admin.department,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            roles: admin.AdminRole.map(ar => ar.role.name),
        }));

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
