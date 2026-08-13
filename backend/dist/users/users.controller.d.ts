import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        user: import("../entities/user.entity").User;
    }>;
    findAll(): Promise<{
        users: import("../entities/user.entity").User[];
    }>;
    findById(id: string): Promise<{
        user: import("../entities/user.entity").User;
    }>;
    getUserQr(id: string): Promise<{
        qr: import("../entities/qr-code.entity").QrCode | null;
    }>;
    regenerateQr(id: string): Promise<{
        qr: import("../entities/qr-code.entity").QrCode;
    }>;
}
