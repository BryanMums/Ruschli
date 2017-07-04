
export interface TaskInterface {
    title: string;
    description: string;
    need_someone: boolean;
    resident: any[];
    room: any[];
    receiver_user: any[];
    receiver_group: any[];
    copyreceiver_user: any[];
    copyreceiver_group: any[];
    time: any;
    eventType: {
      type: any;
      nonperiodic: {
        date: Date;
      },
      periodic: {
          start_date: Date;
          end_date: Date;
          periodicType: {
            type: any;
            quotidien: {},
            hebdomadaire: {
                daysOfWeek: any[];
                intervalWeek: number;
            },
            mensuel: {
              intervalMonth: number;
              monthlyType: {
                type: any;
                daydate: {
                  dayNumber: number;
                },
                daynumberweek: {
                  weekNumber: number;
                  daysOfWeek: any[];
                }
              }
            },
            annuel: {}
          }
      }
    }
}
