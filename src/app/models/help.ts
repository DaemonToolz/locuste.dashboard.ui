
export class HelpMeModel {
    public icon: string;
    public class: string;
    public content: string;
    public description: string;
    public comment : string;
    public is_custom: boolean
}

export enum HelpSections {
    global_actions,
    global_status,
    drone_actions_preview,
    drone_status_preview,
    drone_actions_console,
    drone_status_console,
    
    modules
}