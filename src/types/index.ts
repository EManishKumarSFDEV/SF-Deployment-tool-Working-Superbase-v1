export interface UserStory {
  id: number;
  number: string;
  title: string;
  description: string;
  date: string;
}

export interface FieldChange {
  id: number;
  userStoryId: number;
  apiName: string;
  label: string;
  fieldType: string;
}

export interface LWCChange {
  id: number;
  userStoryId: number;
  componentName: string;
  fileType: string;
  code: string;
}

export interface ProfileChange {
  id: number;
  userStoryId: number;
  profileName: string;
  changes: string;
}

export interface PermissionChange {
  id: number;
  userStoryId: number;
  permissionSet: string;
  permission: string;
  access: 'Read' | 'Write';
}