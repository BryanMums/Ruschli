export class TaskType {
    pk: number
    name: Text
    default_title: Text
    default_description: Text
    default_room: any[]
    default_resident: any[]
    default_receiver_user: any[]
    default_receiver_group: any[]
    default_copyreceiver_user: any[]
    default_copyreceiver_group: any[]
    default_time: any
    default_need_someone: Boolean
    change_copyreceiver_group: Boolean
    change_copyreceiver_user: Boolean
    change_description: Boolean
    change_need_someone: Boolean
    change_receiver_group: Boolean
    change_receiver_user: Boolean
    change_resident: Boolean
    change_room: Boolean
    change_time: Boolean
    change_title: Boolean
}
