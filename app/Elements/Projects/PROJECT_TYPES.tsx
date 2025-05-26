import supabase from "@supabase/supabase-js";
import { FFBusiness, FFProfile, FFProfileIntegrations, FFProject } from "../../assets/Types";

export type ProjectContextMenuProps = {
    setProjects: (project) => any;
    boxPosition: { x: number; y: number };
    setClosed?: (closed) => any;
    isActive: boolean;
    onClose: (boolean) => any;
    onError: (message: string) => any;
    selectedProject: FFProject;
  };
  
  export interface ProjectDateContextMenuProps extends ProjectContextMenuProps {
    onSave: () => void;
    session: supabase.Session;
    profile: FFProfile | undefined;
    integrations: FFProfileIntegrations | undefined;
  }