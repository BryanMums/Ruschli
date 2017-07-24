import { Component, Input } from '@angular/core'
import { TaskDate } from '../../_models/index'

@Component({
    selector: 'task-card',
    moduleId: module.id,
    templateUrl: 'task_card.component.html'
})

export class TaskCardComponent {
    @Input() taskDate: TaskDate

    constructor(){}
}
