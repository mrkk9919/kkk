import { OrderStatus } from '../common/enums';
export declare class OrderStateMachine {
    canTransition(from: OrderStatus, to: OrderStatus): boolean;
    transition(from: OrderStatus, to: OrderStatus): OrderStatus;
}
