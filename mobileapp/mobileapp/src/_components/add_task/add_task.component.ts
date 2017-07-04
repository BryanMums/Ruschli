import { Component, OnInit, Input } from '@angular/core';
import { User, TaskDate } from '../../_models/index';
import { TaskService, FormService } from '../../_services/index';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TaskInterface } from '../../_interfaces/index';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'add-task',
    templateUrl: 'add_task.component.html'
})

export class AddTaskComponent implements OnInit {
    taskTypes : any[] = [];
    state = 1;
    taskType: any = null;
    @Input() date: Date = null;
    @Input() taskToAdd: Boolean = true
    @Input() taskDate: any = null
    @Input() onlyAtDate: Boolean = false

    // Tableaux des différents choix
    optionsDaysOfWeekModel: number[] = [];
    optionsResidentsModel: number[] = [];
    optionsRoomsModel: number[] = [];
    optionsUsersModel: number[] = [];
    optionsSectorsModel: number[] = [];
    optionsCopyUsersModel: number[] = [];
    optionsCopySectorsModel: number[] = [];
    optionsWeekNumberModel: number = null;

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
    private selDate: IMyDate = {year: 2017, month: 6, day: 6};
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
      private formService: FormService,
      private _fb: FormBuilder,
    ) { }

    ngOnInit() {

        // Récupération de la date actuelle et configuration par rapport à la date.
        let date = new Date();
        this.selDate = {year:date.getUTCFullYear(), day:date.getDate(), month:date.getMonth()+1}
        let dateStr = date.getUTCFullYear()+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+("0" + date.getDate()).slice(-2)
        if(!this.taskToAdd && this.taskDate != null){
            this.state = 2
            this.taskService.getTaskType(this.taskDate.task.id_type_task)
                .subscribe(taskType => {
                  this.taskType = taskType
                  this.getAllOptions()
                })
        }else{
          // On va récupérer les types de tâches
          this.formService.getTaskTypes()
              .subscribe(types => {
                  this.taskTypes = types
              })
        }
    }

    chooseType(pk: number){
      this.taskService.getTaskType(pk)
        .subscribe(taskType => {
          this.taskType = taskType
          this.getAllOptions()
        })
      this.state = 2
    }

    getAllOptions(){
      // Configuration du formulaire
      this.myForm = this._fb.group({
          title: [this.taskType.default_title, Validators.required],
          description: [this.taskType.default_description],
          need_someone: [this.taskType.default_need_someone],
          resident: [''],
          room: [''],
          receiver_user: [''],
          receiver_group: [''],
          copyreceiver_user: [''],
          copyreceiver_group: [''],
          time: [this.taskType.time],
          eventType: this.initEventFormGroup(),
      });

      // Va nous servir par la suite
      let that:any = this;

      // On va écouter les changements au niveau de la périodicité
      this.subscribeEventTypeChanges();
      this.subscribePeriodicTypeChanges();
      this.subscribeMonthlyTypeChanges();

      // Permet de mettre à défaut les valeurs pour la périodicité
      this.setEventType(this.EVENT_TYPES.NONPERIODIC);
      this.setPeriodicType(this.PERIODIC_TYPES.QUOTIDIEN);
      this.setMonthlyType(this.MONTHLY_TYPES.DAYDATE);

      // Définir de où l'on va récupérer les informations par défaut
      let default_residents = []
      let default_rooms = []
      let default_receiver_users = []
      let default_receiver_groups = []
      let default_copyreceiver_users = []
      let default_copyreceiver_groups = []
      if(this.taskToAdd){
        default_residents = this.taskType.default_resident
        default_rooms = this.taskType.default_room
        default_receiver_users = this.taskType.default_receiver_user
        default_receiver_groups = this.taskType.default_receiver_group
        default_copyreceiver_users = this.taskType.default_copyreceiver_user
        default_copyreceiver_groups = this.taskType.default_copyreceiver_group
      }else{
        default_residents = this.taskDate.task.resident
        default_rooms = this.taskDate.task.room
        default_receiver_users = this.taskDate.task.receiver_user
        default_receiver_groups = this.taskDate.task.receiver_group
        default_copyreceiver_users = this.taskDate.task.copyreceiver_user
        default_copyreceiver_groups = this.taskDate.task.copyreceiver_group
      }

      // On va récupérer les informations sur les résidents
      this.formService.getResidents()
          .subscribe(residents => {
              residents.forEach(function(resident){
                that.residentsOptions.push({id: resident.pk, name: resident.lastname + ' ' +resident.firstname})
              })
              default_residents.forEach(function(resident){
                  that.optionsResidentsModel.push(resident.pk)
              });
          });
      // On va récupérer les informations sur les chambres
      this.formService.getRooms()
          .subscribe(rooms => {
              rooms.forEach(function(room){
                that.roomsOptions.push({id: room.pk, name: room.title})
              })
              default_rooms.forEach(function(room){
                  that.optionsRoomsModel.push(room.pk)
              });
          });
      // On va récupérer les informations sur les utilisateurs
      this.formService.getUsers()
          .subscribe(users => {
              users.forEach(function(user){
                that.usersOptions.push({id: user.id, name: user.username})
              })
              default_receiver_users.forEach(function(user){
                  that.optionsUsersModel.push(user.pk)
              });
              default_copyreceiver_users.forEach(function(user){
                  that.optionsCopyUsersModel.push(user.pk)
              });
          })
      // On va récupérer les informations sur les secteurs
      this.formService.getGroups()
          .subscribe(groups => {
              groups.forEach(function(group){
                that.sectorsOptions.push({id: group.pk, name: group.title})
              })
              default_receiver_groups.forEach(function(sector: any){
                  that.optionsSectorsModel.push(sector.pk)
              });
              default_copyreceiver_groups.forEach(function(sector: any){
                  that.optionsCopySectorsModel.push(sector.pk)
              });
          })
    }

    save(model: TaskInterface, isValid: boolean){
      //console.log(model, isValid);
      // On va transformer notre TaskInterface.
      let data = {}
      // Informations de base de la tâche
      data['title'] = model.title
      data['description'] = model.description
      data['need_someone'] = model.need_someone
      data['time'] = model.time
      data['resident'] = this.optionsResidentsModel
      data['room'] = this.optionsRoomsModel
      // Informations sur la périodicité
      data['eventType'] = model.eventType.type.id
      // Si c'est non-périodique
      if(model.eventType.type == this.EVENT_TYPES.NONPERIODIC){
          data['start_date'] = (model.eventType.nonperiodic.date as any).formatted
      }
      // Si c'est périodique
      else if(model['eventType'].type == this.EVENT_TYPES.PERIODIC){
          data['start_date'] = (model.eventType.periodic.start_date as any).formatted
          if(model.eventType.periodic.end_date == null){
              data["end_date"] = null
          }else{
              if((model.eventType.periodic.end_date as any).formatted == '0-00-00'){
                  data['end_date'] = null;
              }else{
                  data['end_date'] = (model.eventType.periodic.end_date as any).formatted;
              }
          }

          data['periodicType'] = (model.eventType.periodic as any).type.id
          // Si c'est quotidien ou annuel, on ne fait rien de plus
          // Si c'est hebdomadaire
          if((model.eventType.periodic as any).type == this.PERIODIC_TYPES.HEBDOMADAIRE){
              data['daysOfWeek'] = (model.eventType.periodic as any).hebdomadaire.daysOfWeek
              data['intervalWeek'] = (model.eventType.periodic as any).hebdomadaire.intervalWeek
          }
          // Si c'est mensuel
          else if((model.eventType.periodic as any).type == this.PERIODIC_TYPES.MENSUEL){
              data['intervalMonth'] = (model.eventType.periodic as any).mensuel.intervalMonth
              // Si c'est daydate
              if((model.eventType.periodic as any).mensuel.monthlyType.type == this.MONTHLY_TYPES.DAYDATE){
                  data['dayNumber'] = (model.eventType.periodic as any).mensuel.monthlyType.daydate.dayNumber
              }
              // Si c'est daynumberweek
              else if((model.eventType.periodic as any).mensuel.monthlyType.type == this.MONTHLY_TYPES.DAYNUMBERWEEK){
                  data['weekNumber'] = (model.eventType.periodic as any).mensuel.monthlyType.daynumberweek.weekNumber
                  data['daysOfWeek'] = (model.eventType.periodic as any).mensuel.monthlyType.daynumberweek.daysOfWeek
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
      console.log(data)

      if(this.taskToAdd){
        this.formService.addTask(data)
          .subscribe(response => {
              if((response as any).pk != null){
                  this.state = 3
              }else{
                  this.state = 4
              }
          })
      }else{

          console.log("ON MODIFIE")
          let post = {}
          post['values'] = data
          post['taskdate'] = this.taskDate.pk
          post['onlyAtDate'] = this.onlyAtDate
          post['date'] = this.date

          console.log(post)
      }
    }


    initEventFormGroup(){
        const group = this._fb.group({
            type: [''],
            nonperiodic: this._fb.group(this.initEventNonPeriodicModel()),
            periodic: this._fb.group(this.initEventPeriodicModel()),
        })
        return group;
    }

    initEventNonPeriodicModel(){
        const model = {
            date: [this.selDate, Validators.required]
        }
        return model
    }

    initEventPeriodicModel() {
          const model = {
              type: ['', Validators.required],
              start_date: [this.selDate, Validators.required],
              end_date: [null],
              quotidien: [''],
              hebdomadaire: this._fb.group(this.initHebdomadaireModel()),
              mensuel: this._fb.group(this.initMensuelModel()),
              annuel: ['']
          }
          return model;
    }

    initHebdomadaireModel(){
      const model = {
          daysOfWeek: [''],
          intervalWeek: [1]
      }
      return model
    }

    initMensuelModel(){
      const model = {
          type: [''],
          intervalMonth: [1],
          daydate: this._fb.group(this.initMonthlyDayDateModel()),
          daynumberweek: this._fb.group(this.initMonthlyDayNumberWeekModel())
      }
      return model
    }

    initMonthlyDayDateModel(){
        const model = {
          dayNumber: [1]
        }
        return model
    }

    initMonthlyDayNumberWeekModel(){
        const model = {
          weekNumber: [''],
          daysOfWeek: ['']
        }
        return model
    }

    setEventType(type: any) {
        const ctrl: FormControl = (<any>this.myForm).controls.eventType.controls.type;
        ctrl.setValue(type)
    }

    setPeriodicType(type: any) {
        const ctrl: FormControl = (<any>this.myForm).controls.eventType.controls.periodic.controls.type;
        ctrl.setValue(type)
    }

    setMonthlyType(type: any) {
        const ctrl: FormControl = (<any>this.myForm).controls.eventType.controls.periodic.controls.mensuel.controls.type;
        ctrl.setValue(type)
    }


    subscribeEventTypeChanges(){
        const evCtrl = (<any>this.myForm).controls.eventType;
        const nonpCtrl = evCtrl.controls.nonperiodic;
        const periCtrl = evCtrl.controls.periodic;

        const changes$ = evCtrl.controls.type.valueChanges;

        changes$.subscribe(eventType => {
            //NONPERIODIC
            if (eventType === this.EVENT_TYPES.NONPERIODIC){
              // apply validators to each bank fields, retrieve validators from bank model
              Object.keys(nonpCtrl.controls).forEach(key => {
                  nonpCtrl.controls[key].setValidators(this.initEventNonPeriodicModel()[key][1]);
                  nonpCtrl.controls[key].updateValueAndValidity();
              });

              // remove all validators from card fields
              Object.keys(periCtrl.controls).forEach(key => {
                  periCtrl.controls[key].setValidators(null);
                  periCtrl.controls[key].updateValueAndValidity();
              });
            }

            //PERIODIC
            if(eventType === this.EVENT_TYPES.PERIODIC){
              // apply validators to each bank fields, retrieve validators from bank model
              Object.keys(periCtrl.controls).forEach(key => {
                  periCtrl.controls[key].setValidators(this.initEventPeriodicModel()[key][1]);
                  periCtrl.controls[key].updateValueAndValidity();
              });

              // remove all validators from card fields
              Object.keys(nonpCtrl.controls).forEach(key => {
                  nonpCtrl.controls[key].setValidators(null);
                  nonpCtrl.controls[key].updateValueAndValidity();
              });
            }
        })
    }

    subscribePeriodicTypeChanges(){
        const peCtrl = (<any>this.myForm).controls.eventType.controls.periodic;

    }

    subscribeMonthlyTypeChanges(){
        const moCtrl = (<any>this.myForm).controls.eventType.controls.periodic.controls.mensuel;

        const changes$ = moCtrl.controls.type.valueChanges;

        changes$.subscribe(monthlyType => {
            console.log("Il y a un changement de monthlyType")
        })
    }
}
