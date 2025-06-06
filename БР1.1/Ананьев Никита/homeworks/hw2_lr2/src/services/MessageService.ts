import { MessageDto } from "../dtos/MessageDtos"
import { Message } from "../models/MessageModel"
import { MessageMapper } from "../mappers/MessageMapper"
import { BaseService } from "./BaseService"
import { Repository, FindManyOptions } from "typeorm"
import { CreationError } from "../errors/CreationError"


export interface IMessageService {
    send(messageData: MessageDto): Promise<MessageDto>
    findAll(options?: FindManyOptions<Message>): Promise<MessageDto[]>
    findById(id: number, relations: string[]): Promise<MessageDto | null>
}


export class MessageService extends BaseService<Message, MessageDto> implements IMessageService {
    constructor(protected readonly repository: Repository<Message>) {
        super(repository);
    }

    protected toDto(model: Message): MessageDto {
        return MessageMapper.toDto(model)
    }

    async send(messageData: MessageDto): Promise<MessageDto> {
        let message: Message = MessageMapper.toModel(messageData)
        try {
            message = await this.repository.save(message)
            return this.toDto(message)
            // TODO: implement notifier
        } catch (error: any) {
            console.log(error)
            throw new CreationError("Message send failed")
        }
    }
}
