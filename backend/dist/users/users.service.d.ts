import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserStatus } from '../common/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { QrService } from '../qr/qr.service';
export declare class UsersService {
    private readonly usersRepository;
    private readonly qrService;
    constructor(usersRepository: Repository<User>, qrService: QrService);
    create(dto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByWingAccount(wingAccount: string): Promise<User | null>;
    getUserQr(id: string): Promise<import("../entities/qr-code.entity").QrCode | null>;
    setStatus(id: string, status: UserStatus): Promise<User>;
    regenerateQr(id: string): Promise<{
        qr: import("../entities/qr-code.entity").QrCode;
    }>;
}
