import { Component, OnInit, Input } from '@angular/core'
import { User, TaskDate, TaskType } from '../../_models/index'
import { TaskService, ResidentService, RoomService, SectorService, UserService } from '../../_services/index'
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect'
import { ToasterService } from 'angular2-toaster'
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
    selector: 'form-task',
    moduleId: module.id,
    templateUrl: 'form_task.component.html'
})

export class FormTaskComponent implements OnInit {

    // Variables pouvant être données dans le cas d'une création ou modification
    @Input() taskType: TaskType = null
    @Input() date: any = null
    @Input() taskToAdd: Boolean = true
    @Input() taskDate: any = null
    @Input() onlyAtDate: Boolean = false
    test: Boolean = true

    // Initialisation des dates possibles
    private start_date: IMyDate = {year: 2017, month: 6, day: 6}
    private end_date: IMyDate = {year: 2017, month: 6, day: 6}
    private selDate: IMyDate = {year: 2017, month: 6, day: 6}

    // Tableaux des différents choix
    optionsDaysOfWeekModel: number[] = []
    optionsResidentsModel: number[] = []
    optionsRoomsModel: number[] = []
    optionsUsersModel: number[] = []
    optionsSectorsModel: number[] = []
    optionsCopyUsersModel: number[] = []
    optionsCopySectorsModel: number[] = []
    optionsWeekNumberModel: number = null

    // Options pour le choix des résidents
    residentsOptions: IMultiSelectOption[] = []
    // Options pour le choix des chambres
    roomsOptions: IMultiSelectOption[] = []
    // Options pour le choix des utilisateurs
    usersOptions: IMultiSelectOption[] = []
    // Options pour le choix des secteurs
    sectorsOptions: IMultiSelectOption[] = []

    // Paramètres sans la fonction de recherche
    nosearchSettings: IMultiSelectSettings = {
      enableSearch: false,
      buttonClasses: 'btn btn-block btn-default',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
    }
    // Paramètres avec la fonction de recherche
    searchSettings: IMultiSelectSettings = {
      enableSearch: true,
      buttonClasses: 'btn btn-block btn-default',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
    }
    // Paramètres sans la fonction de recherche et choix unique
    nosearchUniqueSettings: IMultiSelectSettings = {
      enableSearch: false,
      buttonClasses: 'btn btn-block btn-default',
      selectionLimit: 1,
      dynamicTitleMaxItems: 1,
      displayAllSelectedText: true
    }

    // Options pour le choix des jours
    daysOptions: IMultiSelectOption[] = [
        { id: 0, name: 'Lundi' },
        { id: 1, name: 'Mardi' },
        { id: 2, name: 'Mercredi' },
        { id: 3, name: 'Jeudi' },
        { id: 4, name: 'Vendredi' },
        { id: 5, name: 'Samedi' },
        { id: 6, name: 'Dimanche' },
    ]
    // Options pour le choix de quelle semaine
    weekNumberOptions: IMultiSelectOption[] = [
        { id: 0, name: 'Première' },
        { id: 1, name: 'Deuxième' },
        { id: 2, name: 'Troisième' },
        { id: 3, name: 'Quatrième' },
        { id: 4, name: 'Cinquième'}
    ]

    private myDatePickerOptions: IMyDpOptions = {
      dateFormat: 'yyyy-mm-dd',
      dayLabels: {su: 'Dim', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Jeu', fr: 'Ven', sa: 'Sam'},
      todayBtnTxt: 'Aujourd\'ĥui',
      editableDateField: false,
      showClearDateBtn: true,
      showIncreaseDateBtn: true,
      showDecreaseDateBtn: true,
      openSelectorOnInputClick: true
    }

    public myForm: FormGroup;

    public EVENT_TYPES = {
      NONPERIODIC: {id: 0, name: "Non périodique"},
      PERIODIC: {id: 1, name: "Périodique"}
    }

    public PERIODIC_TYPES = {
      QUOTIDIEN : {id: 0,name: "Quotidien"},
      HEBDOMADAIRE: {id: 1,name: "Hebdomadaire"},
      MENSUEL: {id: 2,name: "Mensuel"},
      ANNUEL: {id: 3,name: "Annuel"}
    }

    public MONTHLY_TYPES = {
      DAYDATE: {id: 0,name: "La date répété"},
      DAYNUMBERWEEK: {id: 1,name: "Le(s) jour(s) de la combientième semaine"}
    }

    constructor(
      private taskService: TaskService,
      private residentService: ResidentService,
      private roomService: RoomService,
      private userService: UserService,
      private sectorService: SectorService,
      private _fb: FormBuilder,
      private toasterService: ToasterService,
      private route: ActivatedRoute,
      private router: Router,
    ) { }

    ngOnInit() {
        // Dans le cas de la modification d'une tâche
        if(!this.taskToAdd && this.taskDate != null){
          // Si on est sur une tâche exception et qu'on veut modifier à partir de la date
          // Il va falloir mettre les informations de la tâche parente pour la périodicité
          if(!this.onlyAtDate && this.taskDate.parent != null){
            this.taskService.getTaskDate(this.taskDate.parent)
            .subscribe((taskDate: TaskDate) => {
              this.taskDate.eventType = taskDate.eventType
              this.taskDate.periodicType = taskDate.periodicType
              this.taskDate.monthlyType = taskDate.monthlyType
              this.taskDate.end_date = taskDate.end_date
              this.taskDate.weekNumber = taskDate.weekNumber
              this.taskDate.daysOfWeek = taskDate.daysOfWeek
              this.taskDate.intervalWeek = taskDate.intervalWeek
              this.taskDate.intervalMonth = taskDate.intervalMonth
              this.taskDate.dayNumber = taskDate.dayNumber
              })
          }
          
            // On récupère la date de début comme étant la date à laquelle il veut modifier
            this.start_date = {year:parseInt(this.date.substr(0,4)), day:parseInt(this.date.substr(8,2)), month:parseInt(this.date.substr(5,2))}

            // On récupère les informations du type de la tâche qu'on veut modifier
            this.taskService.getTaskType(this.taskDate.task.id_type_task)
                .subscribe(taskType => {
                  this.taskType = taskType
                  // On va mettre à jour les informations du formulaire par raport à la tâche
                  this.getAllOptions()
                })

        // Dans le cas de la création d'une nouvelle tâche
        }else{
          // Récupération de la date actuelle d'aujourd'hui
          let date = new Date();
          this.start_date = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
          // On va construire une taskDate par rapport au type de la tâche qu'on veut créé
          let task = {}
          task['task'] = {}
          task['task']['title'] = this.taskType.default_title
          task['task']['description'] = this.taskType.default_description
          task['task']['need_someone'] = this.taskType.default_need_someone
          task['task']['resident'] = this.taskType.default_resident
          task['task']['room'] = this.taskType.default_room
          task['task']['receiver_user'] = this.taskType.default_receiver_user
          task['task']['receiver_group'] = this.taskType.default_receiver_group
          task['task']['copyreceiver_user'] = this.taskType.default_copyreceiver_user
          task['task']['copyreceiver_group'] = this.taskType.default_copyreceiver_group
          task['eventType'] = 0
          task['periodicType'] = 0
          task['monthlyType'] = 0
          this.taskDate = task
          // On va mettre à jour les informations du formulaire par raport à la tâche
          this.getAllOptions()
        }
    }


    // Méthode permettant récupérer les options pour le formulaire et configuer ce dernier
    getAllOptions(){
      // Configuration du formulaire
      this.myForm = this._fb.group({
        title: [''],
        description: [''],
        need_someone: [''],
        resident: [''],
        room: [''],
        receiver_user: [''],
        receiver_group: [''],
        copyreceiver_user: [''],
        copyreceiver_group: [''],
        time: [''],
        eventType: [0, Validators.required],
        start_date: [this.start_date, Validators.required],
        end_date: [this.end_date],
        periodicType: [0],
        daysOfWeek: [''],
        intervalWeek: [''],
        intervalMonth: [''],
        monthlyType: [''],
        dayNumber: [''],
        weekNumber: ['']
      });

      // Va nous servir par la suite
      let that:any = this

      // On va récupérer les informations sur les résidents
      this.residentService.getResidents()
          .subscribe(residents => {
              residents.forEach(function(resident){
                that.residentsOptions.push({id: resident.pk, name: resident.lastname + ' ' +resident.firstname})
              })
              this.taskDate.task.resident.forEach(function(resident:any){
                  that.optionsResidentsModel.push(resident.pk)
              })
          })
      // On va récupérer les informations sur les chambres
      this.roomService.getRooms()
          .subscribe(rooms => {
              rooms.forEach(function(room){
                that.roomsOptions.push({id: room.pk, name: room.title})
              })
              this.taskDate.task.room.forEach(function(room:any){
                  that.optionsRoomsModel.push(room.pk)
              })
          })
      // On va récupérer les informations sur les utilisateurs
      this.userService.getUsers()
          .subscribe(users => {
              users.forEach(function(user){
                that.usersOptions.push({id: user.id, name: user.username})
              })
              this.taskDate.task.receiver_user.forEach(function(user:any){
                  that.optionsUsersModel.push(user.id)
              })

              this.taskDate.task.copyreceiver_user.forEach(function(user:any){
                  that.optionsCopyUsersModel.push(user.id)
              })
          })
      // On va récupérer les informations sur les secteurs
      this.sectorService.getSectors()
          .subscribe(groups => {
              groups.forEach(function(group){
                that.sectorsOptions.push({id: group.pk, name: group.title})
              })
              this.taskDate.task.receiver_group.forEach(function(sector: any){
                  that.optionsSectorsModel.push(sector.pk)
              });
              this.taskDate.task.copyreceiver_group.forEach(function(sector: any){
                  that.optionsCopySectorsModel.push(sector.pk)
              });
          })
    }

    // Méthode permettant de créer ou modifier
    save(model: any, isValid: boolean){
      if(isValid){
        // On va préparer les informations à envoyer
        let data = {}
        // Informations de base de la tâche
        data['title'] = model.title
        data['description'] = model.description
        data['need_someone'] = model.need_someone
        data['time'] = model.time
        data['resident'] = this.optionsResidentsModel
        data['room'] = this.optionsRoomsModel
        // Informations sur la périodicité
        data['eventType'] = this.taskDate.eventType
        data['start_date'] = (model.start_date as any).formatted
        // Si c'est périodique
        if(this.taskDate.eventType == 1){
            if(model.end_date == null){
                data["end_date"] = null
            }else{
                if((model.end_date as any).formatted == '0-00-00'){
                    data['end_date'] = null;
                }else{
                    data['end_date'] = (model.end_date as any).formatted;
                }
            }
            data['periodicType'] = this.taskDate.periodicType
            // Si c'est quotidien ou annuel, on ne fait rien de plus
            // Si c'est hebdomadaire
            if(this.taskDate.periodicType == 1){
                data['daysOfWeek'] = model.daysOfWeek
                data['intervalWeek'] = model.intervalWeek
            }
            // Si c'est mensuel
            else if(this.taskDate.periodicType == 2){
                data['monthlyType'] = this.taskDate.monthlyType
                data['intervalMonth'] = model.intervalMonth
                // Si c'est daydate
                if(data['monthlyType'] == 0){
                    data['dayNumber'] = model.dayNumber
                }
                // Si c'est daynumberweek
                else if(data['monthlyType'] == 1){
                    data['weekNumber'] = model.weekNumber
                    data['daysOfWeek'] = model.daysOfWeek
                }
            }
        }
        // Informations sur les destinataires
        data['receiver_user'] = this.optionsUsersModel
        data['receiver_group'] = this.optionsSectorsModel
        data['copyreceiver_user'] = this.optionsCopyUsersModel
        data['copyreceiver_group'] = this.optionsCopySectorsModel

        // Information sur le type de tâche
        data['id_type_task'] = this.taskType.pk

        // Dans le cas d'une création d'une nouvelle tâche
        if(this.taskToAdd){
          console.log(data)
          // On crée la tâche sur l'API
          this.taskService.addTask(data)
            .subscribe(
              response => {
                if((response as any).pk != null){}
                this.toasterService.pop('success', 'Ajout réussi', 'La nouvelle tâche a bien été créée')
                this.router.navigate(['/home'])
            },
              err => {
                this.toasterService.pop('error', 'Ajout a échoué', 'Une erreur s\'est produite !')
              }
          )
        // Dans le cas d'une modification d'une tâche
        }else{
            // On doit donner d'autres informations lors d'une modification
            let post = {}
            post['values'] = data
            post['taskdate'] = this.taskDate.pk
            post['onlyAtDate'] = this.onlyAtDate
            post['date'] = this.date
            console.log(post)
            // On met à jour sur l'API
            this.taskService.updateTask(post)
              .subscribe(
                response => {
                  this.toasterService.pop('success', 'Modification réussie', 'La tâche a bien été modifiée')
                  this.router.navigate(['/home', this.date])
              },
                err => {
                  this.toasterService.pop('error', 'Modification échouée', 'La tâche n\'a pas pu être modifiée')
                })
        }
      }
    }

    // Méthode permettant de changer le type (non-périodique ou périodique)
    setEventType(id: number){
      this.taskDate.eventType = id
    }

    // Méthode permettant de changer le type de périodicité
    setPeriodicType(id: number){
      this.taskDate.periodicType = id
    }

    // Méthode permettant de changer le type de périodicité mensuelle
    setMonthlyType(id: number){
      this.taskDate.monthlyType = id
    }
}
