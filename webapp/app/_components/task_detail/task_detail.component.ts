import { Component, OnInit, Input } from '@angular/core'
import { User, TaskDate } from '../../_models/index'
import { UserService, TaskService } from '../../_services/index'
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker'
import { Router, ActivatedRoute, Params } from '@angular/router'
import 'rxjs/add/operator/switchMap'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { ToasterService } from 'angular2-toaster'

@Component({
    selector: 'task-detail',
    moduleId: module.id,
    templateUrl: 'task_detail.component.html'
})

export class TaskDetailComponent implements OnInit {
    @Input() date: any
    @Input() taskDate: TaskDate
    canTakeInCharge = true
    public myForm: FormGroup

    constructor(
      private taskService: TaskService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb: FormBuilder,
      private toasterService: ToasterService
    ) { }

    ngOnInit() {
      // On récupère le résident selon l'id
      this.myForm = this._fb.group({
          text: ['', Validators.required]
        })
      // On récupère la tâche et la date
      this.route.params.subscribe(params => {
       this.date = params['date'];
       console.log(params['id'])
       this.taskService.getTaskDate(+params['id'])
       .subscribe((taskDate: TaskDate) => {
         this.taskDate = taskDate
         })
      })
    }

    // Méthode permettant d'ajouter un commentaire
    addComment(model: any, isValid: Boolean){
      if(isValid){
        // On prépare les données à envoyer
        let data = {}
        data["text"] = model.text
        data["date"] = this.date
        data["taskdate"] = this.taskDate.pk
        console.log(data)
        // On envoie à l'API le commentaire
        this.taskService.addComment(data)
          .subscribe(taskDate => {
            if(taskDate.pk != null){
              // On met à jour la tâche
              this.taskDate = taskDate
              this.toasterService.pop('success', 'Commentaire ajouté', 'Votre commentaire a bien été enregistré !')
              // On remet le formulaire à 0
              this.myForm = this._fb.group({
                  text: ['', Validators.required]
                })
            }else{
              this.toasterService.pop('error', 'Commentaire refusé', 'Votre commentaire n\'a pas pu être enregistré !')
            }
          })
    }
    }

    // Méthode permettant de prendre en charge une tâche
    take(){
        // On prépare les données à envoyer à l'API
        let data = {}
        data["sector"] = localStorage["sector"]
        data["taskdate"] = this.taskDate.pk
        data["date"] = this.date
        // On envoie à l'API pour dire que l'utilisateur s'occupe de la tâche
        this.taskService.addTaker(data)
          .subscribe(taskDate => {
            if(taskDate.pk != null){
              // On met à jour les infos de la tâche
              this.taskDate = taskDate
              this.toasterService.pop('success', 'S\'occuper de la tâche', 'Vous vous occupez de la tâche !')
            }else{
              this.toasterService.pop('error', 'S\'occuper de la tâche', 'Une erreur s\'est produite, veuillez recharger la page')
            }
          })
    }

    // Méthode appelée pour permettre la modification
    openModif(){
      // On affiche la page de modification d'une tâche
      this.router.navigate(['/update-task', this.taskDate.pk, this.date])
    }

    // Méthode appelée pour permettre d'arrêter la tâche
    openStop(){
      // On affiche la page d'arrêt d'une tâche
      this.router.navigate(['/stop-task', this.taskDate.pk, this.date])
    }
}
